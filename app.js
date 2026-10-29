(() => {
  const works = window.ARTWORKS || [];
  const grid = document.getElementById("artworks");
  const dialog = document.getElementById("artDialog");
  const palettes = new Set(["clay","sage","sand","rose","blue","linen"]);
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
    label.textContent = "Bilde kommer";
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
    document.getElementById("dialogTitle").textContent = work.title;
    document.getElementById("dialogStatus").textContent = work.image ? "Maleri" : "Plassholder";
    document.getElementById("dialogDescription").textContent = work.description || (work.image ? "Malt av Lisa Wilberg Helmen." : "Her kommer et maleri av Lisa Wilberg Helmen. Tittel, teknikk og mål legges til sammen med bildet.");
    document.getElementById("dialogArt").replaceChildren(artworkVisual(work, selected));
    const details = document.getElementById("dialogMetadata");
    details.replaceChildren();
    for (const [label,value] of [["Teknikk",work.medium],["Mål",work.dimensions],["År",work.year]]) {
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
    button.setAttribute("aria-label", "Se " + work.title + (work.image ? "" : " – plassholder"));
    const image = document.createElement("span");
    image.className = "art-image";
    image.append(artworkVisual(work,index));
    const caption = document.createElement("span"), title = document.createElement("span"), arrow = document.createElement("span"), meta = document.createElement("span");
    caption.className = "art-caption";
    title.className = "art-title";
    title.textContent = work.title;
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
  const menu = document.querySelector(".mobile-menu");
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("click", event => { if (!menu.contains(event.target)) menu.open = false; });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary").focus(); }
  });
})();
