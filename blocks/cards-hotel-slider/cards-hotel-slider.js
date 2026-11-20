function decorateCard(row) {
  const li = document.createElement('li');
  li.className = 'slide';
  const link = row.querySelector('a');
  for (const cell of [...row.children]) {
    const pic = cell.querySelector('picture');
    if (pic) {
      cell.className = 'slide-image';
      if (link && !pic.closest('a')) {
        const imgLink = document.createElement('a');
        imgLink.href = link.href;
        imgLink.tabIndex = -1;
        imgLink.setAttribute('aria-hidden', 'true');
        pic.replaceWith(imgLink);
        imgLink.append(pic);
      }
    } else {
      cell.className = 'slide-body';
    }
    li.append(cell);
  }
  return li;
}

function button(className, label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.setAttribute('aria-label', label);
  return btn;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const track = document.createElement('ul');
  track.className = 'track';
  track.append(...rows.map(decorateCard));

  const count = document.createElement('p');
  count.className = 'count';
  count.textContent = `${rows.length} Hotels`;

  const prev = button('prev', 'Previous');
  const next = button('next', 'Next');
  const dots = document.createElement('div');
  dots.className = 'dots';

  const page = () => track.clientWidth || 1;
  const goTo = (i) => track.scrollTo({ left: i * page(), behavior: 'smooth' });
  prev.addEventListener('click', () => track.scrollBy({ left: -page(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: page(), behavior: 'smooth' }));

  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= max - 1;
    const active = Math.round(track.scrollLeft / page());
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', i === active));
  };

  const renderDots = () => {
    const pages = Math.max(1, Math.ceil(track.scrollWidth / page() - 0.01));
    dots.replaceChildren(...Array.from({ length: pages }, (_, i) => {
      const dot = button('dot', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      return dot;
    }));
    dots.hidden = pages < 2;
    update();
  };

  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(renderDots).observe(track);

  const viewport = document.createElement('div');
  viewport.className = 'viewport';
  viewport.append(prev, track, next);
  el.replaceChildren(count, viewport, dots);
}
