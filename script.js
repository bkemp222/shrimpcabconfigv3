const activeCab = "412";

const materials = [
  { id: "black", name: "Black", style: "Levant", color: "#222222", swatch: "assets/swatches/colors/black.png" },
  { id: "cocoa", name: "Cocoa", style: "Levant", color: "#65574d", swatch: "assets/swatches/colors/cocoa.png" },
  { id: "ivory", name: "Ivory", style: "Levant", color: "#d4c49b", swatch: "assets/swatches/colors/ivory.png" },
  { id: "white", name: "White", style: "Levant", color: "#e9e9e9", swatch: "assets/swatches/colors/white.png" },
  { id: "silver", name: "Silver", style: "Levant", color: "#a4aeac", swatch: "assets/swatches/colors/silver.png" },
  { id: "yellow", name: "Yellow", style: "Levant", color: "#dfce5b", swatch: "assets/swatches/colors/yellow.png" },
  { id: "gold", name: "Gold", style: "Levant", color: "#8b8758", swatch: "assets/swatches/colors/gold metallic.png" },
  { id: "orange", name: "Orange", style: "Levant", color: "#f27f2f", swatch: "assets/swatches/colors/orange.png" },
  { id: "red", name: "Red", style: "Levant", color: "#ff1f1f", swatch: "assets/swatches/colors/red.png" },
  { id: "flamingo-pink", name: "Flamingo Pink", style: "Levant", color: "#ec5d75", swatch: "assets/swatches/colors/flamingo pink.png" },
  { id: "pink", name: "Pink", style: "Levant", color: "#bd8897", swatch: "assets/swatches/colors/pink.png" },
  { id: "purple", name: "Purple", style: "Levant", color: "#3b2f66", swatch: "assets/swatches/colors/purple.png" },
  { id: "regency-blue", name: "Regency Blue", style: "Levant", color: "#1662cf", swatch: "assets/swatches/colors/regency blue.png" },
  { id: "carolina-blue", name: "Carolina Blue", style: "Levant", color: "#8dbad6", swatch: "assets/swatches/colors/carolina blue.png" },
  { id: "teal", name: "Teal", style: "Levant", color: "#0aa6a1", swatch: "assets/swatches/colors/teal_levant.png" },
  { id: "navy", name: "Navy", style: "Levant", color: "#112a49", swatch: "assets/swatches/colors/navy.png" },
  { id: "apple-green", name: "Apple Green", style: "Levant", color: "#64b630", swatch: "assets/swatches/colors/apple green.png" },
  { id: "seafoam-green", name: "Seafoam Green", style: "Levant", color: "#7fac74", swatch: "assets/swatches/colors/seafoam green.png" },
  { id: "emerald-green", name: "Emerald Green", style: "Levant", color: "#274037", swatch: "assets/swatches/colors/british green.png" }
];

const liveries = [
  {
    id: "tiger",
    name: "Tiger",
    labels: ["Primary", "Secondary"],
    button: {
      active: "assets/swatches/liveries/tiger_active.png",
      idle: "assets/swatches/liveries/tiger_idle.png"
    },
    layers: {
      body: `assets/${activeCab}/svg/tiger_body.svg`,
      accent: `assets/${activeCab}/svg/tiger_stripes.svg`,
      third: null
    },
    piping: {
      black: `assets/${activeCab}/piping/tiger_black.png`,
      white: `assets/${activeCab}/piping/tiger_white.png`
    }
  },
  {
    id: "shock",
    name: "Shock",
    labels: ["Primary", "Secondary", "Tertiary"],
    button: {
      active: "assets/swatches/liveries/shock_active.png",
      idle: "assets/swatches/liveries/shock_idle.png"
    },
    layers: {
      body: `assets/${activeCab}/svg/shock_top.svg`,
      accent: `assets/${activeCab}/svg/shock_bottom.svg`,
      third: `assets/${activeCab}/svg/shock_bolt.svg`
    },
    piping: {
      black: `assets/${activeCab}/piping/shock_black.png`,
      white: `assets/${activeCab}/piping/shock_white.png`
    }
  },
  {
    id: "nitro",
    name: "Nitro",
    labels: ["Primary", "Secondary"],
    button: {
      active: "assets/swatches/liveries/nitro_active.png",
      idle: "assets/swatches/liveries/nitro_idle.png"
    },
    layers: {
      body: `assets/${activeCab}/svg/nitro_body.svg`,
      accent: `assets/${activeCab}/svg/nitro_flames.svg`,
      third: null
    },
    piping: {
      black: `assets/${activeCab}/piping/nitro_black.png`,
      white: `assets/${activeCab}/piping/nitro_white.png`
    }
  }
];

const grills = [
  { id: "blackbasket", name: "Black Basket", file: `assets/${activeCab}/grills/blackbasket.png`, swatch: "assets/swatches/grills/blackbasket.png" },
  { id: "saltpepper", name: "Salt & Pepper", file: `assets/${activeCab}/grills/saltpepper.png`, swatch: "assets/swatches/grills/saltpepper.png" },
  { id: "smallcane", name: "Small Cane", file: `assets/${activeCab}/grills/smallcane.png`, swatch: "assets/swatches/grills/smallcane.png" },
  { id: "agedsilver", name: "Aged Silver", file: `assets/${activeCab}/grills/agedsilver.png`, swatch: "assets/swatches/grills/agedsilver.png" },
  { id: "fendersilver", name: "Fender Silver", file: `assets/${activeCab}/grills/fendersilver.png`, swatch: "assets/swatches/grills/fendersilver.png" },
  { id: "oxblood", name: "Oxblood", file: `assets/${activeCab}/grills/oxblood.png`, swatch: "assets/swatches/grills/oxblood.png" }
];

const trimOptions = [
  { id: "white", name: "White" },
  { id: "black", name: "Black" }
];

const state = {
  liveryIndex: 0,
  bodyIndex: 0,
  accentIndex: 6,
  thirdIndex: 3,
  grillIndex: 0,
  grillPipingIndex: 0,
  pipingIndex: 0
};

function currentLivery() {
  return liveries[state.liveryIndex];
}

async function loadSVG(layerId, path) {
  const layer = document.getElementById(layerId);

  if (!path) {
    layer.innerHTML = "";
    return;
  }

  const response = await fetch(path);

  if (!response.ok) {
    console.error(`Missing SVG: ${path}`);
    layer.innerHTML = "";
    return;
  }

  const svgText = await response.text();
  layer.innerHTML = svgText;

  const svg = layer.querySelector("svg");

  if (!svg) return;

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.style.width = "100%";
  svg.style.height = "auto";
}

function setLayerColor(layerId, color) {
  const layer = document.getElementById(layerId);
  const svg = layer.querySelector("svg");

  if (!svg) return;

  svg.querySelectorAll("path, polygon, rect, circle, ellipse").forEach(el => {
    el.style.fill = color;
    el.setAttribute("fill", color);
  });
}

async function updateLiveryAssets() {
  const livery = currentLivery();

  await loadSVG("bodyLayer", livery.layers.body);
  await loadSVG("accentLayer", livery.layers.accent);
  await loadSVG("thirdLayer", livery.layers.third);
}

function updateCabinet() {
  const livery = currentLivery();

  const body = materials[state.bodyIndex];
  const accent = materials[state.accentIndex];
  const third = materials[state.thirdIndex];
  const grill = grills[state.grillIndex];
  const grillTrim = trimOptions[state.grillPipingIndex];
  const cabTrim = trimOptions[state.pipingIndex];

  setLayerColor("bodyLayer", body.color);
  setLayerColor("accentLayer", accent.color);
  setLayerColor("thirdLayer", third.color);

  document.getElementById("grillLayer").src = grill.file;

  document.getElementById("grillPipingLayer").src =
    `assets/${activeCab}/piping/grill_${grillTrim.id}.png`;

  document.getElementById("pipingLayer").src =
    livery.piping[cabTrim.id];

  updateColorLabels();
  updateButtons();
}

function buildLiveryButtons() {
  const container = document.getElementById("liveryButtons");
  container.innerHTML = "";

  liveries.forEach((livery, index) => {
    const button = document.createElement("button");
    button.className = "livery-btn";
    button.type = "button";
    button.setAttribute("aria-label", livery.name);

    button.innerHTML = `
      <img src="${index === state.liveryIndex ? livery.button.active : livery.button.idle}" alt="${livery.name}">
    `;

    button.addEventListener("click", async () => {
      if (state.liveryIndex === index) return;

      state.liveryIndex = index;

      await updateLiveryAssets();
      buildColorWheels();
      updateCabinet();
    });

    container.appendChild(button);
  });
}

function buildColorWheels() {
  const container = document.getElementById("colorWheels");
  const livery = currentLivery();

  container.innerHTML = "";

  const selectors = [
    {
      key: "bodyIndex",
      label: livery.labels[0],
      nameId: "bodyName",
      metaId: "bodyMeta"
    },
    {
      key: "accentIndex",
      label: livery.labels[1],
      nameId: "accentName",
      metaId: "accentMeta"
    }
  ];

  if (livery.layers.third) {
    selectors.push({
      key: "thirdIndex",
      label: livery.labels[2],
      nameId: "thirdName",
      metaId: "thirdMeta"
    });
  }

  selectors.forEach(selector => {
    const selectedMaterial = materials[state[selector.key]];

    const block = document.createElement("div");
    block.className = "color-selector";

    block.innerHTML = `
      <div class="selector-label">${selector.label}</div>
      <div id="${selector.nameId}" class="selected-name">${selectedMaterial.name}</div>
      <div id="${selector.metaId}" class="selected-meta">${selectedMaterial.style}</div>

      <div class="wheel-arrow up">⌃</div>

      <div class="wheel-wrap">
        <div class="wheel-zone"></div>
        <div id="${selector.key}Wheel" class="wheel"></div>
      </div>

      <div class="wheel-arrow down">⌄</div>
    `;

    container.appendChild(block);

    renderColorWheel(`${selector.key}Wheel`, state[selector.key], index => {
      state[selector.key] = index;
      updateCabinet();
    });
  });
}

function renderColorWheel(wheelId, selectedIndex, onSelect) {
  const wheel = document.getElementById(wheelId);
  wheel.innerHTML = "";

  materials.forEach((material, index) => {
    const item = document.createElement("button");
    item.className = "wheel-item";
    item.type = "button";
    item.setAttribute("aria-label", material.name);

    const img = document.createElement("img");
    img.className = "swatch";
    img.src = material.swatch;
    img.alt = material.name;

    item.appendChild(img);

    item.addEventListener("click", () => {
      onSelect(index);
      scrollToIndex(wheel, index, "smooth");
    });

    wheel.appendChild(item);
  });

  updateWheelSelection(wheel, selectedIndex);

  requestAnimationFrame(() => {
    scrollToIndex(wheel, selectedIndex, "auto");
  });

  let scrollTimer;
  let lastIndex = selectedIndex;

  wheel.addEventListener("scroll", () => {
    const liveIndex = getCenteredIndex(wheel);

    if (liveIndex !== lastIndex) {
      lastIndex = liveIndex;
      onSelect(liveIndex);
    }

    clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {
      const finalIndex = getCenteredIndex(wheel);
      lastIndex = finalIndex;
      onSelect(finalIndex);
      scrollToIndex(wheel, finalIndex, "smooth");
    }, 100);
  });
}

function getCenteredIndex(wheel) {
  const items = [...wheel.querySelectorAll(".wheel-item")];
  const wheelCenter = wheel.getBoundingClientRect().top + wheel.clientHeight / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(wheelCenter - itemCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function scrollToIndex(wheel, index, behavior = "smooth") {
  const item = wheel.querySelectorAll(".wheel-item")[index];

  if (!item) return;

  item.scrollIntoView({
    block: "center",
    behavior
  });
}

function updateWheelSelection(wheel, selectedIndex) {
  wheel.querySelectorAll(".wheel-item").forEach((item, index) => {
    item.classList.toggle("selected", index === selectedIndex);
  });
}

function updateColorLabels() {
  const body = materials[state.bodyIndex];
  const accent = materials[state.accentIndex];
  const third = materials[state.thirdIndex];

  const bodyName = document.getElementById("bodyName");
  const accentName = document.getElementById("accentName");
  const thirdName = document.getElementById("thirdName");

  if (bodyName) bodyName.textContent = body.name;
  if (accentName) accentName.textContent = accent.name;
  if (thirdName) thirdName.textContent = third.name;

  const bodyMeta = document.getElementById("bodyMeta");
  const accentMeta = document.getElementById("accentMeta");
  const thirdMeta = document.getElementById("thirdMeta");

  if (bodyMeta) bodyMeta.textContent = body.style;
  if (accentMeta) accentMeta.textContent = accent.style;
  if (thirdMeta) thirdMeta.textContent = third.style;

  ["bodyIndex", "accentIndex", "thirdIndex"].forEach(key => {
    const wheel = document.getElementById(`${key}Wheel`);
    if (wheel) updateWheelSelection(wheel, state[key]);
  });
}

function buildGrillButtons() {
  const container = document.getElementById("grillButtons");
  container.innerHTML = "";

  grills.forEach((grill, index) => {
    const button = document.createElement("button");
    button.className = "grill-btn";
    button.type = "button";
    button.setAttribute("aria-label", grill.name);

    button.innerHTML = `<img src="${grill.swatch}" alt="${grill.name}">`;

    button.addEventListener("click", () => {
      state.grillIndex = index;
      updateCabinet();
    });

    container.appendChild(button);
  });
}

function buildTrimButtons(containerId, stateKey) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  trimOptions.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "text-btn";
    button.type = "button";
    button.textContent = option.name;

    button.addEventListener("click", () => {
      state[stateKey] = index;
      updateCabinet();
    });

    container.appendChild(button);
  });
}

function updateButtons() {
  document.querySelectorAll(".livery-btn").forEach((button, index) => {
    const img = button.querySelector("img");
    const livery = liveries[index];

    button.classList.toggle("active", index === state.liveryIndex);
    img.src = index === state.liveryIndex ? livery.button.active : livery.button.idle;
  });

  document.querySelectorAll(".grill-btn").forEach((button, index) => {
    button.classList.toggle("active", index === state.grillIndex);
  });

  updateTextButtonGroup("grillTrimButtons", state.grillPipingIndex);
  updateTextButtonGroup("cabTrimButtons", state.pipingIndex);
}

function updateTextButtonGroup(containerId, activeIndex) {
  const container = document.getElementById(containerId);

  container.querySelectorAll(".text-btn").forEach((button, index) => {
    button.classList.toggle("active", index === activeIndex);
  });
}

async function init() {
  buildLiveryButtons();
  buildColorWheels();
  buildGrillButtons();

  buildTrimButtons("grillTrimButtons", "grillPipingIndex");
  buildTrimButtons("cabTrimButtons", "pipingIndex");

  await updateLiveryAssets();
  updateCabinet();
}

init();