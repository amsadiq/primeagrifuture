# Prime AgriFuture Nigeria Limited — Website

A single-page, responsive company website. No build step or framework — just static files.

## Files
- `index.html` — all page content and sections
- `styles.css` — styling (brand green + gold palette, fully responsive)
- `script.js` — mobile menu, scroll animations, animated stats, contact form
- `assets/` — logos (transparent PNGs) and favicon
- `server.js` — optional tiny local preview server (Node)

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
