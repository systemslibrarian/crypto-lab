const test=require('node:test'),assert=require('node:assert/strict');
const {readCards,hreflessLine}=require('../tools/card-reader.js');
const CARD=(attrs,title='X')=>`<a ${attrs}><div class="project-title">${title}</div></a>`;
const SLUG='https://systemslibrarian.github.io/crypto-lab-x/';

test('all four shapes from the #125 census are seen', () => {
  const shapes = {
    normal:        `class="project-card" data-category="A" href="${SLUG}"`,
    featureCard:   `class="feature-card" data-category="A" href="${SLUG}"`,
    hrefFirst:     `href="${SLUG}" class="project-card" data-category="A"`,
    nonCryptoLab:  `class="project-card" data-category="A" href="https://systemslibrarian.github.io/snow2/"`,
  };
  for (const [name,attrs] of Object.entries(shapes)) {
    const r=readCards(CARD(attrs));
    assert.equal(r.cards.length,1,`${name} must be seen`);
    assert.equal(r.hrefless.length,0,`${name} must resolve`);
  }
  assert.equal(readCards(CARD(shapes.nonCryptoLab)).cards[0].slug,'snow2');
});

test('a > inside an attribute does not end the tag', () => {
  const r=readCards(CARD(`class="project-card" href="${SLUG}" data-review-note="a -> b" data-level="advanced"`));
  assert.equal(r.cards.length,1);
  assert.equal(r.cards[0].attr('data-level'),'advanced','must see past the > in the note');
});

test('CARD-HREFLESS is a named failure, never a skip', () => {
  const r=readCards(CARD('class="project-card" data-category="A"','Dropped'));
  assert.equal(r.cards.length,0);
  assert.equal(r.hrefless.length,1);
  assert.match(r.hrefless[0].why,/no href/);
  assert.match(hreflessLine(r.hrefless),/CARD-HREFLESS \(1\)/);
  assert.match(hreflessLine(r.hrefless),/"Dropped"/);
});

test('a non-github.io href is hrefless, not silently slugged', () => {
  const r=readCards(CARD(`class="project-card" href="https://example.com/x/"`));
  assert.equal(r.cards.length,0);
  assert.equal(r.hrefless.length,1);
});

test('controls: a non-card anchor and an unclosed tag', () => {
  assert.equal(readCards(`<a class="nav-link" href="${SLUG}">x</a>`).cards.length,0,'a non-card anchor must not be read as a card');
  const un=readCards(`<a class="project-card" href="${SLUG}"`);
  assert.equal(un.cards.length,0);
  assert.equal(un.hrefless.length,1,'an unclosed tag is reported, not dropped');
});

test('attribute order cannot change the answer', () => {
  const a=readCards(CARD(`class="project-card" data-category="A" href="${SLUG}" data-level="x"`)).cards[0];
  const b=readCards(CARD(`data-level="x" href="${SLUG}" data-category="A" class="project-card"`)).cards[0];
  assert.equal(a.slug,b.slug);
  assert.equal(a.attr('data-level'),b.attr('data-level'));
  assert.deepEqual(a.categories,b.categories);
});
