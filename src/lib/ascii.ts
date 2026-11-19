// Build-time character art. Every picture on the site can be typed out as
// glyphs on white paper: denser glyphs carry darker ink. Nothing here ships
// to the browser; pages receive plain text inside <pre> elements.
import sharp from "sharp";

// Light to dark: a typewriter's own marks, from a blank cell to a struck-over @,
// ordered so each step lays down visibly more ink than the last.
const RAMP = " .:-=+*#%@";
// A monospace cell is about 0.6em wide; art is set with line-height 1.
export const CELL_ASPECT = 0.6;

export interface AsciiArt {
  text: string;
  cols: number;
  rows: number;
}

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

/** A photograph typed out at `rows` lines, contrast stretched so every
    picture uses the full ramp. */
export function photoToAscii(file: string, rows: number): Promise<AsciiArt> {
  return memo(`photo:${file}:${rows}`, async () => {
    const source = fromProject(file);
    const { width = 1, height = 1 } = await sharp(source).rotate().metadata();
    const cols = columnsFor(width, height, rows);
    // Local contrast first, so the pot separates from table and wall before
    // the picture is reduced to a few hundred cells.
    const data = await sharp(source)
      .rotate()
      .greyscale()
      .normalise()
      .clahe({ width: 8, height: 8 })
      .resize(cols, rows, { fit: "fill" })
      .sharpen()
      .raw()
      .toBuffer();
    const sorted = [...data].sort((a, b) => a - b);
    const low = sorted[Math.floor(sorted.length * 0.03)];
    const high = Math.max(low + 1, sorted[Math.floor(sorted.length * 0.97)]);
    const lines: string[] = [];

    for (let y = 0; y < rows; y += 1) {
      let line = "";
      for (let x = 0; x < cols; x += 1) {
        const light = Math.min(1, Math.max(0, (data[y * cols + x] - low) / (high - low)));
        line += RAMP[Math.round((1 - light) * (RAMP.length - 1))];
      }
      lines.push(line);
    }

    return { text: lines.join("\n"), cols, rows };
  });
}

export interface TurntableArt {
  /** Shaded frames, one per turntable position. */
  frames: string[];
  /** The same frames with every inked cell struck solid: the silhouette. */
  silhouettes: string[];
  cols: number;
  rows: number;
}

/** A horizontal sprite of `count` transparent frames, typed out frame by frame.
    Transparent cells stay blank, so the bottle stands on the page itself. */
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
    const frames: string[] = [];
    const silhouettes: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const data = await sharp(source)
        .extract({ left: index * frameWidth, top: 0, width: frameWidth, height })
        .resize(cols, rows, { fit: "fill" })
        .ensureAlpha()
        .raw()
        .toBuffer();
      const shaded: string[] = [];
      const solid: string[] = [];

      for (let y = 0; y < rows; y += 1) {
        let line = "";
        let mass = "";
        for (let x = 0; x < cols; x += 1) {
          const at = (y * cols + x) * 4;
          const alpha = data[at + 3] / 255;
          const light =
            (0.2126 * data[at] + 0.7152 * data[at + 1] + 0.0722 * data[at + 2]) / 255;

          if (alpha < 0.3) {
            line += " ";
            mass += " ";
          } else {
            const ink = Math.round(alpha * (1 - light) * (RAMP.length - 1));
            line += RAMP[Math.min(RAMP.length - 1, Math.max(1, ink))];
            mass += "█";
          }
        }
        shaded.push(line);
        solid.push(mass);
      }

      frames.push(shaded.join("\n"));
      silhouettes.push(solid.join("\n"));
    }

    return { frames, silhouettes, cols, rows };
  });
}
