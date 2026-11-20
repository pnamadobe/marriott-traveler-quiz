/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-travel-quiz.js
  var import_travel_quiz_exports = {};
  __export(import_travel_quiz_exports, {
    default: () => import_travel_quiz_default
  });

  // tools/importer/parsers/cards-article.js
  function parse(element, { document }) {
    const makeLink = (src, content) => {
      const a = document.createElement("a");
      a.href = src.href;
      if (typeof content === "string") a.textContent = content;
      else a.append(content);
      return a;
    };
    const cells = [];
    element.querySelectorAll(":scope > .related-articles__item").forEach((item) => {
      const imgLink = item.querySelector("a.related-articles__imglink");
      const img = item.querySelector("img");
      const category = item.querySelector(".related-articles__category a");
      const title = item.querySelector(".related-articles__bodylink a");
      let imageCell = "";
      if (img) {
        const image = document.createElement("img");
        image.src = img.getAttribute("src");
        image.alt = img.getAttribute("alt") || "";
        const href = imgLink || title;
        imageCell = href ? makeLink(href, image) : image;
      }
      const text = [];
      if (category) {
        const p = document.createElement("p");
        p.append(makeLink(category, category.textContent.trim()));
        text.push(p);
      }
      if (title) {
        const p = document.createElement("p");
        p.append(makeLink(title, title.textContent.trim()));
        text.push(p);
      }
      cells.push([imageCell, text]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-hotel-slider.js
  function parse2(element, { document }) {
    const items = [
      ...element.querySelectorAll(".owl-desktop .stay__carditem"),
      ...[...element.querySelectorAll(".stay__carditem")].filter((i) => !i.closest(".owl-desktop"))
    ];
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    items.forEach((item) => {
      const nameLink = item.querySelector("a.stay__link") || [...item.querySelectorAll("a")].find((a) => a.textContent.trim());
      const img = item.querySelector("img");
      const href = nameLink ? nameLink.href : (item.querySelector("a[href]") || {}).href;
      const key = href || nameLink && nameLink.textContent.trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      let imageCell = "";
      if (img) {
        const image = document.createElement("img");
        image.src = img.getAttribute("src");
        image.alt = img.getAttribute("alt") || "";
        imageCell = image;
      }
      const p = document.createElement("p");
      if (nameLink) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = nameLink.textContent.trim();
        p.append(a);
      }
      cells.push([imageCell, p]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-hotel-slider", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-breadcrumb.js
  function parse3(element, { document }) {
    const links = [...element.querySelectorAll("li > a")].filter((a) => a.textContent.trim());
    const cells = [];
    if (links.length) {
      cells.push(links.map((a) => {
        const link = document.createElement("a");
        link.href = a.href;
        link.textContent = a.textContent.trim();
        return link;
      }));
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-breadcrumb", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-riddle.js
  function parse4(element, { document }) {
    const iframe = element.querySelector('iframe[src*="riddle.com"]');
    if (!iframe) return;
    const src = iframe.getAttribute("src") || "";
    const href = src.startsWith("//") ? `https:${src.split("?")[0]}` : src.split("?")[0];
    const link = document.createElement("a");
    link.href = href;
    link.textContent = (iframe.getAttribute("title") || "").trim() || href;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-riddle", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/marriott-cleanup.js
  var removeAll = (root, selectors) => {
    selectors.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => el.remove());
    });
  };
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      removeAll(element, [
        "header.header-template-part.wp-block-template-part",
        "footer.wp-block-template-part",
        "#onetrust-consent-sdk",
        "li.teconsent-default-link",
        ".litepicker",
        ".wp-block-traveler-fse-blocks-knotch",
        ".knotch_placeholder",
        '[id^="batBeacon"]',
        '[id^="ttdUniversalPixelTag"]',
        "img.ywa-10000"
      ]);
      element.querySelectorAll("iframe").forEach((iframe) => {
        if (!iframe.closest("section.riddle-quiz")) iframe.remove();
      });
      removeAll(element, [
        ".post-content .wp-block-spacer",
        ".wp-block-spacer",
        ".article-hero__imgauthor"
      ]);
      element.querySelectorAll(".stay__button a").forEach((a) => {
        const doc = a.ownerDocument;
        const u = doc.createElement("u");
        u.textContent = a.textContent.trim();
        a.replaceChildren(u);
        const strong = doc.createElement("strong");
        a.replaceWith(strong);
        strong.append(a);
      });
      element.querySelectorAll(".custom-breadcrumb li > span").forEach((span) => {
        if (span.querySelector("img")) span.remove();
      });
      const stay = element.querySelectorAll("aside.stay, .wp-block-traveler-fse-blocks-highlight.stay");
      stay.forEach((s) => {
        removeAll(s, [
          "button.prev-btn",
          "button.next-btn",
          ".owl-nav",
          ".owl-dots",
          ".stay__num",
          ".stay__count",
          ".owl-item.cloned",
          "hr.stay__seperator"
        ]);
        const desktop = s.querySelector(".owl-carousel.owl-desktop");
        if (desktop && desktop.querySelector(".stay__carditem")) {
          s.querySelectorAll(".owl-carousel.owl-mobile").forEach((m) => m.remove());
        }
      });
    }
    if (hookName === "afterTransform") {
      removeAll(element, ["script", "style", "noscript", "link", "button"]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach(({ name }) => {
          if (name.startsWith("data-track") || name.startsWith("data-analytics") || name === "onclick") {
            el.removeAttribute(name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/marriott-sections.js
  var MARKER = "data-excat-section-id";
  var findSection = (root, section) => {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  };
  function transform2(hookName, element, payload) {
    var _a;
    const sections = (_a = payload == null ? void 0 : payload.template) == null ? void 0 : _a.sections;
    if (!sections || sections.length < 2) return;
    const document = element.ownerDocument;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSection(element, section);
        if (!el) continue;
        if (i > 0 || section.style) {
          const hr = document.createElement("hr");
          if (section.style) hr.setAttribute(MARKER, section.id);
          if (i === 0) hr.setAttribute("data-excat-first", "true");
          el.before(hr);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        const block = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        const el = findSection(element, section);
        if (el) {
          el.after(block);
        } else if (marker) {
          let last = marker;
          while (last.nextElementSibling && last.nextElementSibling.tagName !== "HR") {
            last = last.nextElementSibling;
          }
          last.after(block);
        }
        if (marker) {
          if (marker.hasAttribute("data-excat-first")) marker.remove();
          else marker.removeAttribute(MARKER);
        }
      }
    }
  }

  // tools/importer/import-travel-quiz.js
  var PAGE_TEMPLATE = {
    "name": "travel-quiz",
    "urls": [
      "https://traveler.marriott.com/travel-quiz/quiz-where-to-travel-next-year/"
    ],
    "representativeUrl": "https://traveler.marriott.com/travel-quiz/quiz-where-to-travel-next-year/",
    "description": "Travel quiz articles: breadcrumb, article hero, intro copy with an embedded Riddle quiz, Where to Stay hotel slider and related articles.",
    "blocks": [
      {
        "name": "columns-breadcrumb",
        "instances": [
          ".custom-breadcrumb"
        ]
      },
      {
        "name": "embed-riddle",
        "instances": [
          "section.riddle-quiz",
          ".riddle2-wrapper"
        ]
      },
      {
        "name": "cards-hotel-slider",
        "instances": [
          ".stay__cards"
        ]
      },
      {
        "name": "cards-article",
        "instances": [
          ".related-articles__items"
        ]
      }
    ],
    "urlPattern": "/travel-quiz/*",
    "sections": [
      {
        "id": "rc1",
        "name": "Breadcrumb",
        "selector": [
          ".custom-breadcrumb"
        ],
        "style": null,
        "blocks": [
          "columns-breadcrumb"
        ],
        "defaultContent": []
      },
      {
        "id": "rc2",
        "name": "Article hero",
        "selector": [
          "section.article-hero"
        ],
        "style": "centered",
        "blocks": [],
        "defaultContent": [
          ".article-hero__category",
          ".article-hero__title",
          ".article-hero__author",
          ".article-hero__img",
          ".article-hero__imgdesc"
        ]
      },
      {
        "id": "rc3c1",
        "name": "Article intro and quiz",
        "selector": [
          ".post-content.article-data"
        ],
        "style": null,
        "blocks": [
          "embed-riddle"
        ],
        "defaultContent": [
          ".post-content.article-data > p"
        ]
      },
      {
        "id": "rc3c2",
        "name": "Where to Stay",
        "selector": [
          "aside.stay",
          ".wp-block-traveler-fse-blocks-highlight.stay"
        ],
        "style": "centered",
        "blocks": [
          "cards-hotel-slider"
        ],
        "defaultContent": [
          ".stay__heading",
          ".stay__title",
          ".stay__button"
        ]
      },
      {
        "id": "rc3c3",
        "name": "Related Articles",
        "selector": [
          "section.related-articles"
        ],
        "style": "centered",
        "blocks": [
          "cards-article"
        ],
        "defaultContent": [
          ".related-articles__heading"
        ]
      }
    ]
  };
  var parsers = {
    "columns-breadcrumb": parse3,
    "embed-riddle": parse4,
    "cards-hotel-slider": parse2,
    "cards-article": parse
  };
  var sectionTransformers = [transform2];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var correctionTransformers = [];
  var transformers = [transform, ...lateTransformers, ...correctionTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    };
    template.blocks.forEach((blockDef) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
    });
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
    return pageBlocks;
  }
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  var import_travel_quiz_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_travel_quiz_exports);
})();
