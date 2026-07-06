const ASSET_ROOT = "assets";

const TOLEX_COLORS = [
  { name: "Black", slug: "black", hex: "#222222", swatch: "black.png" },
  { name: "Emerald Green", slug: "emerald-green", hex: "#274037", swatch: "british green.png" },
  { name: "Teal", slug: "teal", hex: "#0aa6a1", swatch: "teal_levant.png" },
  { name: "Navy", slug: "navy", hex: "#112a49", swatch: "navy.png" },
  { name: "Regency Blue", slug: "regency-blue", hex: "#1662cf", swatch: "regency blue.png" },
  { name: "Purple", slug: "purple", hex: "#3b2f66", swatch: "purple.png" },
  { name: "Apple Green", slug: "apple-green", hex: "#64b630", swatch: "apple green.png" },
  { name: "Cocoa", slug: "cocoa", hex: "#65574d", swatch: "cocoa.png" },
  { name: "Seafoam Green", slug: "seafoam-green", hex: "#7fac74", swatch: "seafoam green.png" },
  { name: "Gold", slug: "gold", hex: "#8b8758", swatch: "gold metallic.png" },
  { name: "Carolina Blue", slug: "carolina-blue", hex: "#8dbad6", swatch: "carolina blue.png" },
  { name: "Silver", slug: "silver", hex: "#a4aeac", swatch: "silver.png" },
  { name: "Pink", slug: "pink", hex: "#bd8897", swatch: "pink.png" },
  { name: "Ivory", slug: "ivory", hex: "#d4c49b", swatch: "ivory.png" },
  { name: "Yellow", slug: "yellow", hex: "#dfce5b", swatch: "yellow.png" },
  { name: "White", slug: "white", hex: "#e9e9e9", swatch: "white.png" },
  { name: "Flamingo Pink", slug: "flamingo-pink", hex: "#ec5d75", swatch: "flamingo pink.png" },
  { name: "Orange", slug: "orange", hex: "#f27f2f", swatch: "orange.png" },
  { name: "Red", slug: "red", hex: "#ff1111", swatch: "red.png" }
];

const LIVERIES = ["tiger", "shock", "nitro"];

const GRILLS = [
  { id: "blackbasket", name: "Black Basketweave" },
  { id: "smallcane", name: "Small Cane" },
  { id: "agedsilver", name: "Aged Silver" },
  { id: "fendersilver", name: "Fender Silver" },
  { id: "oxblood", name: "Oxblood" },
  { id: "saltpepper", name: "Salt and Pepper" }
];

const GUITAR_SIZES = ["112", "212h", "212v", "412"];
const BASS_SIZES = ["210"];

const SIZE_BASE_FILE = {
  "112": "base.png",
  "210": "base.png",
  "212h": "212h_base.png",
  "212v": "base.png",
  "412": "base.png"
};

const state = {
  instrument: null,
  size: "412",
  livery: "nitro",
  grill: "blackbasket",
  grillTrim: "white",
  colors: {
    main: 0,
    main2: 9,
    accent: 9
  }
};

const instrumentScreen = document.getElementById("instrumentScreen");
const configurator = document.getElementById("configurator");
const renderStage = document.getElementById("renderStage");

const sizeSelector = document.getElementById("sizeSelector");
const liverySelector = document.getElementById("liverySelector");
const grillSelector = document.getElementById("grillSelector");

const grillSection = document.getElementById("grillSection");
const grillTrimSection = document.getElementById("grillTrimSection");

const mainWheel = document.getElementById("mainWheel");
const main2Wheel = document.getElementById("main2Wheel");
const accentWheel = document.getElementById("accentWheel");

const mainLabel = document.getElementById("mainLabel");
const main2Label = document.getElementById("main2Label");
const accentLabel = document.getElementById("accentLabel");
const grillLabel = document.getElementById("grillLabel");

function asset(path) {
  return `${ASSET_ROOT}/${path}`;
}

function colorByZone(zone) {
  return TOLEX_COLORS[state.colors[zone]];
}

function startConfigurator(instrument) {
  state.instrument = instrument;
  state.size = instrument === "bass" ? "210" : "412";

  instrumentScreen.classList.add("hidden");
  configurator.classList.remove("hidden");

  grillSection.style.display = instrument === "bass" ? "none" : "";
  grillTrimSection.style.display = instrument === "bass" ? "none" : "";

  buildStaticControls();
  renderAll();
}

function buildStaticControls() {
  buildSizeButtons();
  buildLiveryButtons();
  buildGrillButtons();
  buildWheels();
}

function buildSizeButtons() {
  const sizes = state.instrument === "bass" ? BASS_SIZES : GUITAR_SIZES;
  sizeSelector.innerHTML = "";

  sizes.forEach(size => {
    const btn = document.createElement("button");
    btn.className = "image-button";
    btn.dataset.size = size;

    const img = document.createElement("img");
    img.alt = size;
    img.src = asset(`swatches/size/${size}_${state.size === size ? "active" : "idle"}.png`);

    btn.appendChild(img);
    btn.addEventListener("click", () => {
      state.size = size;
      renderAll();
    });

    sizeSelector.appendChild(btn);
  });
}

function buildLiveryButtons() {
  liverySelector.innerHTML = "";

  LIVERIES.forEach(livery => {
    const btn = document.createElement("button");
    btn.className = "image-button";
    btn.dataset.livery = livery;

    const img = document.createElement("img");
    img.alt = livery;
    img.src = asset(`swatches/liveries/${livery}_${state.livery === livery ? "active" : "idle"}.png`);

    btn.appendChild(img);
    btn.addEventListener("click", () => {
      state.livery = livery;
      renderAll();
    });

    liverySelector.appendChild(btn);
  });
}

function buildGrillButtons() {
  grillSelector.innerHTML = "";

  GRILLS.forEach(grill => {
    const btn = document.createElement("button");
    btn.className = "image-button";
    btn.dataset.grill = grill.id;

    const img = document.createElement("img");
    img.alt = grill.name;
    img.src = asset(`swatches/grills/${grill.id}_${state.grill === grill.id ? "active" : "idle"}.png`);

    btn.appendChild(img);
    btn.addEventListener("click", () => {
      state.grill = grill.id;
      renderAll();
    });

    grillSelector.appendChild(btn);
  });
}

function buildWheels() {
  renderWheel("main", mainWheel, mainLabel);
  renderWheel("main2", main2Wheel, main2Label);
  renderWheel("accent", accentWheel, accentLabel);
}

function renderWheel(zone, container, label) {
  container.innerHTML = "";

  const selected = state.colors[zone];
  const visible = [-1, 0, 1].map(offset => wrapIndex(selected + offset));

  visible.forEach(index => {
    const color = TOLEX_COLORS[index];
    const img = document.createElement("img");
    img.className = `swatch ${index === selected ? "active" : ""}`;
    img.src = asset(`swatches/colors/${color.swatch}`);
    img.alt = color.name;
    img.addEventListener("click", () => {
      state.colors[zone] = index;
      renderAll();
    });
    container.appendChild(img);
  });

  label.textContent = colorByZone(zone).name;
}

function wrapIndex(index) {
  const total = TOLEX_COLORS.length;
  return ((index % total) + total) % total;
}

function stepWheel(zone, direction) {
  state.colors[zone] = wrapIndex(state.colors[zone] + direction);
  renderAll();
}

function renderAll() {
  buildSizeButtons();
  buildLiveryButtons();
  buildGrillButtons();
  buildWheels();
  updateTrimButtons();
  renderCab();
}

function updateTrimButtons() {
  document.querySelectorAll("[data-grill-trim]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.grillTrim === state.grillTrim);
  });
}

function renderCab() {
  renderStage.innerHTML = "";

  const size = state.size;
  const livery = state.livery;
  const baseFile = SIZE_BASE_FILE[size];

  addImage(asset(`${size}/base/${baseFile}`), "base");

  getSvgLayers(livery).forEach(layer => {
    addSvgColorLayer(size, layer.file, layer.zone);
  });

  if (state.instrument === "guitar") {
    addImage(asset(`${size}/grills/${state.grill}.png`), "grill");

    const grill = GRILLS.find(item => item.id === state.grill);
    grillLabel.textContent = grill ? grill.name : "";
  }

  const liveryPiping = asset(`${size}/piping/${livery}_${state.grillTrim}.png`);
  addImage(liveryPiping, "piping");

  if (state.instrument === "guitar") {
    addImage(asset(`${size}/piping/grill_${state.grillTrim}.png`), "piping");
  }
}

function getSvgLayers(livery) {
  if (livery === "tiger") {
    return [
      { file: "tiger_body.svg", zone: "main" },
      { file: "tiger_stripes.svg", zone: "accent" }
    ];
  }

  if (livery === "shock") {
    return [
      { file: "shock_top.svg", zone: "main" },
      { file: "shock_bottom.svg", zone: "main2" },
      { file: "shock_bolt.svg", zone: "accent" }
    ];
  }

  return [
    { file: "nitro_body.svg", zone: "main" },
    { file: "nitro_flames.svg", zone: "accent" }
  ];
}

function svgFolderForSize(size) {
  return size === "210" ? "untitled folder" : "svg";
}

function addSvgColorLayer(size, svgFile, zone) {
  const color = colorByZone(zone);

  fetch(asset(`${size}/${svgFolderForSize(size)}/${svgFile}`))
    .then(response => {
      if (!response.ok) throw new Error(`Missing SVG: ${svgFile}`);
      return response.text();
    })
    .then(svgText => {
      const coloredSvg = svgText
        .replace(/fill="[^"]*"/g, `fill="${color.hex}"`)
        .replace(/fill:[^;"']*/g, `fill:${color.hex}`);

      const blob = new Blob([coloredSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      addImage(url, "color-layer", () => URL.revokeObjectURL(url));
    })
    .catch(error => console.warn(error.message));
}

function addImage(src, className, onLoad) {
  const img = document.createElement("img");
  img.src = src;
  img.className = className;
  img.alt = "";
  img.onload = () => {
    if (typeof onLoad === "function") onLoad();
  };
  img.onerror = () => img.remove();
  renderStage.appendChild(img);
}

document.querySelectorAll("[data-instrument]").forEach(btn => {
  btn.addEventListener("click", () => {
    startConfigurator(btn.dataset.instrument);
  });
});

document.querySelectorAll(".wheel-arrow").forEach(btn => {
  btn.addEventListener("click", () => {
    stepWheel(btn.dataset.zone, Number(btn.dataset.dir));
  });
});

document.querySelectorAll("[data-grill-trim]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.grillTrim = btn.dataset.grillTrim;
    renderAll();
  });
});