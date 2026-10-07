const ALIASES = {
  Kyber: "ML-KEM",
  Dilithium: "ML-DSA",
  "SPHINCS+": "SLH-DSA",
  Falcon: "FN-DSA",
  Ed25519: "EdDSA",
  Ed448: "EdDSA",
};

const ROLE_LINE = {
  Intro: "builds the idea",
  "Break it": "has students cause the failure",
  Fix: "shows the construction that holds",
  Extension: "is optional depth",
};

const LENSES = [
  ["path", "Paths"],
  ["concept", "Concepts"],
  ["module", "Modules"],
  ["section", "Sections"],
  ["depth", "Depth"],
];

const state = {
  lens: "path",
  scope: "start-here",
  selectedId: "",
  query: "",
  openLists: new Set(),
};

let catalog;
const byTitle = new Map();
const byId = new Map();

const $ = (id) => document.getElementById(id);

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', '&quot;');
}

function exhibitByTitle(title) {
  return byTitle.get(title);
}

function sectionLabel(id) {
  return catalog.sections.find((section) => section.id === id)?.label ?? id;
}

function pathHits(title) {
  const hits = [];
  for (const path of catalog.paths) {
    const index = path.steps.indexOf(title);
    const side = path.sideTrip?.title === title;
    if (index < 0 && !side) continue;
    hits.push({
      path,
      index,
      prev: index > 0 ? path.steps[index - 1] : null,
      next: index >= 0 && index < path.steps.length - 1 ? path.steps[index + 1] : null,
      side,
    });
  }
  return hits;
}

function moduleHits(title) {
  const hits = [];
  for (const course of catalog.modules) {
    const index = course.exhibits.findIndex((item) => item.title === title);
    if (index < 0) continue;
    const item = course.exhibits[index];
    hits.push({
      moduleId: course.id,
      moduleLabel: course.label,
      role: item.role,
      minutes: item.minutes,
      index,
      total: course.exhibits.length,
      next: index < course.exhibits.length - 1 ? course.exhibits[index + 1].title : null,
    });
  }
  return hits;
}

function conceptsFor(title) {
  return catalog.concepts.filter((concept) => concept.exhibits.includes(title));
}

function runsAttack(exhibit) {
  return exhibit.section === "cryptanalysis" || exhibit.categories[0] === "ATTACKS";
}

function aliasLines(exhibit) {
  const names = new Set(exhibit.implements);
  return Object.entries(ALIASES)
    .filter(([draft]) => names.has(draft))
    .map(([draft, standard]) => `${draft} is filed as an alias of ${standard} in the catalog vocabulary.`);
}

function focusOf(title) {
  const start = catalog.paths.find(
    (path) => path.id === "start-here" && (path.steps.includes(title) || path.sideTrip?.title === title),
  );
  if (start) return { lens: "path", scope: start.id };
  const anyPath = catalog.paths.find(
    (path) => path.steps.includes(title) || path.sideTrip?.title === title,
  );
  if (anyPath) return { lens: "path", scope: anyPath.id };
  const course = catalog.modules.find((item) => item.exhibits.some((exhibit) => exhibit.title === title));
  if (course) return { lens: "module", scope: course.id };
  const concept = conceptsFor(title)[0];
  if (concept) return { lens: "concept", scope: concept.id };
  const exhibit = exhibitByTitle(title);
  return { lens: "section", scope: exhibit?.section ?? "foundations" };
}

function depthModel() {
  const pathTitles = new Set(
    catalog.paths.flatMap((path) => [...path.steps, ...(path.sideTrip ? [path.sideTrip.title] : [])]),
  );
  const moduleTitles = new Set(catalog.modules.flatMap((course) => course.exhibits.map((item) => item.title)));
  const covered = catalog.concepts
    .filter((concept) => concept.status === "COVERED")
    .slice()
    .sort((a, b) => a.exhibits.length - b.exhibits.length || a.number.localeCompare(b.number));
  return {
    exhibits: catalog.exhibits.length,
    deep: catalog.concepts.filter((concept) => concept.status === "DEEP").length,
    coveredCount: catalog.concepts.filter((concept) => concept.status === "COVERED").length,
    onPath: catalog.exhibits.filter((exhibit) => pathTitles.has(exhibit.title)).length,
    onModule: catalog.exhibits.filter((exhibit) => moduleTitles.has(exhibit.title)).length,
    neither: catalog.exhibits.filter(
      (exhibit) => !pathTitles.has(exhibit.title) && !moduleTitles.has(exhibit.title),
    ),
    covered,
  };
}

function spineItem(title, opts = {}) {
  const exhibit = exhibitByTitle(title);
  if (!exhibit) return "";
  const selected = exhibit.id === state.selectedId;
  const badge = opts.badge
    ? `<span class="badge${opts.clay ? " clay" : ""}">${esc(opts.badge)}</span>`
    : "";
  const index = opts.index ? `<span class="meta">${opts.index}</span> ` : "";
  const note = opts.note ? ` · ${esc(opts.note)}` : "";
  return `<li>
    <button type="button" class="row" data-id="${esc(exhibit.id)}" aria-current="${selected ? "true" : "false"}">
      <span class="line"><span class="title">${index}${esc(exhibit.title)}</span>${badge}</span>
      <span class="meta">${esc(exhibit.kicker)}${note} · ${esc(exhibit.level)}</span>
    </button>
  </li>`;
}

function conceptsByTitle() {
  return catalog.concepts
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
}

function renderScope() {
  const host = $("scope");
  if (state.lens === "depth") {
    host.innerHTML = "";
    return;
  }
  if (state.lens === "path") {
    host.innerHTML = `<div class="scopes" role="group" aria-label="Learning path">${catalog.paths
      .map(
        (path) =>
          `<button type="button" data-scope="${esc(path.id)}" aria-pressed="${path.id === state.scope}">${esc(path.label)}</button>`,
      )
      .join("")}</div>`;
    return;
  }
  if (state.lens === "module") {
    host.innerHTML = `<div class="scopes" role="group" aria-label="Course module">${catalog.modules
      .map(
        (course) =>
          `<button type="button" data-scope="${esc(course.id)}" aria-pressed="${course.id === state.scope}">${esc(course.label)}</button>`,
      )
      .join("")}</div>`;
    return;
  }
  if (state.lens === "section") {
    host.innerHTML = `<div class="scopes" role="group" aria-label="Catalog section">${catalog.sections
      .map(
        (section) =>
          `<button type="button" data-scope="${esc(section.id)}" aria-pressed="${section.id === state.scope}">${esc(section.label)}</button>`,
      )
      .join("")}</div>`;
    return;
  }
  const ordered = conceptsByTitle();
  host.innerHTML = `<label class="stack"><span class="kicker">Concept</span>
    <select id="concept-pick">${ordered
      .map(
        (concept) =>
          `<option value="${esc(concept.id)}"${concept.id === state.scope ? " selected" : ""}>${esc(concept.title)} · §${esc(concept.number)} · ${esc(concept.status.toLowerCase())} · ${concept.exhibits.length}</option>`,
      )
      .join("")}</select></label>`;
}

function renderSpine() {
  const host = $("spine");
  if (state.lens === "path") {
    const path = catalog.paths.find((item) => item.id === state.scope) ?? catalog.paths[0];
    host.innerHTML = `<p class="note">${esc(path.blurb)}</p>
      <p class="kicker focus">${esc(path.focus)}</p>
      <ol class="spine">${path.steps.map((title, index) => spineItem(title, { index: index + 1 })).join("")}</ol>
      ${
        path.sideTrip
          ? `<div class="side"><p class="kicker">Off the numbered line</p><p class="note">${esc(path.sideTrip.why)}</p><ul class="spine">${spineItem(path.sideTrip.title)}</ul></div>`
          : ""
      }`;
    return;
  }
  if (state.lens === "concept") {
    const concept = conceptsByTitle().find((item) => item.id === state.scope) ?? conceptsByTitle()[0];
    const depth =
      concept.status === "COVERED"
        ? " Covered means filed, not that the arc is taught in depth."
        : " Deep means the checklist treats this as a taught arc.";
    host.innerHTML = `<div class="card">
        <p class="kicker">${esc(concept.group)} · ${esc(concept.status.toLowerCase())}</p>
        <h2>§${esc(concept.number)} ${esc(concept.title)}</h2>
        <p class="note">${concept.exhibits.length} exhibits filed here. Membership is the checklist’s filing line, not a guess from shared chips.${depth}</p>
      </div>
      <ol class="spine concept">${concept.exhibits.map((title) => spineItem(title)).join("")}</ol>`;
    return;
  }
  if (state.lens === "module") {
    const course = catalog.modules.find((item) => item.id === state.scope) ?? catalog.modules[0];
    host.innerHTML = `<p class="note">Course sequence with the role the worksheet gives each exhibit. Order is the module’s order.</p>
      <ol class="spine">${course.exhibits
        .map((item, index) =>
          spineItem(item.title, {
            index: index + 1,
            badge: item.role,
            note: item.minutes,
            clay: item.role === "Break it",
          }),
        )
        .join("")}</ol>`;
    return;
  }
  if (state.lens === "section") {
    const items = catalog.exhibits.filter((exhibit) => exhibit.section === state.scope);
    const levels = ["beginner", "intermediate", "advanced"];
    host.innerHTML = `<p class="note">${esc(sectionLabel(state.scope))} has ${items.length} exhibits. Drawn as one network, that is a hairball. The cut below is the catalog’s own level, not a new edge.</p>
      ${levels
        .map((level) => {
          const group = items.filter((exhibit) => exhibit.level === level);
          if (!group.length) return "";
          return `<div class="stack"><h2 class="kicker">${esc(level)} · ${group.length}</h2><ul class="stack" style="list-style:none;margin:0;padding:0">${group
            .map((exhibit) => spineItem(exhibit.title))
            .join("")}</ul></div>`;
        })
        .join("")}`;
    return;
  }
  const model = depthModel();
  host.innerHTML = `<p class="note">The concept checklist is complete against its forty boundaries: ${model.deep} deep, ${model.coveredCount} covered. A link does not add a lesson. ${model.neither.length} exhibits are on no learning path and in no course module — a concept filing is their only authored neighbor.</p>
    <div><h2 class="kicker">Covered, thinnest filing first</h2>
      <ul class="stack" style="list-style:none;margin:0.5rem 0 0;padding:0">${model.covered
        .map(
          (concept) =>
            `<li><button type="button" class="thin" data-title="${esc(concept.exhibits[0])}"><span>§${esc(concept.number)} ${esc(concept.title)}</span><span class="meta">${concept.exhibits.length}</span></button></li>`,
        )
        .join("")}</ul></div>
    <div><h2 class="kicker">No path and no module</h2>
      <ul class="stack" style="list-style:none;margin:0.5rem 0 0;padding:0">${model.neither
        .slice(0, 24)
        .map(
          (exhibit) =>
            `<li><button type="button" class="thin" data-title="${esc(exhibit.title)}" style="flex-direction:column;align-items:flex-start"><span>${esc(exhibit.title)}</span><span class="meta">${esc(sectionLabel(exhibit.section))} · ${esc(exhibit.level)}</span></button></li>`,
        )
        .join("")}</ul>
      ${model.neither.length > 24 ? `<p class="note">Showing 24 of ${model.neither.length}. Search finds the rest.</p>` : ""}
    </div>`;
}

function namedList(label, items, empty, note) {
  const key = `${state.selectedId}:${label}`;
  const open = state.openLists.has(key);
  const shown = open ? items : items.slice(0, 6);
  return `<div>
    <p class="kicker" style="color:var(--fg)">${esc(label)}</p>
    ${note ? `<p class="note">${esc(note)}</p>` : ""}
    ${items.length === 0 ? `<p class="note">${esc(empty)}</p>` : `<p>${esc(shown.join(" · "))}</p>`}
    ${
      items.length > 6
        ? `<button type="button" class="more" data-list="${esc(key)}">${open ? "Show fewer" : `Show all ${items.length}`}</button>`
        : ""
    }
  </div>`;
}

function renderDetail() {
  const exhibit = byId.get(state.selectedId) ?? catalog.exhibits[0];
  const paths = pathHits(exhibit.title);
  const courses = moduleHits(exhibit.title);
  const concepts = conceptsFor(exhibit.title);
  const attackLab = runsAttack(exhibit);
  const aliases = aliasLines(exhibit);
  const nextBits = [];
  if (paths.length === 0 && courses.length === 0) {
    nextBits.push(
      `<p class="note">No learning path and no course module names a neighbor. That slot stays empty on purpose.</p>`,
    );
  }
  for (const hit of paths) {
    if (hit.side) {
      nextBits.push(`<p>Off the numbered line of ${esc(hit.path.label)}. ${esc(hit.path.sideTrip?.why ?? "")}</p>`);
    } else {
      const after = hit.prev ? ` After <button type="button" class="linkish" data-title="${esc(hit.prev)}">${esc(hit.prev)}</button>.` : "";
      const then = hit.next ? ` Then <button type="button" class="linkish" data-title="${esc(hit.next)}">${esc(hit.next)}</button>.` : "";
      const end = !hit.next ? " Nothing authored follows it on this path." : "";
      nextBits.push(
        `<p>${esc(hit.path.label)} step ${hit.index + 1} of ${hit.path.steps.length}.${after}${then}${end}</p>`,
      );
    }
  }
  for (const hit of courses) {
    const role = ROLE_LINE[hit.role] ? ` — ${esc(ROLE_LINE[hit.role])}` : "";
    const next = hit.next
      ? ` Next is <button type="button" class="linkish" data-title="${esc(hit.next)}">${esc(hit.next)}</button>.`
      : "";
    nextBits.push(
      `<p>${esc(hit.moduleLabel)}: ${esc(hit.role)}${role}. ${esc(hit.minutes)}. Exhibit ${hit.index + 1} of ${hit.total}.${next}</p>`,
    );
  }
  $("detail").innerHTML = `<article class="detail">
    <div>
      <p class="kicker">${esc(exhibit.kicker)} · ${esc(exhibit.level)} · ${esc(sectionLabel(exhibit.section))}</p>
      <h2>${esc(exhibit.title)}</h2>
      <p>${esc(exhibit.copy)}</p>
    </div>
    <a class="open" href="${esc(exhibit.href)}" target="_blank" rel="noopener noreferrer">Open the live lab</a>
    <section class="block"><h3>What comes next</h3>${nextBits.join("")}</section>
    <section class="block"><h3>Concept filing</h3>
      ${
        concepts.length
          ? `<ul class="stack" style="list-style:none;margin:0;padding:0">${concepts
              .map(
                (concept) =>
                  `<li><button type="button" class="linkish" data-concept="${esc(concept.id)}">§${esc(concept.number)} ${esc(concept.title)}</button> <span class="note">· ${esc(concept.status.toLowerCase())} · ${concept.exhibits.length} filed</span></li>`,
              )
              .join("")}</ul>`
          : `<p class="note">Not on a concept filing line.</p>`
      }
    </section>
    <section class="block"><h3>Index, not a lesson</h3>
      ${namedList("Implements", exhibit.implements, "No algorithm term matched this card.")}
      ${aliases.map((line) => `<p class="note">${esc(line)}</p>`).join("")}
      ${namedList(
        attackLab ? "Attack lab — index terms" : "Attack mentions",
        exhibit.attacks,
        "No attack term in the card index.",
        attackLab
          ? "This card is filed under cryptanalysis, or its first category is Attacks. The terms are still the vocabulary index, not a proof that each one is demonstrated."
          : "These terms were found in the lab repo. A mention is not the lesson that breaks the construction.",
      )}
      ${
        exhibit.standards.length
          ? `<p class="note">Bodies named on the card: ${esc(exhibit.standards.join(", "))}. The card does not carry the defining document; that stays on the vocabulary term.</p>`
          : ""
      }
      ${
        exhibit.chips.length
          ? `<p class="note">Chips, the lab’s own words, are not edges: ${esc(exhibit.chips.slice(0, 8).join(" · "))}${exhibit.chips.length > 8 ? " …" : ""}</p>`
          : ""
      }
    </section>
  </article>`;
}

function renderTabs() {
  $("tabs").innerHTML = LENSES.map(
    ([id, label]) =>
      `<button type="button" role="tab" data-lens="${id}" aria-selected="${state.lens === id}">${label}</button>`,
  ).join("");
}

function renderSearch() {
  const q = state.query.trim().toLowerCase();
  const host = $("hits");
  if (q.length < 2) {
    host.hidden = true;
    host.innerHTML = "";
    return;
  }
  const matches = catalog.exhibits
    .filter((exhibit) => `${exhibit.title} ${exhibit.kicker} ${exhibit.copy}`.toLowerCase().includes(q))
    .slice(0, 8);
  host.hidden = matches.length === 0;
  host.innerHTML = matches
    .map(
      (exhibit) =>
        `<li><button type="button" data-title="${esc(exhibit.title)}"><span>${esc(exhibit.title)}</span><span class="meta">${esc(exhibit.level)}</span></button></li>`,
    )
    .join("");
}

function paint(scroll) {
  renderTabs();
  renderScope();
  renderSpine();
  renderDetail();
  renderSearch();
  if (!scroll) return;
  if (!window.matchMedia("(max-width: 1023px)").matches) return;
  $("detail").scrollIntoView({
    block: "start",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}

function openExhibit(title) {
  const exhibit = exhibitByTitle(title);
  if (!exhibit) return;
  const next = focusOf(title);
  state.lens = next.lens;
  state.scope = next.scope;
  state.selectedId = exhibit.id;
  state.query = "";
  $("q").value = "";
  paint(true);
}

function choose(id) {
  state.selectedId = id;
  paint(true);
}

function boot(data) {
  catalog = data;
  for (const exhibit of catalog.exhibits) {
    byTitle.set(exhibit.title, exhibit);
    byId.set(exhibit.id, exhibit);
  }
  const model = depthModel();
  $("n-exhibits").textContent = String(model.exhibits);
  $("n-path").textContent = String(model.onPath);
  $("n-module").textContent = String(model.onModule);
  $("n-neither").textContent = String(model.neither.length);
  state.selectedId = exhibitByTitle(catalog.paths[0].steps[0])?.id ?? catalog.exhibits[0].id;
  paint(false);

  document.body.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("button") : null;
    if (!target) {
      if (!(event.target instanceof Element) || !event.target.closest("#hits")) $("hits").hidden = true;
      return;
    }
    if (target.dataset.lens) {
      state.lens = target.dataset.lens;
      if (state.lens === "path") state.scope = "start-here";
      if (state.lens === "concept") state.scope = conceptsByTitle()[0].id;
      if (state.lens === "module") state.scope = catalog.modules[0].id;
      if (state.lens === "section") state.scope = catalog.sections[0].id;
      paint(false);
      return;
    }
    if (target.dataset.scope) {
      state.scope = target.dataset.scope;
      paint(false);
      return;
    }
    if (target.dataset.id) {
      choose(target.dataset.id);
      return;
    }
    if (target.dataset.title) {
      openExhibit(target.dataset.title);
      return;
    }
    if (target.dataset.concept) {
      const concept = catalog.concepts.find((item) => item.id === target.dataset.concept);
      if (!concept) return;
      state.lens = "concept";
      state.scope = concept.id;
      const current = byId.get(state.selectedId);
      if (!current || !concept.exhibits.includes(current.title)) {
        const first = exhibitByTitle(concept.exhibits[0]);
        if (first) state.selectedId = first.id;
      }
      state.query = "";
      $("q").value = "";
      paint(false);
      return;
    }
    if (target.dataset.list) {
      if (state.openLists.has(target.dataset.list)) state.openLists.delete(target.dataset.list);
      else state.openLists.add(target.dataset.list);
      renderDetail();
    }
  });

  document.body.addEventListener("change", (event) => {
    if (event.target instanceof HTMLSelectElement && event.target.id === "concept-pick") {
      state.scope = event.target.value;
      const concept = catalog.concepts.find((item) => item.id === state.scope);
      const current = byId.get(state.selectedId);
      if (concept && (!current || !concept.exhibits.includes(current.title))) {
        const first = exhibitByTitle(concept.exhibits[0]);
        if (first) state.selectedId = first.id;
      }
      paint(false);
    }
  });

  $("q").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderSearch();
  });
}

fetch("./catalog.json")
  .then((response) => {
    if (!response.ok) throw new Error("catalog");
    return response.json();
  })
  .then(boot)
  .catch(() => {
    $("spine").textContent = "The catalog snapshot did not load.";
  });
