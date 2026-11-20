/* eslint-disable */
/* global WebImporter */

const MARKER = 'data-excat-section-id';

const findSection = (root, section) => {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
};

export default function transform(hookName, element, payload) {
  const sections = payload?.template?.sections;
  if (!sections || sections.length < 2) return;
  const document = element.ownerDocument;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSection(element, section);
      if (!el) continue;
      if (i > 0 || section.style) {
        const hr = document.createElement('hr');
        if (section.style) hr.setAttribute(MARKER, section.id);
        if (i === 0) hr.setAttribute('data-excat-first', 'true');
        el.before(hr);
      }
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
      const block = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      const el = findSection(element, section);
      if (el) {
        el.after(block);
      } else if (marker) {
        let last = marker;
        while (last.nextElementSibling && last.nextElementSibling.tagName !== 'HR') {
          last = last.nextElementSibling;
        }
        last.after(block);
      }
      if (marker) {
        if (marker.hasAttribute('data-excat-first')) marker.remove();
        else marker.removeAttribute(MARKER);
      }
    }
  }
}
