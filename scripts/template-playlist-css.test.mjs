import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const cssPath = path.resolve("assets/css/template.css");
const css = fs.readFileSync(cssPath, "utf8");

function getBlock(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  return match?.[1] ?? "";
}

test("list view items use the same card-like border treatment as grid view items", () => {
  const block = getBlock(".playlist.list-view li");

  assert.match(block, /border:\s*1px solid var\(--border\);/);
  assert.match(block, /border-radius:\s*var\(--radius-md\);/);
  assert.match(block, /background:\s*var\(--card\);/);
});

test("background-image mode does not wrap song titles in an extra box", () => {
  const block = getBlock("body.has-body-bg .song-title");

  assert.equal(
    block.trim(),
    "",
    "song titles should stay unboxed even when a body background image is active"
  );
});
