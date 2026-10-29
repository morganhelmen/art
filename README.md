# Lisa Wilberg Helmen — art

Separate static art portfolio, configured for Cloudflare Workers Static Assets and later art.helmen.no.
It contains 20 explicitly labelled placeholder slots; no actual artwork or artist biography has been invented.

## Files
- index.html: presentation, gallery, artist section and contact placeholder.
- artworks.js: 20 entries ready for actual photos, titles, medium and dimensions.
- styles.css: responsive styling.
- app.js: gallery size control, accessible image dialog and keyboard navigation.

## Cloudflare Workers setup
Git repository: morganhelmen/art
Production branch: main
Project/Worker name: art
Build command: exit 0 (or empty)
Deploy command: npx wrangler deploy
Root directory: leave empty/default.
Disable preview builds unless branch previews are needed.

wrangler.jsonc serves static assets from the repository root. .assetsignore excludes documentation, Git metadata and configuration from deployment.
Use the temporary workers.dev address first. No DNS changes are required.
Later attach art.helmen.no as a custom domain on this Worker.

## Completing the gallery
Add real artwork images under assets/ and update image/title/medium/dimensions in artworks.js.
Replace the biography placeholder only with supplied facts.
The contact section intentionally has no email or form until Lisa's preferred contact details are supplied.
The site has noindex while it contains placeholders. Remove the robots noindex meta and X-Robots-Tag header when the actual gallery is ready for search engines.

No ATV files or configuration are used.
