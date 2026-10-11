import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';


const base = dirname(fileURLToPath(import.meta.url)) + '/..';
const files = [
  ['README.md', 'Overview'],
  ['spec/01-platform-goal.md', 'Platform Goal'],
  ['spec/02-component-architecture.md', 'Component Architecture'],
  ['spec/03-products-and-usecases.md', 'Products & Back-Test'],
  ['spec/04-domains.md', 'Domains'],
  ['spec/05-detailed-architecture.md', 'Detailed Architecture'],
  ['spec/06-build-phases.md', 'Build Phases'],
];

const docs = files.map(([f, title], i) => {
  const md = readFileSync(`${base}/${f}`, 'utf8').replaceAll('</script>', '<\\/script>');
  return { id: 's' + i, title, md };
});

// Visual pages embedded as sections (each already has the iframe theme/size handshake).
const agenda = { id: 'agenda', title: 'Meeting agenda', src: 'pages/agenda.html',
  lead: 'What we’re thinking and what we want to decide together — the running order for the review.' };
const embeds = [
  { id: 'map',  title: 'At a glance — one case, end to end', src: 'pages/diagram.html',
    lead: 'Follow a single motor-claim case through Mimir. The <b>middle (platform) column never changes</b> between products — only the pack does.' },
  { id: 'arch', title: 'Five planes, one map', src: 'pages/components.html',
    lead: 'The service / component architecture: how the planes connect, and how a client can take one module or a group.' },
  { id: 'bt',   title: 'The back-test, on one page', src: 'pages/backtest.html',
    lead: '13 sample products × 18 requirements. Every product forces at least one — the engine + packs split held for all.' },
];

// the seven module chapter pages, embedded like the other visual pages
const moduleNames = ['capture', 'extract', 'vision', 'verify', 'detect', 'estimate', 'decide'];
const moduleEmbeds = moduleNames.map((m, i) => ({
  id: 'mod-' + m,
  title: m[0].toUpperCase() + m.slice(1),
  src: `pages/module-${m}.html`,
  lead: `Module ${String(i + 1).padStart(2, '0')} of 07 — the story, what we will build, the contract, implementation notes, and the open questions.`,
}));

// nav, grouped: start here → see it → the modules → the docs
const navItems = [
  { group: 'Start here' },
  { id: 'agenda', title: 'Meeting agenda' },
  { id: docs[0].id, title: docs[0].title },
  { group: 'See it' },
  { id: 'map',  title: 'At a glance · example' },
  { id: 'arch', title: 'Architecture map' },
  { id: 'bt',   title: 'Back-test (one page)' },
  { group: 'The modules' },
  ...moduleEmbeds.map((m) => ({ id: m.id, title: m.title })),
  { group: 'The docs' },
  ...docs.slice(1).map((d) => ({ id: d.id, title: d.title })),
];
const nav = navItems.map((n) =>
  n.group ? `<p class="navgroup">${n.group}</p>`
          : `<a href="#${n.id}" data-target="${n.id}">${n.title}</a>`).join('\n');

const embedSection = (e) => `<section id="${e.id}">
  <div class="maphead"><h1>${e.title}</h1><a class="openfull" href="${e.src}" target="_blank" rel="noopener">Open full view ↗</a></div>
  <p class="lead">${e.lead} Dig into any layer using the sidebar.</p>
  <iframe class="embed" src="${e.src}" title="${e.title}"></iframe>
</section>`;

const docSection = (d) => `<section id="${d.id}"><script type="text/markdown">${d.md}</script></section>`;

const blocks = [
  embedSection(agenda),
  docSection(docs[0]),
  ...embeds.map(embedSection),
  ...moduleEmbeds.map(embedSection),
  ...docs.slice(1).map(docSection),
].join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Mimir — the Modules intelligence engine</title>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<style>
  :root{
    --bg:#f6f5f1; --panel:#fff; --ink:#191919; --muted:#70706a; --line:#e4e1d8;
    --accent:#1f6feb; --accent-soft:#e9f0fe; --code:#f0eee8; --shadow:0 1px 2px rgba(0,0,0,.05);
    --platform:#1f6feb; --pack:#b4530a; --cross:#5a4fcf;
  }
  @media (prefers-color-scheme: dark){
    :root{ --bg:#0e1014; --panel:#161922; --ink:#e8eaef; --muted:#97a0ae; --line:#272c38;
      --accent:#6aa2ff; --accent-soft:#182238; --code:#1b1f2a; --shadow:0 1px 2px rgba(0,0,0,.4);
      --platform:#6aa2ff; --pack:#f0a062; --cross:#a79cff;}
  }
  [data-theme="light"]{--bg:#f6f5f1;--panel:#fff;--ink:#191919;--muted:#70706a;--line:#e4e1d8;--accent:#1f6feb;--accent-soft:#e9f0fe;--code:#f0eee8;--shadow:0 1px 2px rgba(0,0,0,.05);--platform:#1f6feb;--pack:#b4530a;--cross:#5a4fcf}
  [data-theme="dark"]{--bg:#0e1014;--panel:#161922;--ink:#e8eaef;--muted:#97a0ae;--line:#272c38;--accent:#6aa2ff;--accent-soft:#182238;--code:#1b1f2a;--shadow:0 1px 2px rgba(0,0,0,.4);--platform:#6aa2ff;--pack:#f0a062;--cross:#a79cff}
  *{box-sizing:border-box}
  html,body{margin:0;background:var(--bg);color:var(--ink);
    font:16px/1.65 ui-sans-serif,-apple-system,"Segoe UI",Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .wrap{display:grid;grid-template-columns:280px 1fr;min-height:100vh}
  aside{position:sticky;top:0;height:100vh;overflow:auto;border-right:1px solid var(--line);background:var(--panel);padding:28px 20px}
  .brand{font-weight:700;font-size:20px;letter-spacing:-.02em;margin:0 0 2px}
  .brand .dot{color:var(--accent)}
  .tag{color:var(--muted);font-size:12.5px;margin:0 0 22px}
  .navgroup{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin:16px 0 4px;padding:0 12px}
  nav{display:flex;flex-direction:column;gap:2px}
  nav a{color:var(--ink);text-decoration:none;padding:8px 12px;border-radius:8px;font-size:14.5px}
  nav a:hover{background:var(--accent-soft)}
  nav a.active{background:var(--accent-soft);color:var(--accent);font-weight:600}
  .aside-foot{margin-top:16px;border-top:1px solid var(--line);padding-top:14px;display:flex;flex-direction:column;gap:9px}
  .aside-foot a{color:var(--muted);font-size:13px;text-decoration:none}
  .aside-foot a:hover{color:var(--accent)}
  .theme{margin-top:16px;border:1px solid var(--line);background:transparent;color:var(--muted);border-radius:8px;padding:7px 12px;font-size:13px;cursor:pointer;width:100%}
  main{padding:56px 7vw;max-width:1040px}
  section{display:none;animation:f .18s ease}
  section.on{display:block}
  @keyframes f{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  h1{font-size:30px;letter-spacing:-.02em;margin:.2em 0 .5em}
  h2{font-size:22px;letter-spacing:-.01em;margin:1.7em 0 .5em;padding-top:.3em;border-top:1px solid var(--line)}
  h3{font-size:17px;margin:1.4em 0 .4em}
  a{color:var(--accent)}
  blockquote{margin:1em 0;padding:.6em 1em;border-left:3px solid var(--accent);background:var(--accent-soft);border-radius:0 8px 8px 0}
  blockquote p{margin:.3em 0}
  code{background:var(--code);padding:.12em .4em;border-radius:5px;font-size:.88em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  pre{background:var(--code);padding:16px;border-radius:12px;overflow:auto;border:1px solid var(--line);box-shadow:var(--shadow)}
  pre code{background:none;padding:0;font-size:12.5px;line-height:1.5}
  table{border-collapse:collapse;width:100%;margin:1.2em 0;font-size:14px;display:block;overflow:auto}
  th,td{border:1px solid var(--line);padding:9px 12px;text-align:left;vertical-align:top}
  th{background:var(--accent-soft);font-weight:600}
  tr:nth-child(even) td{background:color-mix(in srgb,var(--panel) 60%,var(--bg))}
  hr{border:none;border-top:1px solid var(--line);margin:2em 0}
  .maphead{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
  .maphead h1{margin:.2em 0}
  .openfull{font-size:13.5px;white-space:nowrap}
  .lead{color:var(--muted);margin:0 0 18px;font-size:15px}
  iframe.embed{width:100%;border:1px solid var(--line);border-radius:14px;background:var(--panel);min-height:640px;box-shadow:var(--shadow)}
  @media(max-width:860px){.wrap{grid-template-columns:1fr}aside{position:static;height:auto}main{padding:32px 20px}}
</style>
</head>
<body>
<div class="wrap">
  <aside>
    <p class="brand">Mimir<span class="dot">.</span></p>
    <p class="tag">the Modules intelligence engine · architecture docs</p>
    <nav id="nav">${nav}</nav>
    <div class="aside-foot">
      <p class="navgroup" style="margin:0 0 4px;padding:0 12px">Present</p>
      <a href="pages/presentation.html" target="_blank" rel="noopener">▸ The deck (16 slides)</a>
      <a href="pages/speaker-crib.html" target="_blank" rel="noopener">▸ Speaker crib</a>
    </div>
    <button class="theme" id="theme">◐ Toggle theme</button>
  </aside>
  <main id="main">${blocks}</main>
</div>
<script>
  marked.setOptions({gfm:true, breaks:false});
  document.querySelectorAll('section > script[type="text/markdown"]').forEach(sc=>{
    const parent=sc.parentElement;
    const div=document.createElement('div'); div.innerHTML=marked.parse(sc.textContent);
    parent.innerHTML=''; parent.appendChild(div);
  });
  const navs=[...document.querySelectorAll('#nav a')];
  const secs=[...document.querySelectorAll('section')];
  const frames=[...document.querySelectorAll('iframe.embed')];
  function curTheme(){ return document.documentElement.getAttribute('data-theme')
      || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'); }
  function pushTheme(target){
    const list = target ? [target] : frames;
    list.forEach(fr=>{ try{ fr.contentWindow && fr.contentWindow.postMessage({type:'theme',value:curTheme()},'*'); }catch(e){} });
  }
  frames.forEach(f=>f.addEventListener('load',()=>pushTheme(f)));
  window.addEventListener('message',e=>{
    if(e.data&&e.data.type==='size'){ const f=frames.find(fr=>fr.contentWindow===e.source); if(f) f.style.height=(e.data.height+28)+'px'; }
  });
  function show(id){
    secs.forEach(s=>s.classList.toggle('on', s.id===id));
    navs.forEach(a=>a.classList.toggle('active', a.dataset.target===id));
    history.replaceState(null,'','#'+id); window.scrollTo({top:0});
    const sec=document.getElementById(id); const fr=sec&&sec.querySelector('iframe.embed'); if(fr) pushTheme(fr);
  }
  navs.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(a.dataset.target)}));
  show((location.hash||'#agenda').slice(1) || 'agenda');
  document.getElementById('theme').addEventListener('click',()=>{
    document.documentElement.setAttribute('data-theme', curTheme()==='dark'?'light':'dark');
    pushTheme();
  });
</script>
</body>
</html>`;

writeFileSync(`${base}/index.html`, html);
console.log('wrote index.html (' + html.length + ' bytes); nav=' + navItems.length + ' embeds=' + embeds.length);
