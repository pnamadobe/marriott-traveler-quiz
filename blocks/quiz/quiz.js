const SHARE = {
  facebook: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  x: (u, t) => `https://x.com/intent/post?url=${u}&text=${t}`,
  linkedin: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
  whatsapp: (u, t) => `https://wa.me/?text=${t}%20${u}`,
  email: (u, t) => `mailto:?subject=${t}&body=${u}`,
  sms: (u, t) => `sms:?&body=${t}%20${u}`,
};

const tag = (name, className, ...children) => {
  const node = document.createElement(name);
  if (className) node.className = className;
  node.append(...children);
  return node;
};

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

// Media cell: a picture plus an optional credit paragraph.
function readMedia(cell) {
  const picture = cell?.querySelector('picture, img');
  if (!picture) return null;
  const credit = [...cell.querySelectorAll('p')].map(text).find(Boolean);
  return { picture: picture.closest('picture') || picture, credit };
}

function readAnswer(li) {
  const scores = li.querySelector(':scope > ul, :scope > ol');
  const results = scores ? [...scores.children].map(text).filter(Boolean) : [];
  scores?.remove();
  const picture = li.querySelector('picture, img');
  // picture answers: any text after the image is its credit
  if (picture) return { label: picture.closest('picture') || picture, credit: text(li), results };
  return { label: text(li), results };
}

// Fisher-Yates over answer positions; selections keep their authored index.
function shuffled(n) {
  const order = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i -= 1) {
    const k = Math.floor(Math.random() * (i + 1));
    [order[i], order[k]] = [order[k], order[i]];
  }
  return order;
}

function parse(block) {
  const quiz = { questions: [], results: [] };
  const shuffle = block.classList.contains('shuffle');
  [...block.children].forEach((row) => {
    const [typeCell, mediaCell, contentCell] = row.children;
    // "Question (columns)": the type, then options in parentheses
    const [, type = '', opts = ''] = text(typeCell).toLowerCase().match(/^(\w+)\s*(?:\((.*)\))?/) || [];
    const media = readMedia(mediaCell);
    const content = contentCell || mediaCell;
    const heading = content?.querySelector('h1, h2, h3, h4, h5, h6');
    if (type === 'intro') {
      const paras = [...content.querySelectorAll(':scope > p')];
      quiz.intro = {
        media, heading, start: text(paras.pop()) || 'Start', paras, grey: opts.includes('grey'),
      };
    } else if (type === 'question') {
      const list = content.querySelector(':scope > ul, :scope > ol');
      const hint = content.querySelector(':scope > p');
      const max = parseInt(text(hint).match(/\d+/)?.[0], 10) || 1;
      const answers = [...(list?.children || [])].map(readAnswer);
      const order = shuffle ? shuffled(answers.length) : [...answers.keys()];
      const columns = opts.includes('columns');
      quiz.questions.push({
        media, heading, hint, max, answers, order, columns, grey: opts.includes('grey'),
      });
    } else if (type === 'result') {
      heading?.remove();
      quiz.results.push({ media, heading, title: text(heading), body: [...content.childNodes] });
    }
  });
  return quiz;
}

// Each selected answer adds a point to every result it names; ties go to the earlier result.
export function score(quiz, selections) {
  const totals = quiz.results.map(() => 0);
  const key = (t) => t.toLowerCase();
  const index = new Map(quiz.results.map((r, i) => [key(r.title), i]));
  selections.forEach((picked, q) => picked.forEach((a) => {
    // "Result title (2)" weighs that answer double toward the result
    quiz.questions[q].answers[a].results.forEach((r) => {
      const [, name, points] = r.match(/^(.*?)\s*(?:\((\d+)\))?$/);
      if (index.has(key(name))) totals[index.get(key(name))] += Number(points || 1);
    });
  }));
  return totals.indexOf(Math.max(...totals));
}

function mediaFigure(media, step, total) {
  const figure = tag('div', 'quiz-media');
  if (media) {
    figure.append(media.picture.cloneNode(true));
    if (media.credit) figure.append(tag('span', 'quiz-credit', media.credit));
  } else {
    figure.classList.add('no-image');
  }
  const progress = tag('div', 'quiz-progress');
  const bar = tag('span', 'quiz-progress-bar');
  bar.style.setProperty('--progress', `${(step / total) * 100}%`);
  progress.append(bar);
  if (step < total) progress.append(tag('span', 'quiz-counter', `${step} / ${total}`));
  figure.append(progress);
  return figure;
}

function shareRow(title) {
  const url = encodeURIComponent(window.location.href.split('#')[0]);
  const msg = encodeURIComponent(`I got “${title}”`);
  const list = tag('ul', 'quiz-share-links');
  Object.entries(SHARE).forEach(([name, href]) => {
    const a = tag('a', `quiz-share-${name}`);
    a.href = href(url, msg);
    if (!/^(mailto|sms):/.test(a.href)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.setAttribute('aria-label', `Share on ${name}`);
    a.style.setProperty('--icon', `url("/img/icons/share-${name}.svg")`);
    list.append(tag('li', '', a));
  });
  return tag('div', 'quiz-share', tag('p', '', 'Share your result'), list);
}

export default function init(el) {
  const quiz = parse(el);
  if (!quiz.intro || !quiz.questions.length || !quiz.results.length) return;
  const total = quiz.questions.length + 1;
  const selections = quiz.questions.map(() => []);

  const card = tag('div', 'quiz-card');
  card.setAttribute('aria-live', 'polite');

  const show = (screen) => {
    card.replaceChildren(screen);
    screen.querySelector('h1, h2, h3, h4')?.focus({ preventScroll: true });
    if (card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: 'start' });
  };
  const button = (label, onClick) => {
    const b = tag('button', 'quiz-next', label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  };
  const focusable = (heading) => {
    const h = heading.cloneNode(true);
    h.tabIndex = -1;
    return h;
  };

  const showResult = () => {
    const result = quiz.results[score(quiz, selections)];
    const body = tag('div', 'quiz-body', focusable(result.heading), ...result.body.map((n) => n.cloneNode(true)), shareRow(result.title));
    const screen = tag('div', 'quiz-screen quiz-result', mediaFigure(result.media, total, total), body);
    show(screen);
  };

  const showQuestion = (q) => {
    const question = quiz.questions[q];
    const picked = selections[q];
    const next = button('Next', () => (q + 1 < quiz.questions.length ? showQuestion(q + 1) : showResult()));
    next.disabled = !picked.length;
    const answers = tag('ul', 'quiz-answers');
    answers.classList.toggle('has-images', question.answers.some((a) => typeof a.label !== 'string'));
    answers.classList.toggle('columns', question.columns);
    const sync = () => {
      answers.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', picked.includes(Number(b.value))));
      next.disabled = !picked.length;
    };
    question.order.forEach((i) => {
      const answer = question.answers[i];
      const b = tag('button', 'quiz-answer', typeof answer.label === 'string' ? answer.label : answer.label.cloneNode(true));
      if (answer.credit) b.append(tag('span', 'quiz-credit', answer.credit));
      b.type = 'button';
      b.value = i;
      b.addEventListener('click', () => {
        const at = picked.indexOf(i);
        if (at >= 0) picked.splice(at, 1);
        else if (question.max === 1) picked.splice(0, picked.length, i);
        else if (picked.length < question.max) picked.push(i);
        sync();
      });
      answers.append(tag('li', '', b));
    });
    sync();
    const body = tag('div', 'quiz-body', focusable(question.heading));
    if (question.hint) body.append(tag('p', 'quiz-hint', text(question.hint)));
    body.append(answers, next);
    const screen = tag('div', 'quiz-screen', mediaFigure(question.media, q + 2, total), body);
    screen.classList.toggle('grey', question.grey);
    show(screen);
  };

  const { intro } = quiz;
  const introBody = tag('div', 'quiz-body', focusable(intro.heading), ...intro.paras.map((p) => p.cloneNode(true)), button(intro.start, () => showQuestion(0)));
  const introScreen = tag('div', 'quiz-screen quiz-intro', mediaFigure(intro.media, 1, total), introBody);
  introScreen.classList.toggle('grey', intro.grey);
  card.append(introScreen);
  el.replaceChildren(card);
}
