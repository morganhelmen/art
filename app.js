(() => {
  const works = window.ARTWORKS || [];
  const grid = document.getElementById("artworks");
  const dialog = document.getElementById("artDialog");
  const palettes = new Set(["clay","sage","sand","rose","blue","linen"]);
  const params = new URLSearchParams(window.location.search);
  const isEnglish = params.get("lang") === "en" || window.location.pathname.startsWith("/en/");
  const isSpanish = window.location.pathname.startsWith("/es/");
  document.documentElement.lang = isSpanish ? "es" : (isEnglish ? "en" : "nb");
  const copy = isSpanish ? {
    coming: "Imagen próximamente", placeholder: "Obra ", artwork: "Obra",
    artworkLabel: "Ver ", placeholderSuffix: " – próximamente", painting: "Pintura",
    placeholderStatus: "Próximamente", artist: "Pintado por Lisa Wilberg Helmen.",
    placeholderDescription: "Aquí se mostrará una pintura de Lisa Wilberg Helmen. El título, la técnica y las dimensiones se añadirán junto con la imagen.",
    medium: "Técnica", dimensions: "Dimensiones", year: "Año", placeholderMeta: "PRÓXIMAMENTE",
    previous: "Anterior", next: "Siguiente"
  } : isEnglish ? {
    coming: "Image coming soon", placeholder: "Artwork ", artwork: "Artwork",
    artworkLabel: "View ", placeholderSuffix: " – placeholder", painting: "Painting",
    placeholderStatus: "Placeholder", artist: "Painted by Lisa Wilberg Helmen.",
    placeholderDescription: "A painting by Lisa Wilberg Helmen will be displayed here. The title, medium and dimensions will be added with the image.",
    medium: "Medium", dimensions: "Dimensions", year: "Year", placeholderMeta: "PLACEHOLDER",
    previous: "Previous", next: "Next"
  } : {
    coming: "Bilde kommer", placeholder: "Verk ", artwork: "Verk",
    artworkLabel: "Se ", placeholderSuffix: " – plassholder", painting: "Maleri",
    placeholderStatus: "Plassholder", artist: "Malt av Lisa Wilberg Helmen.",
    placeholderDescription: "Her kommer et maleri av Lisa Wilberg Helmen. Tittel, teknikk og mål legges til sammen med bildet.",
    medium: "Teknikk", dimensions: "Mål", year: "År", placeholderMeta: "PLASSHOLDER",
    previous: "Forrige", next: "Neste"
  };
  let selected = 0;
  let opener = null;
  const number = value => String(value + 1).padStart(2, "0");
  function artworkVisual(work, index) {
    if (work.image) {
      const img = document.createElement("img");
      img.src = work.image;
      img.alt = work.title;
      img.loading = "lazy";
      img.decoding = "async";
      return img;
    }
    const surface = document.createElement("div");
    surface.className = "placeholder-surface palette-" + (palettes.has(work.palette) ? work.palette : "linen");
    const center = document.createElement("div");
    center.className = "placeholder-center";
    const symbol = document.createElement("span");
    symbol.className = "image-symbol";
    symbol.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = copy.coming;
    center.append(symbol, label);
    const mark = document.createElement("span");
    mark.className = "placeholder-mark";
    mark.textContent = number(index);
    surface.append(center, mark);
    return surface;
  }
  function show(index) {
    selected = (index + works.length) % works.length;
    const work = works[selected];
    document.getElementById("dialogIndex").textContent = number(selected) + " / " + works.length;
    document.getElementById("dialogTitle").textContent = work.title.startsWith("Verk ") && isEnglish ? copy.placeholder + number(selected) : work.title;
    document.getElementById("dialogStatus").textContent = work.image ? copy.painting : copy.placeholderStatus;
    document.getElementById("dialogDescription").textContent = work.description || (work.image ? copy.artist : copy.placeholderDescription);
    document.getElementById("dialogArt").replaceChildren(artworkVisual(work, selected));
    const details = document.getElementById("dialogMetadata");
    details.replaceChildren();
    for (const [label,value] of [[copy.medium,work.medium],[copy.dimensions,work.dimensions],[copy.year,work.year]]) {
      if (!value) continue;
      const row = document.createElement("div"), term = document.createElement("dt"), definition = document.createElement("dd");
      term.textContent = label;
      definition.textContent = value;
      row.append(term, definition);
      details.append(row);
    }
  }
  works.forEach((work,index) => {
    const article = document.createElement("article");
    article.className = "art-card";
    const button = document.createElement("button");
    button.className = "art-button";
    button.type = "button";
    button.setAttribute("aria-label", (isEnglish ? copy.artworkLabel + (work.title.startsWith("Verk ") ? copy.placeholder + number(index) : work.title) : copy.artworkLabel + work.title) + (work.image ? "" : copy.placeholderSuffix));
    const image = document.createElement("span");
    image.className = "art-image";
    image.append(artworkVisual(work,index));
    const caption = document.createElement("span"), title = document.createElement("span"), arrow = document.createElement("span"), meta = document.createElement("span");
    caption.className = "art-caption";
    title.className = "art-title";
    title.textContent = work.title.startsWith("Verk ") && isEnglish ? copy.placeholder + number(index) : work.title;
    arrow.innerHTML = '<svg aria-hidden="true" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.2"><path d="m4 16 12-12M4 4h12v12"/></svg>';
    arrow.setAttribute("aria-hidden", "true");
    caption.append(title,arrow);
    meta.className = "art-meta";
    meta.textContent = work.image ? [work.medium,work.dimensions].filter(Boolean).join(" · ") : "PLASSHOLDER";
    button.append(image,caption,meta);
    button.addEventListener("click", () => {
      opener = button;
      show(index);
      dialog.showModal();
      document.body.classList.add("dialog-open");
    });
    article.append(button);
    grid.append(article);
  });
  document.getElementById("workCount").textContent = works.length;
  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
    grid.classList.toggle("is-large", button.dataset.view === "large");
    document.querySelectorAll("[data-view]").forEach(other => other.setAttribute("aria-pressed", String(other === button)));
  }));
  document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    opener?.focus();
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  document.getElementById("previousWork").addEventListener("click", () => show(selected - 1));
  document.getElementById("nextWork").addEventListener("click", () => show(selected + 1));
  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); show(selected - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); show(selected + 1); }
  });

  if (isEnglish && !window.location.pathname.startsWith("/en/")) {
    const translations = [
      ['.skip-link', 'Skip to gallery'],
      ['.desktop-nav a[href="#galleri"]', 'Gallery <span>20</span>'],
      ['.desktop-nav a[href="#om"]', 'About Lisa'],
      ['.desktop-nav a[href="#kontakt"]', 'Contact <span aria-hidden="true">↗</span>'],
      ['.mobile-menu summary', 'Menu <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 8h16M4 16h16"/></svg>'],
      ['.mobile-menu nav a[href="#galleri"]', 'Gallery'],
      ['.mobile-menu nav a[href="#om"]', 'About Lisa'],
      ['.mobile-menu nav a[href="#kontakt"]', 'Contact'],
      ['.signature small', 'PAINTINGS'],
      ['.hero-copy .eyebrow', '<span class="little-line"></span> A DIGITAL GALLERY'],
      ['#hero-title', 'A space<br>for <em>paintings.</em>'],
      ['.hero-intro', 'By Lisa Wilberg Helmen.'],
      ['.hero-description', 'Welcome. A place where each painting can be seen, one at a time.'],
      ['.underlined-link', 'Explore the gallery <span aria-hidden="true">↓</span>'],
      ['.hero-note p', 'The gallery is taking shape.<br>Artwork will be added soon. For now, these are placeholders.'],
      ['.hero-display', null],
      ['.display-caption span:first-child', 'A FIRST LOOK'],
      ['.display-footnote', '<span class="small-dot"></span> Placeholders · Original works will be added soon'],
      ['.gallery-heading .eyebrow', 'GALLERY'],
      ['#gallery-title', 'Room for twenty stories.'],
      ['.gallery-heading > p', 'A gallery waiting to be filled with Lisa’s paintings.<br>Select an artwork to see it larger.'],
      ['.gallery-toolbar p', '<span class="small-dot"></span> <span id="workCount">' + works.length + '</span> spaces in the gallery'],
      ['.view-options', null],
      ['.view-options [data-view="grid"] span', 'Grid'],
      ['.view-options [data-view="large"] span', 'Larger'],
      ['.gallery-footnote', 'All items are placeholders. Titles, images and artwork details will be added over time.'],
      ['.about-copy .eyebrow', 'ABOUT THE ARTIST'],
      ['.about-copy .about-lead', 'A place for Lisa’s paintings.'],
      ['.about-copy p:not(.eyebrow):not(.about-lead)', 'A digital gallery where every artwork has a place of its own. A personal introduction to Lisa and her work will be added here.'],
      ['.about-copy .quiet-label', 'Artist introduction coming soon'],
      ['.contact-inner .eyebrow', 'CONTACT'],
      ['#contact-title', 'A painting<br>that <em>speaks to you?</em>'],
      ['.contact-copy p', 'Have a question about the paintings, or want to talk about a particular piece? Send Lisa an email.'],
      ['.site-footer p', 'Paintings · Gallery in progress'],
      ['.back-top', 'Back to top ↑'],
      ['.dialog-bar span:nth-child(2)', 'GALLERY'],
      ['#dialogStatus', 'Placeholder'],
      ['#previousWork', '← <span>Previous</span>'],
      ['#nextWork', '<span>Next</span> →'],
      ['.keyboard-help', 'Use the arrow keys to browse']
    ];
    for (const [selector, value] of translations) {
      if (value === null) continue;
      const element = document.querySelector(selector);
      if (element) element.innerHTML = value;
    }
    document.querySelector('.contact-email')?.setAttribute('href', 'mailto:lisa@helmen.no?subject=Artwork');
    document.querySelector('.mobile-menu')?.setAttribute('aria-label', 'Mobile menu');
    document.querySelector('.gallery-toolbar .view-options')?.setAttribute('aria-label', 'Gallery image size');
    document.querySelector('.gallery-toolbar p')?.setAttribute('aria-label', 'Spaces in the gallery');
    document.querySelector('.about-section')?.setAttribute('aria-label', 'About Lisa');
    document.querySelector('.hero-display')?.setAttribute('aria-label', 'Placeholders for upcoming paintings');
    document.querySelector('.close-dialog')?.setAttribute('aria-label', 'Close artwork');
    document.getElementById('previousWork')?.setAttribute('aria-label', 'Previous artwork');
    document.getElementById('nextWork')?.setAttribute('aria-label', 'Next artwork');
    document.querySelector('.mobile-menu nav')?.setAttribute('aria-label', 'Mobile navigation');
    document.title = 'Lisa Wilberg Helmen · Paintings';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Paintings by Lisa Wilberg Helmen. A digital gallery in the making.');
  }

  const menu = document.querySelector(".mobile-menu");
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("click", event => { if (!menu.contains(event.target)) menu.open = false; });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary").focus(); }
  });
})();
