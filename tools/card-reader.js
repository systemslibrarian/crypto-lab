/*
 * card-reader.js — the one definition of what a card in index.html IS.
 *
 * Not runnable. Required by fleet-sync.js, readme-sync.js, catalog-sync.js,
 * concept-sync.js, level-sync.js, lab-dates.js and teach-build.js.
 *
 * WHY THIS EXISTS
 *
 * `index.html` is the single source of truth, and until 2026-10-19 every tool
 * that read a card from it carried its own regex for what a card is — eight
 * matchers across seven files, two of them inside `lab-dates` alone, and those
 * two disagreed with each other on attribute order. That is the
 * `PAGES_PUBLISHERS` and `sibling-labs.js` lesson for the third time: a
 * definition COPIED instead of IMPORTED is how the second reader misses what
 * the first one learned. `deploy-sync` kept a lab only if a workflow mentioned
 * the literal `deploy-pages` while `gate-sync` had already learned the
 * `peaceiris` publisher a month earlier, so the fleet contained the fix and the
 * second checker never got it — and two labs served a build from 2026-07-11
 * with nothing judging them current or stale.
 *
 * The census in #125, measured by running each matcher against four card
 * shapes rather than by reading them:
 *
 *   matcher                     normal  feature-card  href-first  non-crypto-lab slug
 *   fleet-sync  ANCHOR+HREF     sees    sees          sees        sees
 *   readme-sync cardRe          sees    sees          MISSES      sees
 *   catalog-sync inline re      sees    sees          MISSES      sees
 *   concept-sync title re       sees    sees          sees        sees
 *   level-sync  CARD_HEAD       sees    sees          MISSES      MISSES
 *   lab-dates   re (line 121)   sees    MISSES        sees        MISSES
 *   lab-dates   CARD_HEAD       sees    MISSES        MISSES      MISSES
 *   teach-build re              sees    sees          MISSES      sees
 *
 * Three latent defects fall out of that table, and none of them was visible as
 * a failure: `lab-dates` matches `project-card` only, so a returning
 * `feature-card` would be carded by six tools and dated by none; five of the
 * eight pin `data-category` BEFORE `href`, so a card that reshuffled its own
 * attributes would drop out of five denominators at once; and the stamping
 * tools write attributes into that very tag on every run.
 *
 * The near miss is on record. A conversion of `feature-card` anchors to
 * `project-card` rebuilt each anchor's attributes and collected only the
 * `data-*` set, dropping the `href`. The catalog fell to 221 cards. It was
 * caught in-branch by `corpus-sync` and `level-sync` and never reached main —
 * but it was caught by two readers DISAGREEING, which is luck rather than a
 * control. Under one reader the same edit is one named failure.
 *
 * WHAT THIS MATCHES, AND WHAT IT REFUSES
 *
 * The opening `<a>` tag of a `project-card` or `feature-card`, in ANY attribute
 * order, with its attributes pulled out of the tag rather than positionally. A
 * denominator must not shrink because a card reshuffled its attributes.
 *
 * `CARD-HREFLESS` is a NAMED failure, never a skip: a card anchor whose href
 * does not resolve to a slug is reported and counted, because "could not look"
 * is never "nothing there" — the defect this repository records most often.
 *
 * ON PARSING THE TAG RATHER THAN SPLITTING ON `>`
 *
 * The tag is bounded by scanning for the first `>` that is OUTSIDE a quoted
 * attribute value. Splitting on the first `>` is what made `lab-dates` and
 * `level-sync` each write a second `data-level` when a review note contained
 * one: the tag they thought they were looking at ended early, the attributes
 * that really followed fell outside the match, and neither writer saw its own.
 * That bug is now impossible here rather than guarded against downstream.
 */
'use strict';

/** Opening tag of a card anchor: the class attribute is the only anchor point. */
const CARD_OPEN = /<a\s[^>]*class="(?:feature|project)-card(?:\s[^"]*)?"/g;

/** One attribute out of an already-bounded opening tag. */
function attrIn(tag, name) {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return m ? m[1] : null;
}

/**
 * The end index of the tag that starts at `from`, found by scanning for the
 * first `>` that is not inside a quoted value. Returns -1 when the tag never
 * closes, which is a malformed document rather than a card.
 */
function tagEnd(html, from) {
  let quote = null;
  for (let i = from; i < html.length; i += 1) {
    const ch = html[i];
    if (quote) { if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '>') return i;
  }
  return -1;
}

/**
 * Every card in `html`.
 *
 * @returns {{cards: Array, hrefless: Array}} `cards` each carry `{slug, href,
 *   title, categories, tag, tagStart, tagEnd, block, attr(name)}`; `hrefless`
 *   names every card anchor whose href did not resolve, for the caller to
 *   report as a failure rather than drop.
 */
function readCards(html) {
  const cards = [];
  const hrefless = [];
  CARD_OPEN.lastIndex = 0;
  let m;
  while ((m = CARD_OPEN.exec(html)) !== null) {
    const start = m.index;
    const end = tagEnd(html, start);
    if (end === -1) {
      hrefless.push({ at: start, why: 'the card anchor never closes its opening tag' });
      continue;
    }
    const tag = html.slice(start, end + 1);
    const href = attrIn(tag, 'href');
    const slugMatch = href && /^https:\/\/systemslibrarian\.github\.io\/([A-Za-z0-9._-]+)\/$/.exec(href);
    /* The block is the anchor through its closing tag, for callers that read a
       card's inner content (titles, chips, copy). */
    const close = html.indexOf('</a>', end);
    const block = close === -1 ? html.slice(start, end + 1) : html.slice(start, close + 4);
    if (!slugMatch) {
      const title = /(?:project|feature)-title">([^<]+)</.exec(block);
      hrefless.push({
        at: start,
        title: title ? title[1].trim() : null,
        href,
        why: href ? `href "${href}" is not a github.io project page` : 'the card anchor has no href',
      });
      continue;
    }
    const title = /(?:project|feature)-title">([^<]+)</.exec(block);
    cards.push({
      slug: slugMatch[1],
      href,
      title: title ? title[1].trim() : '',
      categories: (attrIn(tag, 'data-category') || '').split('|').map((x) => x.trim()).filter(Boolean),
      wip: /class="[^"]*wip-card/.test(tag),
      tag,
      tagStart: start,
      tagEnd: end,
      block,
      attr: (name) => attrIn(tag, name),
    });
  }
  return { cards, hrefless };
}

/** The line a caller prints before exiting, or '' when every card resolved. */
function hreflessLine(hrefless) {
  if (!hrefless.length) return '';
  return `CARD-HREFLESS (${hrefless.length}) — a card anchor that does not resolve to a slug.\n`
    + '  Counted as a failure, never skipped: a card the reader cannot place would otherwise\n'
    + '  leave every denominator derived from index.html quietly smaller.\n'
    + hrefless.map((h) => `  ${h.title ? `"${h.title}" ` : ''}at offset ${h.at}: ${h.why}`).join('\n');
}

module.exports = { readCards, hreflessLine, CARD_OPEN, tagEnd, attrIn };
