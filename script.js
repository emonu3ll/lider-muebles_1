/* ============================================================
   LÍDER MUEBLES — Curuguaty
   script.js — datos demo (sin Firebase) + toda la interactividad
   Cuando conectemos Firebase, este mismo archivo se adapta:
   PRODUCTS/SERVICES/FAQS/ABOUT_FEATURES pasan a venir de Firestore
   en vez de estar hardcodeados acá.
   ============================================================ */

/* ------------------------------------------------------------
   1) DATOS DEL NEGOCIO (placeholders — reemplazar por los reales)
   ------------------------------------------------------------ */
const BUSINESS = {
  name: "Líder Muebles",
  shortTag: "Mueblería en Curuguaty",
  tagline: "Todo lo que necesitás para equipar tu casa, en un solo lugar.",
  heroTag: "Mueblería de barrio en Curuguaty",
  heroTitle: "Muebles pensados para <em>tu día a día</em>",
  heroLead:
    "En Líder Muebles de Curuguaty encontrás living, dormitorio, comedor, cocina, oficina, exterior, colchones y decoración — con materiales que aguantan el uso real de todos los días.",
  aboutIntro:
    "Somos un negocio familiar de Curuguaty. No vendemos catálogo por catálogo: te ayudamos a elegir el mueble que realmente entra en tu casa y aguanta el uso de todos los días.",
  // Placeholder — reemplazar por el WhatsApp real del local
  whatsapp: "595981234567",
  whatsappDisplay: "+595 981 234 567",
  // Placeholder — reemplazar por el email real
  email: "contacto@lidermueblescuruguaty.com.py",
  // Ubicación aproximada — Curuguaty es la capital de Canindeyú
  address: "Sobre Ruta VII, Curuguaty, Canindeyú, Paraguay",
  addressMapsQuery: "Curuguaty, Canindeyú, Paraguay",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  usdRate: 5850, // Gs. por USD — referencial, para la vista previa en dólares
};

/* ------------------------------------------------------------
   2) CATEGORÍAS
   ------------------------------------------------------------ */
const CATEGORIES = [
  "Living",
  "Dormitorio",
  "Comedor",
  "Cocina",
  "Oficina",
  "Exterior",
  "Colchones",
  "Decoración",
];

/* ------------------------------------------------------------
   3) PRODUCTOS DEMO
   ------------------------------------------------------------ */
const PRODUCTS = [
  {
    id: "p01",
    sku: "LM-SOF-301",
    name: "Sofá 3 cuerpos Bosque",
    category: "Living",
    price: 3200000,
    oldPrice: 3800000,
    stockLabel: "Últimas unidades",
    stockLow: true,
    isOffer: true,
    isNew: false,
    isFeatured: true,
    showInFeaturedPanel: true,
    featuredAvailable: 6,
    featuredTotal: 20,
    featuredConsultas: 47,
    description:
      "Sofá de 3 cuerpos con estructura de madera maciza y tapizado resistente al uso diario. Ideal para living principal.",
    specs: {
      medidas: "210 x 90 x 85 cm",
      material: "Madera de pino + tapizado antimanchas",
      terminacion: "Verde salvia / Gris piedra",
      garantia: "12 meses",
    },
    images: ["img/living-sofa.svg", "img/living-textura.svg"],
  },
  {
    id: "p02",
    sku: "LM-SIL-118",
    name: "Sillón individual Roble",
    category: "Living",
    price: 950000,
    stockLabel: "Disponible",
    description: "Sillón individual con apoyabrazos, cómodo para lectura o TV.",
    specs: {
      medidas: "80 x 85 x 90 cm",
      material: "Estructura de roble + tela",
      terminacion: "Beige / Terracota",
      garantia: "12 meses",
    },
    images: ["img/living-sofa.svg", "img/living-textura.svg"],
  },
  {
    id: "p03",
    sku: "LM-RCK-220",
    name: "Rack de TV Curuguaty 1.60m",
    category: "Living",
    price: 780000,
    stockLabel: "Disponible",
    isNew: true,
    description: "Rack de TV con 2 puertas y espacio para equipos, hasta TV de 55\".",
    specs: {
      medidas: "160 x 40 x 45 cm",
      material: "MDF melamínico",
      terminacion: "Nogal / Blanco",
      garantia: "6 meses",
    },
    images: ["img/living-sofa.svg", "img/living-textura.svg"],
  },
  {
    id: "p04",
    sku: "LM-CAM-450",
    name: "Cama Queen Nogal con respaldo",
    category: "Dormitorio",
    price: 1450000,
    stockLabel: "Disponible",
    isNew: true,
    description: "Cama tamaño queen con respaldo tapizado y base reforzada.",
    specs: {
      medidas: "160 x 200 cm (queen)",
      material: "Madera maciza + tapizado",
      terminacion: "Nogal / Gris",
      garantia: "12 meses",
    },
    images: ["img/dormitorio-cama.svg", "img/dormitorio-textura.svg"],
  },
  {
    id: "p05",
    sku: "LM-PLA-600",
    name: "Placard 6 puertas Aurora",
    category: "Dormitorio",
    price: 2100000,
    stockLabel: "A pedido",
    description: "Placard amplio de 6 puertas con espejo central y cajones internos.",
    specs: {
      medidas: "240 x 60 x 200 cm",
      material: "MDF melamínico",
      terminacion: "Blanco / Nogal",
      garantia: "12 meses",
    },
    images: ["img/dormitorio-cama.svg", "img/dormitorio-textura.svg"],
  },
  {
    id: "p06",
    sku: "LM-MLZ-090",
    name: "Mesa de luz Sabana",
    category: "Dormitorio",
    price: 320000,
    stockLabel: "Disponible",
    description: "Mesa de luz con un cajón y estante inferior.",
    specs: {
      medidas: "40 x 35 x 50 cm",
      material: "MDF",
      terminacion: "Nogal / Blanco",
      garantia: "6 meses",
    },
    images: ["img/dormitorio-cama.svg", "img/dormitorio-textura.svg"],
  },
  {
    id: "p07",
    sku: "LM-JCM-620",
    name: "Juego de comedor 6 sillas Guaraní",
    category: "Comedor",
    price: 2650000,
    stockLabel: "Disponible",
    isFeatured: true,
    description: "Mesa de comedor con 6 sillas tapizadas, ideal para reuniones familiares.",
    specs: {
      medidas: "Mesa 180 x 90 x 75 cm",
      material: "Madera maciza + tela",
      terminacion: "Nogal / Beige",
      garantia: "12 meses",
    },
    images: ["img/comedor-mesa.svg", "img/comedor-textura.svg"],
  },
  {
    id: "p08",
    sku: "LM-MAX-140",
    name: "Mesa auxiliar redonda",
    category: "Comedor",
    price: 380000,
    stockLabel: "Disponible",
    description: "Mesa auxiliar redonda, útil como apoyo o mesa de café.",
    specs: {
      medidas: "Ø 60 x 45 cm",
      material: "Madera de pino",
      terminacion: "Natural",
      garantia: "6 meses",
    },
    images: ["img/comedor-mesa.svg", "img/comedor-textura.svg"],
  },
  {
    id: "p09",
    sku: "LM-ALA-380",
    name: "Alacena de cocina 1.80m",
    category: "Cocina",
    price: 1150000,
    stockLabel: "Disponible",
    description: "Alacena superior de cocina con puertas batientes, 1.80 metros.",
    specs: {
      medidas: "180 x 35 x 70 cm",
      material: "MDF melamínico hidrófugo",
      terminacion: "Blanco / Roble",
      garantia: "12 meses",
    },
    images: ["img/cocina-mueble.svg", "img/cocina-textura.svg"],
  },
  {
    id: "p10",
    sku: "LM-MBM-380",
    name: "Mueble bajo mesada 1.80m",
    category: "Cocina",
    price: 980000,
    stockLabel: "Disponible",
    isOffer: true,
    oldPrice: 1150000,
    description: "Mueble bajo mesada con cajones y puertas, resistente a la humedad.",
    specs: {
      medidas: "180 x 55 x 85 cm",
      material: "MDF hidrófugo",
      terminacion: "Blanco / Gris",
      garantia: "12 meses",
    },
    images: ["img/cocina-mueble.svg", "img/cocina-textura.svg"],
  },
  {
    id: "p11",
    sku: "LM-ESC-140",
    name: "Escritorio Estudio con cajonera",
    category: "Oficina",
    price: 890000,
    stockLabel: "Disponible",
    isFeatured: true,
    description: "Escritorio con cajonera lateral, ideal para home office.",
    specs: {
      medidas: "120 x 55 x 75 cm",
      material: "MDF + estructura metálica",
      terminacion: "Nogal / Negro",
      garantia: "12 meses",
    },
    images: ["img/oficina-escritorio.svg", "img/oficina-textura.svg"],
  },
  {
    id: "p12",
    sku: "LM-SLE-090",
    name: "Silla de escritorio ergonómica",
    category: "Oficina",
    price: 420000,
    stockLabel: "Disponible",
    description: "Silla ergonómica con altura regulable y apoyo lumbar.",
    specs: {
      medidas: "60 x 60 x 110-120 cm",
      material: "Malla + base metálica",
      terminacion: "Gris / Negro",
      garantia: "6 meses",
    },
    images: ["img/oficina-escritorio.svg", "img/oficina-textura.svg"],
  },
  {
    id: "p13",
    sku: "LM-EST-160",
    name: "Estantería 5 niveles Multiuso",
    category: "Oficina",
    price: 350000,
    stockLabel: "Disponible",
    description: "Estantería de 5 niveles, útil para oficina, cocina o living.",
    specs: {
      medidas: "80 x 30 x 160 cm",
      material: "MDF + caño",
      terminacion: "Nogal / Negro",
      garantia: "6 meses",
    },
    images: ["img/oficina-escritorio.svg", "img/oficina-textura.svg"],
  },
  {
    id: "p14",
    sku: "LM-PAR-100",
    name: "Parrillero de hierro con mesada",
    category: "Exterior",
    price: 1350000,
    oldPrice: 1600000,
    stockLabel: "Últimas unidades",
    stockLow: true,
    isOffer: true,
    description: "Parrillero de hierro con mesada lateral y parrilla regulable en altura.",
    specs: {
      medidas: "100 x 60 x 90 cm",
      material: "Hierro tratado + mesada de ladrillo",
      terminacion: "Negro forja",
      garantia: "12 meses",
    },
    images: ["img/exterior-parrilla.svg", "img/exterior-textura.svg"],
  },
  {
    id: "p15",
    sku: "LM-JAR-450",
    name: "Juego de jardín mesa + 4 sillas",
    category: "Exterior",
    price: 1780000,
    stockLabel: "Disponible",
    isNew: true,
    description: "Set de jardín para exterior, resistente a la intemperie.",
    specs: {
      medidas: "Mesa 140 x 80 x 74 cm",
      material: "Aluminio + tejido sintético",
      terminacion: "Gris grafito",
      garantia: "12 meses",
    },
    images: ["img/exterior-parrilla.svg", "img/exterior-textura.svg"],
  },
  {
    id: "p16",
    sku: "LM-COQ-160",
    name: "Colchón Queen resortes Confort",
    category: "Colchones",
    price: 1550000,
    stockLabel: "Disponible",
    isNew: true,
    description: "Colchón queen de resortes ensacados, soporte firme y transpirable.",
    specs: {
      medidas: "160 x 200 x 28 cm",
      material: "Resortes + espuma viscoelástica",
      terminacion: "Blanco acolchado",
      garantia: "24 meses",
    },
    images: ["img/colchones-colchon.svg", "img/colchones-textura.svg"],
  },
  {
    id: "p17",
    sku: "LM-CO1-090",
    name: "Colchón 1 plaza espuma Suave",
    category: "Colchones",
    price: 620000,
    stockLabel: "Disponible",
    description: "Colchón de una plaza en espuma de alta densidad.",
    specs: {
      medidas: "90 x 190 x 22 cm",
      material: "Espuma alta densidad",
      terminacion: "Blanco",
      garantia: "18 meses",
    },
    images: ["img/colchones-colchon.svg", "img/colchones-textura.svg"],
  },
  {
    id: "p18",
    sku: "LM-ESP-160",
    name: "Espejo de pie con marco",
    category: "Decoración",
    price: 480000,
    stockLabel: "Disponible",
    description: "Espejo de pie con marco de madera, ideal para dormitorio o vestidor.",
    specs: {
      medidas: "45 x 160 cm",
      material: "Vidrio + marco de madera",
      terminacion: "Nogal",
      garantia: "6 meses",
    },
    images: ["img/decoracion-mix.svg", "img/decoracion-textura.svg"],
  },
  {
    id: "p19",
    sku: "LM-LAM-140",
    name: "Lámpara de pie Cálida",
    category: "Decoración",
    price: 310000,
    stockLabel: "Disponible",
    description: "Lámpara de pie con pantalla textil, luz cálida ambiental.",
    specs: {
      medidas: "35 x 35 x 140 cm",
      material: "Metal + pantalla textil",
      terminacion: "Cobre / Crudo",
      garantia: "6 meses",
    },
    images: ["img/decoracion-mix.svg", "img/decoracion-textura.svg"],
  },
  {
    id: "p20",
    sku: "LM-MAC-002",
    name: "Set de maceteros decorativos x2",
    category: "Decoración",
    price: 145000,
    stockLabel: "Disponible",
    description: "Set de 2 maceteros de cerámica en distintos tamaños.",
    specs: {
      medidas: "20 y 28 cm de diámetro",
      material: "Cerámica esmaltada",
      terminacion: "Verde salvia / Terracota",
      garantia: "—",
    },
    images: ["img/decoracion-mix.svg", "img/decoracion-textura.svg"],
  },
];

/* ------------------------------------------------------------
   4) SERVICIOS
   ------------------------------------------------------------ */
const SERVICES = [
  {
    title: "Delivery en Curuguaty y alrededores",
    description: "Llevamos tu mueble hasta la puerta de tu casa, coordinando el horario que te quede mejor.",
    image: "img/exterior-textura.svg",
  },
  {
    title: "Armado e instalación incluida",
    description: "Nuestro equipo arma y ubica el mueble en su lugar, sin que tengas que mover un dedo.",
    image: "img/oficina-textura.svg",
  },
  {
    title: "Muebles a medida",
    description: "¿No entra ningún mueble estándar en tu espacio? Lo hacemos a la medida exacta que necesitás.",
    image: "img/comedor-textura.svg",
  },
  {
    title: "Asesoramiento personalizado",
    description: "Te ayudamos a elegir según el espacio, el uso y el presupuesto que tengas pensado.",
    image: "img/living-textura.svg",
  },
];

/* ------------------------------------------------------------
   5) SOBRE NOSOTROS
   ------------------------------------------------------------ */
const ABOUT_FEATURES = [
  {
    title: "+10 años en Curuguaty",
    description: "Somos parte del barrio desde hace más de una década.",
    icon: "star",
  },
  {
    title: "Todo en un solo lugar",
    description: "De living a parrilleros: no hace falta ir a cinco lugares distintos.",
    icon: "grid",
  },
  {
    title: "Materiales que aguantan",
    description: "Elegimos maderas y tapizados pensados para el uso diario real.",
    icon: "shield",
  },
  {
    title: "Atención de local de barrio",
    description: "Te atendemos nosotros mismos, sin vueltas ni call centers.",
    icon: "heart",
  },
];

/* ------------------------------------------------------------
   6) PREGUNTAS FRECUENTES
   ------------------------------------------------------------ */
const FAQS = [
  {
    q: "¿Hacen envíos fuera de Curuguaty?",
    a: "Sí, coordinamos envíos a localidades cercanas dentro de Canindeyú. Consultanos por WhatsApp el costo según la zona.",
  },
  {
    q: "¿Puedo pagar en cuotas?",
    a: "Sí, trabajamos con distintas formas de pago. Contanos qué producto te interesa y te contamos las opciones disponibles.",
  },
  {
    q: "¿Los muebles tienen garantía?",
    a: "Todos nuestros muebles tienen garantía contra defectos de fabricación. El tiempo varía según el producto (lo indicamos en cada ficha).",
  },
  {
    q: "¿Hacen muebles a medida?",
    a: "Sí, si no encontrás el tamaño exacto que necesitás, lo fabricamos a pedido. Escribinos por WhatsApp con las medidas de tu espacio.",
  },
  {
    q: "¿Puedo ver los productos antes de comprar?",
    a: "Por supuesto, te esperamos en nuestro local en Curuguaty para que veas los muebles de cerca antes de decidir.",
  },
];

/* ------------------------------------------------------------
   7) HELPERS
   ------------------------------------------------------------ */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function formatGs(n) {
  return "Gs. " + Math.round(n).toLocaleString("es-PY");
}
function formatUsd(n) {
  return "USD " + Math.round(n / BUSINESS.usdRate).toLocaleString("en-US");
}
function waLink(message) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}
function productWaMessage(p) {
  return `Hola! Quiero consultar por *${p.name}* (código ${p.sku}) que vi en la página de ${BUSINESS.name}.`;
}

/* ------------------------------------------------------------
   8) ESTADO DE FILTROS
   ------------------------------------------------------------ */
const state = {
  search: "",
  category: "all",
  tab: "todos", // todos | destacados | ofertas | nuevos
  sort: "relevancia", // relevancia | menor | mayor
};

/* ------------------------------------------------------------
   9) RENDER: MARCA / HERO
   ------------------------------------------------------------ */
function renderBrand() {
  qsa("[data-brand-name]").forEach((el) => (el.textContent = BUSINESS.name));
  qsa("[data-brand-tag]").forEach((el) => (el.textContent = BUSINESS.shortTag));
  const heroTag = qs("#heroTagText");
  if (heroTag) heroTag.textContent = BUSINESS.heroTag;
  const heroTitle = qs("#heroTitle");
  if (heroTitle) heroTitle.innerHTML = BUSINESS.heroTitle;
  const heroLead = qs("#heroLead");
  if (heroLead) heroLead.textContent = BUSINESS.heroLead;
  const aboutIntro = qs("#aboutIntroText");
  if (aboutIntro) aboutIntro.textContent = BUSINESS.aboutIntro;
}

/* ------------------------------------------------------------
   10) RENDER: CHIPS + SELECT DE CATEGORÍA
   ------------------------------------------------------------ */
function renderCategoryUI() {
  const chipRow = qs("#categoryChips");
  const select = qs("#categorySelect");
  if (chipRow) {
    chipRow.innerHTML =
      `<button class="chip is-active" data-cat="all">Todos</button>` +
      CATEGORIES.map((c) => `<button class="chip" data-cat="${c}">${c}</button>`).join("");
  }
  if (select) {
    select.innerHTML =
      `<option value="all">Todas las categorías</option>` +
      CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("");
  }
}

/* ------------------------------------------------------------
   11) PANEL DESTACADO
   ------------------------------------------------------------ */
function renderFeaturedPanel() {
  const el = qs("#featuredPanel");
  if (!el) return;
  const p = PRODUCTS.find((x) => x.showInFeaturedPanel) || PRODUCTS[0];
  const pct = Math.round((p.featuredAvailable / p.featuredTotal) * 100);
  el.innerHTML = `
    <div class="featured-media">
      ${p.isOffer ? `<span class="badge badge--oferta">Oferta</span>` : `<span class="badge badge--destacado">Destacado</span>`}
      <img src="${p.images[0]}" alt="${p.name}">
    </div>
    <div class="featured-info">
      <span class="section-kicker">Producto destacado de la semana</span>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="featured-price">
        <span class="now">${formatGs(p.price)}</span>
        ${p.oldPrice ? `<span class="before">${formatGs(p.oldPrice)}</span>` : ""}
      </div>
      <div class="progress-wrap">
        <div class="progress-labels">
          <span>${p.featuredAvailable} disponibles</span>
          <span>${p.featuredConsultas} consultas esta semana</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="featured-actions">
        <a class="btn btn-whatsapp" href="${waLink(productWaMessage(p))}" target="_blank" rel="noopener">
          ${icon("whatsapp")} Consultar por WhatsApp
        </a>
        <button class="btn btn-outline" style="background:transparent;border-color:rgba(255,255,255,.4);color:#fff" onclick="openProductModal('${p.id}')">Ver detalle</button>
      </div>
    </div>
  `;
}

/* ------------------------------------------------------------
   12) FILTRADO + GRILLA
   ------------------------------------------------------------ */
function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (state.tab === "destacados") list = list.filter((p) => p.isFeatured);
  if (state.tab === "ofertas") list = list.filter((p) => p.isOffer);
  if (state.tab === "nuevos") list = list.filter((p) => p.isNew);

  if (state.category !== "all") list = list.filter((p) => p.category === state.category);

  if (state.search.trim()) {
    const term = state.search.trim().toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    );
  }

  if (state.sort === "menor") list.sort((a, b) => a.price - b.price);
  if (state.sort === "mayor") list.sort((a, b) => b.price - a.price);

  return list;
}

function productCardHTML(p) {
  const badge = p.isOffer
    ? `<span class="badge badge--oferta">Oferta</span>`
    : p.isNew
    ? `<span class="badge badge--nuevo">Nuevo</span>`
    : p.isFeatured
    ? `<span class="badge badge--destacado">Destacado</span>`
    : "";
  return `
    <article class="product-card reveal" data-id="${p.id}">
      <div class="product-media" onclick="openProductModal('${p.id}')">
        ${badge}
        <button class="share-btn" title="Compartir" onclick="event.stopPropagation(); shareProduct('${p.id}')">${icon("share")}</button>
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-body" onclick="openProductModal('${p.id}')">
        <span class="product-cat">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <span class="product-stock ${p.stockLow ? "is-low" : ""}">${p.stockLabel}</span>
        <div class="product-price">
          <div>
            <span class="now">${formatGs(p.price)}</span>
            ${p.oldPrice ? `<span class="before">${formatGs(p.oldPrice)}</span>` : ""}
            <span class="usd">≈ ${formatUsd(p.price)}</span>
          </div>
        </div>
      </div>
      <div class="product-actions">
        <a class="btn btn-whatsapp btn-block btn-sm" href="${waLink(productWaMessage(p))}" target="_blank" rel="noopener">
          ${icon("whatsapp")} Consultar
        </a>
      </div>
    </article>
  `;
}

function renderGrid() {
  const grid = qs("#productGrid");
  if (!grid) return;
  const list = getFilteredProducts();
  grid.innerHTML = list.length
    ? list.map(productCardHTML).join("")
    : `<div class="empty-state">No encontramos productos con ese filtro. Probá con otra categoría o búsqueda.</div>`;
  requestAnimationFrame(observeReveal);
}

/* ------------------------------------------------------------
   13) MODAL DE PRODUCTO + CARRUSEL + LIGHTBOX
   ------------------------------------------------------------ */
let currentProduct = null;
let currentSlide = 0;

function openProductModal(id, shared = false) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  currentProduct = p;
  currentSlide = 0;

  qs("#modalCat").textContent = p.category;
  qs("#modalName").textContent = p.name;
  qs("#modalDesc").textContent = p.description;
  qs("#modalPriceNow").textContent = formatGs(p.price);
  qs("#modalPriceUsd").textContent = "≈ " + formatUsd(p.price);
  const before = qs("#modalPriceBefore");
  if (p.oldPrice) {
    before.textContent = formatGs(p.oldPrice);
    before.classList.remove("hidden");
  } else {
    before.classList.add("hidden");
  }
  qs("#modalWaBtn").href = waLink(productWaMessage(p));

  const specsWrap = qs("#modalSpecs");
  specsWrap.innerHTML = Object.entries(p.specs)
    .map(
      ([key, val]) => `
      <div class="workshop-tag-item">
        <span>${specLabel(key)}</span>
        <strong>${val}</strong>
      </div>`
    )
    .join("");

  renderCarousel();

  qs("#modalShareNote").classList.toggle("is-visible", shared);

  qs("#productModal").classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function specLabel(key) {
  const map = { medidas: "Medidas", material: "Material", terminacion: "Terminación", garantia: "Garantía" };
  return map[key] || key;
}

function closeProductModal() {
  qs("#productModal").classList.remove("is-open");
  document.body.style.overflow = "";
}

function renderCarousel() {
  const track = qs("#carouselTrack");
  const dots = qs("#carouselDots");
  track.innerHTML = currentProduct.images
    .map(
      (src, i) =>
        `<div class="carousel-slide" onclick="openLightbox(${i})"><img src="${src}" alt="${currentProduct.name} ${i + 1}"></div>`
    )
    .join("");
  dots.innerHTML = currentProduct.images.map((_, i) => `<span class="${i === 0 ? "is-active" : ""}"></span>`).join("");
  updateCarousel();
}

function updateCarousel() {
  const track = qs("#carouselTrack");
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  qsa("#carouselDots span").forEach((d, i) => d.classList.toggle("is-active", i === currentSlide));
}

function moveCarousel(dir) {
  const total = currentProduct.images.length;
  currentSlide = (currentSlide + dir + total) % total;
  updateCarousel();
}

/* ---- Lightbox con zoom (mouse wheel, doble click, pellizco) ---- */
let lbScale = 1;
let lbPanX = 0;
let lbPanY = 0;
let lbPinchStartDist = 0;
let lbPinchStartScale = 1;

function openLightbox(index) {
  currentSlide = index;
  updateCarousel();
  const img = qs("#lightboxImg");
  img.src = currentProduct.images[index];
  resetLightboxZoom();
  qs("#lightbox").classList.add("is-open");
}
function closeLightbox() {
  qs("#lightbox").classList.remove("is-open");
}
function resetLightboxZoom() {
  lbScale = 1;
  lbPanX = 0;
  lbPanY = 0;
  applyLightboxTransform();
}
function applyLightboxTransform() {
  qs("#lightboxImg").style.transform = `translate(${lbPanX}px, ${lbPanY}px) scale(${lbScale})`;
}

function initLightboxGestures() {
  const img = qs("#lightboxImg");
  const stage = qs("#lightbox");
  if (!img || !stage) return; // admin.html no tiene lightbox de producto

  // Doble click / doble toque → alterna zoom
  let lastTap = 0;
  stage.addEventListener("click", (e) => {
    if (e.target.id !== "lightboxImg") return;
    const now = Date.now();
    if (now - lastTap < 350) {
      lbScale = lbScale > 1 ? 1 : 2.2;
      lbPanX = 0;
      lbPanY = 0;
      applyLightboxTransform();
    }
    lastTap = now;
  });

  // Rueda del mouse → zoom (desktop)
  stage.addEventListener(
    "wheel",
    (e) => {
      if (!qs("#lightbox").classList.contains("is-open")) return;
      e.preventDefault();
      lbScale = Math.min(4, Math.max(1, lbScale - e.deltaY * 0.0015));
      applyLightboxTransform();
    },
    { passive: false }
  );

  // Pellizco (pinch) en mobile
  stage.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 2) {
        lbPinchStartDist = touchDist(e.touches);
        lbPinchStartScale = lbScale;
      }
    },
    { passive: true }
  );
  stage.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = touchDist(e.touches);
        const ratio = dist / (lbPinchStartDist || dist);
        lbScale = Math.min(4, Math.max(1, lbPinchStartScale * ratio));
        applyLightboxTransform();
      }
    },
    { passive: false }
  );
}
function touchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/* ------------------------------------------------------------
   14) COMPARTIR PRODUCTO
   ------------------------------------------------------------ */
function shareProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("producto", id);
  const shareUrl = url.toString();

  if (navigator.share) {
    navigator
      .share({ title: `${p.name} — ${BUSINESS.name}`, text: `Mirá este mueble en ${BUSINESS.name}`, url: shareUrl })
      .catch(() => {});
  } else {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => showToast("Link copiado. ¡Pegalo donde quieras!", "success"))
      .catch(() => showToast("No se pudo copiar el link", "error"));
  }
}

function checkSharedProductInURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("producto");
  if (id && PRODUCTS.some((p) => p.id === id)) {
    openProductModal(id, true);
  }
}

/* ------------------------------------------------------------
   15) SERVICIOS / SOBRE NOSOTROS / FAQ / CONTACTO
   ------------------------------------------------------------ */
function renderServices() {
  const el = qs("#servicesGrid");
  if (!el) return;
  el.innerHTML = SERVICES.map(
    (s) => `
    <div class="service-card reveal">
      <div class="service-media"><img src="${s.image}" alt="${s.title}"></div>
      <div class="service-body">
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <a class="btn btn-whatsapp btn-sm btn-block" href="${waLink(`Hola! Quiero consultar sobre el servicio de "${s.title}".`)}" target="_blank" rel="noopener">${icon("whatsapp")} Consultar</a>
      </div>
    </div>`
  ).join("");
}

function renderAbout() {
  const el = qs("#aboutFeatures");
  if (!el) return;
  el.innerHTML = ABOUT_FEATURES.map(
    (f) => `
    <div class="about-feature">
      <div class="about-feature-icon">${icon(f.icon)}</div>
      <div>
        <h4>${f.title}</h4>
        <p>${f.description}</p>
      </div>
    </div>`
  ).join("");
}

function renderFAQ() {
  const el = qs("#faqList");
  if (!el) return;
  el.innerHTML = FAQS.map(
    (f, i) => `
    <div class="faq-item" data-index="${i}">
      <button class="faq-question" onclick="toggleFaq(${i})">
        <span>${f.q}</span>
        ${icon("plus")}
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">${f.a}</div></div>
    </div>`
  ).join("");
}

function toggleFaq(i) {
  const item = qs(`.faq-item[data-index="${i}"]`);
  const wasOpen = item.classList.contains("is-open");
  qsa(".faq-item").forEach((el) => el.classList.remove("is-open"));
  if (!wasOpen) item.classList.add("is-open");
}

function renderContact() {
  // Nota: usamos ?. en cada elemento porque este mismo script.js se
  // reutiliza en admin.html, donde estos IDs de contacto no existen.
  const contactWa = qs("#contactWa");
  if (contactWa) {
    contactWa.textContent = BUSINESS.whatsappDisplay;
    contactWa.href = waLink(`Hola! Te escribo desde la página de ${BUSINESS.name}.`);
  }
  const contactEmail = qs("#contactEmail");
  if (contactEmail) {
    contactEmail.textContent = BUSINESS.email;
    contactEmail.href = `mailto:${BUSINESS.email}`;
  }
  const contactAddress = qs("#contactAddress");
  if (contactAddress) contactAddress.textContent = BUSINESS.address;
  const contactMapLink = qs("#contactMapLink");
  if (contactMapLink) contactMapLink.href = `https://maps.google.com/?q=${encodeURIComponent(BUSINESS.addressMapsQuery)}`;
  const footerAddress = qs("#footerAddress");
  if (footerAddress) footerAddress.textContent = BUSINESS.address;
  const footerWa = qs("#footerWa");
  if (footerWa) footerWa.textContent = BUSINESS.whatsappDisplay;
  const footerEmail = qs("#footerEmail");
  if (footerEmail) footerEmail.textContent = BUSINESS.email;
  qsa("[data-social-ig]").forEach((a) => (a.href = BUSINESS.instagram));
  qsa("[data-social-fb]").forEach((a) => (a.href = BUSINESS.facebook));
}

function initContactForm() {
  const form = qs("#contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = data.get("nombre") || "";
    const telefono = data.get("telefono") || "";
    const mensaje = data.get("mensaje") || "";
    const text = `Hola! Soy ${nombre} (tel: ${telefono}).\n${mensaje}`;
    window.open(waLink(text), "_blank");
    showToast("Te llevamos a WhatsApp para enviar tu consulta", "success");
  });
}

/* ------------------------------------------------------------
   16) ICONOS (SVG inline, minimal)
   ------------------------------------------------------------ */
function icon(name) {
  const icons = {
    whatsapp:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.44 1.32 4.93L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.83 14.06c-.25.7-1.45 1.34-2 1.42-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.9-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.46.77-2.17 1.04-2.47.27-.3.6-.37.8-.37h.57c.18 0 .43-.03.66.5.25.6.85 2.06.92 2.21.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.32.38-.45.5-.15.15-.31.31-.13.6.18.3.8 1.32 1.72 2.14 1.19 1.06 2.19 1.39 2.5 1.55.31.15.5.13.68-.06.2-.2.79-.9.99-1.21.2-.31.4-.25.66-.15.27.1 1.7.8 1.99.95.3.15.49.22.56.35.08.13.08.72-.17 1.42Z"/></svg>',
    share:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="10.5" x2="15.4" y2="6.5"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/></svg>',
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.82Z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
    sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  };
  return icons[name] || "";
}

/* ------------------------------------------------------------
   17) TOASTS
   ------------------------------------------------------------ */
function showToast(message, type = "success") {
  const stack = qs("#toastStack");
  if (!stack) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  stack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

/* ------------------------------------------------------------
   18) COOKIES
   ------------------------------------------------------------ */
function initCookies() {
  const banner = qs("#cookieBanner");
  if (!banner) return;
  if (!localStorage.getItem("lm_cookies_ok")) {
    setTimeout(() => banner.classList.add("is-visible"), 900);
  }
  qs("#cookieAccept").addEventListener("click", () => {
    localStorage.setItem("lm_cookies_ok", "1");
    banner.classList.remove("is-visible");
  });
}

/* ------------------------------------------------------------
   19) CHAT BUBBLE DE BIENVENIDA
   ------------------------------------------------------------ */
function initChatBubble() {
  const bubble = qs("#chatBubble");
  if (!bubble) return;
  if (sessionStorage.getItem("lm_bubble_closed")) return;
  setTimeout(() => bubble.classList.add("is-visible"), 2600);
  qs("#chatBubbleClose").addEventListener("click", (e) => {
    e.stopPropagation();
    bubble.classList.remove("is-visible");
    sessionStorage.setItem("lm_bubble_closed", "1");
  });
}

/* ------------------------------------------------------------
   20) REVEAL ON SCROLL
   ------------------------------------------------------------ */
let revealObserver;
function observeReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }
  qsa(".reveal").forEach((el) => {
    if (!el.classList.contains("is-visible")) revealObserver.observe(el);
  });
}

/* ------------------------------------------------------------
   21) NAV MOBILE
   ------------------------------------------------------------ */
function initNav() {
  const toggle = qs("#navToggle");
  const links = qs("#navLinks");
  if (!toggle) return;
  toggle.addEventListener("click", () => links.classList.toggle("is-open"));
  qsa("#navLinks a").forEach((a) => a.addEventListener("click", () => links.classList.remove("is-open")));
}

/* ------------------------------------------------------------
   22) WIRING DE FILTROS
   ------------------------------------------------------------ */
function initFilters() {
  qs("#categoryChips")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    state.category = btn.dataset.cat;
    qsa("#categoryChips .chip").forEach((c) => c.classList.toggle("is-active", c === btn));
    const select = qs("#categorySelect");
    if (select) select.value = btn.dataset.cat;
    renderGrid();
  });

  qs("#categorySelect")?.addEventListener("change", (e) => {
    state.category = e.target.value;
    qsa("#categoryChips .chip").forEach((c) => c.classList.toggle("is-active", c.dataset.cat === e.target.value));
    renderGrid();
  });

  qs("#sortSelect")?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrid();
  });

  qs("#searchInput")?.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
  });
  qs("#searchBtn")?.addEventListener("click", () => renderGrid());

  qsa(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tab = btn.dataset.tab;
      qsa(".tab-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderGrid();
    });
  });
}

/* ------------------------------------------------------------
   23) INIT GENERAL
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderBrand();
  renderCategoryUI();
  renderFeaturedPanel();
  renderGrid();
  renderServices();
  renderAbout();
  renderFAQ();
  renderContact();
  initFilters();
  initContactForm();
  initNav();
  initCookies();
  initChatBubble();
  initLightboxGestures();
  observeReveal();
  checkSharedProductInURL();

  qs("#modalClose")?.addEventListener("click", closeProductModal);
  qs("#productModal")?.addEventListener("click", (e) => {
    if (e.target.id === "productModal") closeProductModal();
  });
  qs("#carouselPrev")?.addEventListener("click", () => moveCarousel(-1));
  qs("#carouselNext")?.addEventListener("click", () => moveCarousel(1));
  qs("#lightboxClose")?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeProductModal();
    }
    // Atajo del admin: Alt+Shift+A
    if (e.altKey && e.shiftKey && e.key.toUpperCase() === "A") {
      window.location.href = "admin.html";
    }
  });
});
