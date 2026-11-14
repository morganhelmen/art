(() => {
  const works = window.ARTWORKS || [];
  if (window.location.pathname.startsWith("/es/")) { document.querySelector(".artist-link")?.replaceChildren("Sobre la artista ", Object.assign(document.createElement("span"), { "aria-hidden": "true", textContent: "↓" })); }
  if (window.location.pathname.startsWith("/id/")) { document.querySelector(".artist-link")?.replaceChildren("Tentang seniman ", Object.assign(document.createElement("span"), { "aria-hidden": "true", textContent: "↓" })); }
  const grid = document.getElementById("artworks");
  const dialog = document.getElementById("artDialog");
  const palettes = new Set(["clay","sage","sand","rose","blue","linen"]);
  const params = new URLSearchParams(window.location.search);
  const isEnglish = params.get("lang") === "en" || window.location.pathname.startsWith("/en/");
  const isSpanish = window.location.pathname.startsWith("/es/");
  const isIndonesian = window.location.pathname.startsWith("/id/");
  document.documentElement.lang = isIndonesian ? "id" : isSpanish ? "es" : (isEnglish ? "en" : "nb");
  const copy = isIndonesian ? {
    coming: "Gambar segera hadir", sold: "TERJUAL", placeholder: "Karya ", artwork: "Karya",
    artworkLabel: "Lihat ", placeholderSuffix: " – segera hadir", painting: "Lukisan",
    placeholderStatus: "Segera hadir", artist: "Dilukis oleh Lisa Wilberg Helmen.",
    placeholderDescription: "Lukisan karya Lisa Wilberg Helmen akan ditampilkan di sini. Judul, media, dan ukuran akan ditambahkan bersama gambar.",
    medium: "Media", dimensions: "Ukuran", year: "Tahun", placeholderMeta: "SEGERA HADIR",
    previous: "Sebelumnya", next: "Berikutnya"
  } : isSpanish ? {
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
  const idTitles = {"Gullgruve":"Tambang Emas","Sjelevenner":"Belahan Jiwa","Glød (Lyser i mørket)":"Cahaya (Bersinar dalam Gelap)","Tullehund":"Anjing Lucu","Lyras Arr":"Bekas Luka Lyra","Bestemor":"Nenek","Soloppgang":"Matahari Terbit","Gammern Casper":"Casper si Tua","Lyra i Alpene":"Lyra di Pegunungan Alpen","El Rey Pan":"Raja Pan","Skogsfae":"Peri Hutan","Mors Vrede":"Amarah Ibu","Lyra i Oldemors Hage":"Lyra di Taman Buyut","Følelser":"Perasaan","Aketur":"Perjalanan Kereta Luncur","Lysning i Mørket":"Terang dalam Kegelapan","God Natt":"Selamat Malam","Hører Sammen":"Saling Melengkapi","Bebin og Gammern":"Bebin dan Gammern","Jentene Våre":"Putri-Putri Kami","Julevalpen Pan":"Anak Anjing Natal Pan","Kong Herodes":"Raja Herodes","Mona Lisa-kopi":"Salinan Mona Lisa","Dansende Par":"Pasangan Menari","Sommerflørt":"Godaan Musim Panas"};
  const idMedia = {"Akryl":"Akrilik","Oljemaling":"Cat minyak","Oljemaling (fingermalt)":"Cat minyak (dilukis dengan jari)","Akryl (miniatyr)":"Akrilik (miniatur)","Blekk":"Tinta","Blekk og akvarell":"Tinta dan cat air"};
  const titleFor = work => isIndonesian ? (idTitles[work.title] || work.title) : isSpanish ? (work.titleEs || work.title) : isEnglish ? (work.titleEn || work.title) : work.title;
  const mediumFor = work => isIndonesian ? (idMedia[work.medium] || work.medium) : isSpanish ? (work.mediumEs || work.medium) : isEnglish ? (work.mediumEn || work.medium) : work.medium;
  let selected = 0;
  let imageIndex = 0;
  let opener = null;
  const number = value => String(value + 1).padStart(2, "0");
  function artworkVisual(work, index) {
    if (work.image) {
      const img = document.createElement("img");
      img.src = work.image;
      img.alt = isIndonesian ? titleFor(work) + " – lukisan karya Lisa Wilberg Helmen" : isSpanish
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
    img.alt = titleFor(work) + " – " + (isIndonesian ? "lukisan karya Lisa Wilberg Helmen" : isEnglish ? "painting by Lisa Wilberg Helmen" : isSpanish ? "pintura de Lisa Wilberg Helmen" : "maleri av Lisa Wilberg Helmen");
    img.loading = "eager"; img.decoding = "async";
    dialogArt.append(img);
    if (sources.length > 1) {
      const controls = document.createElement("div"); controls.className = "artwork-image-controls";
      const previous = document.createElement("button"); previous.type = "button"; previous.textContent = "←";
      previous.setAttribute("aria-label", isIndonesian ? "Gambar sebelumnya" : isEnglish ? "Previous image" : isSpanish ? "Imagen anterior" : "Forrige bilde");
      const count = document.createElement("span");
      const next = document.createElement("button"); next.type = "button"; next.textContent = "→";
      next.setAttribute("aria-label", isIndonesian ? "Gambar berikutnya" : isEnglish ? "Next image" : isSpanish ? "Imagen siguiente" : "Neste bilde");
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
    document.getElementById("dialogTitle").textContent = work.title.startsWith("Verk ") && (isEnglish || isIndonesian) ? copy.placeholder + number(selected) : titleFor(work);
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
    meta.textContent = work.image ? [mediumFor(work),work.dimensions].filter(Boolean).join(" · ") : (isIndonesian ? "SEGERA HADIR" : isEnglish ? "PLACEHOLDER" : isSpanish ? "PRÓXIMAMENTE" : "PLASSHOLDER");
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
      ['.desktop-nav a[href="#galleri"]', 'Gallery'],
      ['.desktop-nav a[href="#om"]', 'About Lisa'],
      ['.desktop-nav a[href="#kontakt"]', 'Contact'],
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


  if (isIndonesian) {
    const translations = [
      ['.skip-link','Lewati ke galeri'],
      ['.desktop-nav a[href="#gallery"]','Galeri'],
      ['.desktop-nav a[href="#about"]','Tentang Lisa'],
      ['.desktop-nav a[href="#contact"]','Kontak'],
      ['.desktop-nav a[href="#guestbook"]','Buku Tamu'],
      ['.mobile-menu nav a[href="#gallery"]','Galeri'],
      ['.mobile-menu nav a[href="#about"]','Tentang Lisa'],
      ['.mobile-menu nav a[href="#contact"]','Kontak'],
      ['.mobile-menu nav a[href="#guestbook"]','Buku Tamu'],
      ['.mobile-menu summary','Menu <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 8h16M4 16h16"/></svg>'],
      ['.hero-copy .eyebrow','<span class="little-line"></span> GALERI DIGITAL'],
      ['#peek-title','Sedikit <em>intipan.</em>'],
      ['.peek-heading .eyebrow','MOMEN PILIHAN'],
      ['.peek-heading > p:last-child','Beberapa momen yang ingin saya bagikan.'],
      ['.gallery-heading .eyebrow','GALERI'],
      ['.gallery-toolbar p','<span class="small-dot"></span> <span id="workCount">'+works.length+'</span> karya di galeri'],
      ['.view-options [data-view="grid"] span','Tampilan kisi'],
      ['.view-options [data-view="large"] span','Lebih besar'],
      ['.gallery-footnote','Judul, gambar, dan detail karya akan ditambahkan secara bertahap.'],
      ['.about-copy .eyebrow','TENTANG SENIMAN'],
      ['.about-copy .about-lead','Nama saya Lisa, berusia 36 tahun, dan tinggal di Frognes, Hokksund, bersama tunangan, anak-anak, dan anjing kami, Pan.'],
      ['.about-copy .about-story-1','Saya telah mencintai seni sejak yang dapat saya ingat. Ketertarikan saya pada melukis, menggambar, dan berkarya dengan berbagai bahan telah menemani setiap tahap kehidupan saya. Saya senang mengeksplorasi beragam ekspresi dan teknik, serta selalu ingin tahu hal baru yang dapat saya pelajari dan ciptakan.'],
      ['.about-copy .about-story-2','Banyak hal yang saya ketahui tentang melukis saya pelajari dari nenek saya, yang potretnya juga dapat Anda lihat di galeri. Beliau tidak pernah takut menyampaikan pendapat, sehingga menjadi kritikus terbaik dan mungkin paling jujur bagi saya. Beliau sangat berarti dalam perkembangan saya sebagai seniman.'],
      ['.about-copy .about-story-3','Saya telah membuat beberapa lukisan berdasarkan pesanan dan mendapat kesempatan untuk memamerkan serta menjual karya, antara lain di Ormåsen dan dalam acara Kunst Rundt Elva 2026.'],
      ['.about-copy .about-story-4','Salah satu impian terbesar saya adalah memiliki studio dan galeri sendiri suatu hari nanti. Sebuah tempat untuk berkarya, menjelajahi teknik baru, serta berbagi kegembiraan menciptakan seni dengan orang lain melalui lokakarya dan kursus berbagai bentuk seni.'],
      ['.contact-inner .eyebrow','KONTAK'],
      ['.contact-copy p','Apakah Anda memiliki pertanyaan tentang lukisan atau ingin membicarakan karya tertentu? Kirimkan pesan melalui formulir ini dan saya akan menghubungi Anda kembali.'],
      ['.guestbook-heading .eyebrow','BUKU TAMU'],
      ['.guestbook-heading > p:last-child','Punya pendapat tentang karya seni, saran, atau beberapa kata yang ingin dibagikan? Saya senang mendengarnya. Pesan yang disetujui akan ditampilkan di buku tamu ini.'],
      ['.guestbook-note:nth-child(1) .guestbook-entry > p:first-child','Aku sangat bangga padamu dan semua lukisan indahmu! Tidak sabar ingin melihat lebih banyak karyamu ❤️'],
      ['.guestbook-note:nth-child(2) .guestbook-entry > p:first-child','Aku suka ini! 🔥'],
      ['.guestbook-note:nth-child(3) .guestbook-entry > p:first-child','Aku sangat bangga padamu, kamu sangat berbakat. Lukisanmu indah. Sayang kamu 🥰♥️'],
      ['.guestbook-note:nth-child(4) .guestbook-entry > p:first-child','Semoga sukses<br>Semoga semua harapanmu terwujud ❤️'],
      ['.donation-box .eyebrow','DUKUNG SENI'],
      ['#donation-title','Dukung karya seni saya'],
      ['.donation-box > p:not(.eyebrow):not(.donation-thanks)','Menyukai karya seni saya? Donasi kecil membantu saya membeli bahan, mengeksplorasi ide baru, dan terus berkarya. Setiap kontribusi sangat berarti. 💜 Ingin menerima hadiah kecil atau cetakan karya sebagai ucapan terima kasih? Kirimkan informasi kontak Anda dan kita bisa mengaturnya. ❤️'],
      ['.donation-thanks','Terima kasih atas dukungan Anda!'],
      ['.site-footer p','Lukisan · Galeri sedang dikembangkan'],
      ['.back-top','Kembali ke atas ↑'],
      ['.keyboard-help','Gunakan tombol panah untuk menjelajah']
    ];
    for (const [selector,value] of translations) { const element=document.querySelector(selector); if(element) element.innerHTML=value; }
    document.querySelector('.mobile-menu')?.setAttribute('aria-label','Menu seluler');
    document.querySelector('.mobile-menu nav')?.setAttribute('aria-label','Navigasi seluler');
    document.querySelector('.gallery-toolbar .view-options')?.setAttribute('aria-label','Ukuran gambar galeri');
    document.querySelector('.guestbook-form input[name="name"]')?.setAttribute('aria-label','Nama atau nama panggilan');
    document.querySelector('.close-dialog')?.setAttribute('aria-label','Tutup karya seni');
    document.getElementById('previousWork')?.setAttribute('aria-label','Karya sebelumnya');
    document.getElementById('nextWork')?.setAttribute('aria-label','Karya berikutnya');
    document.title='Galeri Helmen | Lukisan asli karya Lisa Wilberg Helmen';
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


  // Preview carousel: manual navigation and a five-second autoplay clock.
  const peekImages = Array.isArray(window.SNEAK_PEEK) ? window.SNEAK_PEEK.slice(0,11) : [];
  const peekArt = document.getElementById("peekArt");
  if (peekArt) {
    const count = peekImages.length || 11;
    let peekIndex = 0;
    let timer;
    let paused = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const current = document.getElementById("peekCurrent");
    const viewport = document.createElement("div");
    viewport.className = "peek-viewport";
    peekArt.replaceChildren(viewport);
    const makeSlide = index => {
      const slide = document.createElement("div");
      slide.className = "peek-slide";
      if (peekImages[index]) {
        const img = document.createElement("img");
        img.src = peekImages[index];
        img.alt = isIndonesian ? "Lukisan pilihan karya Lisa Wilberg Helmen" : isSpanish ? "Obra seleccionada de Lisa Wilberg Helmen" : isEnglish ? "Selected painting by Lisa Wilberg Helmen" : "Utvalgt maleri av Lisa Wilberg Helmen";
        img.decoding = "async";
        slide.append(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "peek-placeholder";
        const number = document.createElement("span");
        number.textContent = String(index + 1).padStart(2,"0");
        const label = document.createElement("small");
        label.textContent = isIndonesian ? "Gambar akan ditampilkan di sini" : isSpanish ? "Aquí aparecerá una imagen" : isEnglish ? "An image will go here" : "Et bilde kommer her";
        placeholder.append(number,label);
        slide.append(placeholder);
      }
      return slide;
    };
    let activeSlide = makeSlide(0);
    viewport.append(activeSlide);
    const renderPeek = (index, direction = 1) => {
      if (index === peekIndex) return;
      viewport.getAnimations({subtree:true}).forEach(animation => animation.cancel());
      const outgoing = activeSlide;
      viewport.replaceChildren(outgoing);
      activeSlide = makeSlide(index);
      viewport.append(activeSlide);
      peekIndex = index;
      if (!reducedMotion.matches && typeof activeSlide.animate === "function") {
        const options = {duration:500,easing:"ease-in-out"};
        outgoing.setAttribute("aria-hidden","true");
        outgoing.animate([{transform:"translateX(0)"},{transform:"translateX(" + (-direction * 100) + "%)"}],options);
        const incoming = activeSlide.animate([{transform:"translateX(" + (direction * 100) + "%)"},{transform:"translateX(0)"}],options);
        incoming.finished.then(() => outgoing.remove()).catch(() => {});
      } else outgoing.remove();
      current.textContent = String(peekIndex + 1).padStart(2,"0");
      // Warm the next image so automatic transitions do not wait for a download.
      if (peekImages[(peekIndex + 1) % count]) {
        const preload = new Image();
        preload.src = peekImages[(peekIndex + 1) % count];
      }
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!paused && !document.hidden && count > 1) {
        timer = setTimeout(() => { renderPeek((peekIndex + 1) % count); schedule(); },5000);
      }
    };
    const navigate = (index,direction) => { renderPeek(index,direction); schedule(); };
    document.getElementById("peekPrev").addEventListener("click",() => navigate((peekIndex + count - 1) % count,-1));
    document.getElementById("peekNext").addEventListener("click",() => navigate((peekIndex + 1) % count,1));
    current.textContent = "01";
    current.parentElement.lastElementChild.textContent = String(count).padStart(2,"0");
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "peek-autoplay";
    const updateToggle = () => {
      const label = paused
        ? (isIndonesian ? "Mulai tayangan" : isSpanish ? "Iniciar presentación" : isEnglish ? "Play slideshow" : "Start lysbildefremvisning")
        : (isIndonesian ? "Jeda tayangan" : isSpanish ? "Pausar presentación" : isEnglish ? "Pause slideshow" : "Pause lysbildefremvisning");
      toggle.setAttribute("aria-label",label);
      toggle.title = label;
      toggle.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">' +
        (paused ? '<path d="M8 5v14l11-7z"/>' : '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>') + '</svg>';
    };
    toggle.addEventListener("click",() => { paused = !paused; updateToggle(); schedule(); });
    document.getElementById("peekNext").before(toggle);
    updateToggle();
    document.addEventListener("visibilitychange",schedule);
    if (peekImages[1]) { const preload = new Image(); preload.src = peekImages[1]; }
    schedule();
  }

  const menu = document.querySelector(".mobile-menu");
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("click", event => { if (!menu.contains(event.target)) menu.open = false; });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary").focus(); }
  });
})();
