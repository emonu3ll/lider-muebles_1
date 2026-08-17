/* ============================================================
   LÍDER MUEBLES — Panel de administración
   admin.js — se carga DESPUÉS de script.js y reutiliza sus datos
   (PRODUCTS, SERVICES, FAQS, ABOUT_FEATURES, BUSINESS, CATEGORIES)
   y helpers (qs, qsa, formatGs, formatUsd, showToast, icon...).

   Modo demo: todo vive en memoria del navegador. Si recargás la
   página, los cambios se pierden — eso lo resuelve Firebase más
   adelante, cuando lo conectemos.
   ============================================================ */

/* ------------------------------------------------------------
   1) LOGIN
   ------------------------------------------------------------ */
function initAdminLogin() {
  const loginScreen = qs("#loginScreen");
  const app = qs("#adminApp");
  const savedEmail = sessionStorage.getItem("lm_admin_email");

  if (savedEmail) {
    enterApp(savedEmail);
  }

  qs("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = qs("#loginEmail").value.trim();
    const password = qs("#loginPassword").value.trim();
    const error = qs("#loginError");
    if (!email || !password) {
      error.classList.add("is-visible");
      return;
    }
    error.classList.remove("is-visible");
    sessionStorage.setItem("lm_admin_email", email);
    enterApp(email);
  });

  qs("#logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("lm_admin_email");
    location.reload();
  });

  function enterApp(email) {
    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");
    qs("#topbarUser").textContent = email;
    initAdminApp();
  }
}

/* ------------------------------------------------------------
   2) NAVEGACIÓN ENTRE SECCIONES
   ------------------------------------------------------------ */
const SECTION_TITLES = {
  productos: "Productos",
  servicios: "Servicios",
  faq: "Preguntas frecuentes",
  nosotros: "Sobre nosotros",
  contacto: "Contacto y redes",
  portada: "Portada (hero)",
};

function initAdminNav() {
  qsa(".admin-nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.section;
      qsa(".admin-nav-item").forEach((b) => b.classList.toggle("is-active", b === btn));
      qsa(".admin-section").forEach((s) => s.classList.toggle("is-active", s.id === "section-" + key));
      qs("#topbarTitle").textContent = SECTION_TITLES[key] || "";
      qs("#adminSidebar").classList.remove("is-open");
    });
  });
  qs("#adminNavToggle")?.addEventListener("click", () => qs("#adminSidebar").classList.toggle("is-open"));
}

/* ------------------------------------------------------------
   3) INIT GENERAL DEL PANEL (se llama una vez logueado)
   ------------------------------------------------------------ */
let adminInitialized = false;
function initAdminApp() {
  if (adminInitialized) return;
  adminInitialized = true;

  initAdminNav();
  initProductsSection();
  initServicesSection();
  initFaqSection();
  initAboutSection();
  initContactSection();
  initHeroSection();
  initConfirmModal();
  initCropModal();
}

/* ------------------------------------------------------------
   4) HELPERS COMPARTIDOS
   ------------------------------------------------------------ */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setupDropzone(zoneEl, inputEl, onFiles) {
  if (!zoneEl || !inputEl) return;
  zoneEl.addEventListener("click", () => inputEl.click());
  inputEl.addEventListener("change", () => {
    onFiles(Array.from(inputEl.files));
    inputEl.value = "";
  });
  ["dragover", "dragenter"].forEach((evt) =>
    zoneEl.addEventListener(evt, (e) => {
      e.preventDefault();
      zoneEl.classList.add("is-dragover");
    })
  );
  ["dragleave", "dragend"].forEach((evt) => zoneEl.addEventListener(evt, () => zoneEl.classList.remove("is-dragover")));
  zoneEl.addEventListener("drop", (e) => {
    e.preventDefault();
    zoneEl.classList.remove("is-dragover");
    onFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")));
  });
}

function generateSku(category) {
  const prefix = "LM-" + (category || "GEN").slice(0, 3).toUpperCase();
  let sku;
  do {
    sku = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
  } while (PRODUCTS.some((p) => p.sku === sku));
  return sku;
}

function formatParaguayPhone(digits) {
  const clean = (digits || "").replace(/\D/g, "");
  if (clean.startsWith("595") && clean.length >= 11) {
    const rest = clean.slice(3);
    return "+595 " + rest.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3").trim();
  }
  return clean ? "+" + clean : "";
}

/* ------------------------------------------------------------
   5) MODAL DE CONFIRMACIÓN (genérico, reutilizable)
   ------------------------------------------------------------ */
let confirmCallback = null;
function initConfirmModal() {
  qs("#confirmCancel").addEventListener("click", closeConfirmModal);
  qs("#confirmModal").addEventListener("click", (e) => {
    if (e.target.id === "confirmModal") closeConfirmModal();
  });
  qs("#confirmOk").addEventListener("click", () => {
    if (confirmCallback) confirmCallback();
    closeConfirmModal();
  });
}
function confirmAction({ title, text, danger = false, confirmLabel = "Confirmar", onConfirm }) {
  qs("#confirmTitle").textContent = title;
  qs("#confirmText").textContent = text;
  qs("#confirmOk").textContent = confirmLabel;
  qs("#confirmOk").className = "btn " + (danger ? "btn-danger" : "btn-primary");
  qs("#confirmIcon").classList.toggle("danger", danger);
  confirmCallback = onConfirm;
  qs("#confirmModal").classList.add("is-open");
}
function closeConfirmModal() {
  qs("#confirmModal").classList.remove("is-open");
  confirmCallback = null;
}

/* ------------------------------------------------------------
   6) MODAL DE RECORTE DE IMAGEN
   ------------------------------------------------------------ */
const cropState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  naturalW: 0,
  naturalH: 0,
  frame: { x: 0, y: 0, w: 0, h: 0 },
  dragging: null,
  startPointer: { x: 0, y: 0 },
  startFrame: { x: 0, y: 0, w: 0, h: 0 },
  onApply: null,
};
const CROP_MIN = 40;

function openCropModal(src, onApply) {
  cropState.onApply = onApply;
  const img = qs("#cropImg");
  img.onload = () => {
    const stage = qs("#cropStage");
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    cropState.naturalW = img.naturalWidth;
    cropState.naturalH = img.naturalHeight;
    const scale = Math.max(stageW / cropState.naturalW, stageH / cropState.naturalH);
    const displayW = cropState.naturalW * scale;
    const displayH = cropState.naturalH * scale;
    cropState.scale = scale;
    cropState.offsetX = (stageW - displayW) / 2;
    cropState.offsetY = (stageH - displayH) / 2;
    img.style.width = displayW + "px";
    img.style.height = displayH + "px";
    img.style.left = cropState.offsetX + "px";
    img.style.top = cropState.offsetY + "px";

    const size = Math.min(stageW, stageH) * 0.7;
    setFrame((stageW - size) / 2, (stageH - size) / 2, size, size);
  };
  img.src = src;
  qs("#cropModal").classList.add("is-open");
}

function closeCropModal() {
  qs("#cropModal").classList.remove("is-open");
  cropState.onApply = null;
}

function setFrame(x, y, w, h) {
  const stage = qs("#cropStage");
  const stageW = stage.clientWidth;
  const stageH = stage.clientHeight;
  w = Math.max(CROP_MIN, Math.min(w, stageW));
  h = Math.max(CROP_MIN, Math.min(h, stageH));
  x = Math.max(0, Math.min(x, stageW - w));
  y = Math.max(0, Math.min(y, stageH - h));
  cropState.frame = { x, y, w, h };
  const frame = qs("#cropFrame");
  frame.style.left = x + "px";
  frame.style.top = y + "px";
  frame.style.width = w + "px";
  frame.style.height = h + "px";
}

function pointerXY(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function initCropModal() {
  const frame = qs("#cropFrame");
  const stage = qs("#cropStage");

  frame.addEventListener("mousedown", (e) => startDrag(e, "move"));
  frame.addEventListener("touchstart", (e) => startDrag(e, "move"), { passive: true });
  qsa(".crop-handle").forEach((handle) => {
    const corner = [...handle.classList].find((c) => c !== "crop-handle");
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      startDrag(e, corner);
    });
    handle.addEventListener(
      "touchstart",
      (e) => {
        e.stopPropagation();
        startDrag(e, corner);
      },
      { passive: true }
    );
  });

  function startDrag(e, mode) {
    cropState.dragging = mode;
    cropState.startPointer = pointerXY(e);
    cropState.startFrame = { ...cropState.frame };
  }

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDrag, { passive: false });
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);

  function onDrag(e) {
    if (!cropState.dragging) return;
    if (e.cancelable) e.preventDefault();
    const p = pointerXY(e);
    const dx = p.x - cropState.startPointer.x;
    const dy = p.y - cropState.startPointer.y;
    const f = cropState.startFrame;

    if (cropState.dragging === "move") {
      setFrame(f.x + dx, f.y + dy, f.w, f.h);
    } else if (cropState.dragging === "se") {
      setFrame(f.x, f.y, f.w + dx, f.h + dy);
    } else if (cropState.dragging === "nw") {
      setFrame(f.x + dx, f.y + dy, f.w - dx, f.h - dy);
    } else if (cropState.dragging === "ne") {
      setFrame(f.x, f.y + dy, f.w + dx, f.h - dy);
    } else if (cropState.dragging === "sw") {
      setFrame(f.x + dx, f.y, f.w - dx, f.h + dy);
    }
  }
  function stopDrag() {
    cropState.dragging = null;
  }

  qs("#cropCancel").addEventListener("click", closeCropModal);
  qs("#cropApply").addEventListener("click", () => {
    const { x, y, w, h } = cropState.frame;
    const imgX = Math.max(0, (x - cropState.offsetX) / cropState.scale);
    const imgY = Math.max(0, (y - cropState.offsetY) / cropState.scale);
    const imgW = Math.min(cropState.naturalW - imgX, w / cropState.scale);
    const imgH = Math.min(cropState.naturalH - imgY, h / cropState.scale);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(imgW);
    canvas.height = Math.round(imgH);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(qs("#cropImg"), imgX, imgY, imgW, imgH, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    if (cropState.onApply) cropState.onApply(dataUrl);
    closeCropModal();
  });
}

/* ------------------------------------------------------------
   7) PRODUCTOS
   ------------------------------------------------------------ */
let tempProductPhotos = [];
let editingProductId = null;

function initProductsSection() {
  const categorySelect = qs("#pfCategoria");
  categorySelect.innerHTML = CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("");

  renderProductsTable();

  qs("#productSearch").addEventListener("input", renderProductsTable);
  qs("#btnNewProduct").addEventListener("click", () => openProductDrawer(null));
  qs("#productDrawerClose").addEventListener("click", closeProductDrawer);
  qs("#productDrawerCancel").addEventListener("click", closeProductDrawer);
  qs("#productDrawer").addEventListener("click", (e) => {
    if (e.target.id === "productDrawer") closeProductDrawer();
  });
  qs("#productDrawerSave").addEventListener("click", saveProduct);
  qs("#pfPrecioGs").addEventListener("input", updatePricePreview);

  setupDropzone(qs("#productDropzone"), qs("#productPhotoInput"), async (files) => {
    for (const file of files) {
      const dataUrl = await readFileAsDataURL(file);
      tempProductPhotos.push({ src: dataUrl });
    }
    renderProductPhotoGrid();
  });
}

function renderProductsTable() {
  const term = qs("#productSearch").value.trim().toLowerCase();
  const list = PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)
  );
  const tbody = qs("#productsTableBody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="admin-empty">No hay productos que coincidan con la búsqueda.</td></tr>`;
    return;
  }
  tbody.innerHTML = list
    .map((p) => {
      const badge = p.isOffer
        ? `<span class="badge badge--oferta">Oferta</span>`
        : p.isNew
        ? `<span class="badge badge--nuevo">Nuevo</span>`
        : p.isFeatured
        ? `<span class="badge badge--destacado">Destacado</span>`
        : "—";
      return `
      <tr>
        <td>
          <div class="admin-row-name">
            <div class="admin-row-thumb"><img src="${p.images[0]}" alt=""></div>
            <div>
              <div>${p.name}</div>
              <div style="font-size:0.76rem;color:var(--ink-soft);">${p.sku}</div>
            </div>
          </div>
        </td>
        <td>${p.category}</td>
        <td>${formatGs(p.price)}<div style="font-size:0.76rem;color:var(--ink-soft);">${formatUsd(p.price)}</div></td>
        <td>${p.stockLabel}</td>
        <td>${badge}</td>
        <td>
          <div class="admin-row-actions">
            <button class="icon-btn" title="Editar" onclick="openProductDrawer('${p.id}')">${icon("edit")}</button>
            <button class="icon-btn danger" title="Eliminar" onclick="deleteProductPrompt('${p.id}')">${icon("trash")}</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");
}

function openProductDrawer(id) {
  editingProductId = id;
  const isEdit = Boolean(id);
  qs("#productDrawerTitle").textContent = isEdit ? "Editar producto" : "Nuevo producto";

  if (isEdit) {
    const p = PRODUCTS.find((x) => x.id === id);
    qs("#pfNombre").value = p.name;
    qs("#pfCategoria").value = p.category;
    qs("#pfSku").value = p.sku;
    qs("#pfDescripcion").value = p.description;
    qs("#pfPrecioGs").value = p.price;
    qs("#pfPrecioAnterior").value = p.oldPrice || "";
    const stockOptions = ["Disponible", "Últimas unidades", "A pedido", "Agotado"];
    qs("#pfStock").value = stockOptions.includes(p.stockLabel) ? p.stockLabel : "Disponible";
    qs("#pfBadgeOferta").checked = Boolean(p.isOffer);
    qs("#pfBadgeNuevo").checked = Boolean(p.isNew);
    qs("#pfBadgeDestacado").checked = Boolean(p.isFeatured);
    qs("#pfMedidas").value = p.specs?.medidas || "";
    qs("#pfMaterial").value = p.specs?.material || "";
    qs("#pfTerminacion").value = p.specs?.terminacion || "";
    qs("#pfGarantia").value = p.specs?.garantia || "";
    qs("#pfProveedorNombre").value = p.proveedor?.nombre || "";
    qs("#pfProveedorTelefono").value = p.proveedor?.telefono || "";
    qs("#pfProveedorCosto").value = p.proveedor?.costo || "";
    tempProductPhotos = (p.images || []).map((src) => ({ src }));
  } else {
    qs("#pfNombre").value = "";
    qs("#pfCategoria").value = CATEGORIES[0];
    qs("#pfSku").value = "";
    qs("#pfDescripcion").value = "";
    qs("#pfPrecioGs").value = "";
    qs("#pfPrecioAnterior").value = "";
    qs("#pfStock").value = "Disponible";
    qs("#pfBadgeOferta").checked = false;
    qs("#pfBadgeNuevo").checked = false;
    qs("#pfBadgeDestacado").checked = false;
    qs("#pfMedidas").value = "";
    qs("#pfMaterial").value = "";
    qs("#pfTerminacion").value = "";
    qs("#pfGarantia").value = "";
    qs("#pfProveedorNombre").value = "";
    qs("#pfProveedorTelefono").value = "";
    qs("#pfProveedorCosto").value = "";
    tempProductPhotos = [];
  }
  renderProductPhotoGrid();
  updatePricePreview();
  qs("#productDrawer").classList.add("is-open");
}

function closeProductDrawer() {
  qs("#productDrawer").classList.remove("is-open");
}

function renderProductPhotoGrid() {
  const grid = qs("#productPhotoGrid");
  grid.innerHTML = tempProductPhotos
    .map(
      (photo, i) => `
    <div class="photo-thumb">
      ${i === 0 ? `<span class="photo-main-badge">Principal</span>` : ""}
      <img src="${photo.src}" alt="Foto ${i + 1}" onclick="cropProductPhoto(${i})">
      <button class="photo-remove" onclick="removeProductPhoto(${i})">✕</button>
    </div>`
    )
    .join("");
}
function cropProductPhoto(index) {
  openCropModal(tempProductPhotos[index].src, (dataUrl) => {
    tempProductPhotos[index].src = dataUrl;
    renderProductPhotoGrid();
  });
}
function removeProductPhoto(index) {
  tempProductPhotos.splice(index, 1);
  renderProductPhotoGrid();
}

function updatePricePreview() {
  const gs = Number(qs("#pfPrecioGs").value) || 0;
  qs("#pricePreview").innerHTML = `≈ <strong>${formatUsd(gs)}</strong> <span style="color:var(--ink-soft)">(referencial, cotización ~${BUSINESS.usdRate.toLocaleString("es-PY")} Gs./USD)</span>`;
}

function saveProduct() {
  const name = qs("#pfNombre").value.trim();
  const category = qs("#pfCategoria").value;
  const price = Number(qs("#pfPrecioGs").value);

  if (!name || !price) {
    showToast("Completá al menos el nombre y el precio", "error");
    return;
  }
  if (!tempProductPhotos.length) {
    showToast("Agregá al menos una foto del producto", "error");
    return;
  }

  const oldPriceVal = Number(qs("#pfPrecioAnterior").value) || undefined;
  const data = {
    name,
    category,
    sku: qs("#pfSku").value.trim() || generateSku(category),
    description: qs("#pfDescripcion").value.trim(),
    price,
    oldPrice: oldPriceVal,
    stockLabel: qs("#pfStock").value,
    stockLow: qs("#pfStock").value === "Últimas unidades",
    isOffer: qs("#pfBadgeOferta").checked,
    isNew: qs("#pfBadgeNuevo").checked,
    isFeatured: qs("#pfBadgeDestacado").checked,
    specs: {
      medidas: qs("#pfMedidas").value.trim(),
      material: qs("#pfMaterial").value.trim(),
      terminacion: qs("#pfTerminacion").value.trim(),
      garantia: qs("#pfGarantia").value.trim(),
    },
    proveedor: {
      nombre: qs("#pfProveedorNombre").value.trim(),
      telefono: qs("#pfProveedorTelefono").value.trim(),
      costo: Number(qs("#pfProveedorCosto").value) || undefined,
    },
    images: tempProductPhotos.map((p) => p.src),
  };

  if (editingProductId) {
    const idx = PRODUCTS.findIndex((p) => p.id === editingProductId);
    PRODUCTS[idx] = { ...PRODUCTS[idx], ...data };
  } else {
    PRODUCTS.unshift({ id: "p" + Date.now(), ...data });
  }

  renderProductsTable();
  closeProductDrawer();
  showToast(editingProductId ? "Producto actualizado" : "Producto creado", "success");
}

function deleteProductPrompt(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  confirmAction({
    title: "¿Eliminar este producto?",
    text: `Se va a eliminar "${p.name}" del catálogo. En esta demo la acción no se puede deshacer.`,
    danger: true,
    confirmLabel: "Eliminar",
    onConfirm: () => {
      const idx = PRODUCTS.findIndex((x) => x.id === id);
      if (idx > -1) PRODUCTS.splice(idx, 1);
      renderProductsTable();
      showToast("Producto eliminado", "success");
    },
  });
}

/* ------------------------------------------------------------
   8) SERVICIOS
   ------------------------------------------------------------ */
let tempServicePhoto = null;
let editingServiceIndex = null;

function initServicesSection() {
  renderServicesAdminList();
  qs("#btnNewService").addEventListener("click", () => openServiceDrawer(null));
  qs("#serviceDrawerClose").addEventListener("click", closeServiceDrawer);
  qs("#serviceDrawerCancel").addEventListener("click", closeServiceDrawer);
  qs("#serviceDrawer").addEventListener("click", (e) => {
    if (e.target.id === "serviceDrawer") closeServiceDrawer();
  });
  qs("#serviceDrawerSave").addEventListener("click", saveService);

  setupDropzone(qs("#serviceDropzone"), qs("#servicePhotoInput"), async (files) => {
    if (!files.length) return;
    tempServicePhoto = await readFileAsDataURL(files[0]);
    renderServicePhotoGrid();
  });
}

function renderServicesAdminList() {
  const el = qs("#servicesList");
  if (!SERVICES.length) {
    el.innerHTML = `<div class="admin-empty">Todavía no hay servicios cargados.</div>`;
    return;
  }
  el.innerHTML = SERVICES.map(
    (s, i) => `
    <div class="list-card">
      <div style="display:flex;gap:14px;">
        <div class="admin-row-thumb" style="width:60px;height:60px;"><img src="${s.image}" alt=""></div>
        <div class="list-card-body">
          <h4>${s.title}</h4>
          <p>${s.description}</p>
        </div>
      </div>
      <div class="admin-row-actions">
        <button class="icon-btn" title="Editar" onclick="openServiceDrawer(${i})">${icon("edit")}</button>
        <button class="icon-btn danger" title="Eliminar" onclick="deleteServicePrompt(${i})">${icon("trash")}</button>
      </div>
    </div>`
  ).join("");
}

function openServiceDrawer(index) {
  editingServiceIndex = index;
  const isEdit = index !== null;
  qs("#serviceDrawerTitle").textContent = isEdit ? "Editar servicio" : "Nuevo servicio";
  if (isEdit) {
    const s = SERVICES[index];
    qs("#sfTitulo").value = s.title;
    qs("#sfDescripcion").value = s.description;
    tempServicePhoto = s.image;
  } else {
    qs("#sfTitulo").value = "";
    qs("#sfDescripcion").value = "";
    tempServicePhoto = null;
  }
  renderServicePhotoGrid();
  qs("#serviceDrawer").classList.add("is-open");
}
function closeServiceDrawer() {
  qs("#serviceDrawer").classList.remove("is-open");
}
function renderServicePhotoGrid() {
  const grid = qs("#servicePhotoGrid");
  grid.innerHTML = tempServicePhoto
    ? `<div class="photo-thumb">
        <img src="${tempServicePhoto}" alt="" onclick="cropServicePhoto()">
        <button class="photo-remove" onclick="removeServicePhoto()">✕</button>
      </div>`
    : "";
}
function cropServicePhoto() {
  openCropModal(tempServicePhoto, (dataUrl) => {
    tempServicePhoto = dataUrl;
    renderServicePhotoGrid();
  });
}
function removeServicePhoto() {
  tempServicePhoto = null;
  renderServicePhotoGrid();
}

function saveService() {
  const title = qs("#sfTitulo").value.trim();
  const description = qs("#sfDescripcion").value.trim();
  if (!title || !description || !tempServicePhoto) {
    showToast("Completá título, descripción y foto", "error");
    return;
  }
  const data = { title, description, image: tempServicePhoto };
  if (editingServiceIndex !== null) {
    SERVICES[editingServiceIndex] = data;
  } else {
    SERVICES.push(data);
  }
  renderServicesAdminList();
  closeServiceDrawer();
  showToast(editingServiceIndex !== null ? "Servicio actualizado" : "Servicio creado", "success");
}

function deleteServicePrompt(index) {
  const s = SERVICES[index];
  confirmAction({
    title: "¿Eliminar este servicio?",
    text: `Se va a eliminar "${s.title}". En esta demo la acción no se puede deshacer.`,
    danger: true,
    confirmLabel: "Eliminar",
    onConfirm: () => {
      SERVICES.splice(index, 1);
      renderServicesAdminList();
      showToast("Servicio eliminado", "success");
    },
  });
}

/* ------------------------------------------------------------
   9) FAQ
   ------------------------------------------------------------ */
let editingFaqIndex = null;

function initFaqSection() {
  renderFaqAdminList();
  qs("#btnNewFaq").addEventListener("click", () => openFaqDrawer(null));
  qs("#faqDrawerClose").addEventListener("click", closeFaqDrawer);
  qs("#faqDrawerCancel").addEventListener("click", closeFaqDrawer);
  qs("#faqDrawer").addEventListener("click", (e) => {
    if (e.target.id === "faqDrawer") closeFaqDrawer();
  });
  qs("#faqDrawerSave").addEventListener("click", saveFaq);
}

function renderFaqAdminList() {
  const el = qs("#faqAdminList");
  if (!FAQS.length) {
    el.innerHTML = `<div class="admin-empty">Todavía no hay preguntas cargadas.</div>`;
    return;
  }
  el.innerHTML = FAQS.map(
    (f, i) => `
    <div class="list-card">
      <div class="list-card-body">
        <h4>${f.q}</h4>
        <p>${f.a}</p>
      </div>
      <div class="admin-row-actions">
        <button class="icon-btn" title="Editar" onclick="openFaqDrawer(${i})">${icon("edit")}</button>
        <button class="icon-btn danger" title="Eliminar" onclick="deleteFaqPrompt(${i})">${icon("trash")}</button>
      </div>
    </div>`
  ).join("");
}

function openFaqDrawer(index) {
  editingFaqIndex = index;
  const isEdit = index !== null;
  qs("#faqDrawerTitle").textContent = isEdit ? "Editar pregunta" : "Nueva pregunta";
  qs("#ffPregunta").value = isEdit ? FAQS[index].q : "";
  qs("#ffRespuesta").value = isEdit ? FAQS[index].a : "";
  qs("#faqDrawer").classList.add("is-open");
}
function closeFaqDrawer() {
  qs("#faqDrawer").classList.remove("is-open");
}
function saveFaq() {
  const q = qs("#ffPregunta").value.trim();
  const a = qs("#ffRespuesta").value.trim();
  if (!q || !a) {
    showToast("Completá la pregunta y la respuesta", "error");
    return;
  }
  if (editingFaqIndex !== null) {
    FAQS[editingFaqIndex] = { q, a };
  } else {
    FAQS.push({ q, a });
  }
  renderFaqAdminList();
  closeFaqDrawer();
  showToast(editingFaqIndex !== null ? "Pregunta actualizada" : "Pregunta creada", "success");
}
function deleteFaqPrompt(index) {
  confirmAction({
    title: "¿Eliminar esta pregunta?",
    text: "Esta acción no se puede deshacer en esta demo.",
    danger: true,
    confirmLabel: "Eliminar",
    onConfirm: () => {
      FAQS.splice(index, 1);
      renderFaqAdminList();
      showToast("Pregunta eliminada", "success");
    },
  });
}

/* ------------------------------------------------------------
   10) SOBRE NOSOTROS
   ------------------------------------------------------------ */
const FEATURE_ICONS = ["star", "grid", "shield", "heart"];

function initAboutSection() {
  qs("#aboutIntro").value = BUSINESS.aboutIntro;
  renderFeatureEditGrid();
  qs("#btnSaveAbout").addEventListener("click", () => {
    BUSINESS.aboutIntro = qs("#aboutIntro").value.trim();
    ABOUT_FEATURES.forEach((f, i) => {
      f.title = qs(`#featTitle${i}`).value.trim();
      f.description = qs(`#featDesc${i}`).value.trim();
      f.icon = qs(`#featIcon${i}`).value;
    });
    showToast("Sección \"Sobre nosotros\" actualizada", "success");
  });
}

function renderFeatureEditGrid() {
  const grid = qs("#featureEditGrid");
  grid.innerHTML = ABOUT_FEATURES.map(
    (f, i) => `
    <div class="feature-edit-card">
      <div class="field" style="margin:0;">
        <label for="featTitle${i}">Título</label>
        <input id="featTitle${i}" value="${f.title}">
      </div>
      <div class="field" style="margin:0;">
        <label for="featDesc${i}">Descripción</label>
        <textarea id="featDesc${i}" style="min-height:60px;">${f.description}</textarea>
      </div>
      <div class="field" style="margin:0;">
        <label for="featIcon${i}">Ícono</label>
        <select id="featIcon${i}">
          ${FEATURE_ICONS.map((ic) => `<option value="${ic}" ${ic === f.icon ? "selected" : ""}>${ic}</option>`).join("")}
        </select>
      </div>
    </div>`
  ).join("");
}

/* ------------------------------------------------------------
   11) CONTACTO Y REDES
   ------------------------------------------------------------ */
function initContactSection() {
  qs("#cfWhatsapp").value = BUSINESS.whatsapp;
  qs("#cfEmail").value = BUSINESS.email;
  qs("#cfAddress").value = BUSINESS.address;
  qs("#cfInstagram").value = BUSINESS.instagram;
  qs("#cfFacebook").value = BUSINESS.facebook;

  qs("#btnSaveContact").addEventListener("click", () => {
    const whatsapp = qs("#cfWhatsapp").value.trim().replace(/\D/g, "");
    if (!whatsapp) {
      showToast("El número de WhatsApp es obligatorio", "error");
      return;
    }
    BUSINESS.whatsapp = whatsapp;
    BUSINESS.whatsappDisplay = formatParaguayPhone(whatsapp);
    BUSINESS.email = qs("#cfEmail").value.trim();
    BUSINESS.address = qs("#cfAddress").value.trim();
    BUSINESS.addressMapsQuery = BUSINESS.address;
    BUSINESS.instagram = qs("#cfInstagram").value.trim();
    BUSINESS.facebook = qs("#cfFacebook").value.trim();
    showToast("Datos de contacto actualizados", "success");
  });
}

/* ------------------------------------------------------------
   12) PORTADA (HERO)
   ------------------------------------------------------------ */
function initHeroSection() {
  qs("#hfTag").value = BUSINESS.heroTag;
  qs("#hfTitle").value = BUSINESS.heroTitle;
  qs("#hfLead").value = BUSINESS.heroLead;

  qs("#btnSaveHero").addEventListener("click", () => {
    BUSINESS.heroTag = qs("#hfTag").value.trim();
    BUSINESS.heroTitle = qs("#hfTitle").value.trim();
    BUSINESS.heroLead = qs("#hfLead").value.trim();
    showToast("Portada actualizada", "success");
  });
}

/* ------------------------------------------------------------
   13) ARRANQUE
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", initAdminLogin);
