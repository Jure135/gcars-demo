/* Kolekcija – filtriranje i sortiranje preko API-ja */
document.addEventListener("DOMContentLoaded", () => {
  const { $, api, carCard, renderBrands, initReveal, apiError, param } = GC;

  const state = {
    brand: param("brand"),
    q: param("q") ?? "",
    fuel: "",
    maxPrice: "",
    sort: "newest"
  };
  $("#fQ").value = state.q;
  const headerSearch = document.querySelector(".gc-search input");
  if (headerSearch) headerSearch.value = state.q;

  let brands = [];
  renderBrands($("#brandGrid"), {
    asButtons: true,
    active: state.brand,
    onSelect: slug => { state.brand = slug; load(); }
  }).then(b => { brands = b; updateCount(); });

  $("#allBrands").addEventListener("click", () => {
    state.brand = null;
    document.querySelectorAll("#brandGrid button").forEach(b => b.classList.remove("active"));
    load();
  });

  let t;
  $("#fQ").addEventListener("input", e => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; load(); }, 300); });
  $("#fFuel").addEventListener("change", e => { state.fuel = e.target.value; load(); });
  $("#fMax").addEventListener("change", e => { state.maxPrice = e.target.value; load(); });
  $("#fSort").addEventListener("change", e => { state.sort = e.target.value; load(); });

  let lastCount = 0;
  function updateCount() {
    const b = brands.find(x => x.slug === state.brand);
    // HR: 1, 21, 31... "vozilo", inače "vozila"; EN: 1 "vehicle", inače "vehicles"
    const one = GC.isEn ? lastCount === 1 : (lastCount % 10 === 1 && lastCount % 100 !== 11);
    $("#count").textContent = GC.t(one ? "{n} vozilo u ponudi" : "{n} vozila u ponudi", { n: lastCount }) + (b ? ` – ${b.name}` : "");
  }

  async function load() {
    const qs = new URLSearchParams({ sold: "false", sort: state.sort });
    if (state.brand) qs.set("brand", state.brand);
    if (state.q) qs.set("q", state.q);
    if (state.fuel) qs.set("fuel", state.fuel);
    if (state.maxPrice) qs.set("maxPrice", state.maxPrice);

    const url = new URL(location);
    state.brand ? url.searchParams.set("brand", state.brand) : url.searchParams.delete("brand");
    state.q ? url.searchParams.set("q", state.q) : url.searchParams.delete("q");
    history.replaceState(null, "", url);

    const grid = $("#carGrid");
    grid.style.opacity = .4;
    try {
      const cars = await api(`cars?${qs}`);
      lastCount = cars.length;
      grid.innerHTML = cars.length ? cars.map(carCard).join("")
        : `<div class="gc-empty"><i class="bi bi-search fs-2 d-block mb-2"></i>${GC.t("Nema vozila za odabrane filtere.")}<br><a href="collection.html" class="link-tan">${GC.t("Poništi filtere")}</a></div>`;
      updateCount();
      initReveal(grid);
    } catch { apiError(grid); }
    grid.style.opacity = 1;
  }

  load();
});
