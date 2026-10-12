/* =========================================================================
   Modules — Claims Intelligence · internal demo (vanilla JS, no build step)
   ========================================================================= */
"use strict";

/* ----------------------------- SAMPLE DATA ----------------------------- */
const CASES = [
  {
    id: "CLM-2026-90377", reg: "MH 12 AB 1234", vehicle: "Maruti Suzuki Swift · 2019 · Petrol",
    inputs: ["photos", "documents"], band: "high", status: "review", date: "11 Sep 2026",
    score: 78, flagsHigh: 4, flagsMed: 1, parts: 3, vahan: "Match",
  },
  {
    id: "CLM-2026-90361", reg: "KA 05 MH 8842", vehicle: "Hyundai i20 · 2021 · Petrol",
    inputs: ["photos"], band: "low", status: "done", date: "10 Sep 2026",
    score: 19, flagsHigh: 0, flagsMed: 1, parts: 2, vahan: "Match",
  },
  {
    id: "CLM-2026-90352", reg: "DL 3C AQ 7701", vehicle: "Tata Nexon · 2022 · Diesel",
    inputs: ["documents"], band: "medium", status: "review", date: "10 Sep 2026",
    score: 54, flagsHigh: 1, flagsMed: 2, parts: 0, vahan: "Match",
  },
  {
    id: "CLM-2026-90348", reg: "TN 10 BK 2290", vehicle: "Honda City · 2018 · Petrol",
    inputs: ["photos", "documents"], band: "low", status: "new", date: "09 Sep 2026",
    score: 12, flagsHigh: 0, flagsMed: 0, parts: 1, vahan: "Match",
  },
  {
    id: "CLM-2026-90331", reg: "GJ 01 RT 4456", vehicle: "Mahindra XUV300 · 2020 · Diesel",
    inputs: ["photos", "documents"], band: "medium", status: "new", date: "09 Sep 2026",
    score: 47, flagsHigh: 1, flagsMed: 1, parts: 4, vahan: "Mismatch",
  },
  {
    id: "CLM-2026-90310", reg: "RJ 14 CV 9013", vehicle: "Maruti Suzuki Baleno · 2021 · Petrol",
    inputs: ["photos"], band: "low", status: "done", date: "08 Sep 2026",
    score: 23, flagsHigh: 0, flagsMed: 1, parts: 2, vahan: "Match",
  },
];

// The fully-built case (flagship)
const FOCUS_ID = "CLM-2026-90377";

const DAMAGE = [
  { n: 1, part: "Front bumper", type: "Scratch", sev: "moderate" },
  { n: 2, part: "Left front door", type: "Dent", sev: "minor" },
  { n: 3, part: "Left headlamp", type: "Broken", sev: "severe" },
];

const FLAGS = [
  { sev: "high", check: "Policy active on date of loss", why: "Policy ended 9 Sep. Loss reported 11 Sep." },
  { sev: "high", check: "Chassis number across documents", why: "Estimate ends 4471. RC and Vahan end 4417." },
  { sev: "high", check: "Estimate total vs line items", why: "Printed total ₹62,400. Line items add up to ₹58,900." },
  { sev: "high", check: "Invoice number used before", why: "Same garage and number seen on an earlier claim." },
  { sev: "medium", check: "File edited after creation", why: "Invoice PDF saved by an image editor two days after the garage date." },
];

const DOCUMENTS = [
  { name: "Repair estimate", meta: "estimate_swift_9041.pdf · 2 pages · uploaded 11 Sep", flag: "high", flagText: "Total mismatch" },
  { name: "Tax invoice", meta: "invoice_tirupati_motors.pdf · 1 page · uploaded 11 Sep", flag: "high", flagText: "Reused number" },
  { name: "Registration certificate (RC)", meta: "rc_mh12ab1234.jpg · uploaded 11 Sep", flag: null },
  { name: "Policy schedule", meta: "policy_schedule.pdf · 3 pages · uploaded 11 Sep", flag: "high", flagText: "Lapsed on loss date" },
  { name: "Driving licence", meta: "dl_front_back.jpg · uploaded 11 Sep", flag: null },
];

const EVIDENCE = [
  { name: "Front bumper", tag: "IMG_4471", flag: true, car: "bumper" },
  { name: "Left door", tag: "IMG_4479", flag: true, car: "door" },
  { name: "Left headlamp close-up", tag: "IMG_4483", flag: true, car: "lamp" },
];

const OVERVIEW = [
  { k: "Claim id", v: "CLM-2026-90377" },
  { k: "Vehicle reg", v: "MH 12 AB 1234" },
  { k: "Make / model", v: "Maruti Suzuki Swift" },
  { k: "Year / fuel", v: "2019 · Petrol" },
  { k: "Date of loss", v: "11 Sep 2026" },
  { k: "Reported", v: "11 Sep 2026, 14:22 IST" },
  { k: "Garage", v: "Tirupati Motors, Pune" },
  { k: "Estimate total", v: "₹62,400" },
  { k: "Vahan check", v: "Match", strong: true },
  { k: "Inputs received", v: "Photos + Documents" },
];

const ENDPOINTS = [
  { verb: "POST", path: "/v1/cases", desc: "Create a case with claim and vehicle details" },
  { verb: "POST", path: "/v1/cases/{id}/files", desc: "Attach photos and documents" },
  { verb: "POST", path: "/v1/cases/{id}/capture-link", desc: "Issue a guided-capture link for the policyholder" },
  { verb: "GET",  path: "/v1/cases/{id}", desc: "Fetch case with score, flags and findings" },
  { verb: "GET",  path: "/v1/cases/{id}/report.pdf", desc: "Download the one-page case report" },
  { verb: "HOOK", path: "case.completed", desc: "Fires when analysis finishes — delivered to your webhook" },
];

/* ----------------------------- ICONS (inline) -------------------------- */
const I = {
  photo: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.8"/><path d="M4 18l5-4 4 3 3-2.5 4 3.5"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 15h6"/></svg>',
  alert: '<svg viewBox="0 0 24 24"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/></svg>',
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  dot: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M12 4v12M6 11l6 6 6-6"/><path d="M5 20h14"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
  mask: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><path d="M4 4l16 16"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>',
};

/* ------------------------------- ROUTER -------------------------------- */
const view = document.getElementById("view");
const crumbs = document.getElementById("crumbs");
const searchWrap = document.getElementById("searchWrap");
const searchInput = document.getElementById("searchInput");
let state = { nav: "cases", filter: "all", query: "", tab: "overview" };

function setActiveNav(nav) {
  document.querySelectorAll(".nav-item").forEach((b) =>
    b.classList.toggle("active", b.dataset.nav === nav)
  );
}

function render() {
  setActiveNav(state.nav);
  searchWrap.style.display = state.nav === "cases" ? "" : "none";
  if (state.nav === "cases") renderCases();
  else if (state.nav === "case-detail") renderCaseDetail();
  else if (state.nav === "capture") renderCapturePage();
  else if (state.nav === "developers") renderDevelopers();
  view.scrollTop = 0;
}

function go(nav) { state.nav = nav; render(); }

/* ------------------------------ DASHBOARD ------------------------------ */
function bandPill(band) {
  const label = band === "high" ? "High" : band === "medium" ? "Medium" : "Low";
  const icon = band === "high" ? I.alert : band === "medium" ? I.alert : I.check;
  return `<span class="band ${band}">${icon}${label}</span>`;
}
function statusChip(status) {
  const map = { new: "New", review: "In review", done: "Done" };
  const cls = { new: "new", review: "review", done: "done" };
  return `<span class="status ${cls[status]}"><span class="sdot"></span>${map[status]}</span>`;
}
function inputChips(inputs) {
  const map = {
    photos: `<span class="chip">${I.photo}Photos</span>`,
    documents: `<span class="chip">${I.doc}Documents</span>`,
  };
  if (inputs.length === 2) return `<span class="chips">${map.photos}${map.documents}</span>`;
  return `<span class="chips">${inputs.map((i) => map[i]).join("")}</span>`;
}

function filteredCases() {
  const q = state.query.trim().toLowerCase();
  return CASES.filter((c) => {
    if (state.filter !== "all" && c.status !== state.filter) return false;
    if (q && !(c.id.toLowerCase().includes(q) || c.reg.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderCases() {
  crumbs.innerHTML = "Cases";
  const high = CASES.filter((c) => c.band === "high").length;
  const review = CASES.filter((c) => c.status === "review").length;
  const list = filteredCases();

  const rows = list.length
    ? list.map((c) => `
      <tr data-open="${c.id}">
        <td class="cell-id">${c.id}</td>
        <td><div class="cell-reg">${c.reg}</div><div class="cell-veh">${c.vehicle}</div></td>
        <td>${inputChips(c.inputs)}</td>
        <td>${bandPill(c.band)}</td>
        <td>${statusChip(c.status)}</td>
        <td class="cell-date">${c.date}</td>
      </tr>`).join("")
    : `<tr class="empty"><td colspan="6">No cases match your search.</td></tr>`;

  view.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Cases</h1>
        <p>Claims analysed by the engine. Open a case to see where to look.</p>
      </div>
      <button class="btn btn-primary" id="goCapture">${I.send}Send capture link</button>
    </div>

    <div class="principle-banner">
      <div class="pi">${I.shield}</div>
      <p><strong>The engine never approves or rejects a claim.</strong> It tells your team where to look — scores, flags and findings, with the reason for every flag.</p>
    </div>

    <div class="stat-strip">
      <div class="card stat"><div class="k">${CASES.length}</div><div class="l">Cases in queue</div></div>
      <div class="card stat red"><div class="k">${high}</div><div class="l">High fraud band</div></div>
      <div class="card stat amber"><div class="k">${review}</div><div class="l">In review</div></div>
      <div class="card stat teal"><div class="k">1.2m</div><div class="l">Median time to result</div></div>
    </div>

    <div class="filter-bar">
      <div class="seg" id="statusSeg">
        <button data-f="all" class="${state.filter === "all" ? "on" : ""}">All</button>
        <button data-f="new" class="${state.filter === "new" ? "on" : ""}">New</button>
        <button data-f="review" class="${state.filter === "review" ? "on" : ""}">In review</button>
        <button data-f="done" class="${state.filter === "done" ? "on" : ""}">Done</button>
      </div>
      <span class="filter-count">${list.length} of ${CASES.length}</span>
    </div>

    <div class="card table-wrap">
      <table class="cases">
        <thead>
          <tr><th>Claim id</th><th>Vehicle</th><th>Inputs</th><th>Fraud band</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  view.querySelectorAll("tr[data-open]").forEach((tr) =>
    tr.addEventListener("click", () => openCase(tr.dataset.open))
  );
  view.querySelector("#statusSeg").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-f]");
    if (!b) return;
    state.filter = b.dataset.f;
    renderCases();
  });
  view.querySelector("#goCapture").addEventListener("click", openCapture);
}

function openCase(id) {
  // Only the focus case has full detail; others show a friendly notice.
  if (id !== FOCUS_ID) {
    const c = CASES.find((x) => x.id === id);
    toast(`Sample detail is wired for ${FOCUS_ID}. ${c.id} is in the queue.`);
    return;
  }
  state.nav = "case-detail";
  state.tab = "overview";
  render();
}

/* ----------------------------- CASE DETAIL ----------------------------- */
function sevChip(sev) {
  const label = { severe: "SEVERE", moderate: "MODERATE", minor: "MINOR", high: "HIGH", medium: "MEDIUM" }[sev];
  const icon = sev === "minor" ? I.dot : I.alert;
  return `<span class="sev ${sev}">${icon}${label}</span>`;
}

function renderCaseDetail() {
  const c = CASES.find((x) => x.id === FOCUS_ID);
  crumbs.innerHTML = `Cases <span class="sep">/</span><span class="dim mono">${c.id}</span>`;

  view.innerHTML = `
    <div class="detail-head">
      <div>
        <button class="back" id="backBtn">${I.back}All cases</button>
        <div class="detail-title">
          <h1>${c.id}</h1>
          ${bandPill(c.band)}
          ${statusChip(c.status)}
        </div>
        <div class="vehicle-line">
          <span>MH 12 AB 1234</span><span class="v-sep">·</span>
          <span>Maruti Suzuki Swift</span><span class="v-sep">·</span>
          <span>2019</span><span class="v-sep">·</span>
          <span>Petrol</span>
        </div>
      </div>
      <div class="detail-actions">
        <button class="btn btn-ghost" id="dlPdf">${I.down}Download PDF</button>
        <button class="btn btn-ghost" id="dlJson">${I.down}Download JSON</button>
        <button class="btn btn-amber" id="sendLink">${I.send}Send capture link</button>
      </div>
    </div>

    <div class="config-note">
      ${I.info}
      This report adapts to what was sent. For ${c.id} the engine received <strong style="font-weight:600">photos and documents</strong> &mdash; so Damage, Documents and Evidence are all available.
    </div>

    <div class="tiles">
      <div class="card tile score">
        <span class="tlabel">Fraud score</span>
        <span class="tval">78 <span style="font-size:15px">· High</span></span>
        <div class="score-meter"><i style="width:78%"></i></div>
      </div>
      <div class="card tile">
        <span class="tlabel">Red flags</span>
        <span class="tval">4<span style="font-size:15px;color:var(--ink-3)"> high</span></span>
        <span class="tsub">1 medium</span>
      </div>
      <div class="card tile">
        <span class="tlabel">Damaged parts</span>
        <span class="tval">3</span>
        <span class="tsub">1 severe · 1 moderate · 1 minor</span>
      </div>
      <div class="card tile">
        <span class="tlabel">Vahan</span>
        <span class="tval" style="color:var(--teal)">Match</span>
        <span class="tsub">Reg &amp; make/model verified</span>
      </div>
    </div>

    <div class="tabs" id="detailTabs">
      <button class="tab" data-tab="overview">Overview</button>
      <button class="tab" data-tab="damage">Damage <span class="tbadge">3</span></button>
      <button class="tab" data-tab="documents">Documents <span class="tbadge">5</span></button>
      <button class="tab" data-tab="evidence">Evidence <span class="tbadge">3</span></button>
    </div>

    <div id="tabBody"></div>`;

  view.querySelector("#backBtn").addEventListener("click", () => go("cases"));
  view.querySelector("#dlPdf").addEventListener("click", openReport);
  view.querySelector("#dlJson").addEventListener("click", openJson);
  view.querySelector("#sendLink").addEventListener("click", openCapture);
  view.querySelector("#detailTabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    state.tab = b.dataset.tab;
    paintTabs();
  });
  paintTabs();
}

function paintTabs() {
  document.querySelectorAll("#detailTabs .tab").forEach((t) =>
    t.classList.toggle("on", t.dataset.tab === state.tab)
  );
  const body = document.getElementById("tabBody");
  body.innerHTML = tabContent(state.tab);
  // Wire the "Red flags" inline cross-link on the overview tab
  const fl = body.querySelector("#jumpFlags");
  if (fl) fl.addEventListener("click", () => { state.tab = "damage"; paintTabs(); });
}

function flagRows() {
  return FLAGS.map((f) => `
    <tr>
      <td style="width:92px">${sevChip(f.sev)}</td>
      <td class="check-name">${f.check}</td>
      <td class="reason">${f.why}</td>
    </tr>`).join("");
}

function tabContent(tab) {
  if (tab === "overview") {
    return `
      <div class="tab-panel on">
        <div class="overview-grid">
          <div class="card">
            <div class="ov-head"><h2 class="section-title" style="margin:0">Claim summary</h2></div>
            <div class="ov-list">
              ${OVERVIEW.map((r) => `<div class="ov-row"><span class="ov-k">${r.k}</span><span class="ov-v" style="${r.strong ? "color:var(--teal)" : ""}">${r.v}</span></div>`).join("")}
            </div>
          </div>
          <div class="card" style="padding:20px">
            <h2 class="section-title">Why this scored High</h2>
            <p class="section-note" style="margin-top:0">Top findings driving the score. Full list in the Damage tab.</p>
            <table class="dtable" style="margin:0 -18px">
              <tbody>${flagRows()}</tbody>
            </table>
            <button class="btn btn-ghost" id="jumpFlags" style="margin-top:16px">View all red flags</button>
          </div>
        </div>
        ${disclaimerBlock()}
      </div>`;
  }

  if (tab === "damage") {
    return `
      <div class="tab-panel on">
        <h2 class="section-title">Damaged parts</h2>
        <div class="card" style="overflow:hidden;margin-bottom:26px">
          <table class="dtable">
            <thead><tr><th></th><th>Part</th><th>Type</th><th>Severity</th></tr></thead>
            <tbody>
              ${DAMAGE.map((d) => `
                <tr>
                  <td class="num">${d.n}</td>
                  <td class="part">${d.part}</td>
                  <td style="color:var(--ink-2)">${d.type}</td>
                  <td>${sevChip(d.sev)}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>

        <h2 class="section-title">Red flags</h2>
        <p class="section-note">Severity · check · why. Every flag shows its reason — the engine points, it does not decide.</p>
        <div class="card" style="overflow:hidden">
          <table class="dtable">
            <thead><tr><th style="width:92px">Severity</th><th>Check</th><th>Why</th></tr></thead>
            <tbody>${flagRows()}</tbody>
          </table>
        </div>
        ${disclaimerBlock()}
      </div>`;
  }

  if (tab === "documents") {
    return `
      <div class="tab-panel on">
        <h2 class="section-title">Documents received</h2>
        <p class="section-note">5 files. Flagged files link to the red flag that referenced them.</p>
        <div class="doc-list">
          ${DOCUMENTS.map((d) => `
            <div class="card doc-item">
              <div class="doc-icon">${I.doc}</div>
              <div class="doc-body">
                <div class="doc-name">${d.name}</div>
                <div class="doc-meta">${d.meta}</div>
              </div>
              <div class="doc-flag">${d.flag ? `<span class="band ${d.flag}">${I.alert}${d.flagText}</span>` : `<span class="band low">${I.check}Clean</span>`}</div>
            </div>`).join("")}
        </div>
        ${disclaimerBlock()}
      </div>`;
  }

  if (tab === "evidence") {
    return `
      <div class="tab-panel on">
        <h2 class="section-title">Evidence photos</h2>
        <p class="section-note">Guided-capture images mapped to damaged parts. Highlighted regions mark detected damage.</p>
        <div class="evidence-grid">
          ${EVIDENCE.map((e) => evidenceCard(e)).join("")}
        </div>
        <div class="mask-note">${I.mask} Faces &amp; number plates are masked automatically before review.</div>
        ${disclaimerBlock()}
      </div>`;
  }
  return "";
}

function evidenceCard(e) {
  const art = carArt(e.car);
  return `
    <div class="evidence-card">
      <div class="evidence-img">
        <div class="car">${art.svg}</div>
        ${art.flag}
        ${art.mask}
      </div>
      <div class="evidence-meta">
        <span class="en">${e.name}</span>
        <span class="et">${e.tag}</span>
      </div>
    </div>`;
}

// Simple CSS/SVG line-art placeholders per angle (no external images).
function carArt(kind) {
  const base = {
    bumper: '<svg viewBox="0 0 120 90"><path d="M12 60 Q12 42 30 40 L54 38 Q70 38 82 46 L104 48 Q110 50 110 58 L110 66 L12 66 Z"/><circle cx="36" cy="68" r="9"/><circle cx="92" cy="68" r="9"/><path d="M12 60 L8 60"/></svg>',
    door: '<svg viewBox="0 0 120 90"><path d="M18 58 Q18 36 42 34 L86 32 Q100 32 104 48 L104 62 L18 62 Z"/><path d="M50 34 L50 62 M50 46 L66 46"/><circle cx="36" cy="66" r="8"/><circle cx="90" cy="66" r="8"/></svg>',
    lamp: '<svg viewBox="0 0 120 90"><path d="M16 56 Q16 38 36 36 L92 34 Q106 36 108 52"/><ellipse cx="30" cy="50" rx="12" ry="9"/><path d="M24 50 L36 50 M30 44 L30 56"/></svg>',
  }[kind];
  const flag = {
    bumper: '<div class="flagdot" style="left:16%;bottom:30%"></div>',
    door: '<div class="flagdot" style="left:40%;top:46%"></div>',
    lamp: '<div class="flagdot" style="left:22%;top:50%"></div>',
  }[kind];
  const mask = kind === "lamp"
    ? '<div class="mask" style="right:14%;top:18%;width:30%;height:16%"></div>'
    : '<div class="mask" style="right:10%;bottom:14%;width:26%;height:18%"></div>';
  return { svg: base, flag, mask };
}

function disclaimerBlock() {
  return `
    <div class="disclaimer">
      ${I.info}
      <p><strong>Suggestion only.</strong> This report does not approve or reject a claim. Final decision rests with the insurer. Sample data.</p>
    </div>`;
}

/* ------------------------------ DEVELOPERS ----------------------------- */
function renderDevelopers() {
  crumbs.innerHTML = "Developers";
  view.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Developers</h1>
        <p>Create a case, attach files, get a result. Score and flags arrive on the <span class="mono">case.completed</span> webhook.</p>
      </div>
    </div>

    <div class="dev-grid">
      <div class="card table-wrap">
        <table class="ep-table">
          <thead><tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr></thead>
          <tbody>
            ${ENDPOINTS.map((e) => `
              <tr>
                <td><span class="verb ${e.verb.toLowerCase()}">${e.verb === "HOOK" ? "WEBHOOK" : e.verb}</span></td>
                <td class="ep-path">${e.path}</td>
                <td class="ep-desc">${e.desc}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="dev-cols">
        <div>
          <div class="code-head"><span class="ch-label">Create a case</span><span class="ch-tag">sandbox</span></div>
          <pre class="code-block">${createReq()}</pre>
        </div>
        <div>
          <div class="code-head"><span class="ch-label">case.completed webhook</span><span class="ch-tag">signed</span></div>
          <pre class="code-block">${webhookRes()}</pre>
        </div>
      </div>

      <div class="card" style="padding:4px 0">
        <div class="key-row"><span class="kname">Base URL</span><span class="kval">https://api.modules.dev</span></div>
        <div class="key-row"><span class="kname">Publishable key</span><span class="kval">pk_sandbox_7f3a…c91d</span></div>
        <div class="key-row"><span class="kname">Secret key</span><span class="kval">sk_sandbox_•••••• (reveal)</span></div>
        <div class="key-row"><span class="kname">Webhook secret</span><span class="kval">whsec_•••••• (reveal)</span></div>
      </div>
    </div>`;
}

// Token-colored code via small helpers
const ck = (s) => `<span class="ck">${s}</span>`;
const cs = (s) => `<span class="cs">${s}</span>`;
const cn = (s) => `<span class="cn">${s}</span>`;
const cc = (s) => `<span class="cc">${s}</span>`;
const cp = (s) => `<span class="cp">${s}</span>`;

function createReq() {
  return [
    cc("# Create a case"),
    `${cp("POST")} /v1/cases`,
    `Authorization: Bearer ${cs("sk_sandbox_7f3a…c91d")}`,
    `Content-Type: application/json`,
    ``,
    `{`,
    `  ${ck('"claim_id"')}: ${cs('"CLM-2026-90377"')},`,
    `  ${ck('"vehicle"')}: {`,
    `    ${ck('"reg"')}: ${cs('"MH 12 AB 1234"')},`,
    `    ${ck('"make"')}: ${cs('"Maruti Suzuki"')},`,
    `    ${ck('"model"')}: ${cs('"Swift"')},`,
    `    ${ck('"year"')}: ${cn("2019")}`,
    `  },`,
    `  ${ck('"date_of_loss"')}: ${cs('"2026-09-11"')},`,
    `  ${ck('"inputs"')}: [${cs('"photos"')}, ${cs('"documents"')}]`,
    `}`,
    ``,
    cc("# 201 Created"),
    `{ ${ck('"id"')}: ${cs('"CLM-2026-90377"')}, ${ck('"status"')}: ${cs('"processing"')} }`,
  ].join("\n");
}

function webhookRes() {
  return [
    cc("# POST to your endpoint"),
    `${cp("POST")} https://your-app.example/webhooks`,
    `Modules-Signature: ${cs("t=1757…,v1=4a9c…")}`,
    ``,
    `{`,
    `  ${ck('"type"')}: ${cs('"case.completed"')},`,
    `  ${ck('"data"')}: {`,
    `    ${ck('"id"')}: ${cs('"CLM-2026-90377"')},`,
    `    ${ck('"fraud_score"')}: ${cn("78")},`,
    `    ${ck('"fraud_band"')}: ${cs('"high"')},`,
    `    ${ck('"red_flags"')}: { ${ck('"high"')}: ${cn("4")}, ${ck('"medium"')}: ${cn("1")} },`,
    `    ${ck('"vahan"')}: ${cs('"match"')},`,
    `    ${ck('"report_url"')}: ${cs('"/v1/cases/CLM-2026-90377/report.pdf"')}`,
    `  }`,
    `}`,
    ``,
    cc("# The engine points. Your team decides."),
  ].join("\n");
}

/* --------------------------- CAPTURE PAGE ------------------------------ */
function renderCapturePage() {
  crumbs.innerHTML = "Capture";
  view.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Guided capture</h1>
        <p>A link for the policyholder. No app to install. Hindi or English. Every angle lined up for them.</p>
      </div>
      <button class="btn btn-primary" id="launchCapture">${I.photo}Preview capture flow</button>
    </div>

    <div class="principle-banner">
      <div class="pi">${I.shield}</div>
      <p><strong>India-native by design.</strong> Consent is recorded with the case, plates and faces are masked, and the flow runs in Hindi or English — right in the browser.</p>
    </div>

    <div class="card" style="padding:28px;max-width:620px">
      <h2 class="section-title">What the policyholder sees</h2>
      <p class="section-note" style="margin-top:0">A consent screen first, then eight walkaround angles, odometer, chassis plate, damage close-ups and an optional walkaround video. Bad shots prompt a retake.</p>
      <button class="btn btn-amber" id="launchCapture2">${I.photo}Open the phone preview</button>
    </div>`;
  view.querySelector("#launchCapture").addEventListener("click", openCapture);
  view.querySelector("#launchCapture2").addEventListener("click", openCapture);
}

/* ------------------------------ OVERLAYS ------------------------------- */
function showOverlay(id) {
  const o = document.getElementById(id);
  o.hidden = false;
  document.body.style.overflow = "hidden";
}
function hideOverlay(o) {
  o.hidden = true;
  if (!document.querySelector(".overlay:not([hidden])")) document.body.style.overflow = "";
}
document.querySelectorAll("[data-close-overlay]").forEach((b) =>
  b.addEventListener("click", () => hideOverlay(b.closest(".overlay")))
);
document.querySelectorAll(".overlay").forEach((o) =>
  o.addEventListener("click", (e) => { if (e.target === o) hideOverlay(o); })
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const open = document.querySelector(".overlay:not([hidden])");
    if (open) hideOverlay(open);
  }
});

/* ------------- Report ------------- */
function openReport() {
  document.getElementById("reportMount").innerHTML = reportHTML();
  showOverlay("reportOverlay");
}
function reportHTML() {
  return `
    <div class="report-sheet">
      <div class="report-top">
        <div class="report-brand">
          <svg class="ascend" viewBox="0 0 104 104" aria-hidden="true">
            <path class="asc-teal" d="M28 64 L52 52 L76 64"/>
            <path class="asc-teal" d="M34 54 L52 42 L70 54"/>
            <path class="asc-amber" d="M40 44 L52 32 L64 44"/>
          </svg>
          <div>
            <div class="wordmark">Modules</div>
            <div class="sub">Claims Intelligence</div>
          </div>
        </div>
        <div class="report-meta">
          <div class="rid">CLM-2026-90377</div>
          <div>Generated 11 Sep 2026</div>
          <div>Inputs: photos + documents</div>
        </div>
      </div>

      <h1 class="report-title">Motor claim — case report</h1>
      <div class="report-vehicle">MH 12 AB 1234 · Maruti Suzuki Swift · 2019 · Petrol</div>

      <div class="report-score">
        <div class="big">78</div>
        <div class="sbody">
          <div class="sband">High fraud band</div>
          <div class="sline">The engine points to four high-severity findings. It does not approve or reject the claim.</div>
        </div>
        <div class="scols">
          <div class="sc"><div class="n">4</div><div class="t">High flags</div></div>
          <div class="sc"><div class="n">1</div><div class="t">Medium</div></div>
          <div class="sc"><div class="n" style="color:var(--teal)">Match</div><div class="t">Vahan</div></div>
        </div>
      </div>

      <div class="report-section">
        <h3>Red flags</h3>
        <table class="report-table">
          <thead><tr><th style="width:70px">Severity</th><th>Check</th><th>Why</th></tr></thead>
          <tbody>
            ${FLAGS.map((f) => `<tr><td>${sevChip(f.sev)}</td><td style="font-weight:600">${f.check}</td><td style="color:var(--ink-2)">${f.why}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="report-section">
        <h3>Damaged parts</h3>
        <table class="report-table">
          <thead><tr><th class="num">#</th><th>Part</th><th>Type</th><th>Severity</th></tr></thead>
          <tbody>
            ${DAMAGE.map((d) => `<tr><td class="num">${d.n}</td><td style="font-weight:600">${d.part}</td><td>${d.type}</td><td>${sevChip(d.sev)}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="report-section">
        <h3>Verification</h3>
        <div class="report-kv">
          <div class="line"><span class="k">Vahan registration</span><span class="v" style="color:var(--teal)">Match</span></div>
          <div class="line"><span class="k">Make / model</span><span class="v">Verified</span></div>
          <div class="line"><span class="k">Policy on loss date</span><span class="v" style="color:var(--red)">Lapsed</span></div>
          <div class="line"><span class="k">Estimate total</span><span class="v">₹62,400</span></div>
          <div class="line"><span class="k">Line items sum</span><span class="v" style="color:var(--red)">₹58,900</span></div>
          <div class="line"><span class="k">Garage</span><span class="v">Tirupati Motors</span></div>
        </div>
      </div>

      <div class="report-disclaimer">
        <strong>Suggestion only.</strong> This report does not approve or reject a claim. Final decision rests with the insurer. Sample data.
      </div>
    </div>`;
}

/* ------------- JSON ------------- */
function openJson() {
  document.getElementById("jsonMount").innerHTML = jsonHTML();
  showOverlay("jsonOverlay");
}
function jsonHTML() {
  return [
    `{`,
    `  ${ck('"id"')}: ${cs('"CLM-2026-90377"')},`,
    `  ${ck('"status"')}: ${cs('"completed"')},`,
    `  ${ck('"vehicle"')}: {`,
    `    ${ck('"reg"')}: ${cs('"MH 12 AB 1234"')}, ${ck('"make"')}: ${cs('"Maruti Suzuki"')}, ${ck('"model"')}: ${cs('"Swift"')}, ${ck('"year"')}: ${cn("2019")}, ${ck('"fuel"')}: ${cs('"petrol"')}`,
    `  },`,
    `  ${ck('"inputs"')}: [${cs('"photos"')}, ${cs('"documents"')}],`,
    `  ${ck('"fraud_score"')}: ${cn("78")},`,
    `  ${ck('"fraud_band"')}: ${cs('"high"')},`,
    `  ${ck('"vahan"')}: ${cs('"match"')},`,
    `  ${ck('"damage"')}: [`,
    `    { ${ck('"part"')}: ${cs('"Front bumper"')}, ${ck('"type"')}: ${cs('"scratch"')}, ${ck('"severity"')}: ${cs('"moderate"')} },`,
    `    { ${ck('"part"')}: ${cs('"Left front door"')}, ${ck('"type"')}: ${cs('"dent"')}, ${ck('"severity"')}: ${cs('"minor"')} },`,
    `    { ${ck('"part"')}: ${cs('"Left headlamp"')}, ${ck('"type"')}: ${cs('"broken"')}, ${ck('"severity"')}: ${cs('"severe"')} }`,
    `  ],`,
    `  ${ck('"red_flags"')}: [`,
    ...FLAGS.map((f, i) =>
      `    { ${ck('"severity"')}: ${cs(`"${f.sev}"`)}, ${ck('"check"')}: ${cs(`"${f.check}"`)}, ${ck('"why"')}: ${cs(`"${f.why.replace(/"/g, '\\"')}"`)} }${i < FLAGS.length - 1 ? "," : ""}`
    ),
    `  ],`,
    `  ${ck('"report_url"')}: ${cs('"/v1/cases/CLM-2026-90377/report.pdf"')},`,
    `  ${ck('"disclaimer"')}: ${cs('"Suggestion only. Final decision rests with the insurer."')}`,
    `}`,
  ].join("\n");
}

/* ------------- Capture flow (phone) ------------- */
const CAPTURE_STEPS = [
  { name: "Front", hint: "Stand square to the bonnet", art: "front" },
  { name: "Front left", hint: "Step to the left corner", art: "corner" },
  { name: "Left side", hint: "Whole left profile in frame", art: "side" },
  { name: "Rear left", hint: "Left tail corner", art: "corner" },
  { name: "Rear", hint: "Square to the boot", art: "front" },
  { name: "Rear right", hint: "Right tail corner", art: "corner" },
  { name: "Right side", hint: "Whole right profile in frame", art: "side" },
  { name: "Front right", hint: "Right bonnet corner", art: "corner" },
  { name: "Odometer", hint: "Dashboard reading, engine on", art: "odo" },
  { name: "Chassis plate", hint: "Steady, fill the frame", art: "plate" },
  { name: "Damage close-ups", hint: "Each damaged part, close", art: "close" },
  { name: "Walkaround video", hint: "Slow circle of the car", art: "video", optional: true },
];
const CORE_ANGLES = 8; // the eight walkaround angles
let capture = { lang: "en", stage: "consent", step: 2 /* 0-based → "Angle 3 of 8" */ };

function openCapture() {
  capture.stage = "consent";
  capture.step = 2;
  paintCapture();
  showOverlay("captureOverlay");
}

const TXT = {
  en: {
    consentTitle: "Before we start", consentP: "We'll guide you through a few photos of your vehicle. It takes about two minutes. No app to install.",
    c1: "Your consent is recorded with this claim", c2: "Number plates and faces are masked automatically", c3: "Photos are used only to assess this claim",
    start: "I agree — start capture", recorded: "Consent recorded with case CLM-2026-90377",
    angleOf: (n, t) => `Angle ${n} of ${t}`, retakeT: "Too dark — let's retake", retakeS: "Move to better light and hold steady", skip: "Skip (optional)", next: "Capture",
  },
  hi: {
    consentTitle: "शुरू करने से पहले", consentP: "हम आपके वाहन की कुछ फोटो लेने में मदद करेंगे। लगभग दो मिनट। कोई ऐप इंस्टॉल नहीं।",
    c1: "आपकी सहमति इस क्लेम के साथ दर्ज होगी", c2: "नंबर प्लेट और चेहरे अपने आप छिप जाएंगे", c3: "फोटो केवल इस क्लेम के लिए",
    start: "मैं सहमत हूँ — शुरू करें", recorded: "सहमति CLM-2026-90377 के साथ दर्ज",
    angleOf: (n, t) => `कोण ${n} / ${t}`, retakeT: "बहुत अंधेरा — फिर से लें", retakeS: "बेहतर रोशनी में स्थिर रहें", skip: "छोड़ें", next: "लें",
  },
};

function paintCapture() {
  const t = TXT[capture.lang];
  document.querySelectorAll("#langToggle .lang").forEach((b) =>
    b.classList.toggle("on", b.dataset.lang === capture.lang)
  );
  const mount = document.getElementById("captureMount");

  if (capture.stage === "consent") {
    mount.innerHTML = `
      ${phoneWrap(`
        ${phoneHead(t)}
        <div class="ph-consent">
          <div class="cicon">${I.shield}</div>
          <h2>${t.consentTitle}</h2>
          <p>${t.consentP}</p>
          <ul class="consent-list">
            <li>${I.check}<span>${t.c1}</span></li>
            <li>${I.mask}<span>${t.c2}</span></li>
            <li>${I.check}<span>${t.c3}</span></li>
          </ul>
          <button class="ph-btn primary" id="consentBtn">${t.start}</button>
          <div class="ph-recorded">${t.recorded}</div>
        </div>
      `)}
      ${captureAside()}`;
    document.getElementById("consentBtn").addEventListener("click", () => {
      capture.stage = "capture"; paintCapture();
    });
  } else {
    const step = CAPTURE_STEPS[capture.step];
    const isCoreAngle = capture.step < CORE_ANGLES;
    const progressLabel = isCoreAngle
      ? t.angleOf(capture.step + 1, CORE_ANGLES)
      : `${capture.step - CORE_ANGLES + 1} / ${CAPTURE_STEPS.length - CORE_ANGLES} · ${step.name}`;
    const pct = Math.round(((capture.step + 1) / CAPTURE_STEPS.length) * 100);
    const blurry = step.name === "Left side"; // the one "bad shot → retake" moment

    mount.innerHTML = `
      ${phoneWrap(`
        ${phoneHead(t)}
        <div class="ph-progress">
          <div class="plabel"><b>${progressLabel}</b><span>${pct}%</span></div>
          <div class="ph-bar"><i style="width:${pct}%"></i></div>
        </div>
        <div class="ph-body">
          <div class="ph-angle-name">${step.name}${step.optional ? ' <span style="font-size:12px;color:#7D93A8;font-weight:400">· optional</span>' : ""}</div>
          <div class="ph-angle-hint">${step.hint}</div>
          <div class="ph-viewfinder ${blurry ? "blurry" : ""}">
            <span class="vf-corner tl"></span><span class="vf-corner tr"></span>
            <span class="vf-corner bl"></span><span class="vf-corner br"></span>
            <div class="vf-outline">${vfArt(step.art)}</div>
            ${blurry ? `
              <div class="retake-banner">
                ${I.alert}
                <div><div class="rb-t">${t.retakeT}</div><div class="rb-s">${t.retakeS}</div></div>
              </div>` : ""}
          </div>
          <div class="ph-shutter">
            <button class="side" id="prevStep" title="Back">${I.back}</button>
            <button class="shutter" id="shutterBtn" title="${t.next}"></button>
            <button class="side" id="skipStep" title="${t.skip}">${step.optional ? I.check : I.down}</button>
          </div>
        </div>
        <div class="ph-thumbs">
          ${CAPTURE_STEPS.map((s, i) => `<div class="th ${i < capture.step ? "done" : ""} ${i === capture.step ? "cur" : ""}"></div>`).join("")}
        </div>
      `)}
      ${captureAside()}`;

    const advance = () => {
      if (capture.step < CAPTURE_STEPS.length - 1) { capture.step++; paintCapture(); }
      else { toast("Capture complete — 12 of 12. Running analysis."); hideOverlay(document.getElementById("captureOverlay")); }
    };
    document.getElementById("shutterBtn").addEventListener("click", advance);
    document.getElementById("skipStep").addEventListener("click", advance);
    document.getElementById("prevStep").addEventListener("click", () => {
      if (capture.step > 0) { capture.step--; paintCapture(); }
    });
  }
}

function phoneWrap(inner) {
  return `<div class="phone"><div class="phone-screen"><div class="phone-notch"></div>
    <div class="ph-status"><span>9:41</span><span>5G ▪ ▪ ▪</span></div>${inner}</div></div>`;
}
function phoneHead(t) {
  return `
    <div class="ph-head">
      <div class="brandline">
        <svg class="ascend" viewBox="0 0 104 104" aria-hidden="true">
          <path class="asc-teal" d="M28 64 L52 52 L76 64"/>
          <path class="asc-teal" d="M34 54 L52 42 L70 54"/>
          <path class="asc-amber" d="M40 44 L52 32 L64 44"/>
        </svg>
        <span class="wm">Modules</span>
      </div>
      <div class="noinstall">${capture.lang === "hi" ? "कोई ऐप नहीं" : "No app to install"}</div>
    </div>`;
}
function captureAside() {
  const t = TXT[capture.lang];
  return `
    <div class="capture-aside">
      <h2>Guided capture</h2>
      <p>The policyholder opens a link and the flow lines up every angle. Consent is recorded with the case; plates and faces are masked.</p>
      <div class="ca-steps">
        ${CAPTURE_STEPS.map((s, i) => {
          const done = capture.stage === "capture" && i < capture.step;
          const cur = capture.stage === "capture" && i === capture.step;
          return `<div class="ca-step ${done ? "done" : ""} ${cur ? "cur" : ""} ${s.optional ? "optional" : ""}">
            <span class="cn">${i + 1}</span><span>${s.name}</span>${s.optional ? '<span class="ot">optional</span>' : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
}

// Viewfinder outline art per step
function vfArt(kind) {
  const map = {
    front: '<svg viewBox="0 0 160 110"><path d="M20 78 Q20 50 48 46 L112 44 Q140 48 140 78 L140 86 L20 86 Z"/><path d="M36 60 L124 58"/><circle cx="46" cy="88" r="11"/><circle cx="114" cy="88" r="11"/></svg>',
    corner: '<svg viewBox="0 0 160 110"><path d="M16 80 Q22 48 60 44 L120 50 Q142 56 144 78 L144 86 L16 86 Z"/><path d="M60 44 L72 62 L140 60"/><circle cx="44" cy="88" r="11"/><circle cx="120" cy="88" r="11"/></svg>',
    side: '<svg viewBox="0 0 160 110"><path d="M12 80 Q12 52 40 50 L58 34 Q74 28 96 34 L120 50 Q148 52 148 80 L148 86 L12 86 Z"/><path d="M58 36 L58 50 M96 34 L96 50"/><circle cx="42" cy="88" r="12"/><circle cx="120" cy="88" r="12"/></svg>',
    odo: '<svg viewBox="0 0 160 110"><rect x="30" y="30" width="100" height="50" rx="8"/><circle cx="62" cy="55" r="16"/><circle cx="100" cy="55" r="16"/><path d="M62 55 L70 48"/></svg>',
    plate: '<svg viewBox="0 0 160 110"><rect x="34" y="40" width="92" height="30" rx="4"/><line x1="46" y1="55" x2="114" y2="55"/></svg>',
    close: '<svg viewBox="0 0 160 110"><circle cx="80" cy="55" r="34"/><path d="M62 55 Q80 40 98 55 M70 62 L76 56"/></svg>',
    video: '<svg viewBox="0 0 160 110"><circle cx="80" cy="55" r="36"/><path d="M80 24 A31 31 0 0 1 108 48" /><path d="M72 46 L96 55 L72 64 Z"/></svg>',
  };
  return map[kind] || map.front;
}

/* ------------------------------ TOAST ---------------------------------- */
let toastTimer;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.style.cssText =
      "position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(16px);" +
      "background:#0B1B2B;color:#E6EDF4;padding:13px 20px;border-radius:12px;font-size:13.5px;" +
      "font-family:var(--sans);box-shadow:0 12px 40px rgba(11,27,43,.35);z-index:100;opacity:0;" +
      "transition:opacity .2s, transform .2s;max-width:420px;border:1px solid rgba(255,255,255,.08)";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateX(-50%) translateY(0)"; });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(-50%) translateY(16px)"; }, 2800);
}

/* ------------------------------ WIRING --------------------------------- */
document.querySelectorAll("[data-nav]").forEach((b) =>
  b.addEventListener("click", () => go(b.dataset.nav))
);
document.querySelector(".brand").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") go("cases");
});
document.getElementById("langToggle").addEventListener("click", (e) => {
  const b = e.target.closest(".lang");
  if (!b) return;
  capture.lang = b.dataset.lang;
  paintCapture();
});
searchInput.addEventListener("input", (e) => {
  state.query = e.target.value;
  if (state.nav === "cases") renderCases();
});

render();
