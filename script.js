/* Döner Snack — production JS
   Vanilla JS port of the React prototype's interactivity layer. */

// ─── Data (content layer) ───────────────────────────────────────────────────
const SHOP = {
  phone: "02166 3104250",
  phoneHref: "tel:+4921663104250",
};

// 0 = Sonntag … 6 = Samstag (matches Date.getDay)
const HOURS = [
  { day: "Sonntag",    open: 12 * 60, close: 21 * 60 },
  { day: "Montag",     open: 11 * 60, close: 21 * 60 },
  { day: "Dienstag",   open: null,    close: null },   // Geschlossen
  { day: "Mittwoch",   open: 11 * 60, close: 21 * 60 },
  { day: "Donnerstag", open: 11 * 60, close: 21 * 60 },
  { day: "Freitag",    open: 11 * 60, close: 21 * 60 },
  { day: "Samstag",    open: 12 * 60, close: 21 * 60 },
];

const SAUCES = [
  { name: "Knoblauch-Joghurt", note: "cremig, frisch, der Klassiker" },
  { name: "Scharfe Harissa",   note: "Chili-Paprika mit Kick" },
  { name: "Kräuter-Curry",     note: "mild-würzig, hausgemacht" },
  { name: "Cocktail",          note: "fruchtig & rund" },
  { name: "Mango-Habanero",    note: "süß trifft scharf" },
];

const MENU = [
  {
    id: "doener",
    label: "Döner",
    items: [
      { name: "Döner Klassik",  price: "6,00", desc: "Kalbfleisch, frischer Salat, Tomate, Zwiebel, Sauce nach Wahl.", tag: "Beliebt" },
      { name: "Döner Spezial",  price: "7,50", desc: "Extra Fleisch, zwei Spezialsaucen, Käse — der ganz Große.", tag: "Empfehlung" },
      { name: "Hähnchen Döner", price: "6,00", desc: "Saftiges Hähnchenfleisch, Salat, Sauce nach Wahl." },
      { name: "Käse Döner",     price: "6,50", desc: "Mit geschmolzenem Käse überbacken." },
      { name: "Falafel Döner",  price: "5,50", desc: "Hausgemachte Falafel, Hummus, Salat.", tag: "Vegetarisch" },
    ],
  },
  {
    id: "duerum",
    label: "Dürüm",
    items: [
      { name: "Dürüm Döner",    price: "7,00", desc: "Kalbfleisch im dünnen Yufka-Fladen, Salat & Sauce." },
      { name: "Dürüm Hähnchen", price: "7,00", desc: "Hähnchenfleisch gerollt, frisch & saftig." },
      { name: "Dürüm Mix",      price: "7,50", desc: "Kalb & Hähnchen kombiniert.", tag: "Beliebt" },
      { name: "Dürüm Falafel",  price: "6,50", desc: "Falafel, Hummus, Salat — vegetarisch.", tag: "Vegetarisch" },
    ],
  },
  {
    id: "lahmacun",
    label: "Lahmacun",
    items: [
      { name: "Lahmacun pur",          price: "3,50", desc: "Türkische Pizza dünn ausgerollt, mit würzigem Hackfleisch." },
      { name: "Lahmacun mit Salat",    price: "5,50", desc: "Gerollt mit frischem Salat & Sauce." },
      { name: "Lahmacun mit Fleisch",  price: "6,50", desc: "Extra Dönerfleisch, Salat, Sauce.", tag: "Beliebt" },
    ],
  },
  {
    id: "beilagen",
    label: "Beilagen",
    items: [
      { name: "Pommes Frites",     price: "2,50", desc: "Knusprig, mit Ketchup oder Mayo." },
      { name: "Pommes Spezial",    price: "4,00", desc: "Mit Dönerfleisch, Käse & Sauce." },
      { name: "Falafel (5 Stk.)",  price: "3,50", desc: "Hausgemacht, mit Dip.", tag: "Vegetarisch" },
      { name: "Salat klein",       price: "3,50", desc: "Frische Blattsalate, Tomate, Gurke, Dressing." },
    ],
  },
  {
    id: "getraenke",
    label: "Getränke",
    items: [
      { name: "Ayran 0,25 l",                price: "1,50", desc: "Türkisches Joghurtgetränk." },
      { name: "Cola / Fanta / Sprite 0,33 l", price: "2,00", desc: "Eisgekühlt." },
      { name: "Eistee 0,33 l",               price: "2,00", desc: "Pfirsich oder Zitrone." },
      { name: "Wasser 0,5 l",                price: "1,50", desc: "Still oder sprudelnd." },
      { name: "Red Bull 0,25 l",             price: "2,50", desc: "Für den Extra-Schub." },
    ],
  },
];

const REVIEWS = [
  { text: "Bester Döner in Rheydt — die Spezialsaucen machen wirklich den Unterschied. Komme seit Jahren her.", name: "Marcel K.", meta: "Stammgast" },
  { text: "Klein, ehrlich, mega lecker. Fleisch immer frisch und das Personal richtig freundlich.",            name: "Aylin S.",  meta: "Google-Rezension" },
  { text: "Schnell, günstig und super sauber. Der Dürüm Spezial ist ein Traum.",                              name: "Tobias W.", meta: "Google-Rezension" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const fmtMin = (m) => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

// ─── Live opening status ────────────────────────────────────────────────────
function getStatus(now = new Date()) {
  const d = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = HOURS[d];
  const nextOpenDay = () => {
    for (let i = 1; i <= 7; i++) {
      const h = HOURS[(d + i) % 7];
      if (h.open != null) return h;
    }
    return null;
  };
  if (today.open != null && mins >= today.open && mins < today.close) {
    return { open: true, label: "Jetzt geöffnet", detail: "bis " + fmtMin(today.close) + " Uhr" };
  }
  if (today.open != null && mins < today.open) {
    return { open: false, label: "Heute geschlossen", detail: "öffnet um " + fmtMin(today.open) + " Uhr" };
  }
  const nx = nextOpenDay();
  return { open: false, label: "Gerade geschlossen", detail: nx ? "öffnet " + nx.day + " · " + fmtMin(nx.open) + " Uhr" : "" };
}

function applyStatus() {
  const s = getStatus();
  $$("[data-status-label]").forEach((el) => { el.textContent = s.label; });
  $$("[data-status-detail]").forEach((el) => { el.textContent = s.detail; });

  const heroPill = $("#hero-status");
  if (heroPill) heroPill.classList.toggle("closed", !s.open);

  const hoursPill = $("#hours-status");
  if (hoursPill) {
    hoursPill.style.color = s.open ? "#1f8a5b" : "var(--pink)";
    const dot = hoursPill.querySelector(".dot");
    if (dot) dot.style.background = s.open ? "#33d17a" : "#ff5a5a";
  }
}

// ─── Renderers ──────────────────────────────────────────────────────────────
function renderSauces() {
  const root = $("#sauce-grid");
  if (!root) return;
  root.innerHTML = SAUCES.map((s, i) => `
    <div class="sauce-card reveal" style="transition-delay:${i * 70}ms;">
      <div class="sauce-num">0${i + 1}</div>
      <h4>${escapeHtml(s.name)}</h4>
      <p>${escapeHtml(s.note)}</p>
    </div>
  `).join("");
}

let activeMenuId = MENU[0].id;
let _menuTabsWired = false;
function renderMenuTabs() {
  const root = $("#menu-tabs");
  if (!root) return;
  root.innerHTML = MENU.map((c) => `
    <button role="tab"
            class="menu-tab${c.id === activeMenuId ? " active" : ""}"
            aria-selected="${c.id === activeMenuId}"
            data-menu-tab="${c.id}">${escapeHtml(c.label)}</button>
  `).join("");
  // Wire delegation once — the parent #menu-tabs stays stable while we replace
  // its children, so a single listener handles every future click.
  if (!_menuTabsWired) {
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-menu-tab]");
      if (!btn) return;
      const next = btn.dataset.menuTab;
      if (next === activeMenuId) return;
      activeMenuId = next;
      renderMenuTabs();
      renderMenuList();
    });
    _menuTabsWired = true;
  }
}

function renderMenuList() {
  const root = $("#menu-list");
  const aside = $("#menu-aside-ph .ph-tag");
  if (!root) return;
  const cat = MENU.find((c) => c.id === activeMenuId);
  if (!cat) return;

  if (aside) aside.textContent = "Foto · " + cat.label;

  root.innerHTML = cat.items.map((it) => {
    const veg = it.tag === "Vegetarisch";
    return `
      <div class="menu-row">
        <div class="mr-main">
          <div class="mr-name">
            <h4>${escapeHtml(it.name)}</h4>
            ${it.tag ? `<span class="mr-tag${veg ? " veg" : ""}">${escapeHtml(it.tag)}</span>` : ""}
          </div>
          <p class="mr-desc">${escapeHtml(it.desc)}</p>
        </div>
        <span class="mr-dots"></span>
        <span class="mr-price">${escapeHtml(it.price)} €</span>
      </div>
    `;
  }).join("");
}

function renderHours() {
  const root = $("#hours-list");
  if (!root) return;
  const todayIdx = new Date().getDay();
  root.innerHTML = HOURS.map((h, i) => {
    const closed = h.open == null;
    const cls = "hours-row" + (i === todayIdx ? " today" : "") + (closed ? " closed-day" : "");
    const time = closed ? "Geschlossen" : fmtMin(h.open) + " – " + fmtMin(h.close) + " Uhr";
    return `<div class="${cls}"><span class="hr-day">${escapeHtml(h.day)}</span><span class="hr-time">${escapeHtml(time)}</span></div>`;
  }).join("");
}

function renderReviews() {
  const root = $("#reviews-grid");
  if (!root) return;
  root.innerHTML = REVIEWS.map((r, i) => `
    <div class="review-card reveal" style="transition-delay:${i * 90}ms;">
      <div class="rc-stars">★★★★★</div>
      <p>„${escapeHtml(r.text)}“</p>
      <div class="rc-who">
        <span class="rc-av">${escapeHtml(r.name.charAt(0))}</span>
        <span>
          <span class="rc-name">${escapeHtml(r.name)}</span><br />
          <span class="rc-meta">${escapeHtml(r.meta)}</span>
        </span>
      </div>
    </div>
  `).join("");
}

// ─── Interactive: nav, mobile menu, scroll reveals ──────────────────────────
function initNavScroll() {
  const nav = $("#nav");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileMenu() {
  const menu = $("#mobile-menu");
  const burger = $("#burger");
  const close = $("#mm-close");
  if (!menu || !burger || !close) return;

  const open = () => {
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const shut = () => {
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", open);
  close.addEventListener("click", shut);
  $$("[data-mm-link]", menu).forEach((a) => a.addEventListener("click", shut));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) shut();
  });
}

function initReveals() {
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
}

function setFooterYear() {
  const el = $("#ft-year");
  if (el) el.textContent = String(new Date().getFullYear());
}

// ─── Boot ───────────────────────────────────────────────────────────────────
function init() {
  renderSauces();
  renderMenuTabs();
  renderMenuList();
  renderHours();
  renderReviews();
  applyStatus();
  // refresh the live status every minute so it stays accurate on long sessions
  setInterval(applyStatus, 60_000);

  initNavScroll();
  initMobileMenu();
  initReveals();
  setFooterYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
