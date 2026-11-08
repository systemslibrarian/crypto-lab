/*
 * teaching-extract.js — pull the learner-facing CONTENT out of one page, as an
 * ordered list of blocks, each carrying the file and line it came from.
 *
 * Not runnable. Required by scripts/build-teaching-export.js.
 *
 * Reads: nothing on its own; callers pass file text they have already read
 *   (through clone-source.js, for a lab).
 *
 * WHAT IT DOES AND DOES NOT CLAIM
 *
 * Every `text` it returns is VERBATIM from the source, with tags removed and
 * entities decoded, and every block records `loc` so a reader can open the line.
 * Nothing here paraphrases.
 *
 * It does NOT execute anything. A control is reported as a control -- its kind,
 * its id, its visible label -- and an output region as a region, with whatever
 * STATIC placeholder the markup ships. What a lab prints when you press the
 * button is a runtime value this tool never sees, and it is recorded as not
 * captured rather than guessed. That distinction is the whole point: an export
 * that invented plausible outputs would be worse than one that admits the gap.
 *
 * Two limitations are structural and are reported per page rather than hidden:
 *
 *   1. It is a SCANNER, not a browser. These pages are generated or
 *      hand-authored, not adversarial, and the scanner tracks tags rather than
 *      matching them with one regex -- but a page it cannot segment is marked
 *      `partial` with the reason, never silently truncated.
 *   2. About half the fleet BUILDS its page in template literals under src/,
 *      so the served .html file is a shell. Content found in a source template
 *      is extracted and labelled with that file and line, because that is where
 *      the learner-facing words actually live.
 */

'use strict';

/*
 * Tag stripping, repeated until stable.
 *
 * CodeQL flags `replace(/<[^>]*>/g, '')` as js/incomplete-multi-character-sanitization,
 * on the general ground that removing a multi-character pattern once can expose
 * another. I TRIED AND FAILED TO CONSTRUCT AN INPUT WHERE IT MATTERS HERE:
 * `<<p>script<>`, `<a<b>c<>` and `<<>x>` give the same answer one pass or many,
 * because the `/g` scan already continues past each match. So the alert is
 * pattern-shaped rather than a demonstrated defect in this function, and that is
 * recorded here rather than dressed up as a bug I found.
 *
 * The loop is kept anyway, for two honest reasons: it makes idempotence a
 * property of the code rather than of an argument about a regex, and it costs one
 * extra scan of a string this extractor has already read from disk. It is not a
 * sanitizer either way -- nothing it returns is rendered -- but a function that
 * hands back a tag inside its "text" is wrong on its own terms.
 */
function stripTags(s) {
  let out = String(s);
  for (let prev = null; out !== prev;) { prev = out; out = out.replace(/<[^>]*>/g, ''); }
  return out;
}

/** Entity-decode and collapse whitespace. `&amp;` LAST, or `&amp;lt;` becomes a tag. */
function text(raw) {
  return stripTags(raw)
    .replace(/&nbsp;/g, ' ')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&rarr;/g, '→').replace(/&larr;/g, '←')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…').replace(/&middot;/g, '·')
    .replace(/&times;/g, '×').replace(/&oplus;/g, '⊕')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const lineOf = (src, index) => src.slice(0, index).split('\n').length;
const attr = (tag, name) => {
  const m = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`).exec(tag) || new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`).exec(tag);
  return m ? m[1] : null;
};

/*
 * Classes a lab uses to mark a CAVEAT, separated from classes it uses for any
 * aside. The first list included `note` and `callout`, and that labelled
 * crypto-lab-nonce-collision's "No theory required to start. Go to The XOR
 * reveal..." as a stated limitation -- friendly onboarding prose filed under
 * warnings. An export whose warning list is padded with encouragement is worse
 * than one with fewer warnings, because the reader cannot trust the category.
 * `note` and `callout` now become `aside`, which is what they are.
 */
const WARNING_CLASS = /(production-warning|sim-warning|honesty|limitation|not-production|caveat|disclaimer|scope-note|warning)/i;
const ASIDE_CLASS = /(note|callout|primer|aside|tip)/i;

/** Blocks of learner-facing content, in document order. */
function blocks(src, file) {
  const out = [];
  const push = (b) => { out.push({ ...b, file }); };
  const seen = new Set();

  const paired = (tagName, handler) => {
    const re = new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}\\s*>`, 'gi');
    let m;
    while ((m = re.exec(src)) !== null) handler(m, m[1] || '', m[2] || '');
  };

  /* Headings: the page's own structure, verbatim. */
  for (let level = 1; level <= 6; level += 1) {
    paired(`h${level}`, (m, a, body) => {
      const t = text(body);
      if (t) push({ kind: 'heading', level, text: t, loc: lineOf(src, m.index), id: attr(a, 'id') });
    });
  }

  /* Figures and diagrams: the label and caption are content; the picture is not
     something a text export can carry, and saying so is part of the record. */
  paired('figcaption', (m, a, body) => {
    const t = text(body);
    if (t) push({ kind: 'figure-caption', text: t, loc: lineOf(src, m.index) });
  });
  /* `<title>` is the PAGE title in a head and a DIAGRAM title inside an svg, and
     conflating them reported a Vite shell's `<title>` as a diagram and left two
     labs looking like they had one block of teaching content. Which one it is
     depends on whether an unclosed `<svg` precedes it. */
  paired('title', (m, a, body) => {
    const t = text(body);
    if (!t) return;
    const before = src.slice(0, m.index);
    const inSvg = (before.match(/<svg\b/gi) || []).length > (before.match(/<\/svg\s*>/gi) || []).length;
    const kind = inSvg ? 'diagram-title' : 'page-title';
    if (seen.has(kind + t)) return;
    seen.add(kind + t);
    push({ kind, text: t, loc: lineOf(src, m.index) });
  });
  paired('desc', (m, a, body) => {
    const t = text(body);
    if (t && !seen.has('d' + t)) { seen.add('d' + t); push({ kind: 'diagram-description', text: t, loc: lineOf(src, m.index) }); }
  });
  /* SVG text nodes are diagram LABELS -- the words drawn inside the picture. */
  paired('text', (m, a, body) => {
    const t = text(body);
    if (t) push({ kind: 'diagram-label', text: t, loc: lineOf(src, m.index) });
  });
  let im;
  const imgRe = /<img\b([^>]*)>/gi;
  while ((im = imgRe.exec(src)) !== null) {
    const alt = attr(im[1], 'alt');
    if (alt) push({ kind: 'image-alt', text: text(alt), loc: lineOf(src, im.index), src: attr(im[1], 'src') });
  }

  /* Prose. A paragraph carrying a caveat class is a WARNING, kept apart because
     "what this does not prove" is the sentence a reader most needs flagged. */
  for (const tagName of ['p', 'blockquote', 'aside']) {
    paired(tagName, (m, a, body) => {
      const t = text(body);
      if (!t) return;
      const cls = attr(a, 'class') || '';
      const warn = WARNING_CLASS.exec(cls);
      const aside = ASIDE_CLASS.exec(cls);
      if (warn) push({ kind: 'warning', variant: warn[1].toLowerCase(), text: t, loc: lineOf(src, m.index) });
      else if (aside) push({ kind: 'aside', variant: aside[1].toLowerCase(), text: t, loc: lineOf(src, m.index) });
      else push({ kind: 'paragraph', text: t, loc: lineOf(src, m.index) });
    });
  }

  /* Progressive disclosure: the summary is the question a learner clicks. */
  paired('summary', (m, a, body) => {
    const t = text(body);
    if (t) push({ kind: 'disclosure-summary', text: t, loc: lineOf(src, m.index) });
  });

  /* Definition lists carry the glossaries these labs teach from. */
  paired('dt', (m, a, body) => {
    const t = text(body);
    if (t) push({ kind: 'term', text: t, loc: lineOf(src, m.index) });
  });
  paired('dd', (m, a, body) => {
    const t = text(body);
    if (t) push({ kind: 'definition', text: t, loc: lineOf(src, m.index) });
  });

  /* Lists: steps and claims. */
  for (const [tagName, ordered] of [['ol', true], ['ul', false]]) {
    paired(tagName, (m, a, body) => {
      const items = [];
      const li = /<li\b[^>]*>([\s\S]*?)<\/li\s*>/gi;
      let l;
      while ((l = li.exec(body)) !== null) { const t = text(l[1]); if (t) items.push(t); }
      if (items.length) push({ kind: 'list', ordered, items, loc: lineOf(src, m.index) });
    });
  }

  /* Tables, reconstructed into markdown. Marked as a reconstruction in the
     output: the CELLS are verbatim, the pipes are ours. */
  paired('table', (m, a, body) => {
    const rows = [];
    const tr = /<tr\b[^>]*>([\s\S]*?)<\/tr\s*>/gi;
    let r;
    while ((r = tr.exec(body)) !== null) {
      const cells = [];
      const cell = /<(th|td)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;
      let c;
      while ((c = cell.exec(r[1])) !== null) cells.push(text(c[2]));
      if (cells.length) rows.push(cells);
    }
    const cap = /<caption\b[^>]*>([\s\S]*?)<\/caption\s*>/i.exec(body);
    if (rows.length) {
      push({
        kind: 'table', rows, loc: lineOf(src, m.index),
        caption: cap ? text(cap[1]) : null,
        label: attr(a, 'aria-label'),
      });
    }
  });

  /* Equations and inline formulae. `<code>` and the fleet's mono classes carry
     them; MathML and KaTeX are captured when a lab uses them. */
  paired('code', (m, a, body) => {
    const t = text(body);
    if (t) push({ kind: 'code-or-equation', text: t, loc: lineOf(src, m.index) });
  });
  paired('math', (m, a, body) => {
    const t = text(body);
    if (t) push({ kind: 'equation', notation: 'MathML', text: t, loc: lineOf(src, m.index) });
  });
  paired('pre', (m, a, body) => {
    const t = stripTags(body);
    if (t.trim()) push({ kind: 'preformatted', text: t.replace(/\s+$/, ''), loc: lineOf(src, m.index) });
  });

  /* References: a link's text plus where it goes. */
  paired('a', (m, a, body) => {
    const href = attr(a, 'href');
    const t = text(body);
    if (href && t && /^(https?:|\/|\.)/.test(href)) {
      push({ kind: 'reference', text: t, href, loc: lineOf(src, m.index) });
    }
  });

  /* INTERACTIVE CONTROLS. Described, never exercised. */
  paired('button', (m, a, body) => {
    push({
      kind: 'control', control: 'button', loc: lineOf(src, m.index),
      label: text(body) || attr(a, 'aria-label') || null,
      id: attr(a, 'id'), disabled: /\bdisabled\b/.test(a),
    });
  });
  let ctl;
  const inputRe = /<input\b([^>]*)>/gi;
  while ((ctl = inputRe.exec(src)) !== null) {
    const a = ctl[1];
    push({
      kind: 'control', control: attr(a, 'type') || 'text', loc: lineOf(src, ctl.index),
      id: attr(a, 'id'), label: attr(a, 'aria-label'),
      min: attr(a, 'min'), max: attr(a, 'max'), step: attr(a, 'step'),
      value: attr(a, 'value'), maxlength: attr(a, 'maxlength'),
    });
  }
  paired('select', (m, a, body) => {
    const opts = [];
    const op = /<option\b[^>]*>([\s\S]*?)<\/option\s*>/gi;
    let o;
    while ((o = op.exec(body)) !== null) { const t = text(o[1]); if (t) opts.push(t); }
    push({ kind: 'control', control: 'select', id: attr(a, 'id'), label: attr(a, 'aria-label'), options: opts, loc: lineOf(src, m.index) });
  });
  paired('label', (m, a, body) => {
    const t = text(body);
    if (t) push({ kind: 'control-label', text: t, forId: attr(a, 'for'), loc: lineOf(src, m.index) });
  });

  /* OBSERVABLE OUTPUT REGIONS. The region is recorded; the runtime value is not,
     because nothing here runs the page. Any static placeholder the markup ships
     IS content and is kept verbatim. */
  const liveRe = /<(\w+)\b([^>]*(?:role\s*=\s*"status"|aria-live\s*=\s*"[^"]*")[^>]*)>([\s\S]*?)<\/\1\s*>/gi;
  let lv;
  while ((lv = liveRe.exec(src)) !== null) {
    push({
      kind: 'output-region', loc: lineOf(src, lv.index),
      id: attr(lv[2], 'id'), role: attr(lv[2], 'role'), live: attr(lv[2], 'aria-live'),
      placeholder: text(lv[3]) || null,
    });
  }

  return out.sort((a, b) => a.loc - b.loc || a.kind.localeCompare(b.kind));
}

/* Template literals in a source file, which is where about half the fleet keeps
   its page. Returned with the line each one starts on, so extracted content
   still points at a real location. */
function templates(src) {
  const out = [];
  const re = /`([\s\S]*?)`/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const body = m[1];
    if (!/<\/?(h[1-6]|p|section|div|table|button|ul|ol|dl|details|input|select|figcaption)\b/i.test(body)) continue;
    out.push({ body, startLine: lineOf(src, m.index) });
  }
  return out;
}

/*
 * A FOURTH shape: pages built by calling a DOM helper, not by writing markup.
 *
 * 31 labs came back with zero headings and four to fourteen blocks -- kem-trap,
 * pake-gate, vdf, frozen-heart and the rest -- because they construct every
 * element as `el('h2', { class: 'x' }, ['Text'])` or `h('p', { text: 'Text' })`.
 * There is no markup for a tag scanner to find and no template literal either,
 * so the first three readers each saw a shell. This one parses the CALL: the tag
 * name is the first argument, the attributes are the balanced object after it,
 * and the text is either a `text:` property or the first string of the children.
 *
 * The builder is not always named `el` -- crypto-lab-sector-vault calls it `h` --
 * so any identifier is accepted and the TAG NAME is what gates a match. That is
 * safe because the tag list is closed and short.
 */
const BUILDER_TAGS = {
  h1: 'heading', h2: 'heading', h3: 'heading', h4: 'heading', h5: 'heading', h6: 'heading',
  p: 'paragraph', li: 'list-item', dt: 'term', dd: 'definition',
  button: 'control', summary: 'disclosure-summary', figcaption: 'figure-caption',
  caption: 'figure-caption', code: 'code-or-equation', th: 'table-cell', td: 'table-cell',
  label: 'control-label', option: 'control-option', pre: 'preformatted',
};

/** The balanced `{...}` starting at `open`, or null. */
function balancedObject(src, open) {
  let depth = 0;
  for (let i = open; i < src.length && i < open + 20000; i += 1) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}') { depth -= 1; if (depth === 0) return src.slice(open, i + 1); }
  }
  return null;
}

function blocksFromBuilders(src, file) {
  const out = [];
  const re = /\b[A-Za-z_$][\w$]*\(\s*['"`]([a-zA-Z][a-zA-Z0-9]{0,11})['"`]\s*(,|\))/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const tag = m[1].toLowerCase();
    const kind = BUILDER_TAGS[tag];
    if (!kind) continue;
    const loc = lineOf(src, m.index);
    let rest = src.slice(m.index + m[0].length - 1);
    let attrs = '';
    const objAt = /^\s*,?\s*\{/.exec(rest);
    if (objAt) {
      const obj = balancedObject(rest, rest.indexOf('{', objAt.index));
      if (obj) { attrs = obj; rest = rest.slice(rest.indexOf(obj) + obj.length); }
    }
    let value = null;
    const inAttrs = /\btext\s*:\s*['"`]([\s\S]*?)['"`]/.exec(attrs);
    if (inAttrs) value = inAttrs[1];
    if (value === null) {
      const arr = /^\s*,\s*\[\s*['"`]([\s\S]*?)['"`]/.exec(rest);
      if (arr) value = arr[1];
    }
    if (value === null) {
      const bare = /^\s*,\s*['"`]([\s\S]*?)['"`]/.exec(rest);
      if (bare) value = bare[1];
    }
    const t = value === null ? '' : text(value);
    const cls = /\bclass(?:Name)?\s*:\s*['"`]([^'"`]*)['"`]/.exec(attrs);
    const id = /\bid\s*:\s*['"`]([^'"`]*)['"`]/.exec(attrs);

    if (kind === 'control') {
      out.push({ kind: 'control', control: 'button', label: t || null, id: id ? id[1] : null, loc, file, fromTemplate: true, markup: 'DOM builder' });
      continue;
    }
    if (!t) continue;
    const warn = cls && WARNING_CLASS.exec(cls[1]);
    if (kind === 'paragraph' && warn) {
      out.push({ kind: 'warning', variant: warn[1].toLowerCase(), text: t, loc, file, fromTemplate: true, markup: 'DOM builder' });
      continue;
    }
    const block = { kind, text: t, loc, file, fromTemplate: true, markup: 'DOM builder' };
    if (kind === 'heading') block.level = Number(tag[1]);
    out.push(block);
  }
  return out;
}

/**
 * Blocks from a source file's page-building markup.
 *
 * THREE SHAPES, and the third was found the way the others were -- by a lab
 * reporting one block of content. Most labs build pages in template literals;
 * `crypto-lab-lattice-builder` and `crypto-lab-point-ledger` use React, where the
 * markup is JSX sitting in the code rather than inside backticks, so a
 * template-literal reader saw nothing and the Vite shell's `<title>` was all that
 * was left. JSX is scanned directly, since the tags are literal text in the file.
 */
function blocksFromSource(src, file) {
  /* RAW-TEXT scanning, not template-literal scanning.
   *
   * Markup inside a source file is literal text wherever it sits, so scanning the
   * file itself subsumes every quoting style at once: backtick templates, JSX, and
   * the `innerHTML = '<p>…</p>'` single-quoted strings that crypto-lab-prime-witness,
   * log-forge, residue-gate and hybrid-wire use. Reading only backticks found four
   * labs' pages empty while 19 innerHTML assignments sat in main.ts. Line numbers
   * come out right for free, where the template reader had to offset them.
   *
   * The builder reader runs as well and the two are merged, because a lab may write
   * some markup and build the rest; running only whichever matched first drops
   * content. Duplicates are removed on kind, text and line. */
  const out = [];
  const markup = /\.(tsx|jsx)$/.test(file) ? 'JSX' : 'markup in source';
  for (const b of blocks(src, file)) out.push({ ...b, fromTemplate: true, markup });
  out.push(...blocksFromBuilders(src, file));
  const seen = new Set();
  return out.filter((b) => {
    const key = `${b.kind}|${b.loc}|${b.text || b.label || b.id || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => a.loc - b.loc || a.kind.localeCompare(b.kind));
}

module.exports = { text, stripTags, blocks, blocksFromSource, blocksFromBuilders, templates, WARNING_CLASS, ASIDE_CLASS, BUILDER_TAGS };
