const ICONS = '/img/icons';
let navId = 0;

async function fetchNav() {
  // metadata-independent: /content first (local preview), then root (DA/EDS)
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) throw Error('Could not load nav');
  const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return [...doc.body.children].filter((el) => el.tagName === 'DIV');
}

function icon(name) {
  const span = document.createElement('span');
  span.className = `icon icon-${name}`;
  span.style.setProperty('--icon', `url("${ICONS}/${name}.svg")`);
  span.setAttribute('aria-hidden', 'true');
  return span;
}

function button(className, label, ...children) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  if (label) btn.setAttribute('aria-label', label);
  btn.append(...children);
  return btn;
}

const ownText = (li) => [...li.childNodes]
  .filter((n) => n.nodeType === Node.TEXT_NODE)
  .map((n) => n.textContent.trim())
  .join(' ')
  .trim();

const subList = (li) => li.querySelector(':scope > ul');

// each trigger keeps a reference to the panel it controls
const controls = new WeakMap();

function control(trigger, panel) {
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', panel.id);
  controls.set(trigger, panel);
}

function buildDetail(items) {
  const detail = document.createElement('div');
  detail.className = 'nav-detail';
  items.forEach((li, i) => {
    const list = subList(li);
    if (list) {
      const group = document.createElement('div');
      group.className = 'nav-group';
      const title = document.createElement('p');
      title.className = 'nav-group-title';
      title.textContent = ownText(li);
      list.classList.add('nav-group-links');
      group.append(title, list);
      detail.append(group);
      return;
    }
    const a = li.querySelector('a');
    if (!a) return;
    a.classList.add(i === 0 ? 'nav-detail-heading' : 'nav-detail-link');
    detail.append(a);
  });
  return detail;
}

const backButton = (label, onClick) => {
  const back = button('nav-back', '', icon('chevron-right'), label);
  back.addEventListener('click', onClick);
  return back;
};

function buildCategories(items, panel) {
  const list = document.createElement('ul');
  list.className = 'nav-categories';
  const details = document.createElement('div');
  details.className = 'nav-details';
  const select = (btn) => list.querySelectorAll('.nav-category').forEach((other) => {
    const open = other === btn;
    other.setAttribute('aria-expanded', open);
    controls.get(other).hidden = !open;
  });
  items.forEach((li) => {
    const label = ownText(li);
    const detail = buildDetail([...subList(li).children]);
    detail.id = `nav-detail-${navId += 1}`;
    detail.hidden = true;
    detail.prepend(backButton(label, () => select(null)));
    details.append(detail);
    const btn = button('nav-category', '', label, icon('chevron-right'));
    control(btn, detail);
    btn.addEventListener('click', () => select(btn));
    const item = document.createElement('li');
    item.append(btn);
    list.append(item);
  });
  panel.classList.add('has-categories');
  panel.append(list, details);
}

function buildPanel(ul) {
  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  panel.id = `nav-panel-${navId += 1}`;
  panel.hidden = true;
  const items = [...ul.children];
  if (items.some(subList)) {
    buildCategories(items, panel);
  } else {
    ul.className = 'nav-links';
    panel.append(ul);
  }
  return panel;
}

function buildSearch(section) {
  const panel = document.createElement('div');
  panel.className = 'nav-panel nav-search-panel';
  panel.id = `nav-panel-${navId += 1}`;
  panel.hidden = true;
  const [placeholder] = section.querySelectorAll(':scope > p');
  const form = document.createElement('form');
  form.action = '/';
  form.method = 'get';
  form.role = 'search';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 's';
  input.placeholder = placeholder?.textContent.trim() || 'Search';
  input.setAttribute('aria-label', input.placeholder);
  form.append(input);
  placeholder?.remove();
  const heading = section.querySelector('h2, h3');
  heading?.classList.add('nav-trending-title');
  section.querySelector('ul')?.classList.add('nav-trending');
  panel.append(form, ...section.children);
  return panel;
}

function decorate(header, sections) {
  const [brand, navSection, searchSection] = sections;
  const bar = document.createElement('nav');
  bar.className = 'nav-bar';
  bar.setAttribute('aria-label', 'Main');

  const logo = brand?.querySelector('a');
  if (logo) {
    logo.className = 'nav-brand';
    logo.setAttribute('aria-label', logo.querySelector('img')?.alt || 'Home');
  }

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  const triggers = [];
  const panels = document.createElement('div');
  panels.className = 'nav-panels';

  const hamburger = button('nav-hamburger', 'Open menu', icon('menu'), icon('close'));
  hamburger.setAttribute('aria-expanded', 'false');

  const closePanels = () => {
    triggers.forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
      controls.get(t).hidden = true;
    });
    header.classList.toggle('is-open', header.classList.contains('menu-open'));
  };
  const close = () => {
    header.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    closePanels();
  };
  const toggle = (trigger) => {
    const panel = controls.get(trigger);
    const open = panel.hidden;
    closePanels();
    if (!open) return;
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    header.classList.add('is-open');
  };
  // panels sit next to their trigger; search has no list item, so it goes in the panels row
  const register = (trigger, panel, closable = true) => {
    control(trigger, panel);
    trigger.addEventListener('click', () => toggle(trigger));
    if (closable) {
      const x = button('nav-close', 'Close menu', icon('close'));
      x.addEventListener('click', close);
      panel.prepend(backButton(trigger.textContent.trim(), closePanels), x);
    }
    triggers.push(trigger);
    (trigger.closest('li') || panels).append(panel);
  };
  hamburger.addEventListener('click', () => {
    const open = !header.classList.contains('menu-open');
    close();
    if (!open) return;
    header.classList.add('menu-open', 'is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
  });

  const menu = document.createElement('ul');
  menu.className = 'nav-sections';
  [...(navSection?.querySelector('ul')?.children || [])].forEach((li) => {
    const list = subList(li);
    if (!list) return;
    const trigger = button('nav-trigger', '', ownText(li), icon('chevron-down'));
    const item = document.createElement('li');
    item.append(trigger);
    menu.append(item);
    register(trigger, buildPanel(list));
  });

  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  if (searchSection) {
    const search = button('nav-search', 'Search', icon('search'), icon('close'));
    tools.append(search);
    // search replaces the mobile menu rather than stacking on it
    search.addEventListener('click', () => {
      if (!header.classList.contains('menu-open')) return;
      header.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
    register(search, buildSearch(searchSection), false);
    search.addEventListener('click', () => {
      if (search.getAttribute('aria-expanded') === 'true') search.closest('header').querySelector('.nav-search-panel input').focus();
    });
  }

  bar.append(...[hamburger, logo, menu, tools].filter(Boolean));
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) close();
  });
  // desktop and mobile menus differ, so reset whenever the layout switches
  window.matchMedia('(width >= 900px)').addEventListener('change', close);
  const main = document.querySelector('main');
  const skip = document.createElement('a');
  if (main) {
    main.id ||= 'main';
    skip.className = 'nav-skip';
    skip.href = `#${main.id}`;
    skip.textContent = 'Skip to main content';
  }
  header.replaceChildren(...(main ? [skip] : []), bar, panels, overlay);
}

export default async function init(el) {
  decorate(el, await fetchNav());
}
