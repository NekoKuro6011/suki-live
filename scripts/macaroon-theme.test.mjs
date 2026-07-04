import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const expectedTokens = {
  "--bg": "#fff8fb",
  "--bg-gradient-start": "#fff7f6",
  "--bg-gradient-end": "#eef8ff",
  "--surface": "#ffffff",
  "--surface-soft": "#fff1f6",
  "--text": "#38445a",
  "--text-light": "#6f7c94",
  "--text-faint": "#98a3b8",
  "--accent": "#7fc8ff",
  "--accent-hover": "#5fb8f6",
  "--accent-soft": "#dff4ff",
  "--rose-accent": "#ff9fc2",
  "--rose-soft": "#ffe0ec",
  "--mint-accent": "#8ee3c4",
  "--lemon-accent": "#ffe08a",
  "--border": "#e8d9e4",
};

function extractRootTokens(filePath) {
  const css = fs.readFileSync(filePath, "utf8");
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  const tokens = new Map();

  if (!rootMatch) {
    throw new Error(`${filePath}: missing :root block`);
  }

  for (const line of rootMatch[1].split("\n")) {
    const match = line.match(/(--[a-z0-9-]+)\s*:\s*([^;]+);/i);
    if (match) {
      tokens.set(match[1], match[2].trim());
    }
  }

  return tokens;
}

for (const cssPath of ["assets/css/site.css", "assets/css/template.css"]) {
  test(`${cssPath} uses the approved sea-salt peach macaroon palette`, () => {
    const tokens = extractRootTokens(path.resolve(cssPath));

    for (const [token, value] of Object.entries(expectedTokens)) {
      assert.equal(tokens.get(token), value, `${cssPath} should set ${token} to ${value}`);
    }
  });
}
