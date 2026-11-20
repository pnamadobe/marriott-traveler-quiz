/* eslint-disable */
/* global WebImporter */
export default function parse(element, { document }) {
  const links = [...element.querySelectorAll('li > a')].filter((a) => a.textContent.trim());
  const cells = [];
  if (links.length) {
    cells.push(links.map((a) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      return link;
    }));
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-breadcrumb', cells });
  element.replaceWith(block);
}
