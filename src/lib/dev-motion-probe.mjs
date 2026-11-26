// Injects scripts/motion-probe.js into every page's <head> under `astro dev`
// only, so any dev page opened with ?probe records its motion frame by frame
// (docs/testing-motion.md). Builds are untouched.
import { readFileSync } from "node:fs";

export function devMotionProbe() {
  return {
    name: "dev-motion-probe",
    hooks: {
      "astro:config:setup": ({ addWatchFile, command, injectScript }) => {
        if (command !== "dev") return;
        const file = new URL("../../scripts/motion-probe.js", import.meta.url);
        // Read once here, so editing the probe restarts the dev server.
        addWatchFile(file);
        injectScript("head-inline", readFileSync(file, "utf8"));
      },
    },
  };
}
