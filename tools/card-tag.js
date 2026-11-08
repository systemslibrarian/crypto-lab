/*
 * card-tag.js — ONE definition of where each attribute sits in a card's opening
 * tag, imported by every writer that stamps one.
 *
 * Not runnable. Required by catalog-evidence.js, lab-dates.js and level-sync.js.
 *
 * Reads: nothing; callers pass the tag text that card-reader.js bounded.
 *
 * WHY THIS EXISTS
 *
 * Three tools write attributes into the same tag and each had its own idea of
 * where they go, so WHICHEVER RAN LAST REFORMATTED ALL 252 CARDS:
 *
 *   - `catalog-evidence.js` inserted its derived attributes immediately after
 *     `href`, which pushed `data-added`/`data-updated` off the href line;
 *   - `lab-dates.js` inserted the dates immediately after `href`, pulling them
 *     back onto it;
 *   - `level-sync.js` inserted `data-level` immediately after `href` too,
 *     moving it up from below the derived block.
 *
 * Measured 2026-11-08: PR #374 ran the first and its commit carried an 803-line
 * index.html diff; PR #377 ran the second and carried 762 lines back the other
 * way; running the third moves 766. Four cards had actually changed between
 * them. A reviewer cannot see a real claim change in that, which is the cost --
 * the flip is cosmetic and it hides the thing that is not.
 *
 * So the layout is declared once, HERE, and it is the layout `main` already has
 * (chosen to minimise the diff rather than to be tidier):
 *
 *   <a class=... data-category=... href=... data-added=... data-added-on=... data-updated=...
 *      data-implements=...            <- derived, one per line
 *      ...
 *      data-level=...                 <- own line, after the derived block
 *      target=... rel=... style=...>  <- whatever the card already had
 *
 * The functions below are deliberately INSERTERS rather than a whole-tag
 * rebuilder. A rebuilder would also normalise the run of blank lines that the
 * old strip passes left inside many tags, and that is a 252-card diff for no
 * claim -- the exact noise this module exists to stop.
 */

'use strict';

/** Same line as `href`, in this order. */
const DATE_ATTRS = ['data-added', 'data-added-on', 'data-updated'];
/** Own line, after the derived block. */
const LEVEL_ATTRS = ['data-level'];
/*
 * Own-line attributes that stay BELOW data-level. Measured across main: only
 * `data-overlaps`, on 19 cards. It is the one attribute here that is judged and
 * hand-written rather than derived -- how two labs differ is not derivable from
 * either one -- so the writers leave it alone, and data-level has to go above it
 * rather than after the last own-line attribute it happens to find. Inserting
 * after the last one moved data-level down a line on exactly those 19 cards.
 */
const TAIL_ATTRS = ['data-overlaps'];

const attrRe = (names) => new RegExp(`\\s+(?:${names.map((n) => n.replace('data-', '')).join('|')})`);

/** Strip the named `data-` attributes wherever they sit, leaving layout alone. */
function stripAttrs(tag, names) {
  const alt = names.map((n) => n.replace(/^data-/, '')).join('|');
  return tag
    .replace(new RegExp(`^[ \\t]*data-(?:${alt})="[^"]*"\\r?\\n`, 'gm'), '')
    .replace(new RegExp(`\\s*data-(?:${alt})="[^"]*"`, 'g'), '');
}

/**
 * The offset just past `href` AND any date attributes already sitting on its
 * line. Derived attributes are inserted here, which is what stops
 * catalog-evidence from pushing the dates onto a line of their own.
 */
function hrefLineEnd(tag) {
  const href = /\shref="[^"]*"/.exec(tag);
  if (!href) return -1;
  let at = href.index + href[0].length;
  for (;;) {
    const rest = tag.slice(at);
    const next = new RegExp(`^[ \\t]+data-(?:${DATE_ATTRS.map((n) => n.slice(5)).join('|')})="[^"]*"`).exec(rest);
    if (!next) return at;
    at += next[0].length;
  }
}

/**
 * Put `values` on the href line, in canonical order, replacing any existing
 * copies wherever they were. `values` maps attribute name to string, and a
 * null/undefined value removes that attribute.
 */
function setHrefLineAttrs(tag, values) {
  const names = DATE_ATTRS.filter((n) => Object.prototype.hasOwnProperty.call(values, n));
  const stripped = stripAttrs(tag, names);
  const insert = DATE_ATTRS
    .filter((n) => values[n] !== null && values[n] !== undefined && values[n] !== '')
    .map((n) => ` ${n}="${values[n]}"`)
    .join('');
  const href = /\shref="[^"]*"/.exec(stripped);
  /* No href means card-reader already reported CARD-HREFLESS and the caller
     exits non-zero; change nothing silently rather than guess at a position. */
  if (!href) return stripped;
  const at = href.index + href[0].length;
  return stripped.slice(0, at) + insert + stripped.slice(at);
}

/**
 * Put `names` on their own line AFTER the last own-line `data-` attribute, which
 * is where `main` carries `data-level`. Falls back to the href line's end when a
 * card has no own-line attributes yet, so a newly carded lab converges on the
 * same shape instead of accumulating a second one.
 */
function setOwnLineAttrs(tag, values) {
  const names = LEVEL_ATTRS.filter((n) => Object.prototype.hasOwnProperty.call(values, n));
  const stripped = stripAttrs(tag, names);
  const parts = LEVEL_ATTRS
    .filter((n) => values[n] !== null && values[n] !== undefined && values[n] !== '')
    .map((n) => `${n}="${values[n]}"`);
  if (!parts.length) return stripped;
  const ownLine = [...stripped.matchAll(/^[ \t]*(data-[a-z-]+)="[^"]*"[ \t]*$/gm)]
    .filter((m) => !TAIL_ATTRS.includes(m[1]));
  if (ownLine.length) {
    const last = ownLine[ownLine.length - 1];
    const at = last.index + last[0].length;
    const indent = /^[ \t]*/.exec(last[0])[0];
    return `${stripped.slice(0, at)}\n${indent}${parts.join(`\n${indent}`)}${stripped.slice(at)}`;
  }
  const at = hrefLineEnd(stripped);
  if (at === -1) return stripped;
  /* A card with no own-line attributes yet -- a freshly hand-authored one. Break
     the line AFTER the insert as well, or whatever followed href (target, rel,
     style, a review note) ends up sharing the line and the attribute is not on
     its own line at all. Same conditional separator catalog-evidence uses, so a
     new card converges on the canonical shape instead of growing a second one. */
  const tail = stripped.slice(at);
  const sep = /^\r?\n/.test(tail) ? '' : '\n           ';
  return `${stripped.slice(0, at)}\n            ${parts.join('\n            ')}${sep}${tail}`;
}

module.exports = { DATE_ATTRS, LEVEL_ATTRS, TAIL_ATTRS, stripAttrs, hrefLineEnd, setHrefLineAttrs, setOwnLineAttrs };
