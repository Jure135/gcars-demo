/* =========================================================
   G-Cars – zajednički JavaScript (header, footer, API, pomoćne funkcije)
   ========================================================= */
const GC = (() => {
  // Kontakt podaci – mijenjaju se samo ovdje, a prikazuju u headeru, izborniku, footeru, kontaktu i na vozilima
  const CONTACT = {
    phone: "+385 98 171 3505",
    phoneHref: "tel:+385981713505",
    mobile: "+385 98 171 3505",
    whatsapp: "https://wa.me/385981713505",
    email: "g.cars.hr@gmail.com",
    street: "Marka Kažotića 6",
    city: "21215 Kaštel Lukšić",
    country: "Hrvatska",
    // Radno vrijeme – prikazuje se u footeru, na početnoj, kontaktu i "O nama"
    hours: "Pon – Ned: 08:00 – 20:00",
    hoursNote: "i po dogovoru"
  };

  // Logo salona (slika): bijeli za tamne pozadine, tamni za svijetle
  const LOGO = { white: "img/logo-white.png?v=2", dark: "img/logo-dark.png?v=2" };   // ?v= mijenjati kad se logo promijeni
  const logoImg = (variant = "white", cls = "") =>
    `<img src="${LOGO[variant]}" alt="G-Cars" class="${cls}" width="800" height="198">`;

  // Video iz G-Cars salona (vertikalni, 9:16)
  const VIDEOS = {
    hero: "media/video/gcars-salon.mp4",
    heroPoster: "media/gcars/range-rover-velar.jpg"
  };

  const NAV = [
    { href: "index.html", label: "Početna" },
    { href: "about.html", label: "O nama" },
    { href: "collection.html", label: "Kolekcija" },
    { href: "recently-sold.html", label: "Nedavno prodano" },
    { href: "services.html", label: "Ekskluzivne usluge" },   // Komisijska prodaja maknuta iz izbornika (stranica i dalje postoji)
    { href: "contact.html", label: "Kontakt" }
  ];

  /* ---------- Pomoćne funkcije ---------- */
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  // Lokalne slike (media/...) vraćamo kakve jesu; vanjskim Unsplash URL-ovima dodajemo veličinu
  const img = (url, w = 1200) => url.startsWith("index.html") || url.includes("?") ? url : `${url}?auto=format&fit=crop&w=${w}&q=80`;
  const unsplash = id => `media/img/${id}.jpg`;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Prijevod (i18n.js): t("hrvatski tekst {param}", { param })
  const t = (key, params) => I18N.t(key, params);
  const isEn = I18N.lang === "en";
  const num = n => new Intl.NumberFormat(I18N.locale).format(n);
  const price = n => n == null ? t("Na upit") : `<span class="cur">€</span> ${num(n)}${isEn ? "" : ",-"}`;
  // Kilometraža 0 = podatak još nije upisan
  const km = n => n ? `${num(n)} km` : t("Na upit");
  const date = d => new Date(d).toLocaleDateString(I18N.locale, isEn
    ? { day: "numeric", month: "short", year: "numeric" }
    : { day: "2-digit", month: "2-digit", year: "numeric" });
  const param = k => new URLSearchParams(location.search).get(k);

  // DEMO verzija: podaci su snimka baze (data/db.json), obrasci se ne spremaju
  let DB;
  const loadDb = () => DB ??= fetch("data/db.json").then(r => r.json());
  async function api(path, options = {}) {
    const db = await loadDb();
    const L = db[I18N.lang] || db.hr;
    if (options.method && options.method !== "GET") return { ok: true, demo: true };
    const [route, qs = ""] = path.split("?");
    const q = new URLSearchParams(qs);
    const notFound = () => { const e = new Error("Nije pronađeno"); e.status = 404; throw e; };
    if (route === "brands") return L.brands;
    let m;
    if ((m = route.match(/^cars\/(\d+)$/))) return L.cars[m[1]] || notFound();
    if ((m = route.match(/^news\/(\d+)$/))) return L.news.find(n => n.id == m[1]) || notFound();
    if (route === "news") return q.get("limit") ? L.news.slice(0, +q.get("limit")) : L.news;
    if (route !== "cars") notFound();
    let cars = [...L.list];
    const has = k => q.get(k) != null && q.get(k) !== "";
    if (has("brand")) cars = cars.filter(c => c.brandSlug === q.get("brand"));
    if (has("fuel")) cars = cars.filter(c => c.fuel === q.get("fuel"));
    if (has("minPrice")) cars = cars.filter(c => c.price != null && c.price >= +q.get("minPrice"));
    if (has("maxPrice")) cars = cars.filter(c => c.price != null && c.price <= +q.get("maxPrice"));
    if (has("sold")) cars = cars.filter(c => c.isSold === (q.get("sold") === "true"));
    if (q.get("featured") === "true") cars = cars.filter(c => c.isFeatured);
    if (has("q")) {
      const s = q.get("q").trim().toLowerCase();
      const other = (I18N.lang === "en" ? db.hr : db.en).list;
      cars = cars.filter(c => {
        const o = other.find(x => x.id === c.id) || {};
        return [c.title, c.model, c.brand, c.color, o.title, o.color].some(v => v && v.toLowerCase().includes(s));
      });
    }
    const by = (f, dir = 1) => (a, b) => ((f(a) ?? -Infinity) > (f(b) ?? -Infinity) ? 1 : (f(a) ?? -Infinity) < (f(b) ?? -Infinity) ? -1 : 0) * dir;
    const sort = q.get("sort");
    if (sort === "price-asc") cars.sort(by(c => c.price));
    else if (sort === "price-desc") cars.sort(by(c => c.price, -1));
    else if (sort === "year-desc") cars.sort(by(c => c.year, -1));
    else if (sort === "mileage-asc") cars.sort(by(c => c.mileage));
    else if (sort === "brand") cars.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
    else if (q.get("sold") === "true") cars.sort(by(c => c.soldAt, -1));
    if (has("limit")) cars = cars.slice(0, +q.get("limit"));
    return cars;
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    const path = location.pathname === "index.html" ? "index.html" : location.pathname;
    const isActive = h => h === path ? "active" : "";
    const el = $("#gc-header");
    if (!el) return;
    el.outerHTML = `
    <header class="gc-header ${document.body.dataset.header === "solid" ? "solid" : ""}" id="gcHeader">
      <div class="container-fluid">
        <div class="gc-header-left">
          <button class="gc-burger" type="button" data-bs-toggle="offcanvas" data-bs-target="#gcMenu" aria-label="Otvori izbornik">
            <span></span><span></span><span></span>
          </button>
          <form class="gc-search" action="collection.html" role="search">
            <input type="search" name="q" placeholder="Pretraži..." aria-label="Pretraži vozila">
            <button type="submit" aria-label="Traži"><i class="bi bi-search"></i></button>
          </form>
          ${langSwitch()}
        </div>
        <!-- Glavna navigacija (desktop); na manjim ekranima ostaje bočni izbornik -->
        <nav class="gc-header-nav" aria-label="Glavna navigacija">
          ${NAV.map(n => `
            <div class="item ${n.sub ? "has-sub" : ""}">
              <a href="${n.href}" class="${isActive(n.href) || (n.sub?.some(s => isActive(s.href)) ? "active" : "")}">${n.label}${n.sub ? ` <i class="bi bi-chevron-down"></i>` : ""}</a>
              ${n.sub ? `<div class="sub">${n.sub.map(s => `<a href="${s.href}" class="${isActive(s.href)}">${s.label}</a>`).join("")}</div>` : ""}
            </div>`).join("")}
        </nav>
        <a href="index.html" class="gc-logo" aria-label="G-Cars početna">${logoImg("white")}</a>
      </div>
    </header>

    <div class="offcanvas offcanvas-start gc-menu" tabindex="-1" id="gcMenu" aria-labelledby="gcMenuLabel">
      <div class="offcanvas-header">
        <a href="index.html" class="gc-logo" id="gcMenuLabel" aria-label="G-Cars početna">${logoImg("white")}</a>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Zatvori"></button>
      </div>
      <div class="offcanvas-body">
        <!-- Tražilica u izborniku (na mobitelu je u headeru nema mjesta) -->
        <form class="gc-search gc-search-menu" action="collection.html" role="search">
          <input type="search" name="q" placeholder="Pretraži..." aria-label="Pretraži vozila">
          <button type="submit" aria-label="Traži"><i class="bi bi-search"></i></button>
        </form>
        <ul class="gc-menu-links">
          ${NAV.map(n => `
            <li>
              <a href="${n.href}" class="${isActive(n.href)}">${n.label} <i class="bi bi-arrow-right-short"></i></a>
              ${n.sub ? `<ul class="sub">${n.sub.map(s => `<li><a href="${s.href}">— ${s.label}</a></li>`).join("")}</ul>` : ""}
            </li>`).join("")}
        </ul>
        <div class="gc-menu-contact">
          <a href="${CONTACT.phoneHref}"><i class="bi bi-telephone"></i> ${CONTACT.phone}</a>
          <a href="${CONTACT.whatsapp}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> ${CONTACT.mobile}</a>
          <a href="mailto:${CONTACT.email}"><i class="bi bi-envelope"></i> ${CONTACT.email}</a>
          <div class="mt-4">${langSwitch("gc-lang-menu")}</div>
        </div>
      </div>
    </div>

    <div class="gc-side-contact">
      <a href="${CONTACT.phoneHref}" aria-label="Nazovite nas"><i class="bi bi-telephone"></i><span>${CONTACT.phone}</span></a>
      <a href="${CONTACT.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i><span>WhatsApp ${CONTACT.mobile}</span></a>
      <a href="mailto:${CONTACT.email}" aria-label="E-mail"><i class="bi bi-envelope"></i><span>${CONTACT.email}</span></a>
    </div>
    <button class="gc-to-top" id="gcToTop" aria-label="Na vrh"><i class="bi bi-arrow-up"></i></button>`;
  }

  /** Prekidač jezika HR | EN */
  function langSwitch(extraClass = "") {
    return `
      <div class="gc-lang ${extraClass}" role="group" aria-label="Jezik">
        ${["hr", "en"].map(l => `<button type="button" data-lang="${l}" class="${I18N.lang === l ? "active" : ""}" lang="${l}"
            aria-pressed="${I18N.lang === l}">${l.toUpperCase()}</button>`).join("")}
      </div>`;
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const el = $("#gc-footer");
    if (!el) return;
    el.outerHTML = `
    <footer class="gc-footer">
      <div class="container">
        <a href="index.html" class="gc-footer-logo" aria-label="G-Cars početna"><img src="img/logo-456-white.png?v=1" alt="G-Cars Auto salon" width="345" height="116"></a>

        <div class="row gy-5 gx-4">
          <!-- Poziv na kontakt -->
          <div class="col-lg-4 gc-footer-cta">
            <h3>Imate pitanja?</h3>
            <p>Želite saznati više o našim automobilima ili uslugama, ili želite probnu vožnju? Javite nam se. Naravno, uvijek ste dobrodošli u naš salon.</p>
            <div class="actions">
              <a href="contact.html" class="btn-gc btn-gc-tan">Kontakt</a>
              <a href="${CONTACT.whatsapp}" target="_blank" rel="noopener" class="btn-gc btn-gc-black"><i class="bi bi-whatsapp"></i> ${CONTACT.mobile}</a>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2">
            <h5>PONUDA</h5>
            <ul class="gc-footer-links">
              <li><a href="about.html">O nama</a></li>
              <li><a href="services.html">Ekskluzivne usluge</a></li>
              <li><a href="contact.html">Kontakt</a></li>
            </ul>
          </div>
          <div class="col-6 col-md-3 col-lg-2">
            <h5>OTKRIJTE</h5>
            <ul class="gc-footer-links">
              <li><a href="collection.html">Kolekcija</a></li>
              <li><a href="recently-sold.html">Nedavno prodano</a></li>
            </ul>
          </div>
          <div class="col-6 col-md-3 col-lg-2">
            <h5>SALON</h5>
            <div class="gc-footer-text">
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.street + ", " + CONTACT.city)}" target="_blank" rel="noopener">${CONTACT.street}<br>${CONTACT.city}<br>${CONTACT.country}</a><br>
              <a href="${CONTACT.phoneHref}">${CONTACT.phone}</a><br>
              <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
            </div>
          </div>
          <div class="col-6 col-md-3 col-lg-2">
            <h5>RADNO VRIJEME</h5>
            <div class="gc-footer-text">${CONTACT.hours}<br>${CONTACT.hoursNote}</div>
          </div>
        </div>
        <div class="gc-footer-bottom">
          <span>G-Cars © ${new Date().getFullYear()}</span>
          <a href="#">Uvjeti poslovanja</a>
          <a href="#">Privatnost</a>
          <a href="#">Impresum</a>
          <a href="#">Jamstvo</a>
          <a href="#" id="gcCookieSettings">Kolačići</a>
        </div>
      </div>
    </footer>

    <div class="gc-cookie" id="gcCookie" role="dialog" aria-live="polite">
      <h5>Ova stranica koristi kolačiće</h5>
      <p class="mb-0">Koristimo kolačiće kako bismo poboljšali vaše iskustvo. Možete prihvatiti sve ili samo nužne kolačiće.</p>
      <div class="actions">
        <button class="btn-gc btn-gc-dark" data-cookie="all">Prihvati sve</button>
        <button class="btn-gc btn-gc-outline-dark" data-cookie="necessary">Samo nužni</button>
      </div>
    </div>`;
  }

  /* ---------- Ponašanje ---------- */
  function initBehaviour() {
    const header = $("#gcHeader");
    const toTop = $("#gcToTop");
    // Header nema pozadinu: provjeri što je ispod njega pa prebaci na tamni tekst/logo iznad svijetlih dijelova
    const headerLogo = header?.querySelector(".gc-logo img");
    const isLightBehind = () => {
      const hr = header.getBoundingClientRect();
      const y = hr.top + hr.height / 2;
      let light = 0, dark = 0;
      for (const x of [innerWidth * .15, innerWidth * .5, innerWidth * .85]) {
        // svi slojevi ispod te točke, od gornjeg prema donjem; prvi neprozirni odlučuje
        let isLight = true;                                                   // body je bijeli
        for (const e of document.elementsFromPoint(x, y)) {
          if (header.contains(e) || e === document.documentElement || e === document.body) continue;
          const cs = getComputedStyle(e);
          if (cs.position === "fixed" || +cs.opacity === 0) continue;
          if (/^(IMG|VIDEO|CANVAS|IFRAME)$/.test(e.tagName) || cs.backgroundImage !== "none") { isLight = false; break; }   // slika/video = tamno
          const m = cs.backgroundColor.match(/[\d.]+/g);
          if (m && (m[3] === undefined || +m[3] > .5)) { isLight = (.299 * m[0] + .587 * m[1] + .114 * m[2]) > 160; break; }
        }
        isLight ? light++ : dark++;
      }
      return light > dark;
    };
    let lastLight = null;
    const updateHeaderTone = () => {
      if (!header) return;
      const light = isLightBehind();
      if (light === lastLight) return;
      lastLight = light;
      header.classList.toggle("on-light", light);
      if (headerLogo) headerLogo.src = light ? LOGO.dark : LOGO.white;
    };
    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle("scrolled", y > 60);
      updateHeaderTone();
      toTop?.classList.toggle("show", y > 600);
      $$(".gc-wide-img img").forEach(im => {
        const r = im.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) im.style.transform = `scale(1.08) translateY(${(r.top / innerHeight) * -30}px)`;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

    // Cookie banner
    const cookie = $("#gcCookie");
    let consent = null;
    try { consent = localStorage.getItem("gc-cookie"); } catch { }
    if (!consent) setTimeout(() => cookie?.classList.add("show"), 800);
    $$("[data-cookie]").forEach(b => b.addEventListener("click", () => {
      try { localStorage.setItem("gc-cookie", b.dataset.cookie); } catch { }
      cookie.classList.remove("show");
    }));
    $("#gcCookieSettings")?.addEventListener("click", e => { e.preventDefault(); cookie.classList.add("show"); });

    // Prekidač jezika
    $$("[data-lang]").forEach(b => b.addEventListener("click", () => I18N.setLang(b.dataset.lang)));

    initReveal();
  }

  function initReveal(root = document) {
    const els = $$(".reveal:not(.visible)", root);
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("visible")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }

  /* ---------- Kartica automobila ---------- */
  function carCard(c) {
    const energy = c.fuel === "Električni"
      ? t("Potrošnja: električni · CO₂: 0 g/km · Klasa: A")
      : t("Potrošnja: {c} l/100km (komb.) · CO₂: {co2} g/km · Klasa: {k}", { c: c.consumption ?? "–", co2: c.co2 ?? "–", k: c.co2Class ?? "–" });
    if (c.isSold) {
      return `
      <div class="reveal">
        <article class="gc-car-card sold">
          <div class="img"><img src="${img(c.mainImage, 900)}" alt="${esc(c.brand + " " + c.model)}" loading="lazy"></div>
          <div class="body">
            <div class="brand">${esc(c.title)}</div>
            <div class="mt-2"><span class="gc-sold-tag">${t("Prodano")}</span></div>
          </div>
        </article>
      </div>`;
    }
    return `
    <div class="reveal">
      <a href="car.html?id=${c.id}" class="gc-car-card">
        <div class="img">
          <img src="${img(c.mainImage, 900)}" alt="${esc(c.brand + " " + c.model)}" loading="lazy">
          ${c.isFeatured ? `<span class="badge-gc">${t("Novo")}</span>` : ""}
        </div>
        <div class="body">
          <div class="brand">${esc(c.brand)} ${esc(c.model)}</div>
          <div class="title">${esc(c.title)}</div>
          <div class="specs">
            <span><i class="bi bi-speedometer2"></i>${km(c.mileage)}</span>
            <span><i class="bi bi-calendar3"></i>${esc(c.firstRegistration ?? c.year)}</span>
            ${c.powerHp ? `<span><i class="bi bi-lightning-charge"></i>${t("{n} KS", { n: c.powerHp })}</span>` : ""}
            <span><i class="bi bi-fuel-pump"></i>${esc(t(c.fuel))}</span>
          </div>
          <div class="energy">${energy}</div>
          <div class="foot">
            <div class="price">${price(c.price)}<small>(${esc(t(c.priceType))})</small></div>
            <span class="btn-gc btn-gc-tan">${t("Saznaj više")}</span>
          </div>
        </div>
      </a>
    </div>`;
  }

  /* ---------- Obrasci ---------- */
  function bindForm(form, endpoint, extra = () => ({})) {
    const alert = form.querySelector(".gc-form-alert");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      form.classList.add("was-validated");
      if (!form.checkValidity()) return;
      const btn = form.querySelector("[type=submit]");
      const data = Object.fromEntries(new FormData(form));
      Object.keys(data).forEach(k => { if (data[k] === "") data[k] = null; });
      ["year", "mileage", "askingPrice", "carId"].forEach(k => { if (data[k] != null) data[k] = Number(data[k]); });
      btn.disabled = true;
      const old = btn.innerHTML;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> ${t("Šaljem...")}`;
      try {
        const r = await api(endpoint, { method: "POST", body: JSON.stringify({ ...data, ...extra() }) });
        showAlert(alert, "success", t(r.message));   // poruka s backenda je na hrvatskom -> prevodi se
        form.reset();
        form.classList.remove("was-validated");
      } catch (err) {
        // Detalji validacije s backenda su na hrvatskom; na engleskom prikazujemo općenitu poruku
        const details = !err.errors ? t("Pokušajte ponovno kasnije.")
          : isEn ? t("Provjerite obavezna polja.") : Object.values(err.errors).flat().join(" ");
        showAlert(alert, "danger", `${t("Slanje nije uspjelo.")} ${details}`);
      } finally {
        btn.disabled = false;
        btn.innerHTML = old;
      }
    });
  }
  function showAlert(el, type, text) {
    if (!el) return;
    el.className = `alert alert-${type} gc-form-alert mt-3`;
    el.textContent = text;
    el.style.display = "block";
  }

  /* ---------- Marke (zeleni blok) ---------- */
  async function renderBrands(container, { asButtons = false, active = null, onSelect } = {}) {
    try {
      const brands = await api("brands");
      container.innerHTML = brands.map(b => asButtons
        ? `<button type="button" data-brand="${b.slug}" class="${active === b.slug ? "active" : ""}">${esc(b.name)}</button>`
        : `<a href="collection.html?brand=${b.slug}">${esc(b.name)}</a>`).join("");
      if (asButtons) container.addEventListener("click", e => {
        const b = e.target.closest("button[data-brand]");
        if (!b) return;
        const isActive = b.classList.contains("active");
        $$("button", container).forEach(x => x.classList.remove("active"));
        if (!isActive) b.classList.add("active");
        onSelect?.(isActive ? null : b.dataset.brand);
      });
      return brands;
    } catch {
      container.innerHTML = `<p class="text-center w-100 mb-0">${t("Marke trenutno nisu dostupne.")}</p>`;
      return [];
    }
  }

  function apiError(container, text = "Podaci trenutno nisu dostupni. Provjerite je li backend pokrenut.") {
    container.innerHTML = `<div class="gc-empty"><i class="bi bi-exclamation-circle fs-2 d-block mb-2"></i>${t(text)}</div>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    I18N.init();        // prevede statički tekst i prati sadržaj koji se doda kasnije
    initBehaviour();
  });

  return { CONTACT, VIDEOS, LOGO, logoImg, $, $$, t, isEn, img, unsplash, esc, num, km, price, date, param, api, carCard, bindForm, renderBrands, initReveal, apiError };
})();
