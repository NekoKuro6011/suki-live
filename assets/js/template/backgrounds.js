(function () {
  const template = (window.SukiTemplate = window.SukiTemplate || {});

  function getAssetCandidates(base, assetName, isMobile) {
    const timestamp = Date.now();
    const buildUrl = (name, ext) => `${base}/${name}.${ext}?t=${timestamp}`;

    if (!isMobile) {
      return [buildUrl(assetName, "webp"), buildUrl(assetName, "png")];
    }

    return [
      buildUrl(`${assetName}_mobile`, "webp"),
      buildUrl(`${assetName}_mobile`, "png"),
      buildUrl(assetName, "webp"),
      buildUrl(assetName, "png"),
    ];
  }

  async function findFirstAvailableAsset(candidates, checkAsset) {
    for (const candidate of candidates) {
      if (await checkAsset(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  function checkImage(url) {
    return fetch(url, { method: "HEAD" })
      .then((response) => response.ok)
      .catch(() => false);
  }

  function setupHeaderBackground(state, info) {
    if (info.show_header_bg !== true) return;

    const applyHeaderBg = (url) => {
      document.documentElement.style.setProperty("--header-bg", `url(${url})`);
      const headerEl = document.querySelector(".header");
      if (headerEl) {
        headerEl.style.textShadow = "0 1px 4px rgba(0,0,0,0.25)";
        headerEl.style.color = "var(--text)";
      }
    };

    const loadHeaderBg = () => {
      const isMobile = window.innerWidth <= 640;
      const candidates = getAssetCandidates(state.base, "head_bg", isMobile);

      findFirstAvailableAsset(candidates, checkImage).then((found) => {
        if (typeof found === "string") applyHeaderBg(found);
      });
    };

    loadHeaderBg();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(loadHeaderBg, 250);
    });
  }

  function setupBodyBackground(state, info) {
    if (info.show_body_bg !== true) return;

    const applyBg = (url) => {
      document.body.classList.add("has-body-bg");
      document.documentElement.style.setProperty("--body-bg", `url(${url})`);
      document.documentElement.style.setProperty("--body-bg-size", "cover");
      document.documentElement.style.setProperty("--body-bg-position", "center");
    };

    const checkAndApply = (isMobile) => {
      const candidates = getAssetCandidates(state.base, "body_bg", isMobile);

      findFirstAvailableAsset(candidates, checkImage)
        .then((found) => {
          if (typeof found === "string") {
            applyBg(found);
          }
        })
        .catch(() => {
          console.log("Body background not found");
        });
    };

    checkAndApply(window.innerWidth <= 640);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkAndApply(window.innerWidth <= 640);
      }, 250);
    });
  }

  template.backgrounds = {
    __test: {
      findFirstAvailableAsset,
      getAssetCandidates,
    },
    setupBodyBackground,
    setupHeaderBackground,
  };
})();
