const BANDS = ['booking', 'loyalty', 'brands', 'sites', 'about', 'legal'];

async function fetchFooter() {
  // metadata-independent: /content first (local preview), then root (DA/EDS)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) throw Error('Could not load footer');
  const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
    img.loading = 'lazy';
  });
  return [...doc.body.children].filter((el) => el.tagName === 'DIV');
}

const isExternal = (a) => new URL(a.href, window.location).origin !== window.location.origin;

const pad = (n) => String(n).padStart(2, '0');
const usDate = (value) => {
  const [y, m, d] = value.split('-');
  return `${pad(m)}/${pad(d)}/${y}`;
};

function field(labelText, control, forId) {
  const pod = document.createElement('div');
  pod.className = 'booking-field';
  const label = document.createElement('label');
  label.textContent = labelText;
  label.htmlFor = forId;
  pod.append(label, control);
  return pod;
}

// Destination + dates pairs come from the fragment: label, then placeholder.
function buildBooking(section) {
  const [logo, ...paras] = section.querySelectorAll(':scope > p');
  const submit = section.querySelector('a');
  const texts = paras.filter((p) => !p.querySelector('a')).map((p) => p.textContent.trim());
  const [destLabel, destHint, dateLabel, dateHint] = texts;

  const form = document.createElement('form');
  form.className = 'booking-form';

  const dest = document.createElement('input');
  dest.id = 'footer-booking-destination';
  dest.type = 'text';
  dest.required = true;
  dest.autocomplete = 'off';
  dest.placeholder = destHint || '';

  const dates = document.createElement('div');
  dates.className = 'booking-dates';
  // the hint reads 'Check-in & Check-out': one half labels each date input
  const hints = (dateHint || '').split('&').map((h) => h.trim());
  const [from, to] = ['from', 'to'].map((key, i) => {
    const input = document.createElement('input');
    input.type = 'date';
    input.id = `footer-booking-${key}`;
    input.setAttribute('aria-label', hints[i] || dateLabel);
    dates.append(input);
    return input;
  });
  from.addEventListener('change', () => { to.min = from.value; });

  const destField = field(destLabel, dest, dest.id);
  const dateField = field(dateLabel, dates, from.id);

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = submit?.textContent.trim();

  form.append(destField, dateField, button);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new URL(submit.href);
    url.searchParams.set('destinationAddress.destination', dest.value.trim());
    if (from.value) url.searchParams.set('fromDate', usDate(from.value));
    if (to.value) url.searchParams.set('toDate', usDate(to.value));
    window.open(url, '_blank', 'noopener');
  });

  const bar = document.createElement('div');
  bar.className = 'booking-bar';
  logo?.classList.add('booking-logo');
  bar.append(...[logo, form].filter(Boolean));
  section.replaceChildren(bar);
}

// The consent dialog only exists where a consent manager is loaded.
function decorateConsentLink(section) {
  const link = section.querySelector('a[href="#tracking-preferences"]');
  if (!link) return;
  const { OneTrust } = window;
  if (!OneTrust?.ToggleInfoDisplay) {
    link.closest('li').hidden = true;
    return;
  }
  link.addEventListener('click', (e) => {
    e.preventDefault();
    OneTrust.ToggleInfoDisplay();
  });
}

// the logo tiers sit in a frame with the brand mark set into its top edge
function buildBrandFrame(section) {
  const frame = document.createElement('div');
  frame.className = 'brands-frame';
  frame.append(...section.children);
  frame.querySelector(':scope > p')?.classList.add('brands-legend');
  section.append(frame);
}

export default async function init(el) {
  const sections = await fetchFooter();
  sections.forEach((section, i) => section.classList.add(`footer-${BANDS[i] || 'extra'}`));
  const [booking, , brands, , , legal] = sections;
  if (booking) buildBooking(booking);
  if (brands) buildBrandFrame(brands);
  if (legal) decorateConsentLink(legal);

  sections.flatMap((s) => [...s.querySelectorAll('a[href]')])
    .filter((a) => isExternal(a) && !a.href.startsWith('mailto:'))
    .forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener';
    });

  // the dark band groups sites, about and legal under one inner column
  const band = document.createElement('div');
  band.className = 'footer-band';
  const inner = document.createElement('div');
  inner.className = 'footer-band-inner';
  inner.append(...sections.slice(3));
  band.append(inner);
  el.replaceChildren(...sections.slice(0, 3), band);
}
