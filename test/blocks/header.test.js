import { expect } from '@esm-bundle/chai';
import { setViewport } from '@web/test-runner-commands';
import init from '../../blocks/header/header.js';

const NAV = `<div><p><a href="/"><img src="images/logo.svg" alt="Brand"></a></p></div>
<div><ul>
  <li>Places<ul>
    <li>Europe<ul>
      <li><a href="/europe/">Europe</a></li>
      <li>COUNTRIES<ul><li><a href="/europe/italy/">Italy</a></li></ul></li>
    </ul></li>
    <li>Asia<ul><li><a href="/asia/">Asia</a></li></ul></li>
  </ul></li>
  <li>Tips<ul><li><a href="/packing/">Packing</a></li></ul></li>
</ul></div>
<div><p>Search</p><h2>Trending</h2><ul><li><p><a href="/a/">A</a></p></li></ul></div>`;

const originalFetch = window.fetch;
let header;
let fetched;

async function mount() {
  await new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/blocks/header/header.css';
    link.onload = resolve;
    link.onerror = resolve;
    document.head.append(link);
  });
  header = document.createElement('header');
  document.body.append(header);
  await init(header);
  return header;
}

beforeEach(() => {
  fetched = [];
  window.fetch = async (path) => {
    fetched.push(path);
    return { ok: true, url: new URL(path, window.location).href, text: async () => NAV };
  };
});

afterEach(() => {
  window.fetch = originalFetch;
  header?.remove();
});

describe('nav source', () => {
  it('fetches the local fragment first, then the site root', async () => {
    window.fetch = async (path) => {
      fetched.push(path);
      return path === '/nav.plain.html'
        ? { ok: true, url: new URL(path, window.location).href, text: async () => NAV }
        : { ok: false };
    };
    await mount();
    expect(fetched).to.deep.equal(['/content/nav.plain.html', '/nav.plain.html']);
  });

  it('resolves image paths against the fragment, not the page', async () => {
    await mount();
    expect(header.querySelector('.nav-brand img').src).to.equal(new URL('/content/images/logo.svg', window.location).href);
  });
});

describe('desktop menus', () => {
  before(() => setViewport({ width: 1280, height: 800 }));

  it('builds one trigger per menu and a search toggle', async () => {
    await mount();
    expect([...header.querySelectorAll('.nav-trigger')].map((t) => t.textContent.trim())).to.deep.equal(['Places', 'Tips']);
    expect(header.querySelector('.nav-search')).to.exist;
  });

  it('opens one panel at a time and closes on Escape', async () => {
    await mount();
    const [places, tips] = header.querySelectorAll('.nav-trigger');
    places.click();
    tips.click();
    expect(document.getElementById(places.getAttribute('aria-controls')).hidden).to.be.true;
    expect(document.getElementById(tips.getAttribute('aria-controls')).hidden).to.be.false;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(tips.getAttribute('aria-expanded')).to.equal('false');
    expect(header.classList.contains('is-open')).to.be.false;
  });

  it('shows a category detail with its heading and grouped links', async () => {
    await mount();
    header.querySelector('.nav-trigger').click();
    const europe = header.querySelector('.nav-category');
    europe.click();
    const detail = document.getElementById(europe.getAttribute('aria-controls'));
    expect(detail.hidden).to.be.false;
    expect(detail.querySelector('.nav-detail-heading').textContent).to.equal('Europe');
    expect(detail.querySelector('.nav-group-title').textContent).to.equal('COUNTRIES');
  });

  it('builds a GET search form named s', async () => {
    await mount();
    const form = header.querySelector('.nav-search-panel form');
    expect(form.getAttribute('method')).to.equal('get');
    expect(form.querySelector('input').name).to.equal('s');
    expect(form.querySelector('input').placeholder).to.equal('Search');
  });
});

describe('mobile menu', () => {
  before(() => setViewport({ width: 375, height: 812 }));
  after(() => setViewport({ width: 1280, height: 800 }));

  it('opens the drawer and drills into a section and back', async () => {
    await mount();
    const hamburger = header.querySelector('.nav-hamburger');
    hamburger.click();
    expect(header.classList.contains('menu-open')).to.be.true;
    const places = header.querySelector('.nav-trigger');
    places.click();
    const panel = document.getElementById(places.getAttribute('aria-controls'));
    expect(panel.hidden).to.be.false;
    expect(getComputedStyle(places).visibility).to.equal('hidden');
    panel.querySelector(':scope > .nav-back').click();
    expect(panel.hidden).to.be.true;
    expect(header.classList.contains('menu-open')).to.be.true;
  });

  it('closes the menu when search opens', async () => {
    await mount();
    header.querySelector('.nav-hamburger').click();
    header.querySelector('.nav-search').click();
    expect(header.classList.contains('menu-open')).to.be.false;
    expect(header.querySelector('.nav-search-panel').hidden).to.be.false;
  });
});
