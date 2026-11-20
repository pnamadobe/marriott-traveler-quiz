/* eslint-disable */
/* global WebImporter */
export default function parse(element, { document }) {
  const iframe = element.querySelector('iframe[src*="riddle.com"]');
  if (!iframe) return;
  const src = iframe.getAttribute('src') || '';
  const href = src.startsWith('//') ? `https:${src.split('?')[0]}` : src.split('?')[0];
  const link = document.createElement('a');
  link.href = href;
  link.textContent = (iframe.getAttribute('title') || '').trim() || href;
  const cells = [[link]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-riddle', cells });
  element.replaceWith(block);
}
