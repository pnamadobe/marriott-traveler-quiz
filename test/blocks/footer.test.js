import { expect } from '@esm-bundle/chai';
import init from '../../blocks/footer/footer.js';

const FOOTER = `<div><p><img src="images/logo.png" alt="Logo"></p><p>Destination</p><p>Where to?</p><p>Dates</p><p>Check-in &amp; Check-out</p><p><a href="https://example.com/search">Find Hotels</a></p></div>
<div><h2>Join</h2><p>Intro</p><ul><li>Perk</li></ul><p><a href="https://example.com/join">Join Now</a></p></div>
<div><p><a href="https://example.com/"><img src="images/brand.svg" alt="Brand"></a></p><h3>LUXURY</h3><ul><li><a href="https://example.com/a"><img src="images/a.svg" alt="A"></a></li></ul></div>
<div><p>Sites</p><ul><li><a href="/es/">Spanish</a></li></ul></div>
<div><p><img src="images/t.png" alt="T"></p><p>About</p><p>Follow</p><ul><li><a href="https://social.example/"><img src="images/s.svg" alt="S"></a></li></ul></div>
<div><ul><li><a href="/about-us/">About</a></li><li><a href="mailto:a@example.com">Contact</a></li><li><a href="#tracking-preferences">Tracking Preferences</a></li></ul><p>© Company</p></div>`;

const originalFetch = window.fetch;
const originalOpen = window.open;
let footer;
let fetched;

async function mount() {
  footer = document.createElement('footer');
  document.body.append(footer);
  await init(footer);
  return footer;
}

beforeEach(() => {
  fetched = [];
  window.fetch = async (path) => {
    fetched.push(path);
    return { ok: true, url: new URL(path, window.location).href, text: async () => FOOTER };
  };
});

afterEach(() => {
  window.fetch = originalFetch;
  window.open = originalOpen;
  delete window.OneTrust;
  footer?.remove();
});

describe('footer source', () => {
  it('fetches the local fragment first, then the site root', async () => {
    window.fetch = async (path) => {
      fetched.push(path);
      return path === '/footer.plain.html'
        ? { ok: true, url: new URL(path, window.location).href, text: async () => FOOTER }
        : { ok: false };
    };
    await mount();
    expect(fetched).to.deep.equal(['/content/footer.plain.html', '/footer.plain.html']);
  });

  it('names each band and groups the last three in the dark band', async () => {
    await mount();
    expect([...footer.children].map((c) => c.className)).to.deep.equal(['footer-booking', 'footer-loyalty', 'footer-brands', 'footer-band']);
    expect(footer.querySelectorAll('.footer-band-inner > div')).to.have.length(3);
  });

  it('frames the brand tiers with the legend inside', async () => {
    await mount();
    expect(footer.querySelector('.brands-frame > .brands-legend img').alt).to.equal('Brand');
  });

  it('opens external links in a new tab, but not site or mail links', async () => {
    await mount();
    expect(footer.querySelector('a[href="https://example.com/join"]').target).to.equal('_blank');
    expect(footer.querySelector('a[href="/es/"]').target).to.equal('');
    expect(footer.querySelector('a[href^="mailto:"]').target).to.equal('');
  });
});

describe('booking bar', () => {
  it('builds labelled fields from the fragment text', async () => {
    await mount();
    const labels = [...footer.querySelectorAll('.booking-field label')].map((l) => l.textContent);
    expect(labels).to.deep.equal(['Destination', 'Dates']);
    expect(footer.querySelector('#footer-booking-destination').placeholder).to.equal('Where to?');
    expect(footer.querySelector('#footer-booking-from').getAttribute('aria-label')).to.equal('Check-in');
  });

  it('opens the search link with destination and dates', async () => {
    let opened;
    window.open = (url) => { opened = String(url); };
    await mount();
    footer.querySelector('#footer-booking-destination').value = 'Paris';
    footer.querySelector('#footer-booking-from').value = '2026-12-10';
    footer.querySelector('.booking-form').requestSubmit();
    const url = new URL(opened);
    expect(url.origin + url.pathname).to.equal('https://example.com/search');
    expect(url.searchParams.get('destinationAddress.destination')).to.equal('Paris');
    expect(url.searchParams.get('fromDate')).to.equal('12/10/2026');
  });
});

describe('tracking preferences', () => {
  it('stays hidden without a consent manager', async () => {
    await mount();
    expect(footer.querySelector('a[href="#tracking-preferences"]').closest('li').hidden).to.be.true;
  });

  it('opens the consent dialog when one is present', async () => {
    let toggled = false;
    window.OneTrust = { ToggleInfoDisplay: () => { toggled = true; } };
    await mount();
    const link = footer.querySelector('a[href="#tracking-preferences"]');
    expect(link.closest('li').hidden).to.be.false;
    link.click();
    expect(toggled).to.be.true;
  });
});
