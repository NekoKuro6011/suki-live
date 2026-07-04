import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const siteCss = path.join(rootDir, "assets", "css", "site.css");
const templateCss = path.join(rootDir, "assets", "css", "template.css");

const requiredTokens = [
  "--bg",
  "--surface",
  "--surface-soft",
  "--text",
  "--text-light",
  "--text-faint",
  "--accent",
  "--accent-hover",
  "--accent-soft",
  "--border",
  "--shadow",
  "--radius-lg",
  "--radius-md",
];

function extractRootTokens(filePath) {
  const css = fs.readFileSync(filePath, "utf8");
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);

  if (!rootMatch) {
    throw new Error(`${path.relative(rootDir, filePath)}: missing :root block`);
  }

  const tokens = new Map();
  for (const line of rootMatch[1].split("\n")) {
    const match = line.match(/(--[a-z0-9-]+)\s*:\s*([^;]+);/i);
    if (match) {
      tokens.set(match[1], match[2].trim());
    }
  }

  return tokens;
}

const siteTokens = extractRootTokens(siteCss);
const templateTokens = extractRootTokens(templateCss);
const errors = [];

for (const token of requiredTokens) {
  if (!siteTokens.has(token)) {
    errors.push(`assets/css/site.css: missing ${token}`);
    continue;
  }

  if (!templateTokens.has(token)) {
    errors.push(`assets/css/template.css: missing ${token}`);
    continue;
  }

  if (siteTokens.get(token) !== templateTokens.get(token)) {
    errors.push(
      `${token}: site.css has "${siteTokens.get(token)}" but template.css has "${templateTokens.get(token)}"`
    );
  }
}

if (errors.length > 0) {
  console.error(`Style token validation failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Style token validation passed for ${requiredTokens.length} shared theme tokens.`);
