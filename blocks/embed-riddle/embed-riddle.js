const isRiddle = (origin) => {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === 'https:' && (hostname === 'riddle.com' || hostname.endsWith('.riddle.com'));
  } catch {
    return false;
  }
};

const getHeight = (data) => {
  let msg = data;
  if (typeof msg === 'string') {
    try {
      msg = JSON.parse(msg);
    } catch {
      return null;
    }
  }
  const height = Number(msg?.riddleHeight ?? msg?.height ?? msg?.data?.height);
  return height > 0 ? height : null;
};

export default function init(el) {
  const a = el.querySelector('a');
  if (!a || !isRiddle(a.href)) return;
  const text = a.textContent.trim();
  const iframe = document.createElement('iframe');
  iframe.src = a.href;
  iframe.title = text && !text.startsWith('http') ? text : 'Riddle quiz';
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; clipboard-write; fullscreen';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  window.addEventListener('message', (e) => {
    if (e.source !== iframe.contentWindow || !isRiddle(e.origin)) return;
    const height = getHeight(e.data);
    if (height) iframe.style.height = `${Math.ceil(height)}px`;
  });
  el.replaceChildren(iframe);
}
