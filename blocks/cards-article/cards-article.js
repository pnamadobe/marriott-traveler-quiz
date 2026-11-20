export default function init(el) {
  const ul = document.createElement('ul');
  for (const row of el.querySelectorAll(':scope > div')) {
    const li = document.createElement('li');
    li.className = 'article';
    for (const cell of [...row.children]) {
      if (cell.querySelector('picture') && !cell.textContent.trim()) {
        cell.className = 'article-image';
      } else {
        cell.className = 'article-body';
        const paras = cell.querySelectorAll(':scope > p');
        if (paras.length > 1) paras[0].classList.add('article-category');
        paras[paras.length - 1]?.classList.add('article-title');
      }
      li.append(cell);
    }
    ul.append(li);
  }
  el.replaceChildren(ul);
}
