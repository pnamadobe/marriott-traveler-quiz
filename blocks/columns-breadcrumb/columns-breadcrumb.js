export default function init(el) {
  const ol = document.createElement('ol');
  for (const cell of el.querySelectorAll(':scope > div > div')) {
    const content = cell.querySelector('a') || cell.textContent.trim();
    if (content) {
      const li = document.createElement('li');
      li.append(content);
      ol.append(li);
    }
  }
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.append(ol);
  el.replaceChildren(nav);
}
