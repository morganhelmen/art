(() => {
  const works = window.ARTWORKS || [];
  if (window.location.pathname.startsWith("/es/")) { document.querySelector(".artist-link")?.replaceChildren("Sobre la artista ", Object.assign(document.createElement("span"), { "aria-hidden": "true", textContent: "↓" })); }
  const grid = document.getElementById("artworks");
  const dialog = document.getElementById("artDialog");
  const palettes = new Set(["clay","sage","sand","rose","blue","linen"]);
  const params = new URLSearchParams(window.location.search);
  const isEnglish = params.get("lang") === "en" || window.location.pathname.startsWith("/en/");
  const isSpanish = window.location.pathname.startsWith("/es/");
  document.documentElement.lang = isSpanish ? "es" : (isEnglish ? "en" : "nb");
  const copy = isSpanish ? {
    coming: "Imagen próximamente", sold: "VENDIDA", placeholder: "Obra ", artwork: "Obra",
    artworkLabel: "Ver ", placeholderSuffix: " – próximamente", painting: "Pintura",
    placeholderStatus: "Próximamente", artist: "Pintado por Lisa Wilberg Helmen.",
    placeholderDescription: "Aquí se mostrará una pintura de Lisa Wilberg Helmen. El título, la técnica y las dimensiones se añadirán junto con la imagen.",
    medium: "Técnica", dimensions: "Dimensiones", year: "Año", placeholderMeta: "PRÓXIMAMENTE",
    previous: "Anterior", next: "Siguiente"
  } : isEnglish ? {
    coming: "Image coming soon", sold: "SOLD", placeholder: "Artwork ", artwork: "Artwork",
    artworkLabel: "View ", placeholderSuffix: " – placeholder", painting: "Painting",
    placeholderStatus: "Placeholder", artist: "Painted by Lisa Wilberg Helmen.",
    placeholderDescription: "A painting by Lisa Wilberg Helmen will be displayed here. The title, medium and dimensions will be added with the image.",
    medium: "Medium", dimensions: "Dimensions", year: "Year", placeholderMeta: "PLACEHOLDER",
    previous: "Previous", next: "Next"
  } : {
    coming: "Bilde kommer", sold: "SOLGT", placeholder: "Verk ", artwork: "Verk",
    artworkLabel: "Se ", placeholderSuffix: " – plassholder", painting: "Maleri",
    placeholderStatus: "Plassholder", artist: "Malt av Lisa Wilberg Helmen.",
    placeholderDescription: "Her kommer et maleri av Lisa Wilberg Helmen. Tittel, teknikk og mål legges til sammen med bildet.",
    medium: "Teknikk", dimensions: "Mål", year: "År", placeholderMeta: "PLASSHOLDER",
    previous: "Forrige", next: "Neste"
  };
  const titleFor = work => isSpanish ? (work.titleEs || work.title) : isEnglish ? (work.titleEn || work.title) : work.title;
  const mediumFor = work => isSpanish ? (work.mediumEs || work.medium) : isEnglish ? (work.mediumEn || work.medium) : work.medium;
  let selected = 0;
  let imageIndex = 0;
  let opener = null;
  const number = value => String(value + 1).padStart(2, "0");
  function artworkVisual(work, index) {
    if (work.image) {
      const img = document.createElement("img");
      img.src = work.image;
      img.alt = isSpanish
        ? titleFor(work) + " – pintura de Lisa Wilberg Helmen"
        : isEnglish
          ? titleFor(work) + " – painting by Lisa Wilberg Helmen"
          : titleFor(work) + " – maleri av Lisa Wilberg Helmen";
      img.title = titleFor(work);
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
  function renderDialogArtwork(work, index) {
    const dialogArt = document.getElementById("dialogArt");
    const sources = Array.isArray(work.images) && work.images.length ? work.images : (work.image ? [work.image] : []);
    dialogArt.replaceChildren();
    if (!sources.length) { dialogArt.append(artworkVisual(work, index)); return; }
    const img = document.createElement("img");
    img.src = sources[imageIndex % sources.length];
    img.alt = titleFor(work) + " – " + (isEnglish ? "painting by Lisa Wilberg Helmen" : isSpanish ? "pintura de Lisa Wilberg Helmen" : "maleri av Lisa Wilberg Helmen");
    img.loading = "eager"; img.decoding = "async";
    dialogArt.append(img);
    if (sources.length > 1) {
      const controls = document.createElement("div"); controls.className = "artwork-image-controls";
      const previous = document.createElement("button"); previous.type = "button"; previous.textContent = "←";
      previous.setAttribute("aria-label", isEnglish ? "Previous image" : isSpanish ? "Imagen anterior" : "Forrige bilde");
      const count = document.createElement("span");
      const next = document.createElement("button"); next.type = "button"; next.textContent = "→";
      next.setAttribute("aria-label", isEnglish ? "Next image" : isSpanish ? "Imagen siguiente" : "Neste bilde");
      const refresh = () => { img.src = sources[imageIndex]; count.textContent = String(imageIndex+1).padStart(2,"0") + " / " + String(sources.length).padStart(2,"0"); };
      previous.addEventListener("click", () => { imageIndex = (imageIndex + sources.length - 1) % sources.length; refresh(); });
      next.addEventListener("click", () => { imageIndex = (imageIndex + 1) % sources.length; refresh(); });
      controls.append(previous,count,next); dialogArt.append(controls); refresh();
    }
  }
  function show(index) {
    selected = (index + works.length) % works.length;
    imageIndex = 0;
    const work = works[selected];
    document.getElementById("dialogIndex").textContent = number(selected) + " / " + works.length;
    document.getElementById("dialogTitle").textContent = work.title.startsWith("Verk ") && isEnglish ? copy.placeholder + number(selected) : titleFor(work);
    document.getElementById("dialogStatus").textContent = work.sold ? copy.sold : (work.image ? copy.painting : copy.placeholderStatus);
    document.getElementById("dialogDescription").textContent = work.description || (work.image ? copy.artist : copy.placeholderDescription);
    renderDialogArtwork(work, selected);
    if (work.sold) {
      const soldBadge = document.createElement("span");
      soldBadge.className = "sold-badge";
      soldBadge.textContent = copy.sold;
      dialogArt.append(soldBadge);
    }
    const details = document.getElementById("dialogMetadata");
    details.replaceChildren();
    for (const [label,value] of [[copy.medium,mediumFor(work)],[copy.dimensions,work.dimensions],[copy.year,work.year]]) {
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
    button.setAttribute("aria-label", (isEnglish ? copy.artworkLabel + (work.title.startsWith("Verk ") ? copy.placeholder + number(index) : titleFor(work)) : copy.artworkLabel + titleFor(work)) + (work.image ? "" : copy.placeholderSuffix));
    const image = document.createElement("span");
    image.className = "art-image";
    image.append(artworkVisual(work,index));
    if (work.sold) {
      const soldBadge = document.createElement("span");
      soldBadge.className = "sold-badge";
      soldBadge.textContent = copy.sold;
      image.append(soldBadge);
    }
    const caption = document.createElement("span"), title = document.createElement("span"), arrow = document.createElement("span"), meta = document.createElement("span");
    caption.className = "art-caption";
    title.className = "art-title";
    title.textContent = work.title.startsWith("Verk ") && isEnglish ? copy.placeholder + number(index) : titleFor(work);
    arrow.innerHTML = '<svg aria-hidden="true" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.2"><path d="m4 16 12-12M4 4h12v12"/></svg>';
    arrow.setAttribute("aria-hidden", "true");
    caption.append(title,arrow);
    meta.className = "art-meta";
    meta.textContent = work.image ? [mediumFor(work),work.dimensions].filter(Boolean).join(" · ") : (isEnglish ? "PLACEHOLDER" : isSpanish ? "PRÓXIMAMENTE" : "PLASSHOLDER");
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
      ['.desktop-nav a[href="#galleri"]', 'Gallery <span>27</span>'],
      ['.desktop-nav a[href="#om"]', 'About Lisa'],
      ['.desktop-nav a[href="#kontakt"]', 'Contact <span aria-hidden="true">↗</span>'],
      ['.mobile-menu summary', 'Menu <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 8h16M4 16h16"/></svg>'],
      ['.mobile-menu nav a[href="#galleri"]', 'Gallery'],
      ['.mobile-menu nav a[href="#om"]', 'About Lisa'],
      ['.mobile-menu nav a[href="#kontakt"]', 'Contact'],
      ['.signature small', 'PAINTINGS'],
      ['.scroll-nav a[href="#galleri"]', 'To the gallery'],
      ['.scroll-nav a[href="#om"]', 'About the artist'],
      ['.scroll-nav a[href="#topp"]', 'Back to top ↑'],
      ['.hero-copy .eyebrow', '<span class="little-line"></span> A DIGITAL GALLERY'],
      ['#hero-title', 'A space<br>for <em>paintings.</em>'],
      ['.hero-intro', 'By Lisa Wilberg Helmen.'],
      ['.hero-description', 'Welcome. A place where each painting can be seen, one at a time.'],
      ['.underlined-link:not(.artist-link)', 'Explore the gallery <span aria-hidden="true">↓</span>'],
      ['.artist-link', 'About the artist <span aria-hidden="true">↓</span>'],
      ['.hero-note p', 'The gallery is taking shape.<br>Artwork will be added soon. For now, these are placeholders.'],
      ['.hero-display', null],
      ['.display-caption span:first-child', 'A FIRST LOOK'],
      ['.display-footnote', '<span class="small-dot"></span> Placeholders · Original works will be added soon'],
      ['.gallery-heading .eyebrow', 'GALLERY'],
      ['#gallery-title', 'Room for twenty stories.'],
      ['.gallery-heading > p', 'A gallery waiting to be filled with my paintings.<br>Select an artwork to see it larger.'],
      ['.gallery-toolbar p', '<span class="small-dot"></span> <span id="workCount">' + works.length + '</span> spaces in the gallery'],
      ['.view-options', null],
      ['.view-options [data-view="grid"] span', 'Grid'],
      ['.view-options [data-view="large"] span', 'Larger'],
      ['.gallery-footnote', 'All items are placeholders. Titles, images and artwork details will be added over time.'],
      ['.about-copy .eyebrow', 'ABOUT THE ARTIST'],
      ['.about-copy .about-lead', "I'm Lisa, I'm 36, and I live in Frognes, Hokksund, with my fiancé, our children and our dog, Pan."],
      ['.about-copy .about-story-1', "I've loved art for as long as I can remember. My interest in painting, drawing and creating with many different materials has followed me through every stage of life. I enjoy exploring different forms of expression and techniques, and I'm always curious about what I can learn and create."],
      ['.about-copy .about-story-2', "Much of what I know about painting, I learned from my grandmother, whose portrait you can also see in the gallery. She was never afraid to speak her mind, which made her my best, and perhaps most honest, critic. She has meant a great deal to my development as an artist."],
      ['.about-copy .about-story-3', "I've painted several commissioned works and have also had the opportunity to exhibit and sell paintings, including at Ormåsen and Kunst Rundt Elva 2026."],
      ['.about-copy .about-story-4', "One of my biggest dreams is to have my own studio and gallery one day. A place where I can create, explore new techniques and share the joy of making art with others through workshops and courses in different art forms."],
      ['.contact-inner .eyebrow', 'CONTACT'],
      ['#contact-title', 'A painting<br>that <em>speaks to you?</em>'],
      ['.contact-copy p', 'Have a question about the paintings, or want to talk about a particular piece? Send me a message using the form and I’ll get back to you.'],
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


  if (isSpanish) {

    const spanishAbout = [
      ['.about-copy .eyebrow', 'SOBRE LA ARTISTA'],
      ['.about-copy .about-lead', 'Me llamo Lisa, tengo 36 años y vivo en Frognes, Hokksund, con mi prometido, nuestros hijos y nuestro perro, Pan.'],
      ['.about-copy .about-story-1', 'Me ha gustado el arte desde que tengo memoria. Mi interés por la pintura, el dibujo y la creación con materiales muy diversos me ha acompañado en todas las etapas de mi vida. Me gusta explorar distintas formas de expresión y técnicas, y siempre tengo curiosidad por aprender y crear cosas nuevas.'],
      ['.about-copy .about-story-2', 'Gran parte de lo que sé sobre pintura lo aprendí de mi abuela, cuyo retrato también puedes ver en la galería. Nunca tuvo miedo de decir lo que pensaba, por eso siempre fue mi mejor crítica y, quizá, la más sincera. Ha sido muy importante para mi desarrollo como artista.'],
      ['.about-copy .about-story-3', 'He realizado varias obras por encargo y también he tenido la oportunidad de exponer y vender cuadros, entre otros lugares en Ormåsen y durante Kunst Rundt Elva 2026.'],
      ['.about-copy .about-story-4', 'Uno de mis grandes sueños es tener algún día mi propio taller y galería. Un lugar donde pueda crear, explorar nuevas técnicas y compartir con otras personas la alegría de crear mediante talleres y cursos de distintas disciplinas artísticas.']
    ];
    for (const [selector, value] of spanishAbout) {
      const element = document.querySelector(selector);
      if (element) element.textContent = value;
    }
    document.querySelector('.about-section')?.setAttribute('aria-label', 'Sobre Lisa');
    const scrollNav = document.querySelector('.scroll-nav');
    if (scrollNav) {
      scrollNav.setAttribute('aria-label', 'Navegación rápida');
      const links = scrollNav.querySelectorAll('a');
      if (links[0]) links[0].textContent = 'Ir a la galería';
      if (links[1]) links[1].textContent = 'Sobre la artista';
      if (links[2]) links[2].textContent = 'Volver arriba ↑';
    }
  }


  // Independent eleven-image preview carousel. Add image URLs in slideshow.js.
  const peekImages = Array.isArray(window.SNEAK_PEEK) ? window.SNEAK_PEEK.slice(0,11) : [];
  const peekArt = document.getElementById("peekArt");
  if (peekArt) {
    let peekIndex = 0;
    const dots = document.getElementById("peekDots");
    const current = document.getElementById("peekCurrent");
    const renderPeek = () => {
      const src = peekImages[peekIndex];
      peekArt.replaceChildren();
      if (src) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = isSpanish ? "Obra seleccionada de Lisa Wilberg Helmen" : isEnglish ? "Selected painting by Lisa Wilberg Helmen" : "Utvalgt maleri av Lisa Wilberg Helmen";
        img.loading = "lazy"; img.decoding = "async"; peekArt.append(img);
      } else {
        const placeholder = document.createElement("div"); placeholder.className = "peek-placeholder";
        const number = document.createElement("span"); number.textContent = String(peekIndex+1).padStart(2,"0");
        const label = document.createElement("small");
        label.textContent = isSpanish ? "Aquí aparecerá una imagen" : isEnglish ? "An image will go here" : "Et bilde kommer her";
        placeholder.append(number,label); peekArt.append(placeholder);
      }
      current.textContent = String(peekIndex+1).padStart(2,"0");
      dots.querySelectorAll("button").forEach((dot,i)=>dot.setAttribute("aria-current",String(i===peekIndex)));
    };
    for(let i=0;i<11;i++){const dot=document.createElement("button");dot.type="button";dot.setAttribute("aria-label",(isSpanish?"Imagen ":isEnglish?"Image ":"Bilde ")+(i+1));dot.addEventListener("click",()=>{peekIndex=i;renderPeek();});dots.append(dot);}
    document.getElementById("peekPrev").addEventListener("click",()=>{peekIndex=(peekIndex+10)%11;renderPeek();});
    document.getElementById("peekNext").addEventListener("click",()=>{peekIndex=(peekIndex+1)%11;renderPeek();});
    renderPeek();
  }

  const menu = document.querySelector(".mobile-menu");
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("click", event => { if (!menu.contains(event.target)) menu.open = false; });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary").focus(); }
  });
})();
