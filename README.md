# Lisa Wilberg Helmen — art

Separate static art portfolio, intended for Cloudflare Pages and later art.helmen.no.
It contains 20 explicitly labelled placeholder slots; no actual artwork or artist biography has been invented.

## Files
- index.html: presentation, gallery, artist section and contact placeholder.
- artworks.js: 20 entries ready for actual photos, titles, medium and dimensions.
- styles.css: responsive styling.
- app.js: gallery size control, accessible image dialog and keyboard navigation.

## Cloudflare Pages setup
Git repository: morganhelmen/art
Production branch: main
Framework preset: None
Build command: exit 0
Build output directory: /
Root directory: leave empty/default.

Use the temporary pages.dev address first. No domain/DNS changes are required.
Later attach art.helmen.no as a custom domain on this Pages project.

## Completing the gallery
Add real artwork images under assets/ and update image/title/medium/dimensions in artworks.js.
Replace the biography placeholder only with supplied facts.
The contact section intentionally has no email or form until Lisa's preferred contact details are supplied.
The site has noindex while it contains placeholders. Remove the robots noindex meta and X-Robots-Tag header when the actual gallery is ready for search engines.

No ATV files or configuration are used.
