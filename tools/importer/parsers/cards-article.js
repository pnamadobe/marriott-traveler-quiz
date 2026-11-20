/* eslint-disable */
/* global WebImporter */
export default function parse(element, { document }) {
  const makeLink = (src, content) => {
    const a = document.createElement('a');
    a.href = src.href;
    if (typeof content === 'string') a.textContent = content;
    else a.append(content);
    return a;
  };

  const cells = [];
  element.querySelectorAll(':scope > .related-articles__item').forEach((item) => {
    const imgLink = item.querySelector('a.related-articles__imglink');
    const img = item.querySelector('img');
    const category = item.querySelector('.related-articles__category a');
    const title = item.querySelector('.related-articles__bodylink a');

    let imageCell = '';
    if (img) {
      const image = document.createElement('img');
      image.src = img.getAttribute('src');
      image.alt = img.getAttribute('alt') || '';
      const href = imgLink || title;
      imageCell = href ? makeLink(href, image) : image;
    }

    const text = [];
    if (category) {
      const p = document.createElement('p');
      p.append(makeLink(category, category.textContent.trim()));
      text.push(p);
    }
    if (title) {
      const p = document.createElement('p');
      p.append(makeLink(title, title.textContent.trim()));
      text.push(p);
    }
    cells.push([imageCell, text]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
