// Rebuilds the homepage bottle assets from the turntable cutouts in the
// untracked `photo/cutout/` folder (IMG_0263.png … IMG_0283.png, one per
// turntable position, already trimmed to the bottle):
//   src/assets/home/bottle-spin.webp   21 frames side by side, for the turn
//   src/assets/home/bottle-still.webp  frame 0 at full resolution, for the
//                                      resting hero shown larger than the screen
// Every frame puts the bottle at the same height, centred in a frame padded
// to 396:980 (bottle 900 of 980), so the frames turn without wobbling.
// Run: node scripts/build-bottle-assets.mjs
import sharp from "sharp";

const FIRST = 263;
const COUNT = 21;
const SPRITE_BOTTLE = 900;
const STILL_BOTTLE = 1514; // the shortest cutout, so no frame is upscaled
const files = Array.from({ length: COUNT }, (_, i) => `photo/cutout/IMG_0${FIRST + i}.png`);

async function frame(file, bottle) {
  const width = Math.round((bottle * 396) / 900);
  const height = Math.round((bottle * 980) / 900);
  const cutout = await sharp(file).resize({ height: bottle }).png().toBuffer();
  const { width: cutoutWidth = 0 } = await sharp(cutout).metadata();
  const buffer = await sharp({
    create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: cutout, left: Math.round((width - cutoutWidth) / 2), top: Math.round((height - bottle) / 2) },
    ])
    .png()
    .toBuffer();
  return { buffer, width, height };
}

const frames = await Promise.all(files.map((file) => frame(file, SPRITE_BOTTLE)));
const { width, height } = frames[0];
await sharp({
  create: { width: width * COUNT, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite(frames.map(({ buffer }, i) => ({ input: buffer, left: i * width, top: 0 })))
  .webp({ quality: 72, alphaQuality: 70, effort: 6 })
  .toFile("src/assets/home/bottle-spin.webp");

const still = await frame(files[0], STILL_BOTTLE);
await sharp(still.buffer)
  .webp({ quality: 80, alphaQuality: 80, effort: 6 })
  .toFile("src/assets/home/bottle-still.webp");

console.log(`sprite ${width * COUNT}×${height}, still ${still.width}×${still.height}`);
