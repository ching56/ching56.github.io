// Build-time character art. Every picture on the site can be typed out as
// glyphs on white paper: denser glyphs carry darker ink. Nothing here ships
// to the browser; pages receive plain text inside <pre> elements.
import sharp from "sharp";

// A monospace cell is about 0.6em wide; art is set with line-height 1.
export const CELL_ASPECT = 0.6;

const cache = new Map<string, Promise<unknown>>();

function memo<T>(key: string, make: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key) as Promise<T>;
}

// Sharp resolves relative paths against the project root the build runs in.
function fromProject(file: string) {
  return file.replace(/^\//, "");
}

function columnsFor(width: number, height: number, rows: number) {
  return Math.max(1, Math.round((rows * width) / height / CELL_ASPECT));
}

export interface TurntableArt {
  /** One silhouette per turntable position: every opaque cell struck solid. */
  silhouettes: string[];
  cols: number;
  rows: number;
}

/** A horizontal sprite of `count` transparent frames, struck as solid
    silhouettes frame by frame. Transparent cells stay blank. */
export function turntableToAscii(
  file: string,
  count: number,
  rows: number,
): Promise<TurntableArt> {
  return memo(`turntable:${file}:${count}:${rows}`, async () => {
    const source = fromProject(file);
    const { width = 1, height = 1 } = await sharp(source).metadata();
    const frameWidth = Math.floor(width / count);
    const cols = columnsFor(frameWidth, height, rows);
    const silhouettes: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const data = await sharp(source)
        .extract({ left: index * frameWidth, top: 0, width: frameWidth, height })
        .resize(cols, rows, { fit: "fill" })
        .ensureAlpha()
        .raw()
        .toBuffer();
      const solid: string[] = [];

      for (let y = 0; y < rows; y += 1) {
        let mass = "";
        for (let x = 0; x < cols; x += 1) {
          mass += data[(y * cols + x) * 4 + 3] < 0.3 * 255 ? " " : "█";
        }
        solid.push(mass);
      }

      silhouettes.push(solid.join("\n"));
    }

    return { silhouettes, cols, rows };
  });
}
