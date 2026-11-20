/* eslint-disable */
/* global WebImporter */

import cardsArticleParser from './parsers/cards-article.js';
import cardsHotelSliderParser from './parsers/cards-hotel-slider.js';
import columnsBreadcrumbParser from './parsers/columns-breadcrumb.js';
import embedRiddleParser from './parsers/embed-riddle.js';
import cleanupTransformer from './transformers/marriott-cleanup.js';
import sectionsTransformer from './transformers/marriott-sections.js';

const PAGE_TEMPLATE = {
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

const parsers = {
  'columns-breadcrumb': columnsBreadcrumbParser,
  'embed-riddle': embedRiddleParser,
  'cards-hotel-slider': cardsHotelSliderParser,
  'cards-article': cardsArticleParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [sectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
// Page corrections (marriott-page-corrections.js, when it exists) run last.
const correctionTransformers = [];
const transformers = [cleanupTransformer, ...lateTransformers, ...correctionTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
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

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
