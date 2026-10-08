# Prime AgriFuture Nigeria Limited — Website

A single-page, responsive company website. No build step or framework — just static files.

## Files
- `index.html` — public marketing site (all sections)
- `styles.css` — public site styling (brand green + gold palette, responsive)
- `script.js` — mobile menu, scroll animations, animated stats, contact form
- `assets/` — logos (transparent PNGs) and favicon
- `server.js` — optional tiny local preview server (Node)

### Partner Portal (login-protected farm management)
- `portal.html` / `portal.css` / `portal.js` — the partner & founder portal:
  login + dashboard for **livestock, feed, births, and a daily activity log**.
- `firebase-config.js` — paste your Firebase project keys here to go live.
- `firestore.rules` — database security rules (signed-in users only).
- `FIREBASE_SETUP.md` — step-by-step guide to connect the shared cloud (~10 min).

Until Firebase is configured the portal runs in **Demo mode** (records saved only
in the current browser). Demo login: `demo@paf.ng` / `demo1234`.

## View it locally
Open `index.html` directly in a browser, **or** run the preview server:

```bash
node server.js
```

Then visit http://localhost:4317

## Publish it (free options)
Because it's plain static files, you can host it anywhere:
- **Netlify / Vercel / Cloudflare Pages** — drag the folder in, or connect a repo. Free tier, custom domain supported.
- **GitHub Pages** — push the folder to a repo and enable Pages.
- **Any web host / cPanel** — upload the folder's contents to `public_html`.

## Contact form
The form currently opens the visitor's email app, pre-addressed to
`primeagrifuturefarms@gmail.com` (works with zero backend). To receive messages
as proper form submissions instead, connect a free service like **Formspree**
or **Netlify Forms** — ask and I'll wire it up.

## Editing content
All text lives in `index.html` in plain, labelled sections (About, What We Do,
Our Model, Impact, Leadership, Contact). Edit the text between the tags; no code
knowledge needed for copy changes.
