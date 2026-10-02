(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CryptoLabSearch = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FIELD_ALIASES = {
    primitive: 'implements', primitives: 'implements',
    algorithm: 'implements', algorithms: 'implements',
    implements: 'implements',
    attack: 'attacks', attacks: 'attacks',
    standard: 'standards', standards: 'standards',
    ref: 'references', reference: 'references', references: 'references',
    impl: 'implementation', implementation: 'implementation',
    section: 'section', category: 'categories',
    title: 'title', description: 'copy'
  };

  var WEIGHTS = {
    title: 100, implements: 72, attacks: 68, chips: 62,
    standards: 58, categories: 54, kicker: 48,
    implementation: 44, copy: 40, references: 32, section: 28
  };

  var ALIASES = {
    'kyber': ['ml kem', 'crystals kyber'],
    'ml kem': ['kyber', 'crystals kyber'],
    'dilithium': ['ml dsa', 'crystals dilithium'],
    'ml dsa': ['dilithium', 'crystals dilithium'],
    'sphincs': ['slh dsa', 'sphincs+'],
    'sphincs+': ['slh dsa', 'sphincs'],
    'slh dsa': ['sphincs', 'sphincs+'],
    'pqc': ['post quantum'],
    'post quantum': ['pqc'],
    'zk': ['zero knowledge'],
    'zkp': ['zero knowledge proof', 'zero knowledge'],
    'mitm': ['man in the middle'],
    'dh': ['diffie hellman'],
    'ecc': ['elliptic curve'],
    'fhe': ['fully homomorphic encryption', 'homomorphic'],
    'hndl': ['harvest now decrypt later'],
    'rng': ['random number generator', 'drbg', 'randomness'],
    'drbg': ['deterministic random bit generator', 'rng']
  };

  function normalize(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u2010-\u2015\u2212_\/\\-]+/g, ' ')
      .replace(/[^a-z0-9+.#]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function variants(term) {
    var n = normalize(term);
    if (!n) return [];
    var set = new Set([n]);
    function add(list) {
      (list || []).forEach(function (v) {
        v = normalize(v);
        if (v) set.add(v);
      });
    }
    add(ALIASES[n]);
    Object.keys(ALIASES).forEach(function (key) {
      var vals = ALIASES[key].map(normalize);
      if (vals.indexOf(n) !== -1) {
        set.add(normalize(key));
        add(ALIASES[key]);
      }
    });
    return Array.from(set);
  }

  function parse(query) {
    var out = [];
    var re = /([A-Za-z]+):(?:"([^"]+)"|([^\s]+))|"([^"]+)"|([^\s]+)/g;
    var m;
    while ((m = re.exec(String(query || ''))) !== null) {
      var fieldName = m[1] ? normalize(m[1]).replace(/\s+/g, '') : '';
      var value = m[2] || m[3] || m[4] || m[5] || '';
      var field = fieldName ? FIELD_ALIASES[fieldName] : null;
      if (fieldName && !field) value = fieldName + ' ' + value;
      var term = normalize(value);
      if (term) out.push({ field: field || null, term: term });
    }
    return out;
  }

  function prepare(fields) {
    var out = {};
    Object.keys(WEIGHTS).forEach(function (key) {
      var value = fields && fields[key];
      if (Array.isArray(value)) value = value.join(' ');
      out[key] = normalize(value || '');
    });
    return out;
  }

  function fieldScore(haystack, term, weight) {
    if (!haystack) return -1;
    var best = -1;
    variants(term).forEach(function (v) {
      if (!v || haystack.indexOf(v) === -1) return;
      var bonus = haystack === v ? 30
        : haystack.indexOf(v + ' ') === 0 ? 16
        : (' ' + haystack + ' ').indexOf(' ' + v + ' ') !== -1 ? 10
        : 0;
      best = Math.max(best, weight + bonus);
    });
    return best;
  }

  function score(prepared, parsedOrQuery) {
    var clauses = Array.isArray(parsedOrQuery) ? parsedOrQuery : parse(parsedOrQuery);
    if (!clauses.length) return 0;
    var total = 0;
    for (var i = 0; i < clauses.length; i++) {
      var clause = clauses[i];
      var best = -1;
      if (clause.field) {
        best = fieldScore(prepared[clause.field] || '', clause.term, WEIGHTS[clause.field] || 20);
      } else {
        Object.keys(WEIGHTS).forEach(function (field) {
          best = Math.max(best, fieldScore(prepared[field] || '', clause.term, WEIGHTS[field]));
        });
      }
      if (best < 0) return -1;
      total += best;
    }
    return total;
  }

  function rank(items, query) {
    var parsed = parse(query);
    return (items || []).map(function (item) {
      return { item: item, score: score(item.search || item, parsed) };
    }).filter(function (x) {
      return x.score >= 0;
    }).sort(function (a, b) {
      if (a.score !== b.score) return b.score - a.score;
      return normalize((a.item && a.item.title) || '').localeCompare(normalize((b.item && b.item.title) || ''));
    });
  }

  return { normalize: normalize, parse: parse, prepare: prepare, score: score, rank: rank };
});
