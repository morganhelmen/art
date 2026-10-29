# Art portfolio

- This is the independent morganhelmen/art project for Lisa Wilberg Helmen's paintings.
- Deploy as a static-assets Cloudflare Worker named art from main, using wrangler.jsonc. Deploy command: npx wrangler deploy. Do not edit or deploy morganhelmen/atv for this project.
- Initially use the Worker's temporary workers.dev URL. art.helmen.no is deferred until requested.
- Buildless static HTML/CSS/JS; build command exit 0 or empty. Assets directory is the repository root; .assetsignore excludes internal documentation and configuration.
- There are 20 explicit placeholders in artworks.js, ready to replace with real images.
- Do not invent details of Lisa's biography, artwork titles, medium, size, prices or contact information.
- Contact details and biography are intentionally pending.
- Keep noindex until real content is ready and the user asks to make the gallery searchable.
