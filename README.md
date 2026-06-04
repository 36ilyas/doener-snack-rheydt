# Döner Snack — Rheydt

Single-Page-Website für **Döner Snack** an der Friedensstraße 2, Mönchengladbach-Rheydt.

🌐 **Live:** https://36ilyas.github.io/doener-snack-rheydt/

## Über

Statische Vanilla-Site (HTML + CSS + JS, keine Build-Tools, keine Dependencies). Mobile-first, voll responsive.

**Features**

- Sticky-Nav mit Mobile-Burger-Menü
- Live-Öffnungsstatus (rechnet Mo–So inkl. Dienstag-Ruhetag)
- Speisekarte mit Kategorie-Tabs (Döner, Dürüm, Lahmacun, Beilagen, Getränke)
- Heutiger Tag in Öffnungszeiten automatisch hervorgehoben
- Eingebettete Google-Maps-Karte + Routen-Link
- Click-to-Call überall
- Scroll-Reveal-Animationen (respektiert `prefers-reduced-motion`)

## Struktur

```
.
├── index.html            ← Markup
├── styles.css            ← Design-System (Farben, Typo, Layout)
├── script.js             ← Interaktivität + Datenobjekte
└── assets/
    └── hero-storefront.jpg
```

## Inhalte ändern

Saucen, Speisekarte, Bewertungen und Shop-Infos liegen alle als JS-Objekte ganz oben in [`script.js`](./script.js) (`SHOP`, `HOURS`, `SAUCES`, `MENU`, `REVIEWS`) — einfach dort editieren.

## Lokal testen

Wegen des Google-Maps-iframes am besten über einen lokalen Server:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Lizenz

Privat — alle Rechte beim Inhaber von Döner Snack.
