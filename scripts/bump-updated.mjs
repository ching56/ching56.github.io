#!/usr/bin/env node
// Pre-commit hook body: when a staged post or page under src/content/posts/
// already exists in HEAD and its Markdown body changed, set its `updated`
// frontmatter to today's Asia/Taipei date. New files, frontmatter-only edits,
// and commits that change `updated` by hand are left alone; history is never
// backfilled. The index blob is rewritten directly so partially staged files
// never pick up unstaged hunks; the working-tree file gets the same line.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const POST_PATH = /^src\/content\/posts\/.+\.md$/;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export function taipeiDate(now = new Date()) {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei" }).format(now);
}

function split(text) {
  const match = text.match(FRONTMATTER);

  return match
    ? { frontmatter: match[1], body: text.slice(match[0].length) }
    : null;
}

function field(frontmatter, name) {
  return frontmatter
    .match(new RegExp(`^${name}:\\s*(.*)$`, "m"))?.[1]
    .trim()
    .replace(/^["']|["']$/g, "");
}

export function setUpdated(text, today) {
  const line = `updated: ${today}`;

  return text.replace(FRONTMATTER, (whole, frontmatter) => {
    let next;

    if (/^updated:.*$/m.test(frontmatter)) {
      next = frontmatter.replace(/^updated:.*$/m, line);
    } else if (/^date:.*$/m.test(frontmatter)) {
      next = frontmatter.replace(/^date:.*$/m, (date) => `${date}\n${line}`);
    } else {
      next = `${frontmatter}\n${line}`;
    }

    return whole.replace(frontmatter, () => next);
  });
}

// Returns the staged text with `updated` bumped, or null when no bump applies.
export function bumpedText(previous, staged, today) {
  const before = previous === undefined ? null : split(previous);
  const after = split(staged);

  if (!before || !after || before.body === after.body) {
    return null;
  }

  const updated = field(after.frontmatter, "updated");
  const date = field(after.frontmatter, "date")?.slice(0, 10);

  if (
    updated !== field(before.frontmatter, "updated") ||
    updated === today ||
    (date && date >= today)
  ) {
    return null;
  }

  return setUpdated(staged, today);
}

function git(args, input) {
  return execFileSync("git", args, {
    encoding: "utf8",
    input,
    maxBuffer: 64 * 1024 * 1024,
  });
}

function main() {
  const today = taipeiDate();
  const paths = git(["diff", "--cached", "--name-only", "--diff-filter=M", "-z"])
    .split("\0")
    .filter((path) => POST_PATH.test(path));

  for (const path of paths) {
    const next = bumpedText(
      git(["show", `HEAD:${path}`]),
      git(["show", `:${path}`]),
      today,
    );

    if (!next) {
      continue;
    }

    const mode = git(["ls-files", "--stage", "--", path]).split(" ")[0];
    const blob = git(["hash-object", "-w", "--stdin", "--path", path], next).trim();
    git(["update-index", "--cacheinfo", `${mode},${blob},${path}`]);

    if (existsSync(path)) {
      writeFileSync(path, setUpdated(readFileSync(path, "utf8"), today));
    }

    console.log(`bump-updated: ${path} → updated: ${today}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
