/* Detalji vozila */
document.addEventListener("DOMContentLoaded", async () => {
  const { $, $$, t, api, img, esc, num, km, price, carCard, bindForm, initReveal, param, CONTACT } = GC;
  const root = $("#carRoot");
  const id = Number(param("id"));

  if (!id) { notFound(); return; }

  let car;
  try { car = await api(`cars/${id}`); }
  catch (e) { e.status === 404 ? notFound() : GC.apiError(root); return; }

  const carName = `${car.brand} ${car.model}`;
  document.title = `${carName} – ${car.title} | G-Cars`;

  const specs = [
    ["Marka", car.brand], ["Model", car.model], ["Godina", car.year],
    ["Prva registracija", car.firstRegistration], ["Kilometraža", km(car.mileage)],
    ["Motor", car.engine], ["Snaga", car.powerHp && t("{hp} KS ({kw} kW)", { hp: car.powerHp, kw: Math.round(car.powerHp * 0.7355) })],
    ["Mjenjač", t(car.transmission)], ["Pogon", car.drive && t(car.drive)], ["Gorivo", t(car.fuel)], ["Boja", car.color]
  ].filter(([, v]) => v != null && v !== "");

  const energy = [
    ["Vrsta pogona", t(car.fuel).toUpperCase()], ["Gorivo", t(car.fuel)],
    ["Potrošnja (kombinirano)", car.consumption != null ? `${car.consumption} l/100km` : "–"],
    ["CO₂ emisije (kombinirano)", `${car.co2 ?? "–"} g/km`], ["CO₂ klasa (kombinirano)", car.co2Class ?? "–"]
  ];
  const row = ([k, v]) => `<tr><th>${t(k)}</th><td>${esc(v)}</td></tr>`;

  root.innerHTML = `
    <nav class="gc-breadcrumb"><a href="index.html">${t("Početna")}</a> / <a href="collection.html">${t("Kolekcija")}</a> /
      <a href="collection.html?brand=${car.brandSlug}">${esc(car.brand)}</a> / ${esc(car.model)}</nav>
    <div class="row g-4">
      <div class="col-lg-8">
        <div id="gallery" class="carousel slide gc-gallery" data-bs-ride="false">
          <div class="carousel-inner">
            ${car.images.map((u, i) => `<div class="carousel-item ${i === 0 ? "active" : ""}"><img src="${img(u, 1600)}" alt="${esc(t("{car} – slika {n}", { car: carName, n: i + 1 }))}" data-full="${img(u, 2400)}"></div>`).join("")}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#gallery" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span><span class="visually-hidden">${t("Prethodna")}</span></button>
          <button class="carousel-control-next" type="button" data-bs-target="#gallery" data-bs-slide="next"><span class="carousel-control-next-icon"></span><span class="visually-hidden">${t("Sljedeća")}</span></button>
        </div>
        <div class="gc-thumbs">
          ${car.images.map((u, i) => `<button type="button" data-bs-target="#gallery" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}" aria-label="${t("Slika {n}", { n: i + 1 })}"><img src="${img(u, 300)}" alt=""></button>`).join("")}
        </div>

        <div class="mt-5">
          <div class="gc-eyebrow">${esc(car.brand)}</div>
          <h1 class="gc-title">${esc(car.model)}</h1>
          <p class="fw-bold text-uppercase text-secondary">${esc(car.title)}</p>
          <p>${esc(car.description ?? "")}</p>
        </div>

        <div class="row g-5 mt-1">
          <div class="col-md-6">
            <h3 class="fs-5 mb-3">${t("Specifikacije")}</h3>
            <table class="gc-spec-table">${specs.map(row).join("")}</table>
          </div>
          <div class="col-md-6">
            <h3 class="fs-5 mb-3">${t("Potrošnja energije")}</h3>
            <table class="gc-spec-table">${energy.map(row).join("")}</table>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <aside class="gc-detail-panel">
          ${car.isSold ? `<span class="gc-sold-tag fs-6">${t("Prodano")}</span>` : `<div class="price">${price(car.price)}<small>(${esc(t(car.priceType))})</small></div>`}
          <div class="gc-keyspecs">
            <div><span>${t("Kilometraža")}</span><strong>${km(car.mileage)}</strong></div>
            <div><span>${t("Registracija")}</span><strong>${esc(car.firstRegistration ?? car.year)}</strong></div>
            <div><span>${t("Snaga")}</span><strong>${car.powerHp ? t("{n} KS", { n: car.powerHp }) : "–"}</strong></div>
            <div><span>${t("Mjenjač")}</span><strong>${esc(t(car.transmission))}</strong></div>
          </div>
          <div class="d-flex flex-column gap-2 mb-4">
            <a href="#inquiry" class="btn-gc btn-gc-tan">${t("Pošaljite upit")}</a>
            <a href="${CONTACT.whatsapp}?text=${encodeURIComponent(t("Pozdrav, zanima me {car} (ID {id}).", { car: carName, id: car.id }))}" target="_blank" rel="noopener" class="btn-gc btn-gc-green"><i class="bi bi-whatsapp"></i> WhatsApp</a>
            <a href="${CONTACT.phoneHref}" class="btn-gc btn-gc-outline-dark"><i class="bi bi-telephone"></i> ${CONTACT.phone}</a>
          </div>

          <h3 class="fs-6 mb-3" id="inquiry">${t("Zainteresirani za ovo vozilo?")}</h3>
          <form class="gc-form" id="inquiryForm" novalidate>
            <div class="mb-2"><input class="form-control" name="name" placeholder="${t("Ime i prezime *")}" required maxlength="100"><div class="invalid-feedback">${t("Unesite ime.")}</div></div>
            <div class="mb-2"><input class="form-control" type="email" name="email" placeholder="${t("E-mail *")}" required maxlength="150"><div class="invalid-feedback">${t("Unesite ispravan e-mail.")}</div></div>
            <div class="mb-2"><input class="form-control" name="phone" placeholder="${t("Telefon")}" maxlength="40"></div>
            <div class="mb-3"><textarea class="form-control" name="message" rows="4" required minlength="5" maxlength="2000">${esc(t("Pozdrav, zainteresiran/a sam za {car} ({title}). Molim vas da me kontaktirate.", { car: carName, title: car.title }))}</textarea></div>
            <button type="submit" class="btn-gc btn-gc-dark w-100">${t("Pošalji upit")}</button>
            <div class="gc-form-alert"></div>
          </form>
        </aside>
      </div>
    </div>`;

  // Sličice galerije
  $("#gallery").addEventListener("slid.bs.carousel", e => {
    $$(".gc-thumbs button").forEach((b, i) => b.classList.toggle("active", i === e.to));
  });
  // Zoom
  const zoom = new bootstrap.Modal("#zoomModal");
  $$("#gallery img").forEach(im => im.addEventListener("click", () => { $("#zoomImg").src = im.dataset.full; zoom.show(); }));

  // Tema upita ostaje na hrvatskom jer je čita vlasnik stranice
  bindForm($("#inquiryForm"), "contact", () => ({ carId: car.id, subject: `Upit za vozilo: ${carName}` }));

  // Slična vozila
  try {
    let similar = (await api(`cars?sold=false&brand=${car.brandSlug}`)).filter(c => c.id !== car.id);
    if (similar.length < 3) {
      const more = (await api("cars?sold=false&limit=8")).filter(c => c.id !== car.id && !similar.some(s => s.id === c.id));
      similar = similar.concat(more);
    }
    $("#similar").innerHTML = similar.slice(0, 3).map(carCard).join("");
    initReveal($("#similar"));
  } catch { }

  function notFound() {
    root.innerHTML = `<div class="gc-empty"><h1 class="gc-title">${t("Vozilo nije pronađeno")}</h1><p>${t("Vozilo možda više nije u ponudi.")}</p><a href="collection.html" class="btn-gc btn-gc-tan">${t("Natrag na kolekciju")}</a></div>`;
  }
});
