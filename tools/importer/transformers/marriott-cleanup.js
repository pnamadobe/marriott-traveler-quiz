/* eslint-disable */
/* global WebImporter */

const removeAll = (root, selectors) => {
  selectors.forEach((sel) => {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  });
};

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Global chrome, consent UI, third-party widgets and tracking pixels.
    removeAll(element, [
      'header.header-template-part.wp-block-template-part',
      'footer.wp-block-template-part',
      '#onetrust-consent-sdk',
      'li.teconsent-default-link',
      '.litepicker',
      '.wp-block-traveler-fse-blocks-knotch',
      '.knotch_placeholder',
      '[id^="batBeacon"]',
      '[id^="ttdUniversalPixelTag"]',
      'img.ywa-10000',
    ]);

    // Iframes outside the Riddle quiz are trackers/sync frames.
    element.querySelectorAll('iframe').forEach((iframe) => {
      if (!iframe.closest('section.riddle-quiz')) iframe.remove();
    });

    // Article: spacer and the hidden photo credit.
    removeAll(element, [
      '.post-content .wp-block-spacer',
      '.wp-block-spacer',
      '.article-hero__imgauthor',
    ]);

    // "Explore More Hotels" is an outlined button: bold + underlined link (btn-primary btn-outline).
    element.querySelectorAll('.stay__button a').forEach((a) => {
      const doc = a.ownerDocument;
      const u = doc.createElement('u');
      u.textContent = a.textContent.trim();
      a.replaceChildren(u);
      const strong = doc.createElement('strong');
      a.replaceWith(strong);
      strong.append(a);
    });

    // Breadcrumb chevron icons (span > img data:svg between crumbs).
    element.querySelectorAll('.custom-breadcrumb li > span').forEach((span) => {
      if (span.querySelector('img')) span.remove();
    });

    // Hotel slider: controls, duplicate counters, carousel clones and
    // the mobile duplicate of the desktop carousel, so each hotel appears once.
    const stay = element.querySelectorAll('aside.stay, .wp-block-traveler-fse-blocks-highlight.stay');
    stay.forEach((s) => {
      removeAll(s, [
        'button.prev-btn',
        'button.next-btn',
        '.owl-nav',
        '.owl-dots',
        '.stay__num',
        '.stay__count',
        '.owl-item.cloned',
        'hr.stay__seperator',
      ]);
      const desktop = s.querySelector('.owl-carousel.owl-desktop');
      if (desktop && desktop.querySelector('.stay__carditem')) {
        s.querySelectorAll('.owl-carousel.owl-mobile').forEach((m) => m.remove());
      }
    });
  }

  if (hookName === 'afterTransform') {
    removeAll(element, ['script', 'style', 'noscript', 'link', 'button']);
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach(({ name }) => {
        if (name.startsWith('data-track') || name.startsWith('data-analytics') || name === 'onclick') {
          el.removeAttribute(name);
        }
      });
    });
  }
}
