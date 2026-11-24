/* Početna stranica */
document.addEventListener("DOMContentLoaded", async () => {
  const { $, t, api, img, esc, km, price, date, carCard, renderBrands, initReveal, apiError, VIDEOS, CONTACT } = GC;

  // Marke u ponudi – učitavaju se prve, odmah pri otvaranju stranice
  renderBrands($("#brandGrid"));

  // Hero video iz salona: blago zamućena pozadina + oštar vertikalni video desno
  // (greška u videu ne smije zaustaviti ostatak stranice)
  try {
    const heroBg = $("#heroBg"), hero = $("#heroVideo"), sound = $("#heroSound");
    [heroBg, hero].forEach(v => { v.src = VIDEOS.hero; v.play().catch(() => { }); });
    // pozadina prati glavni video
    hero.addEventListener("play", () => { heroBg.currentTime = hero.currentTime; });
    sound.addEventListener("click", () => {
      hero.muted = !hero.muted;
      sound.innerHTML = `<i class="bi bi-volume-${hero.muted ? "mute" : "up"}"></i>`;
      sound.setAttribute("aria-label", t(hero.muted ? "Uključi zvuk" : "Isključi zvuk"));
      if (!hero.muted) hero.play().catch(() => { });
    });

    // Radno vrijeme
    $("#homeHours").innerHTML = `<span>${t(CONTACT.hours)}</span><span>${t(CONTACT.hoursNote)}</span>`;
    $("#homeWhatsapp").href = CONTACT.whatsapp;
  } catch (e) { console.error(e); }

  // Dogovor posjeta – obrazac u smeđem bloku, šalje se kao kontakt upit
  const visit = $("#visitFormEl");
  if (visit) {
    const dateEl = $("#vDate");
    dateEl.min = new Date().toISOString().slice(0, 10);   // ne može se odabrati prošli datum
    $("#visitForm").addEventListener("shown.bs.collapse", () => $("#vName").focus());
    GC.bindForm(visit, "contact", () => {
      const d = dateEl.value ? new Date(dateEl.value).toLocaleDateString(I18N.locale) : "";
      const note = $("#vNote").value.trim();
      return {
        subject: "Dogovor posjeta",
        message: [`Zahtjev za posjet salonu.`, `Datum: ${d}`, `Vrijeme: ${$("#vTime").value || "Bilo kada"}`, note && `Napomena: ${note}`]
          .filter(Boolean).join("\n")
      };
    });
  }

  // Vozila iz salona (4 portretne fotografije)
  try {
    const cars = (await api("cars?featured=true&sold=false&limit=12"));
    const portrait = ["toyota-hilux", "mercedes-glc-coupe.jpg", "discovery-sport", "mercedes-glc.jpg"];
    const picks = portrait.map(p => cars.find(c => c.mainImage.includes(p))).filter(Boolean);
    $("#showroom").innerHTML = picks.map(c => `
      <a href="car.html?id=${c.id}" class="gc-reel reveal" aria-label="${esc(c.brand + " " + c.model)}">
        <img src="${img(c.mainImage, 800)}" alt="${esc(c.brand + " " + c.model)}" loading="lazy">
        <div class="cap"><strong class="d-block">${esc(c.brand)} ${esc(c.model)}</strong>${esc(t("Saznaj više"))} <i class="bi bi-arrow-right-short"></i></div>
      </a>`).join("");
  } catch { apiError($("#showroom")); }

  // Novo u kolekciji
  try {
    const featured = await api("cars?featured=true&sold=false&limit=6");
    $("#featuredInner").innerHTML = featured.map((c, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img class="bg" src="${img(c.mainImage, 2000)}" alt="" aria-hidden="true">
        <img class="fg" src="${img(c.mainImage, 2000)}" alt="${esc(c.brand + " " + c.model)}">
        <div class="gc-featured-overlay">
          <div class="gc-featured-top">
            <h3>${esc(c.title)}</h3>
            <div class="meta"><strong>${esc(c.brand)}</strong>${esc(c.model)}
              <div class="mt-3"><a href="car.html?id=${c.id}" class="btn-gc btn-gc-tan">${t("Saznaj više")}</a></div>
            </div>
          </div>
          <div class="gc-energy">
            <h4>${t("Potrošnja energije")}</h4>
            <dl>
              <div><dt>${t("Vrsta pogona")}</dt><dd>${esc(t(c.fuel).toUpperCase())}</dd></div>
              <div><dt>${t("Gorivo")}</dt><dd>${esc(t(c.fuel))}</dd></div>
              <div><dt>${t("CO₂ emisije (komb.)")}</dt><dd>${c.co2 ?? "–"} g/km</dd></div>
              <div><dt>${t("CO₂ klasa (komb.)")}</dt><dd>${esc(c.co2Class ?? "–")}</dd></div>
              <div><dt>${t("Potrošnja goriva")}</dt><dd>${t("{x} l/100km (komb.)", { x: c.consumption ?? "–" })}</dd></div>
              <div><dt>${t("Cijena")}</dt><dd>${price(c.price)} (${esc(t(c.priceType))})</dd></div>
            </dl>
          </div>
        </div>
      </div>`).join("");
    $("#featuredDots").innerHTML = featured.map((_, i) =>
      `<button type="button" data-bs-target="#featuredCarousel" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}" aria-label="${t("Slajd {n}", { n: i + 1 })}"></button>`).join("");
    const carouselEl = $("#featuredCarousel");
    bootstrap.Carousel.getOrCreateInstance(carouselEl).cycle();
    carouselEl.addEventListener("slid.bs.carousel", e => {
      document.querySelectorAll("#featuredDots button").forEach((b, i) => b.classList.toggle("active", i === e.to));
    });
  } catch { apiError($("#featuredInner")); }

  // Nedavno prodano
  try {
    const sold = await api("cars?sold=true&limit=3");
    // dok nema prodanih vozila, sekcija se ne prikazuje
    if (!sold.length) $("#soldSection").hidden = true;
    $("#soldGrid").innerHTML = sold.map(carCard).join("");
  } catch { apiError($("#soldGrid")); }

  initReveal();
});
