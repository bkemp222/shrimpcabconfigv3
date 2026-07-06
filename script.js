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

const wheelRefs = {
  main: mainWheel,
  main2: main2Wheel,
  accent: accentWheel
};

const wheelLabels = {
  main: mainLabel,
  main2: main2Label,
  accent: accentLabel
};

let wheelScrollTimers = {};
let wheelIsProgrammatic = {
  main: false,
  main2: false,
  accent: false
};

function buildWheels() {
  buildScrollableWheel("main");
  buildScrollableWheel("main2");
  buildScrollableWheel("accent");

  requestAnimationFrame(() => {
    centerWheelOnSelected("main", false);
    centerWheelOnSelected("main2", false);
    centerWheelOnSelected("accent", false);
  });
}

function buildScrollableWheel(zone) {
  const container = wheelRefs[zone];
  container.innerHTML = "";

  TOLEX_COLORS.forEach((color, index) => {
    const img = document.createElement("img");
    img.className = "swatch";
    img.dataset.index = index;
    img.src = asset(`swatches/colors/${color.swatch}`);
    img.alt = color.name;

    img.addEventListener("click", () => {
      state.colors[zone] = index;
      updateWheelState(zone);
      centerWheelOnSelected(zone, true);
      renderCab();
    });

    container.appendChild(img);
  });

  container.addEventListener("scroll", () => {
    if (wheelIsProgrammatic[zone]) return;

    clearTimeout(wheelScrollTimers[zone]);

    const index = getCenteredSwatchIndex(container);

    if (index !== state.colors[zone]) {
      state.colors[zone] = index;
      updateWheelState(zone);
      renderCab();
    }

    wheelScrollTimers[zone] = setTimeout(() => {
      centerWheelOnSelected(zone, true);
    }, 180);
  });

  updateWheelState(zone);
}

function centerWheelOnSelected(zone, smooth = true) {
  const container = wheelRefs[zone];
  const selected = container.querySelector(`.swatch[data-index="${state.colors[zone]}"]`);

  if (!selected) return;

  const target =
    selected.offsetLeft -
    container.clientWidth / 2 +
    selected.clientWidth / 2;

  wheelIsProgrammatic[zone] = true;

  container.scrollTo({
    left: target,
    behavior: smooth ? "smooth" : "auto"
  });

  setTimeout(() => {
    wheelIsProgrammatic[zone] = false;
  }, smooth ? 350 : 50);
}

function stepWheel(zone, direction) {
  state.colors[zone] = wrapIndex(state.colors[zone] + direction);
  updateWheelState(zone);
  centerWheelOnSelected(zone, true);
  renderCab();
}

function asset(path) {
  return `${ASSET_ROOT}/${path}`;
}

function wrapIndex(index) {
  const total = TOLEX_COLORS.length;
  return ((index % total) + total) % total;
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
  updateTrimButtons();
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

    const buttonState = state.size === size ? "active" : "idle";
    img.src = asset(`swatches/size/${size}_${buttonState}.png`);

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

    const buttonState = state.livery === livery ? "active" : "idle";
    img.src = asset(`swatches/liveries/${livery}_${buttonState}.png`);

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

    const buttonState = state.grill === grill.id ? "active" : "idle";
    img.src = asset(`swatches/grills/${grill.id}_${buttonState}.png`);

    btn.appendChild(img);

    btn.addEventListener("click", () => {
      state.grill = grill.id;
      renderAll();
    });

    grillSelector.appendChild(btn);
  });
}

function buildWheels() {
  buildScrollableWheel("main");
  buildScrollableWheel("main2");
  buildScrollableWheel("accent");
}

function buildScrollableWheel(zone) {
  const container = wheelRefs[zone];
  container.innerHTML = "";

  TOLEX_COLORS.forEach((color, index) => {
    const img = document.createElement("img");
    img.className = "swatch";
    img.dataset.index = index;
    img.src = asset(`swatches/colors/${color.swatch}`);
    img.alt = color.name;

    img.addEventListener("click", () => {
      state.colors[zone] = index;
      updateWheelState(zone);
      centerWheelOnSelected(zone, true);
      renderCab();
    });

    container.appendChild(img);
  });

  container.addEventListener("scroll", () => {
    clearTimeout(wheelScrollTimers[zone]);

    const index = getCenteredSwatchIndex(container);

    if (index !== state.colors[zone]) {
      state.colors[zone] = index;
      updateWheelState(zone);
      renderCab();
    }

    wheelScrollTimers[zone] = setTimeout(() => {
      centerWheelOnSelected(zone, true);
    }, 120);
  });

  updateWheelState(zone);
}

function getCenteredSwatchIndex(container) {
  const containerBox = container.getBoundingClientRect();
  const centerX = containerBox.left + containerBox.width / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  container.querySelectorAll(".swatch").forEach(swatch => {
    const box = swatch.getBoundingClientRect();
    const swatchCenter = box.left + box.width / 2;
    const distance = Math.abs(centerX - swatchCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = Number(swatch.dataset.index);
    }
  });

  return closestIndex;
}

function updateWheelState(zone) {
  const container = wheelRefs[zone];
  const selected = state.colors[zone];

  container.querySelectorAll(".swatch").forEach(swatch => {
    swatch.classList.toggle("active", Number(swatch.dataset.index) === selected);
  });

  wheelLabels[zone].textContent = TOLEX_COLORS[selected].name;
}

function centerWheelOnSelected(zone, smooth = true) {
  const container = wheelRefs[zone];
  const selected = container.querySelector(`.swatch[data-index="${state.colors[zone]}"]`);

  if (!selected) return;

  const target =
    selected.offsetLeft -
    container.clientWidth / 2 +
    selected.clientWidth / 2;

  container.scrollTo({
    left: target,
    behavior: smooth ? "smooth" : "auto"
  });
}

function stepWheel(zone, direction) {
  state.colors[zone] = wrapIndex(state.colors[zone] + direction);
  updateWheelState(zone);
  centerWheelOnSelected(zone, true);
  renderCab();
}

function updateTrimButtons() {
  document.querySelectorAll("[data-grill-trim]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.grillTrim === state.grillTrim);
  });
}

function renderAll() {
  buildSizeButtons();
  buildLiveryButtons();
  buildGrillButtons();

  updateWheelState("main");
  updateWheelState("main2");
  updateWheelState("accent");

  updateTrimButtons();
  renderCab();
}

function renderCab() {
  const thisRender = ++renderToken;

  renderStage.innerHTML = "";

  const size = state.size;
  const livery = state.livery;
  const baseFile = SIZE_BASE_FILE[size];

  addImage(asset(`${size}/base/${baseFile}`), "base");

  getSvgLayers(livery).forEach(layer => {
    addSvgColorLayer(size, layer.file, layer.zone, thisRender);
  });

  if (state.instrument === "guitar") {
    addImage(asset(`${size}/grills/${state.grill}.png`), "grill");

    const grill = GRILLS.find(item => item.id === state.grill);
    grillLabel.textContent = grill ? grill.name : "";
  }

  addImage(asset(`${size}/piping/${livery}_${state.grillTrim}.png`), "piping");

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

function addSvgColorLayer(size, svgFile, zone, thisRender) {
  const color = colorByZone(zone);

  fetch(asset(`${size}/${svgFolderForSize(size)}/${svgFile}`))
    .then(response => {
      if (!response.ok) throw new Error(`Missing SVG: ${svgFile}`);
      return response.text();
    })
    .then(svgText => {
      if (thisRender !== renderToken) return;

      const coloredSvg = forceSvgColor(svgText, color.hex);

      const encoded = encodeURIComponent(coloredSvg)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");

      addImage(`data:image/svg+xml;charset=utf-8,${encoded}`, "color-layer");
    })
    .catch(error => console.warn(error.message));
}

function forceSvgColor(svgText, hex) {
  let svg = svgText;

  svg = svg.replace(/fill="[^"]*"/gi, "");
  svg = svg.replace(/stroke="[^"]*"/gi, "");
  svg = svg.replace(/style="[^"]*"/gi, match => {
    return match
      .replace(/fill\s*:\s*[^;"]+;?/gi, "")
      .replace(/stroke\s*:\s*[^;"]+;?/gi, "");
  });

  svg = svg.replace(/<path\b/gi, `<path fill="${hex}"`);
  svg = svg.replace(/<polygon\b/gi, `<polygon fill="${hex}"`);
  svg = svg.replace(/<rect\b/gi, `<rect fill="${hex}"`);
  svg = svg.replace(/<circle\b/gi, `<circle fill="${hex}"`);
  svg = svg.replace(/<ellipse\b/gi, `<ellipse fill="${hex}"`);

  return svg;
}

function addImage(src, className, onLoad) {
  const img = document.createElement("img");
  img.src = src;
  img.className = className;
  img.alt = "";

  img.onload = () => {
    if (typeof onLoad === "function") onLoad();
  };

  img.onerror = () => {
    img.remove();
  };

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