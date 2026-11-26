// Builds the site's favicons from the bottle mark's outline
// (src/assets/home/bottle-mark.webp, made by build-bottle-assets.mjs): the
// solid ink bottle, tilted to fill the square, on paper, so it reads on
// light and dark tab bars alike.
//   public/favicon.ico           16, 32 and 48 px (PNG inside an ICO), for
//                                browsers and crawlers that ask /favicon.ico
//   public/icon.png              192 px, the <link rel="icon">
//   public/apple-touch-icon.png  180 px, iOS home screen and Safari
// Run: node scripts/build-favicons.mjs
import { writeFile } from "node:fs/promises";

import sharp from "sharp";

const INK = "#141414"; // --ink
const PAPER = "#ffffff"; // --paper
const TILT = -45; // between the upright hero (0) and the docked logo (-90)

// The outline, filled with ink and tilted, on a transparent square.
const alpha = await sharp("src/assets/home/bottle-mark.webp").extractChannel(3).toBuffer();
const { width, height } = await sharp("src/assets/home/bottle-mark.webp").metadata();
const solid = await sharp({ create: { width, height, channels: 3, background: INK } })
  .joinChannel(alpha)
  .png()
  .toBuffer();
const tilted = await sharp(solid)
  .rotate(TILT, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .trim()
  .png()
  .toBuffer();

async function icon(size) {
  const inner = Math.round(size * 0.84);
  const bottle = await sharp(tilted).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([{ input: bottle, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// An ICO file may hold PNG images directly: a 6-byte header, one 16-byte
// entry per image, then the images.
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size % 256, entry);
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map(({ png }) => png)]);
}

const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await icon(size) })));
await writeFile("public/favicon.ico", ico(small));
await writeFile("public/icon.png", await icon(192));
await writeFile("public/apple-touch-icon.png", await icon(180));
console.log("public/favicon.ico (16, 32, 48), icon.png (192), apple-touch-icon.png (180)");
