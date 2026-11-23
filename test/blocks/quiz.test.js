import { expect } from '@esm-bundle/chai';
import init, { score } from '../../blocks/quiz/quiz.js';
import { setConfig } from '../../scripts/ak.js';

const row = (type, media, content) => `<div><div>${type}</div><div>${media}</div><div>${content}</div></div>`;
const QUIZ = [
  row('Intro', '', '<h2>Where next?</h2><p>Begin</p>'),
  row('Question', '', '<h3>Pace?</h3><ul><li>Slow<ul><li>Slower</li></ul></li><li>Fast<ul><li>Weekend</li></ul></li></ul>'),
  row('Question', '', '<h3>Pick two</h3><p>Choose up to 2</p><ul><li>A<ul><li>weekend</li></ul></li><li>B<ul><li>Slower</li></ul></li><li>C<ul><li>Weekend</li></ul></li></ul>'),
  row('Result', '', '<h3>Slower</h3><p>Slow down.</p>'),
  row('Result', '', '<h3>Weekend</h3><p>Go for a weekend.</p>'),
].join('');

let el;

function mount() {
  el = document.createElement('div');
  el.className = 'quiz';
  el.innerHTML = QUIZ;
  document.body.append(el);
  init(el);
  return el;
}

const next = () => el.querySelector('.quiz-next');
const answers = () => [...el.querySelectorAll('.quiz-answer')];

afterEach(() => el?.remove());

describe('quiz', () => {
  it('opens on the intro with the authored button label', () => {
    mount();
    expect(el.querySelector('h2').textContent).to.equal('Where next?');
    expect(next().textContent).to.equal('Begin');
  });

  it('keeps Next disabled until an answer is chosen', () => {
    mount();
    next().click();
    expect(next().disabled).to.be.true;
    answers()[0].click();
    expect(next().disabled).to.be.false;
    expect(answers()[0].getAttribute('aria-pressed')).to.equal('true');
  });

  it('caps a multi-select question at the number in its hint', () => {
    mount();
    next().click();
    answers()[0].click();
    next().click();
    answers().forEach((b) => b.click());
    expect(answers().map((b) => b.getAttribute('aria-pressed'))).to.deep.equal(['true', 'true', 'false']);
  });

  it('shows the result with the most points, matching names case-insensitively', () => {
    mount();
    next().click();
    answers()[1].click();
    next().click();
    answers()[0].click();
    answers()[2].click();
    next().click();
    expect(el.querySelector('.quiz-result h3').textContent).to.equal('Weekend');
    expect(el.querySelectorAll('.quiz-share a')).to.have.length(6);
  });

  it('lays out "Question (columns)" in two columns and credits picture answers', () => {
    el = document.createElement('div');
    el.className = 'quiz';
    el.innerHTML = [
      row('Intro', '', '<h2>Go</h2><p>Start</p>'),
      row('Question (columns)', '', '<h3>Pick</h3><ul><li><img src="data:," alt="Beach"> <em>Getty Images</em><ul><li>Slower</li></ul></li><li>B<ul><li>Slower</li></ul></li></ul>'),
      row('Result', '', '<h3>Slower</h3>'),
    ].join('');
    document.body.append(el);
    init(el);
    next().click();
    expect(el.querySelector('.quiz-answers').classList.contains('columns')).to.be.true;
    expect(el.querySelector('.quiz-answer .quiz-credit').textContent).to.equal('Getty Images');
  });

  it('shuffles answers for "quiz (shuffle)" but scores by the authored answer', () => {
    el = document.createElement('div');
    el.className = 'quiz shuffle';
    el.innerHTML = QUIZ;
    document.body.append(el);
    init(el);
    next().click();
    expect(answers().map((b) => b.value).sort()).to.deep.equal(['0', '1']);
    answers().find((b) => b.textContent === 'Fast').click();
    next().click();
    answers().find((b) => b.textContent === 'C').click();
    next().click();
    expect(el.querySelector('.quiz-result h3').textContent).to.equal('Weekend');
  });

  it('marks "grey" rows so their titles render grey', () => {
    el = document.createElement('div');
    el.className = 'quiz';
    el.innerHTML = QUIZ.replace('<div>Intro</div>', '<div>Intro (grey)</div>');
    document.body.append(el);
    init(el);
    expect(el.querySelector('.quiz-screen').classList.contains('grey')).to.be.true;
    next().click();
    expect(el.querySelector('.quiz-screen').classList.contains('grey')).to.be.false;
  });

  it('weighs an answer by the number after its result name', () => {
    el = document.createElement('div');
    el.className = 'quiz';
    el.innerHTML = QUIZ.replace('<li>Slow<ul><li>Slower</li>', '<li>Slow<ul><li>Slower (3)</li>');
    document.body.append(el);
    init(el);
    next().click();
    answers()[0].click();
    next().click();
    answers()[0].click();
    answers()[2].click();
    next().click();
    expect(el.querySelector('.quiz-result h3').textContent).to.equal('Slower');
  });

  it('still ends on a result when no chosen answer scores', () => {
    el = document.createElement('div');
    el.className = 'quiz';
    el.innerHTML = [
      row('Intro', '', '<h2>Go</h2><p>Start</p>'),
      row('Question', '', '<h3>Pick</h3><ul><li>A</li><li>B</li></ul>'),
      row('Result', '', '<h3>First</h3>'),
      row('Result', '', '<h3>Second</h3>'),
    ].join('');
    document.body.append(el);
    init(el);
    next().click();
    answers()[1].click();
    next().click();
    expect(['First', 'Second']).to.include(el.querySelector('.quiz-result h3').textContent);
  });

  it('flags answers that name a result that does not exist', async () => {
    const logged = [];
    setConfig({ log: (msg) => logged.push(msg) });
    el = document.createElement('div');
    el.className = 'quiz';
    el.innerHTML = QUIZ.replace('<li>Slower</li></ul></li><li>Fast', '<li>Slowr</li></ul></li><li>Fast');
    document.body.append(el);
    init(el);
    setConfig({});
    expect(logged.join(' ')).to.include('Slowr');
    expect(el.querySelector('.quiz-card')).to.exist;
  });

  it('breaks a tie at random among the tied results only', () => {
    const quiz = {
      questions: [{ answers: [{ results: ['A'] }, { results: ['B'] }] }],
      results: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
    };
    const both = [[0, 1]];
    expect(score(quiz, both, () => 0)).to.equal(0);
    expect(score(quiz, both, () => 0.99)).to.equal(1);
    expect(score(quiz, [[0]], () => 0.99)).to.equal(0);
  });
});
