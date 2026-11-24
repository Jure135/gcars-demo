/* =========================================================
   G-Cars – prijevod stranice (HR / EN)

   Hrvatski je izvorni jezik: sav tekst u HTML-u i JS-u napisan je na hrvatskom.
   Za engleski se svaki hrvatski tekst zamjenjuje prijevodom iz rječnika EN
   (ključ = hrvatski tekst, kao kod gettext-a).

   - Statički tekst (HTML): prevodi se automatski nakon učitavanja stranice.
   - Dinamički tekst (JS): koristi I18N.t("tekst {param}", { param }).
   - Jezik se pamti u localStorage, a može se postaviti i preko ?lang=en.

   Ova datoteka se učitava u <head> kako se hrvatski tekst ne bi
   "bljesnuo" prije prijevoda.
   ========================================================= */
const I18N = (() => {
  const SUPPORTED = ["hr", "en"];

  // ---------- Odabir jezika ----------
  let lang = "hr";
  try {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (SUPPORTED.includes(fromUrl)) { lang = fromUrl; localStorage.setItem("gc-lang", fromUrl); }
    else if (SUPPORTED.includes(localStorage.getItem("gc-lang"))) lang = localStorage.getItem("gc-lang");
  } catch { }

  document.documentElement.lang = lang;
  if (lang !== "hr") {
    // sakrij stranicu dok se ne prevede (s osiguračem ako nešto pođe po zlu)
    document.documentElement.classList.add("gc-i18n-pending");
    setTimeout(() => document.documentElement.classList.remove("gc-i18n-pending"), 2000);
  }

  // ---------- Engleski rječnik ----------
  const EN = {
    /* Naslovi stranica (kartica preglednika) */
    "G-Cars | Luksuzni i ekskluzivni automobili, prodaja i iskustvo": "G-Cars | Luxury & exclusive cars, sales & experience",
    "Kolekcija | G-Cars": "Collection | G-Cars",
    "Vozilo | G-Cars": "Vehicle | G-Cars",
    "Nedavno prodano | G-Cars": "Recently sold | G-Cars",
    "O nama | G-Cars": "About us | G-Cars",
    "Ekskluzivne usluge | G-Cars": "Exclusive services | G-Cars",
    "Komisijska prodaja | G-Cars": "Consignment sales | G-Cars",
    "Novosti & blog | G-Cars": "News & blog | G-Cars",
    "Članak | G-Cars": "Article | G-Cars",
    "Kontakt | G-Cars": "Contact | G-Cars",
    "Stranica nije pronađena | G-Cars": "Page not found | G-Cars",

    /* Opis stranice (meta description) */
    "G-Cars – luksuzni, ekskluzivni, investicijski i sportski automobili. Kupnja, prodaja i komisijska prodaja.":
      "G-Cars – luxury, exclusive, investment and sports cars. Buying, selling and consignment sales.",

    /* Izbornik, header, footer */
    "Početna": "Home",
    "O nama": "About us",
    "Kolekcija": "Collection",
    "Novosti & blog": "News & blog",
    "Nedavno prodano": "Recently sold",
    "Ekskluzivne usluge": "Exclusive services",
    "Komisijska prodaja": "Consignment sales",
    "— Komisijska prodaja": "— Consignment sales",
    "Kontakt": "Contact",
    "Otvori izbornik": "Open menu",
    "Pretraži...": "Search...",
    "Pretraži vozila": "Search vehicles",
    "Traži": "Search",
    "G-Cars početna": "G-Cars home",
    "Zatvori": "Close",
    "Nazovite nas": "Call us",
    "E-mail": "Email",
    "Na vrh": "Back to top",
    "Jezik": "Language",
    "Zainteresirani?": "Interested?",
    "Želite saznati više o našim automobilima ili uslugama, ili želite probnu vožnju? Javite nam se. Naravno, uvijek ste dobrodošli u naš salon.":
      "Want to learn more about our cars or services, or would you like a test drive? Just let us know. Of course, you are always welcome to visit our showroom.",
    "OTKRIJTE": "DISCOVER",
    "SALON": "SHOWROOM",
    "PONUDA": "OFFER",
    "Hrvatska": "Croatia",
    "Uvjeti poslovanja": "Terms and conditions",
    "Privatnost": "Privacy",
    "Impresum": "Legal notice",
    "LUKSUZ & EKSKLUZIVNOST": "LUXURY & EXCLUSIVE",
    "Jamstvo": "Warranty",
    "Kolačići": "Cookies",
    "Ova stranica koristi kolačiće": "This website uses cookies",
    "Koristimo kolačiće kako bismo poboljšali vaše iskustvo. Možete prihvatiti sve ili samo nužne kolačiće.":
      "We use cookies to improve your experience. You can accept all cookies or only the necessary ones.",
    "Prihvati sve": "Accept all",
    "Samo nužni": "Necessary only",

    /* Početna */
    "Skrolaj dolje": "Scroll down",
    "Kvaliteta kao": "Quality as",
    "standard": "the standard",
    "Automobili, uvoz": "Cars, import",
    "& prodaja": "& sales",
    "Pogledajte našu ponudu": "View our offer",
    "ODABERITE MARKU": "CHOOSE A BRAND",
    "Sve marke": "All brands",
    "Marke trenutno nisu dostupne.": "Brands are currently unavailable.",
    "Od snova": "From dreams",
    "do ceste": "to the road",
    "Nudimo neusporedivo iskustvo u pronalaženju savršenog mladog klasika, investicijskog ili sportskog automobila.":
      "We offer an unparalleled experience in finding the perfect youngtimer, investment or sports car.",
    "U G-Carsu imamo oko za nabavu ekskluzivnih, luksuznih, investicijskih i sportskih automobila. Neovisni smo međunarodni trgovac i pružamo „Uslugu Plus“. Zašto? Zato što uvijek idemo korak dalje. Uvjereni smo da ćete iz našeg salona otići više nego zadovoljni.":
      "At G-Cars we have an eye for sourcing exclusive, luxury, investment and sports cars. We are an independent international dealer and we deliver “Service Plus”. Why? Because we always go the extra mile. We are confident you will drive away from our showroom more than satisfied.",
    "Više o nama": "More about us",
    "G-Cars salon s luksuznim automobilima": "G-Cars showroom with luxury cars",
    "Unutrašnjost G-Cars salona": "Inside the G-Cars showroom",
    "G-Cars u pokretu": "G-Cars in motion",
    "Otkrijte iznimne automobile, nove dolaske i trenutke iz našeg salona u najnovijim videima G-Carsa.":
      "Discover exceptional cars, new arrivals and moments from our showroom in the latest G-Cars videos.",
    "McLaren Senna – stražnji pogled": "McLaren Senna – rear view",
    "Lamborghini na cesti": "Lamborghini on the road",
    "Aston Martin – interijer": "Aston Martin – interior",
    "Noćna vožnja gradom": "Night drive through the city",
    "Pokreni video: {x}": "Play video: {x}",
    "Video": "Video",
    "Novo u našoj kolekciji": "New in our collection",
    "Prethodni": "Previous",
    "Sljedeći": "Next",
    "Slajd {n}": "Slide {n}",
    "Naša kompletna kolekcija": "Our complete collection",
    "Kupite & prodajte svoj luksuzni ili hiperautomobil": "Buy & sell your luxury or hypercar",
    "Diskrecija zajamčena. Mi se brinemo za procjenu, fotografiranje, oglašavanje, pregovore i papirologiju – vi samo potpišete.":
      "Discretion guaranteed. We take care of the valuation, photography, advertising, negotiations and paperwork – all you do is sign.",
    "Saznajte više o komisijskoj prodaji": "Learn more about consignment sales",
    "Predaja ključeva automobila": "Handing over car keys",
    "Pronađi & vozi": "Find & drive",
    "Automobil": "Your dream",
    "iz snova": "car",
    "Pronaći i posjedovati vrhunski sportski automobil san je koji se ostvaruje mnogima. San koji je često počeo slavnim posterom iznad kreveta. Od postera do stvarnosti – trenutak kad sjednete, upalite motor i krenete. U G-Carsu znamo koliko je taj trenutak poseban. Zato kod nas pronalazite samo automobile koji ispunjavaju sva vaša očekivanja – i više od toga.":
      "Finding and owning the ultimate sports car is a dream that comes true for many people. A dream that often began with a famous poster above the bed. From poster to reality – the moment you get in, start the engine and drive off. At G-Cars we know how special that moment is. That is why you will only find cars with us that meet all your expectations – and beyond.",
    "Ferrari u vožnji": "Ferrari on the move",
    "Pregled": "Overview",
    "Pročitaj više": "Read more",

    /* Kartice vozila i energija */
    "Saznaj više": "Discover more",
    "Novo": "New",
    "Prodano": "Sold",
    "Na upit": "On request",
    "Potrošnja energije": "Energy consumption",
    "Vrsta pogona": "Drive type",
    "Gorivo": "Fuel",
    "CO₂ emisije (komb.)": "CO₂ emissions (comb.)",
    "CO₂ klasa (komb.)": "CO₂ class (comb.)",
    "Potrošnja goriva": "Fuel consumption",
    "Cijena": "Price",
    "{x} l/100km (komb.)": "{x} l/100km (comb.)",
    "Potrošnja: {c} l/100km (komb.) · CO₂: {co2} g/km · Klasa: {k}": "Consumption: {c} l/100km (comb.) · CO₂: {co2} g/km · Class: {k}",
    "Potrošnja: električni · CO₂: 0 g/km · Klasa: A": "Consumption: electric · CO₂: 0 g/km · Class: A",
    "{n} KS": "{n} hp",
    "Podaci trenutno nisu dostupni. Provjerite je li backend pokrenut.": "Data is currently unavailable. Please check that the backend is running.",

    /* Vrijednosti iz baze (gorivo, mjenjač, pogon, cijena) */
    "Benzin": "Petrol",
    "BENZIN": "PETROL",
    "Dizel": "Diesel",
    "DIZEL": "DIESEL",
    "Hibrid": "Hybrid",
    "HIBRID": "HYBRID",
    "Električni": "Electric",
    "ELEKTRIČNI": "ELECTRIC",
    "Automatski": "Automatic",
    "Ručni": "Manual",
    "Stražnji": "Rear-wheel",
    "Prednji": "Front-wheel",
    "Uklj. PDV": "Incl. VAT",
    "Marža": "Margin scheme",

    /* Kolekcija */
    "Naša": "Our",
    "kolekcija": "collection",
    "MARKE": "BRANDS",
    "Pogledajte našu ponudu": "View our offer",
    "Pretraži model, marku, boju...": "Search model, brand, colour...",
    "Sva goriva": "All fuels",
    "Maksimalna cijena": "Maximum price",
    "Bilo koja cijena": "Any price",
    "do € 150.000": "up to € 150,000",
    "do € 250.000": "up to € 250,000",
    "do € 400.000": "up to € 400,000",
    "Sortiraj": "Sort",
    "Najnovije": "Newest",
    "Cijena: od najniže": "Price: low to high",
    "Cijena: od najviše": "Price: high to low",
    "Godina: najnovije": "Year: newest first",
    "Kilometraža: najmanja": "Mileage: lowest first",
    "Marka (A–Ž)": "Brand (A–Z)",
    "{n} vozilo u ponudi": "{n} vehicle available",
    "{n} vozila u ponudi": "{n} vehicles available",
    "Nema vozila za odabrane filtere.": "No vehicles match the selected filters.",
    "Poništi filtere": "Reset filters",
    "Lamborghini Aventador": "Lamborghini Aventador",

    /* Detalji vozila */
    "Vozilo nije pronađeno": "Vehicle not found",
    "Vozilo možda više nije u ponudi.": "The vehicle may no longer be available.",
    "Natrag na kolekciju": "Back to the collection",
    "Možda vas zanima": "You may also like",
    "Kompletna kolekcija": "Complete collection",
    "Uvećana slika": "Enlarged image",
    "Uvećana slika vozila": "Enlarged vehicle image",
    "Prethodna": "Previous",
    "Sljedeća": "Next",
    "Slika {n}": "Image {n}",
    "{car} – slika {n}": "{car} – image {n}",
    "Specifikacije": "Specifications",
    "Marka": "Brand",
    "Model": "Model",
    "Godina": "Year",
    "Prva registracija": "First registration",
    "Kilometraža": "Mileage",
    "Motor": "Engine",
    "Snaga": "Power",
    "{hp} KS ({kw} kW)": "{hp} hp ({kw} kW)",
    "Mjenjač": "Transmission",
    "Pogon": "Drive",
    "Boja": "Colour",
    "Potrošnja (kombinirano)": "Consumption (combined)",
    "CO₂ emisije (kombinirano)": "CO₂ emissions (combined)",
    "CO₂ klasa (kombinirano)": "CO₂ class (combined)",
    "Registracija": "Registration",
    "Pošaljite upit": "Send an enquiry",
    "Zainteresirani za ovo vozilo?": "Interested in this vehicle?",
    "Ime i prezime *": "Full name *",
    "E-mail *": "Email *",
    "Telefon": "Phone",
    "Unesite ime.": "Please enter your name.",
    "Unesite ispravan e-mail.": "Please enter a valid email address.",
    "Pošalji upit": "Send enquiry",
    "Pozdrav, zainteresiran/a sam za {car} ({title}). Molim vas da me kontaktirate.": "Hello, I am interested in the {car} ({title}). Please contact me.",
    "Pozdrav, zanima me {car} (ID {id}).": "Hello, I am interested in the {car} (ID {id}).",
    "Upit za vozilo: {car}": "Vehicle enquiry: {car}",

    /* Obrasci – poruke */
    "Šaljem...": "Sending...",
    "Slanje nije uspjelo.": "Sending failed.",
    "Pokušajte ponovno kasnije.": "Please try again later.",
    "Provjerite obavezna polja.": "Please check the required fields.",
    "Hvala! Vaša poruka je zaprimljena. Javit ćemo vam se uskoro.": "Thank you! Your message has been received. We will get back to you soon.",
    "Hvala! Zaprimili smo podatke o vašem vozilu. Kontaktirat ćemo vas u roku 24 sata.": "Thank you! We have received your vehicle details. We will contact you within 24 hours.",

    /* Nedavno prodano */
    "Nedavno": "Recently",
    "prodano": "sold",
    "Ova vozila su pronašla novog vlasnika. Tražite sličan automobil? Javite nam se – pomoću naše međunarodne mreže pronaći ćemo ga za vas.":
      "These vehicles have found a new owner. Looking for a similar car? Get in touch – with our international network we will find it for you.",
    "Trenutno nema prodanih vozila za prikaz.": "There are currently no sold vehicles to show.",
    "Želite prodati svoj automobil?": "Want to sell your car?",
    "Kupujemo i prodajemo luksuzne i hiperautomobile – diskrecija zajamčena.": "We buy and sell luxury cars and hypercars – discretion guaranteed.",
    "Prodani sportski automobili": "Sold sports cars",
    "Predaja ključeva": "Key handover",

    /* O nama */
    "O nama · G-Cars": "About us · G-Cars",
    "Gdje strast": "Where passion",
    "pronalazi": "finds the",
    "cestu": "road",
    "Više od 15 godina spajamo vozače s automobilima iz snova – pažljivo odabranima, temeljito provjerenima i predanima uz osobnu uslugu.":
      "For more than 15 years we have been matching drivers with their dream cars – carefully selected, thoroughly inspected and handed over with a personal service.",
    "Naša priča": "Our story",
    "Strast koja je postala posao": "A passion that became a business",
    "G-Cars je nastao iz ljubavi prema iznimnim automobilima. Ono što je počelo kao hobi preraslo je u jednog od vodećih trgovaca luksuznim i sportskim automobilima u regiji.":
      "G-Cars was born out of a love for exceptional cars. What started as a hobby has grown into one of the leading luxury and sports car dealers in the region.",
    "Specijalizirani smo za kupnju i prodaju ekskluzivnih, investicijskih i sportskih automobila te mladih klasika. Svaki automobil u našoj ponudi pažljivo je odabran, detaljno pregledan i dolazi s potpunom poviješću održavanja.":
      "We specialise in buying and selling exclusive, investment and sports cars as well as youngtimers. Every car we offer is carefully selected, thoroughly inspected and comes with a complete maintenance history.",
    "Kao neovisni međunarodni trgovac nudimo „Uslugu Plus“: od financiranja i osiguranja do međunarodne dostave i registracije. Uvijek idemo korak dalje.":
      "As an independent international dealer we offer “Service Plus”: from financing and insurance to international delivery and registration. We always go the extra mile.",
    "Sportski automobil u radionici": "Sports car in the workshop",
    "Godina iskustva": "Years of experience",
    "Prodanih vozila": "Vehicles sold",
    "Zemalja isporuke": "Delivery countries",
    "% zadovoljnih kupaca": "% satisfied customers",
    "Garaža s automobilima": "Garage full of cars",
    "Naše vrijednosti": "Our values",
    "Zašto G-Cars?": "Why G-Cars?",
    "Pažljivo odabrano": "Carefully selected",
    "Svaki automobil prolazi detaljan tehnički pregled i provjeru povijesti prije nego uđe u ponudu.":
      "Every car undergoes a detailed technical inspection and history check before it joins our collection.",
    "Potpuna transparentnost": "Full transparency",
    "Jasne cijene, kompletna dokumentacija i iskren savjet – bez skrivenih troškova.": "Clear prices, complete documentation and honest advice – no hidden costs.",
    "Usluga Plus": "Service Plus",
    "Financiranje, osiguranje, dostava na kućnu adresu i pomoć pri registraciji u inozemstvu.":
      "Financing, insurance, home delivery and help with registration abroad.",
    "Diskrecija": "Discretion",
    "Kupnja i prodaja uz potpunu diskreciju – vaša privatnost nam je na prvom mjestu.": "Buying and selling with complete discretion – your privacy comes first.",
    "Posjetite naš salon": "Visit our showroom",
    "U našem modernom salonu u Kaštel Lukšiću uvijek vas očekuje više od 30 iznimnih automobila. Uz kavu, u opuštenoj atmosferi, rado ćemo vam predstaviti svako vozilo i dogovoriti probnu vožnju.":
      "More than 30 exceptional cars are always waiting for you in our modern showroom in Kaštel Lukšić. Over a coffee, in a relaxed atmosphere, we will gladly present every vehicle and arrange a test drive.",
    "Radno vrijeme:": "Opening hours:",
    "Radno vrijeme": "Opening hours",
    "Pon – Pet: 09:00 – 18:00": "Mon – Fri: 09:00 – 18:00",
    "Subota: 10:00 – 15:00": "Saturday: 10:00 – 15:00",
    "Nedjelja: po dogovoru": "Sunday: by appointment",
    "Dogovorite posjet": "Book a visit",
    // Novi layout početne / radno vrijeme
    "Pon – Ned: 08:00 – 20:00": "Mon – Sun: 08:00 – 20:00",
    "i po dogovoru": "and by appointment",
    "RADNO VRIJEME": "OPENING HOURS",
    "Odaberite marku": "Choose a brand",
    "Auto salon G-CARS": "G-CARS car showroom",
    "Nudimo neusporedivo iskustvo u pronalaženju savršenog automobila – od pouzdanih terenaca do luksuznih SUV-ova.":
      "We offer an unparalleled experience in finding the perfect car – from dependable off-roaders to luxury SUVs.",
    "U našem salonu u Kaštel Lukšiću svako vozilo je pažljivo odabrano i pripremljeno. Uvijek idemo korak dalje i uvjereni smo da ćete iz našeg salona otići više nego zadovoljni.":
      "At our showroom in Kaštel Lukšić every vehicle is carefully selected and prepared. We always go the extra mile and are confident you will leave our showroom more than satisfied.",
    "U salonu G-CARS": "In the G-CARS showroom",
    "Pogledajte vozila koja vas trenutno čekaju u našem salonu.": "Take a look at the vehicles currently waiting for you in our showroom.",
    "Kupite & prodajte svoj automobil, uz zajamčenu diskreciju.": "Buy & sell your car, discretion guaranteed.",
    "Vaš automobil": "Your dream",
    "Pronaći pravi automobil san je koji se ostvaruje mnogima. Od prvog pogleda do trenutka kad sjednete, upalite motor i krenete – u G-Carsu znamo koliko je taj trenutak poseban.":
      "Finding the right car is a dream that comes true for many. From the first look to the moment you sit down, start the engine and drive off – at G-Cars we know how special that moment is.",
    "Zato kod nas pronalazite samo automobile koji ispunjavaju sva vaša očekivanja – i više od toga.":
      "That is why you will only find cars with us that meet all your expectations – and more.",
    "Pogledajte ponudu": "View our offer",
    "Posjetite naš salon u Kaštel Lukšiću": "Visit our showroom in Kaštel Lukšić",
    "Ponudite vaše vozilo u zamjenu": "Offer your vehicle as a trade-in",
    // Opisi slika (alt), pristupačnost i nazivi modela
    "Glavna navigacija": "Main navigation",
    "G-Cars salon – Volvo XC90": "G-Cars showroom – Volvo XC90",
    "Mazda CX-5 u G-Cars salonu": "Mazda CX-5 at the G-Cars showroom",
    "Range Rover Velar u G-Cars salonu": "Range Rover Velar at the G-Cars showroom",
    "Mercedes GLC Coupé u G-Cars salonu": "Mercedes GLC Coupé at the G-Cars showroom",
    "Mercedes GLC Coupé u salonu": "Mercedes GLC Coupé in the showroom",
    "G-Cars salon – Mercedes S-Klasa i BMW C 650 Sport": "G-Cars showroom – Mercedes S-Class and BMW C 650 Sport",
    "S-Klasa AMG": "S-Class AMG",
    "Mercedes S-Klasa AMG": "Mercedes S-Class AMG",
    "/ S-Klasa AMG": "/ S-Class AMG",
    "Uključi zvuk": "Turn sound on",
    "Isključi zvuk": "Turn sound off",
    "Mercedes GLC Coupé – stražnji pogled": "Mercedes GLC Coupé – rear view",
    "Dogovorite posjet salonu": "Book a showroom visit",
    "Telefon *": "Phone *",
    "Unesite broj telefona.": "Please enter your phone number.",
    "Datum *": "Date *",
    "Odaberite datum.": "Please choose a date.",
    "Vrijeme": "Time",
    "Bilo kada": "Any time",
    "Po dogovoru": "By arrangement",
    "Npr. vozilo koje vas zanima ili želite probnu vožnju": "E.g. the vehicle you are interested in or a test drive",
    "Slažem se s obradom osobnih podataka u svrhu dogovora posjeta. *": "I agree to the processing of my personal data for arranging the visit. *",
    "Pošalji zahtjev": "Send request",
    "G-Cars salon": "G-Cars showroom",
    "Crveni automobil u salonu": "Red car in the showroom",

    /* Usluge */
    "Ekskluzivne": "Exclusive",
    "usluge": "services",
    "Kupnja luksuznog automobila mora biti jednako posebna kao i sam automobil. Zato vam nudimo kompletan paket usluga – od prvog kontakta do predaje ključeva i nakon toga.":
      "Buying a luxury car should be just as special as the car itself. That is why we offer a complete package of services – from the first contact to the key handover and beyond.",
    "Prodajemo vaš automobil umjesto vas – brzo, sigurno i uz najbolju cijenu.": "We sell your car for you – quickly, safely and at the best price.",
    "Saznajte više": "Learn more",
    "Pronalazak vozila": "Car sourcing",
    "Tražite određeni model ili specifikaciju? Pomoću naše međunarodne mreže pronalazimo i najrjeđe automobile.":
      "Looking for a specific model or specification? With our international network we find even the rarest cars.",
    "Otkup & zamjena": "Buy-out & trade-in",
    "Otkupljujemo vaš automobil odmah ili ga uzimamo u zamjenu pri kupnji novog.": "We buy your car on the spot or take it as a trade-in when you buy a new one.",
    "Financiranje & leasing": "Financing & leasing",
    "Fleksibilna rješenja financiranja i leasinga prilagođena privatnim i poslovnim klijentima.":
      "Flexible financing and leasing solutions tailored to private and business clients.",
    "Međunarodna dostava": "International delivery",
    "Zatvoreni transport do vaših vrata bilo gdje u Europi, uz potpuno osiguranje.": "Enclosed transport to your door anywhere in Europe, fully insured.",
    "Njega & zaštita": "Detailing & protection",
    "Profesionalno poliranje, keramička zaštita i PPF folija kako bi vaš automobil zauvijek izgledao kao nov.":
      "Professional polishing, ceramic coating and PPF film to keep your car looking brand new.",
    "Imate posebnu želju?": "Have a special request?",
    "Javite nam se – rado ćemo vam pomoći.": "Get in touch – we are happy to help.",
    "Kontaktirajte nas": "Contact us",
    "Pronalazak automobila": "Car sourcing",
    "Otkup automobila": "Car buy-out",
    "Financiranje": "Financing",
    "Dostava": "Delivery",
    "Njega vozila": "Detailing",

    /* Vrijednosti iz baze – pogon i boje */
    "Svi kotači": "All-wheel",

    /* Komisijska prodaja */
    "Komisijska": "Consignment",
    "prodaja": "sales",
    "Sportski automobil u Monaku": "Sports car in Monaco",
    "Kupite & prodajte": "Buy & sell",
    "Ponudite svoje vozilo u zamjenu za neko vozilo iz naše ponude": "Offer your vehicle in exchange for one from our range",
    "Prodaja ekskluzivnog automobila zahtijeva stručnost, mrežu kupaca i vrijeme. Mi preuzimamo sve umjesto vas.":
      "Selling an exclusive car takes expertise, a network of buyers and time. We take care of everything for you.",
    "Vaš automobil izlažemo u našem salonu, profesionalno ga fotografiramo i snimamo te oglašavamo na međunarodnim platformama i među našim privatnim kupcima. Pregovore, provjeru kupca, plaćanje i papirologiju odrađujemo mi – potpuno transparentno.":
      "We display your car in our showroom, have it professionally photographed and filmed, and advertise it on international platforms and among our private clients. We handle the negotiations, buyer checks, payment and paperwork – completely transparently.",
    "Besplatna procjena vrijednosti": "Free valuation",
    "Profesionalne fotografije i video": "Professional photos and video",
    "Pristup međunarodnoj mreži kupaca": "Access to an international network of buyers",
    "Sigurna isplata i kompletna papirologija": "Secure payment and complete paperwork",
    "Diskrecija zajamčena": "Discretion guaranteed",
    "Tvrtka specijalizirana za uvoz i prodaju svih vrsta rabljenih motornih vozila.": "A company specialising in the import and sale of all types of used motor vehicles.",
    "Također dovozimo i vozila po narudžbi prema Vašim željama.": "We also import vehicles to order, according to your wishes.",
    "Sve vrste plaćanja (gotovinsko – transakcijski, leasing, kredit, kartice)": "All payment methods (cash – bank transfer, leasing, loan, cards)",
    "Zamjena staro za novo": "Trade-in: old for new",
    // Ekskluzivne usluge (7 usluga)
    "Vozila sa lagera": "Vehicles in stock",
    "Sva vozila iz naše ponude nalaze se u salonu i spremna su za preuzimanje. Svako vozilo prije prodaje prolazi detaljan tehnički pregled, provjeru povijesti i dokumentacije te profesionalnu pripremu. Dođite, pogledajte ga uživo i odvezite ga isti dan.":
      "Every vehicle in our range is at the showroom and ready for collection. Before sale, each one undergoes a detailed technical inspection, a history and paperwork check and professional preparation. Come and see it in person and drive it home the same day.",
    "Vozila po narudžbi": "Vehicles to order",
    "Niste pronašli željeno vozilo u našoj ponudi? Recite nam marku, model, opremu i budžet – mi ćemo ga pronaći i dovesti iz inozemstva. Brinemo o provjeri vozila, prijevozu, carinskim formalnostima i registraciji, a vi o svemu dobivate redovite informacije.":
      "Didn't find the vehicle you want in our range? Tell us the make, model, equipment and budget – we will find it and bring it from abroad. We take care of the inspection, transport, customs formalities and registration, and keep you informed every step of the way.",
    "Jamstvo na vozila": "Vehicle warranty",
    "Kupnja rabljenog vozila kod nas znači sigurnost. Uz vozila nudimo jamstvo koje pokriva ključne mehaničke i električne sklopove, a uvjeti i trajanje jamstva ovise o pojedinom vozilu. Sve detalje rado ćemo vam objasniti prije kupnje.":
      "Buying a used vehicle from us means peace of mind. We offer a warranty covering key mechanical and electrical components; the terms and duration depend on the individual vehicle. We will gladly explain all the details before you buy.",
    "Leasing": "Leasing",
    "Vozilo možete kupiti putem financijskog ili operativnog leasinga, kao privatna osoba ili tvrtka. U suradnji s leasing kućama pripremamo ponudu prilagođenu vašim mogućnostima – s fleksibilnim učešćem i rokom otplate te brzom obradom zahtjeva.":
      "You can buy a vehicle through finance or operating leasing, as a private individual or a company. Together with leasing companies we prepare an offer tailored to you – with a flexible down payment and repayment term and fast processing.",
    "Kartice (do 36 rata)": "Cards (up to 36 instalments)",
    "Vozilo možete platiti i kreditnim karticama na do 36 mjesečnih rata. Jednostavno i bez dodatne papirologije – plaćanje obavljate izravno u našem salonu, a o dostupnim karticama i uvjetima obročne otplate informirat ćemo vas prilikom kupnje.":
      "You can also pay for your vehicle by credit card in up to 36 monthly instalments. Simple and with no extra paperwork – you pay directly at our showroom, and we will tell you about the accepted cards and instalment terms when you buy.",
    "Dostava vozila unutar HR": "Vehicle delivery within Croatia",
    "Ne stignete doći u salon? Kupljeno vozilo dostavljamo na vašu adresu bilo gdje u Hrvatskoj. Vozilo stiže očišćeno, pripremljeno i s kompletnom dokumentacijom, a termin dostave dogovaramo prema vašim željama.":
      "Can't make it to the showroom? We deliver your vehicle to your address anywhere in Croatia. It arrives cleaned, prepared and with complete paperwork, at a delivery time that suits you.",
    "Registracija vozila": "Vehicle registration",
    "Registraciju kupljenog vozila obavljamo umjesto vas. Brinemo o tehničkom pregledu, osiguranju, prijenosu vlasništva i svoj potrebnoj dokumentaciji, tako da vozilo preuzimate registrirano i spremno za vožnju – bez čekanja u redovima i gubljenja vremena.":
      "We register your new vehicle for you. We take care of the technical inspection, insurance, transfer of ownership and all the necessary paperwork, so you pick up your car registered and ready to drive – no queues, no wasted time.",
    "Zamjena vozila": "Vehicle trade-in",
    "Vaše dosadašnje vozilo možete ostaviti kao dio plaćanja za novo. Napravit ćemo besplatnu i realnu procjenu vrijednosti, a iznos odmah umanjujemo od cijene vozila koje kupujete. Zamjena staro za novo – brzo, jednostavno i na jednom mjestu.":
      "You can leave your current vehicle as part payment for a new one. We provide a free, realistic valuation and deduct the amount straight from the price of the vehicle you are buying. Old for new – quick, simple and all in one place.",
    "Zatražite procjenu": "Request a valuation",
    "Vozila sa lagera u G-Cars salonu": "Vehicles in stock at the G-Cars showroom",
    "Plaćanje karticama na rate": "Card payment in instalments",
    "Leasing & kartično do 36 rata": "Leasing & card payment in up to 36 instalments",
    "Leasing i plaćanje karticama na rate": "Leasing and card payment in instalments",
    "Vozilo možete kupiti putem financijskog ili operativnog leasinga, kao privatna osoba ili tvrtka – u suradnji s leasing kućama pripremamo ponudu s fleksibilnim učešćem i rokom otplate te brzom obradom zahtjeva. Također, vozilo možete platiti kreditnim karticama na do 36 mjesečnih rata, izravno u našem salonu i bez dodatne papirologije.":
      "You can buy a vehicle through finance or operating leasing, as a private individual or a company – together with leasing companies we prepare an offer with a flexible down payment and repayment term and fast processing. You can also pay by credit card in up to 36 monthly instalments, directly at our showroom and with no extra paperwork.",
    "Dostava vozila unutar Hrvatske": "Vehicle delivery within Croatia",
    "Podaci o vašem vozilu": "Your vehicle details",
    "Marka *": "Brand *",
    "Model *": "Model *",
    "Obavezno polje.": "Required field.",
    "Željena cijena (€)": "Asking price (€)",
    "Napomena": "Notes",
    "Oprema, povijest servisa, stanje...": "Equipment, service history, condition...",
    "Zatražite besplatnu procjenu": "Request a free valuation",
    "Kako funkcionira?": "How does it work?",
    "Procjena": "Valuation",
    "Pošaljite nam podatke o vozilu, a mi vam u roku 24 sata dajemo realnu procjenu.": "Send us your vehicle details and we will give you a realistic valuation within 24 hours.",
    "Priprema": "Preparation",
    "Automobil pregledavamo, pripremamo, fotografiramo i izlažemo u salonu.": "We inspect, prepare and photograph the car and display it in our showroom.",
    "Oglašavanje": "Advertising",
    "Oglašavamo ga međunarodno i predstavljamo našoj mreži privatnih kupaca.": "We advertise it internationally and present it to our network of private buyers.",
    "Isplata": "Payment",
    "Nakon prodaje dobivate isplatu – sigurno i bez brige o papirologiji.": "Once sold, you get paid – safely and without worrying about paperwork.",

    /* Novosti i članak */
    "Novosti": "News",
    "& blog": "& blog",
    "Automobil noću u gradu": "Car in the city at night",
    "Sve novosti": "All news",
    "Pogledajte kolekciju": "View the collection",
    "Članak nije pronađen": "Article not found",

    /* Kontakt */
    "Pošaljite nam poruku": "Send us a message",
    "Želite saznati više o našim automobilima ili uslugama, ili želite probnu vožnju? Ispunite obrazac i javit ćemo vam se u najkraćem roku.":
      "Want to learn more about our cars or services, or would you like a test drive? Fill in the form and we will get back to you as soon as possible.",
    "Tema": "Subject",
    "Opći upit": "General enquiry",
    "Probna vožnja": "Test drive",
    "Kupnja vozila": "Buying a vehicle",
    "Prodaja / komisija": "Selling / consignment",
    "Poruka *": "Message *",
    "Poruka mora imati barem 5 znakova.": "The message must be at least 5 characters long.",
    "Slažem se s obradom osobnih podataka u svrhu odgovora na upit. *": "I agree to the processing of my personal data for the purpose of answering my enquiry. *",
    "Pošalji poruku": "Send message",
    "Salon": "Showroom",
    "Prikaži na karti": "Show on map",
    "Adresa": "Address",
    "Lokacija G-Cars salona": "G-Cars showroom location",

    /* 404 */
    "Greška 404": "Error 404",
    "Skrenuli ste": "You have gone",
    "s ceste": "off the road",
    "Stranica koju tražite ne postoji ili je premještena.": "The page you are looking for does not exist or has been moved."
  };

  const DICT = { en: EN };
  const norm = s => s.replace(/\s+/g, " ").trim();

  /** Prevodi tekst; {param} zamjenjuje vrijednostima iz params. */
  function t(key, params) {
    let s = (lang !== "hr" && DICT[lang]?.[key]) || key;
    if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => params[k] ?? m);
    return s;
  }

  const ATTRS = ["placeholder", "alt", "aria-label", "title"];

  /** Prevodi sav statički tekst i atribute unutar root elementa. */
  function translate(root = document.body) {
    if (lang === "hr" || !root) return;
    const dict = DICT[lang];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => ["SCRIPT", "STYLE"].includes(n.parentNode?.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      const key = norm(n.nodeValue);
      if (key && dict[key]) {
        const lead = n.nodeValue.match(/^\s*/)[0], trail = n.nodeValue.match(/\s*$/)[0];
        n.nodeValue = lead + dict[key] + trail;
      }
    }
    const els = root.querySelectorAll ? [root, ...root.querySelectorAll("[placeholder],[alt],[aria-label],[title]")] : [];
    for (const el of els) {
      for (const a of ATTRS) {
        const v = el.getAttribute?.(a);
        if (v && dict[norm(v)]) el.setAttribute(a, dict[norm(v)]);
      }
    }
  }

  function translateTitle() {
    if (lang === "hr") return;
    document.title = t(norm(document.title));
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = t(norm(meta.content));
  }

  /** Mijenja jezik i ponovno učitava stranicu. */
  function setLang(l) {
    if (!SUPPORTED.includes(l) || l === lang) return;
    try { localStorage.setItem("gc-lang", l); } catch { }
    const url = new URL(location);
    url.searchParams.delete("lang");
    location.href = url;
  }

  // Automatski prevodi i sadržaj koji JS doda kasnije (kartice vozila, novosti...)
  function observe() {
    if (lang === "hr") return;
    new MutationObserver(muts => {
      for (const m of muts) {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) translate(node);
          else if (node.nodeType === 3 && node.parentNode) translate(node.parentNode);
        });
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  /** Poziva main.js nakon iscrtavanja headera i footera. */
  function init() {
    translate(document.body);
    translateTitle();
    observe();
    document.documentElement.classList.remove("gc-i18n-pending");
  }

  return {
    get lang() { return lang; },
    locale: lang === "en" ? "en-GB" : "hr-HR",
    t, translate, setLang, init
  };
})();
