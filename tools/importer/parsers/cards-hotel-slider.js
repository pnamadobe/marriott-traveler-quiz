/* eslint-disable */
/* global WebImporter */
export default function parse(element, { document }) {
  // Desktop carousel first, then any mobile-only items; deduped by href below.
  const items = [
    ...element.querySelectorAll('.owl-desktop .stay__carditem'),
    ...[...element.querySelectorAll('.stay__carditem')].filter((i) => !i.closest('.owl-desktop')),
  ];
  const seen = new Set();
  const cells = [];
  items.forEach((item) => {
    const nameLink = item.querySelector('a.stay__link') || [...item.querySelectorAll('a')].find((a) => a.textContent.trim());
    const img = item.querySelector('img');
    const href = nameLink ? nameLink.href : (item.querySelector('a[href]') || {}).href;
    const key = href || (nameLink && nameLink.textContent.trim());
    if (!key || seen.has(key)) return;
    seen.add(key);

    let imageCell = '';
    if (img) {
      const image = document.createElement('img');
      image.src = img.getAttribute('src');
      image.alt = img.getAttribute('alt') || '';
      imageCell = image;
    }

    const p = document.createElement('p');
    if (nameLink) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = nameLink.textContent.trim();
      p.append(a);
    }
    cells.push([imageCell, p]);
  });
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-hotel-slider', cells });
  element.replaceWith(block);
}
