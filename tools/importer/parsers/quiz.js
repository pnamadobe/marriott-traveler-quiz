/* eslint-disable */
/* global WebImporter */
import quizzes from '../data/riddle-quizzes.js';
import embedRiddle from './embed-riddle.js';

// Riddle quizzes render in a cross-origin iframe, so their content comes from data captured
// from the live embed (tools/importer/data/riddle-quizzes.js). Quizzes without captured data
// stay embedded.
export default function parse(element, ctx) {
  const { document } = ctx;
  const iframe = element.querySelector('iframe[src*="riddle.com"]');
  if (!iframe) return;
  const id = (iframe.getAttribute('src') || '').split('?')[0].split('/').pop();
  const quiz = quizzes[id];
  if (!quiz) {
    embedRiddle(element, ctx);
    return;
  }

  const el = (tag, text) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    return node;
  };
  const media = (src, alt, credit) => {
    const cell = document.createElement('div');
    if (!src) return '';
    const img = el('img');
    img.src = src;
    img.alt = alt || '';
    cell.append(img);
    if (credit) {
      const p = el('p');
      p.append(el('em', credit));
      cell.append(p);
    }
    return cell;
  };
  const content = (...nodes) => {
    const cell = document.createElement('div');
    cell.append(...nodes);
    return cell;
  };

  const rows = [];
  const { intro } = quiz;
  const type = (name, opts) => (opts.length ? `${name} (${opts.join(', ')})` : name);
  rows.push([type('Intro', intro.grey ? ['grey'] : []), media(intro.image, '', intro.credit), content(el('h2', intro.title), el('p', intro.start))]);

  quiz.questions.forEach((q) => {
    const list = el('ul');
    q.answers.forEach((a) => {
      const li = el('li');
      if (a.image) {
        const img = el('img');
        img.src = a.image;
        img.alt = a.alt;
        li.append(img);
        if (a.credit) li.append(el('em', a.credit));
      } else {
        li.append(a.text);
      }
      const scores = el('ul');
      a.results.forEach((r) => scores.append(el('li', r)));
      li.append(scores);
      list.append(li);
    });
    const nodes = [el('h3', q.title)];
    if (q.maxSelections > 1) nodes.push(el('p', `Choose up to ${q.maxSelections}`));
    nodes.push(list);
    rows.push([type('Question', [q.columns && 'columns', q.grey && 'grey'].filter(Boolean)), media(q.image, '', q.credit), content(...nodes)]);
  });

  quiz.results.forEach((r) => {
    const body = document.createElement('div');
    body.innerHTML = r.html;
    rows.push(['Result', media(r.image, '', r.credit), content(el('h3', r.title), ...body.childNodes)]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'quiz', variants: quiz.shuffle ? ['shuffle'] : [], cells: rows });
  element.replaceWith(block);
}
