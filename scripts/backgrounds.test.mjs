import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

function loadBackgroundHelpers() {
  const scriptPath = path.resolve("assets/js/template/backgrounds.js");
  const source = fs.readFileSync(scriptPath, "utf8");
  const context = {
    window: {},
    document: {},
    fetch: async () => ({ ok: false }),
    console,
    setTimeout,
    clearTimeout,
    Date: { now: () => 12345 },
  };

  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.SukiTemplate?.backgrounds?.__test;
}

test("mobile header candidates prefer mobile webp then png before desktop fallbacks", () => {
  const helpers = loadBackgroundHelpers();
  const candidates = Array.from(helpers.getAssetCandidates("/u/demo", "head_bg", true));

  assert.deepEqual(candidates, [
    "/u/demo/head_bg_mobile.webp?t=12345",
    "/u/demo/head_bg_mobile.png?t=12345",
    "/u/demo/head_bg.webp?t=12345",
    "/u/demo/head_bg.png?t=12345",
  ]);
});

test("desktop body candidates prefer webp before png", () => {
  const helpers = loadBackgroundHelpers();
  const candidates = Array.from(helpers.getAssetCandidates("/u/demo", "body_bg", false));

  assert.deepEqual(candidates, [
    "/u/demo/body_bg.webp?t=12345",
    "/u/demo/body_bg.png?t=12345",
  ]);
});

test("resolver returns the first available candidate", async () => {
  const helpers = loadBackgroundHelpers();
  const attempts = [];
  const result = await helpers.findFirstAvailableAsset(
    ["/a.webp?t=1", "/a.png?t=1", "/fallback.png?t=1"],
    async (url) => {
      attempts.push(url);
      return url === "/a.png?t=1";
    }
  );

  assert.equal(result, "/a.png?t=1");
  assert.deepEqual(attempts, ["/a.webp?t=1", "/a.png?t=1"]);
});
