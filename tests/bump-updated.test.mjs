import assert from "node:assert/strict";
import test from "node:test";

import { bumpedText, setUpdated, taipeiDate } from "../scripts/bump-updated.mjs";

const today = "2026-10-20";
const post = (frontmatter, body) => `---\n${frontmatter}\n---\n\n${body}\n`;
const base = 'title: "瓶子"\ndate: 2026-10-11\nlanguage: zh-TW';

test("a body edit inserts updated right after date", () => {
  assert.equal(
    bumpedText(post(base, "舊的"), post(base, "新的"), today),
    post(`title: "瓶子"\ndate: 2026-10-11\nupdated: ${today}\nlanguage: zh-TW`, "新的"),
  );
});

test("a body edit replaces an older updated date", () => {
  const before = post(`${base}\nupdated: 2026-10-15`, "舊的");
  const after = post(`${base}\nupdated: 2026-10-15`, "新的");

  assert.equal(
    bumpedText(before, after, today),
    post(`${base}\nupdated: ${today}`, "新的"),
  );
});

test("new files, frontmatter-only edits, and hand-set dates are left alone", () => {
  assert.equal(bumpedText(undefined, post(base, "新的"), today), null);
  assert.equal(
    bumpedText(post(base, "內文"), post(`${base}\npublished: false`, "內文"), today),
    null,
  );
  assert.equal(
    bumpedText(post(base, "舊的"), post(`${base}\nupdated: 2026-10-19`, "新的"), today),
    null,
  );
});

test("a post first published today is not marked as updated", () => {
  const sameDay = `title: "新"\ndate: ${today}\nlanguage: zh-TW`;

  assert.equal(bumpedText(post(sameDay, "初稿"), post(sameDay, "二稿"), today), null);
});

test("setUpdated keeps replacement text literal and is idempotent", () => {
  const text = post('title: "$& 價格"\ndate: 2026-10-11', "內文 $1");
  const once = setUpdated(text, today);

  assert.equal(once, post(`title: "$& 價格"\ndate: 2026-10-11\nupdated: ${today}`, "內文 $1"));
  assert.equal(setUpdated(once, today), once);
});

test("today is the Asia/Taipei calendar date", () => {
  assert.equal(taipeiDate(new Date("2026-10-19T16:30:00Z")), "2026-10-20");
  assert.equal(taipeiDate(new Date("2026-10-19T15:59:00Z")), "2026-10-19");
});
