const ASSET_ROOT = "assets";

const TOLEX_COLORS = [
  { name: "Black", hex: "#222222", swatch: "black.png" },
  { name: "British Green", hex: "#274037", swatch: "british green.png" },
  { name: "Teal Levant", hex: "#0aa6a1", swatch: "teal_levant.png" },
  { name: "Navy", hex: "#112a49", swatch: "navy.png" },
  { name: "Regency Blue", hex: "#1662cf", swatch: "regency blue.png" },
  { name: "Purple", hex: "#3b2f66", swatch: "purple.png" },
  { name: "Apple Green", hex: "#64b630", swatch: "apple green.png" },
  { name: "Cocoa", hex: "#65574d", swatch: "cocoa.png" },
  { name: "Seafoam Green", hex: "#7fac74", swatch: "seafoam green.png" },
  { name: "Gold Metallic", hex: "#8b8758", swatch: "gold metallic.png" },
  { name: "Carolina Blue", hex: "#8dbad6", swatch: "carolina blue.png" },
  { name: "Silver", hex: "#a4aeac", swatch: "silver.png" },
  { name: "Pink", hex: "#bd8897", swatch: "pink.png" },
  { name: "Ivory", hex: "#d4c49b", swatch: "ivory.png" },
  { name: "Yellow", hex: "#dfce5b", swatch: "yellow.png" },
  { name: "White", hex: "#e9e9e9", swatch: "white.png" },
  { name: "Flamingo Pink", hex: "#ec5d75", swatch: "flamingo pink.png" },
  { name: "Orange", hex: "#f27f2f", swatch: "orange.png" },
  { name: "Red", hex: "#ff1111", swatch: "red.png" }
];

const LIVERIES = ["tiger", "nitro", "shock"];
const GUITAR_SIZES = ["112", "212h", "212v", "412"];
const BASS_SIZES = ["210"];

const GRILLS = [
  { id: "blackbasket", name: "Black Basketweave" },
  { id: "smallcane", name: "Small Cane" },
  { id: "agedsilver", name: "Aged Silver" },
  { id: "fendersilver", name: "Fender Silver" },
  { id: "oxblood", name: "Oxblood" },
  { id: "saltpepper", name: "Salt & Pepper" }
];

const BASE_FILES = {
  "112": "base.png",
  "210": "base.png",
  "212h": "212h_base.png",
  "212v": "base.png",
  "412": "base.png"
};

const state = {
  instrument: null,
  size: "412",
  livery: "tiger",
  grill: "blackbasket",
  grillPiping: "white",
  colors: {
    main: 0,
    main2: 9,
    accent: 9
  }
};

const els = {
  instrumentScreen: document.getElementById("instrumentScreen"),
  configurator: document.getElementById("configurator"),
  backToInstrument: document.getElementById("backToInstrument"),

  sizeSelector: document.getElementById("sizeSelector"),
  liverySelector: document.getElementById("liverySelector"),
  grillSelector: document.getElementById("grillSelector"),
  guitarControls: document.getElementById("guitarControls"),

  renderStage: document.getElementById("renderStage"),

  mainWheel: document.getElementById("mainWheel"),
  main2Wheel: document.getElementById("main2Wheel"),
  accentWheel: document.getElementById("accentWheel"),

  mainLabel: document.getElementById("mainLabel"),
  main2Label: document.getElementById("main2Label"),
  accentLabel: document.getElementById("accentLabel"),
  grillLabel: document.getElementById("grillLabel")
};

const wheelMap = {
  main: {
    el: els.mainWheel,
    label: els.mainLabel,
    programmatic: false,
    timer: null
  },
  main2: {
    el: els.main2Wheel,
    label: els.main2Label,
    programmatic: false,
    timer: null
  },
  accent: {
    el: els.accentWheel,
    label: els.accentLabel,
    programmatic: false,
    timer: null
  }
};

const layerEls = {
  base: null,
  main: null,
  main2: null,
  accent: null,
  grill: null,
  grillPiping: null,
  liveryPiping: null
};

const svgCache = new Map();
let renderId = 0;

function asset(path) {
  return `${ASSET_ROOT}/${path}`;
}

function slugLabel(text) {
  return text.replace(/&/g, "and").replace(/\s+/g, " ").trim();
}

function svgFolder(size) {
  return size === "210" ? "untitled folder" : "svg";
}

function wrapIndex(index) {
  return ((index % TOLEX_COLORS.length) + TOLEX_COLORS.length) % TOLEX_COLORS.length;
}

function getColor(zone) {
  return TOLEX_COLORS[state.colors[zone]];
}

function getAvailableSizes() {
  return state.instrument === "bass" ? BASS_SIZES : GUITAR_SIZES;
}

function getLiveryLayers(livery) {
  if (livery === "tiger") {
    return [
      { zone: "main", file: "tiger_body.svg" },
      { zone: "accent", file: "tiger_stripes.svg" }
    ];
  }

  if (livery === "nitro") {
    return [
      { zone: "main", file: "nitro_body.svg" },
      { zone: "accent", file: "nitro_flames.svg" }
    ];
  }

  return [
    { zone: "main", file: "shock_top.svg" },
    { zone: "main2", file: "shock_bottom.svg" },
    { zone: "accent", file: "shock_bolt.svg" }
  ];
}

function init() {
  buildRenderLayers();
  bindInstrumentButtons();
  bindBackButton();
  bindWheelButtons();
  bindPipingButtons();
}

function buildRenderLayers() {
  els.renderStage.innerHTML = "";

  layerEls.base = makeImg("base");
  layerEls.main = makeImg("mask-main");
  layerEls.main2 = makeImg("mask-main2");
  layerEls.accent = makeImg("mask-accent");
  layerEls.grill = makeImg("grill");
  layerEls.grillPiping = makeImg("grillPiping");
  layerEls.liveryPiping = makeImg("liveryPiping");

  els.renderStage.appendChild(layerEls.base);
  els.renderStage.appendChild(layerEls.main);
  els.renderStage.appendChild(layerEls.main2);
  els.renderStage.appendChild(layerEls.accent);
  els.renderStage.appendChild(layerEls.grill);
  els.renderStage.appendChild(layerEls.grillPiping);
  els.renderStage.appendChild(layerEls.liveryPiping);
}

function makeImg(className) {
  const img = document.createElement("img");
  img.className = className;
  img.alt = "";
  img.draggable = false;

  img.onerror = () => {
    img.removeAttribute("src");
  };

  return img;
}

function bindInstrumentButtons() {
  document.querySelectorAll("[data-instrument]").forEach(button => {
    button.addEventListener("click", () => {
      startConfigurator(button.dataset.instrument);
    });
  });
}

function bindBackButton() {
  els.backToInstrument.addEventListener("click", () => {
    els.configurator.classList.add("hidden");
    els.instrumentScreen.classList.remove("hidden");
    state.instrument = null;
  });
}

function bindWheelButtons() {
  document.querySelectorAll("[data-wheel]").forEach(button => {
    button.addEventListener("click", () => {
      const zone = button.dataset.wheel;
      const dir = Number(button.dataset.dir);
      setWheelIndex(zone, wrapIndex(state.colors[zone] + dir), true);
    });
  });
}

function bindPipingButtons() {
  document.querySelectorAll("[data-grill-piping]").forEach(button => {
    button.addEventListener("click", () => {
      state.grillPiping = button.dataset.grillPiping;
      updatePipingButtons();
      renderCab();
    });
  });
}

function startConfigurator(instrument) {
  state.instrument = instrument;
  state.size = instrument === "bass" ? "210" : "412";

  els.instrumentScreen.classList.add("hidden");
  els.configurator.classList.remove("hidden");
  els.guitarControls.classList.toggle("hidden", instrument === "bass");

  buildSizeButtons();
  buildLiveryButtons();
  buildGrillButtons();
  buildColorWheels();

  updatePipingButtons();
  renderCab();

  requestAnimationFrame(() => {
    centerAllWheels(false);
  });
}

function buildSizeButtons() {
  els.sizeSelector.innerHTML = "";

  getAvailableSizes().forEach(size => {
    const button = document.createElement("button");
    button.className = "image-btn";
    button.dataset.size = size;
    button.setAttribute("aria-label", `Choose ${size}`);

    const img = document.createElement("img");
    img.alt = size;
    img.src = asset(`swatches/size/${size}_${state.size === size ? "active" : "idle"}.png`);

    button.appendChild(img);

    button.addEventListener("click", () => {
      state.size = size;
      buildSizeButtons();
      renderCab();
    });

    els.sizeSelector.appendChild(button);
  });
}

function buildLiveryButtons() {
  els.liverySelector.innerHTML = "";

  LIVERIES.forEach(livery => {
    const button = document.createElement("button");
    button.className = "image-btn";
    button.dataset.livery = livery;
    button.setAttribute("aria-label", `Choose ${livery}`);

    const img = document.createElement("img");
    img.alt = livery;
    img.src = asset(`swatches/liveries/${livery}_${state.livery === livery ? "active" : "idle"}.png`);

    button.appendChild(img);

    button.addEventListener("click", () => {
      state.livery = livery;
      buildLiveryButtons();
      renderCab();
    });

    els.liverySelector.appendChild(button);
  });
}

function buildGrillButtons() {
  els.grillSelector.innerHTML = "";

  GRILLS.forEach(grill => {
    const button = document.createElement("button");
    button.className = "image-btn";
    button.dataset.grill = grill.id;
    button.setAttribute("aria-label", `Choose ${grill.name}`);

    const img = document.createElement("img");
    img.alt = grill.name;
    img.src = asset(`swatches/grills/${grill.id}_${state.grill === grill.id ? "active" : "idle"}.png`);

    button.appendChild(img);

    button.addEventListener("click", () => {
      state.grill = grill.id;
      buildGrillButtons();
      updateGrillLabel();
      renderCab();
    });

    els.grillSelector.appendChild(button);
  });

  updateGrillLabel();
}

function buildColorWheels() {
  ["main", "main2", "accent"].forEach(zone => {
    const wheel = wheelMap[zone];
    wheel.el.innerHTML = "";

    TOLEX_COLORS.forEach((color, index) => {
      const swatch = document.createElement("img");
      swatch.className = "swatch";
      swatch.dataset.index = index;
      swatch.src = asset(`swatches/colors/${color.swatch}`);
      swatch.alt = color.name;
      swatch.draggable = false;

      swatch.addEventListener("click", () => {
        setWheelIndex(zone, index, true);
      });

      wheel.el.appendChild(swatch);
    });

    wheel.el.addEventListener("scroll", () => {
      handleWheelScroll(zone);
    });

    updateWheelVisual(zone);
  });
}

function handleWheelScroll(zone) {
  const wheel = wheelMap[zone];

  if (wheel.programmatic) return;

  const index = getCenteredIndex(wheel.el);

  if (index !== state.colors[zone]) {
    state.colors[zone] = index;
    updateWheelVisual(zone);
    renderCab();
  }

  clearTimeout(wheel.timer);
  wheel.timer = setTimeout(() => {
    centerWheel(zone, true);
  }, 140);
}

function getCenteredIndex(container) {
  const containerRect = container.getBoundingClientRect();
  const center = containerRect.left + containerRect.width / 2;

  let closest = 0;
  let closestDistance = Infinity;

  container.querySelectorAll(".swatch").forEach(swatch => {
    const rect = swatch.getBoundingClientRect();
    const swatchCenter = rect.left + rect.width / 2;
    const distance = Math.abs(center - swatchCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = Number(swatch.dataset.index);
    }
  });

  return closest;
}

function setWheelIndex(zone, index, center = true) {
  state.colors[zone] = wrapIndex(index);
  updateWheelVisual(zone);

  if (center) centerWheel(zone, true);

  renderCab();
}

function updateWheelVisual(zone) {
  const wheel = wheelMap[zone];
  const index = state.colors[zone];

  wheel.el.querySelectorAll(".swatch").forEach(swatch => {
    swatch.classList.toggle("active", Number(swatch.dataset.index) === index);
  });

  wheel.label.textContent = getColor(zone).name;
}

function centerAllWheels(smooth = false) {
  centerWheel("main", smooth);
  centerWheel("main2", smooth);
  centerWheel("accent", smooth);
}

function centerWheel(zone, smooth = true) {
  const wheel = wheelMap[zone];
  const selected = wheel.el.querySelector(`.swatch[data-index="${state.colors[zone]}"]`);

  if (!selected) return;

  const target =
    selected.offsetLeft -
    wheel.el.clientWidth / 2 +
    selected.clientWidth / 2;

  wheel.programmatic = true;

  wheel.el.scrollTo({
    left: target,
    behavior: smooth ? "smooth" : "auto"
  });

  window.setTimeout(() => {
    wheel.programmatic = false;
  }, smooth ? 320 : 60);
}

function updatePipingButtons() {
  document.querySelectorAll("[data-grill-piping]").forEach(button => {
    button.classList.toggle("active", button.dataset.grillPiping === state.grillPiping);
  });
}

function updateGrillLabel() {
  const grill = GRILLS.find(item => item.id === state.grill);
  els.grillLabel.textContent = grill ? grill.name : "";
}

async function renderCab() {
  const currentRender = ++renderId;
  const size = state.size;
  const livery = state.livery;

  layerEls.base.src = asset(`${size}/base/${BASE_FILES[size]}`);

  layerEls.main.removeAttribute("src");
  layerEls.main2.removeAttribute("src");
  layerEls.accent.removeAttribute("src");

  const layers = getLiveryLayers(livery);

  for (const layer of layers) {
    const svgUrl = await getColoredSvgUrl(size, layer.file, getColor(layer.zone).hex);

    if (currentRender !== renderId) return;

    layerEls[layer.zone].src = svgUrl;
  }

  if (state.instrument === "guitar") {
    layerEls.grill.src = asset(`${size}/grills/${state.grill}.png`);
    layerEls.grillPiping.src = asset(`${size}/piping/grill_${state.grillPiping}.png`);
  } else {
    layerEls.grill.removeAttribute("src");
    layerEls.grillPiping.removeAttribute("src");
  }

  layerEls.liveryPiping.src = asset(`${size}/piping/${livery}_${state.grillPiping}.png`);
}

async function getColoredSvgUrl(size, file, hex) {
  const key = `${size}-${file}-${hex}`;

  if (svgCache.has(key)) {
    return svgCache.get(key);
  }

  const url = asset(`${size}/${svgFolder(size)}/${file}`);
  const response = await fetch(url);

  if (!response.ok) {
    console.warn(`Missing SVG: ${url}`);
    return "";
  }

  const svgText = await response.text();
  const colored = colorSvg(svgText, hex);
  const blob = new Blob([colored], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(blob);

  svgCache.set(key, objectUrl);

  return objectUrl;
}

function colorSvg(svgText, hex) {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");

  const svg = doc.querySelector("svg");
  if (!svg) return svgText;

  const paintable = "path, polygon, rect, circle, ellipse";

  doc.querySelectorAll(paintable).forEach(el => {
    if (el.closest("defs, clipPath, mask")) return;

    el.setAttribute("fill", hex);
    el.removeAttribute("stroke");

    const style = el.getAttribute("style");

    if (style) {
      const cleaned = style
        .replace(/fill\s*:\s*[^;]+;?/gi, "")
        .replace(/stroke\s*:\s*[^;]+;?/gi, "");

      if (cleaned.trim()) {
        el.setAttribute("style", cleaned);
      } else {
        el.removeAttribute("style");
      }
    }
  });

  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  return new XMLSerializer().serializeToString(svg);
}

init();