let activeCab = "412";

const cabSizes = [
  {
    id: "112",
    name: "1x12",
    active: "assets/swatches/size/112_active.png",
    idle: "assets/swatches/size/112_idle.png"
  },
  {
    id: "212h",
    name: "2x12H",
    active: "assets/swatches/size/212h_active.png",
    idle: "assets/swatches/size/212h_idle.png"
  },
  {
    id: "212v",
    name: "2x12V",
    active: "assets/swatches/size/212v_active.png",
    idle: "assets/swatches/size/212v_idle.png"
  },
  {
    id: "412",
    name: "4x12",
    active: "assets/swatches/size/412_active.png",
    idle: "assets/swatches/size/412_idle.png"
  }
];

const materials = [
  { id: "black", name: "Black", color: "#222222", swatch: "assets/swatches/colors/black.png" },
  { id: "cocoa", name: "Cocoa", color: "#65574d", swatch: "assets/swatches/colors/cocoa.png" },
  { id: "ivory", name: "Ivory", color: "#d4c49b", swatch: "assets/swatches/colors/ivory.png" },
  { id: "white", name: "White", color: "#e9e9e9", swatch: "assets/swatches/colors/white.png" },
  { id: "silver", name: "Silver", color: "#a4aeac", swatch: "assets/swatches/colors/silver.png" },
  { id: "yellow", name: "Yellow", color: "#dfce5b", swatch: "assets/swatches/colors/yellow.png" },
  { id: "gold", name: "Gold", color: "#8b8758", swatch: "assets/swatches/colors/gold metallic.png" },
  { id: "orange", name: "Orange", color: "#f27f2f", swatch: "assets/swatches/colors/orange.png" },
  { id: "red", name: "Red", color: "#ff1f1f", swatch: "assets/swatches/colors/red.png" },
  { id: "flamingo-pink", name: "Flamingo Pink", color: "#ec5d75", swatch: "assets/swatches/colors/flamingo pink.png" },
  { id: "pink", name: "Pink", color: "#bd8897", swatch: "assets/swatches/colors/pink.png" },
  { id: "purple", name: "Purple", color: "#3b2f66", swatch: "assets/swatches/colors/purple.png" },
  { id: "regency-blue", name: "Regency Blue", color: "#1662cf", swatch: "assets/swatches/colors/regency blue.png" },
  { id: "carolina-blue", name: "Carolina Blue", color: "#8dbad6", swatch: "assets/swatches/colors/carolina blue.png" },
  { id: "teal", name: "Teal", color: "#0aa6a1", swatch: "assets/swatches/colors/teal_levant.png" },
  { id: "navy", name: "Navy", color: "#112a49", swatch: "assets/swatches/colors/navy.png" },
  { id: "apple-green", name: "Apple Green", color: "#64b630", swatch: "assets/swatches/colors/apple green.png" },
  { id: "seafoam-green", name: "Seafoam Green", color: "#7fac74", swatch: "assets/swatches/colors/seafoam green.png" },
  { id: "emerald-green", name: "Emerald Green", color: "#274037", swatch: "assets/swatches/colors/british green.png" }
];

const liveries = [
  {
    id: "tiger",
    name: "Tiger",
    roles: ["Main", "Accent"],
    active: "assets/swatches/liveries/tiger_active.png",
    idle: "assets/swatches/liveries/tiger_idle.png",
    files: {
      main: "tiger_body.svg",
      accent: "tiger_stripes.svg",
      accent2: null
    }
  },
  {
    id: "shock",
    name: "Shock",
    roles: ["Main", "Accent", "Accent 2"],
    active: "assets/swatches/liveries/shock_active.png",
    idle: "assets/swatches/liveries/shock_idle.png",
    files: {
      main: "shock_top.svg",
      accent: "shock_bottom.svg",
      accent2: "shock_bolt.svg"
    }
  },
  {
    id: "nitro",
    name: "Nitro",
    roles: ["Main", "Accent"],
    active: "assets/swatches/liveries/nitro_active.png",
    idle: "assets/swatches/liveries/nitro_idle.png",
    files: {
      main: "nitro_body.svg",
      accent: "nitro_flames.svg",
      accent2: null
    }
  }
];

const grills = [
  { id: "blackbasket", name: "Black Basketweave" },
  { id: "saltpepper", name: "Salt & Pepper" },
  { id: "smallcane", name: "Small Cane" },
  { id: "agedsilver", name: "Aged Silver" },
  { id: "fendersilver", name: "Fender Silver" },
  { id: "oxblood", name: "Oxblood" }
];

const trimOptions = [
  { id: "white", name: "White" },
  { id: "black", name: "Black" }
];

const state = {
  cabIndex: 3,
  liveryIndex: 0,
  mainIndex: 0,
  accentIndex: 6,
  accent2Index: 6,
  grillIndex: 0,
  grillTrimIndex: 0
};

function currentCab() {
  return cabSizes[state.cabIndex];
}

function currentLivery() {
  return liveries[state.liveryIndex];
}

function assetPath(...parts) {
  return parts.join("/");
}

async function loadSVG(layerId, path) {
  const layer = document.getElementById(layerId);

  if (!path) {
    layer.innerHTML = "";
    return;
  }

  const response = await fetch(path);

  if (!response.ok) {
    console.error("Missing SVG:", path);
    layer.innerHTML = "";
    return;
  }

  layer.innerHTML = await response.text();

  const svg = layer.querySelector("svg");
  if (!svg) return;

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.style.width = "100%";
  svg.style.height = "auto";
}

function setSVGColor(layerId, color) {
  const svg = document.querySelector(`#${layerId} svg`);
  if (!svg) return;

  svg.querySelectorAll("path, polygon, rect, circle, ellipse").forEach(el => {
    el.style.fill = color;
    el.setAttribute("fill", color);
  });
}

async function loadCabAssets() {
  const livery = currentLivery();

  document.getElementById("baseLayer").src =
    assetPath("assets", activeCab, "base", "base.png");

  await loadSVG(
    "bodyLayer",
    assetPath("assets", activeCab, "svg", livery.files.main)
  );

  await loadSVG(
    "accentLayer",
    assetPath("assets", activeCab, "svg", livery.files.accent)
  );

  await loadSVG(
    "thirdLayer",
    livery.files.accent2
      ? assetPath("assets", activeCab, "svg", livery.files.accent2)
      : null
  );
}

function updateCabinet() {
  const livery = currentLivery();
  const main = materials[state.mainIndex];
  const accent = materials[state.accentIndex];
  const accent2 = materials[state.accent2Index];
  const grill = grills[state.grillIndex];
  const grillTrim = trimOptions[state.grillTrimIndex];

  setSVGColor("bodyLayer", main.color);
  setSVGColor("accentLayer", accent.color);
  setSVGColor("thirdLayer", accent2.color);

  document.getElementById("grillLayer").src =
    assetPath("assets", activeCab, "grills", `${grill.id}.png`);

  document.getElementById("grillPipingLayer").src =
    assetPath("assets", activeCab, "piping", `grill_${grillTrim.id}.png`);

  document.getElementById("pipingLayer").src =
    assetPath("assets", activeCab, "piping", `${livery.id}_white.png`);

  updateLabels();
  updateButtonStates();
}

function buildSizeButtons() {
  const container = document.getElementById("sizeButtons");
  container.innerHTML = "";

  cabSizes.forEach((cab, index) => {
    const button = document.createElement("button");
    button.className = "size-btn";
    button.type = "button";
    button.setAttribute("aria-label", cab.name);

    button.innerHTML = `
      <img src="${index === state.cabIndex ? cab.active : cab.idle}" alt="${cab.name}">
    `;

    button.addEventListener("click", async () => {
      if (state.cabIndex === index) return;

      state.cabIndex = index;
      activeCab = cab.id;

      await loadCabAssets();
      buildColorWheels();
      updateCabinet();
    });

    container.appendChild(button);
  });
}

function buildLiveryButtons() {
  const container = document.getElementById("liveryButtons");
  container.innerHTML = "";

  liveries.forEach((livery, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "livery-option";

    const label = document.createElement("div");
    label.className = "option-label";
    label.textContent = livery.name;

    const button = document.createElement("button");
    button.className = "livery-btn";
    button.type = "button";
    button.setAttribute("aria-label", livery.name);

    button.innerHTML = `
      <img src="${index === state.liveryIndex ? livery.active : livery.idle}" alt="${livery.name}">
    `;

    button.addEventListener("click", async () => {
      if (state.liveryIndex === index) return;

      state.liveryIndex = index;

      await loadCabAssets();
      buildColorWheels();
      updateCabinet();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(button);
    container.appendChild(wrapper);
  });
}

function buildColorWheels() {
  const container = document.getElementById("colorWheels");
  const livery = currentLivery();

  container.innerHTML = "";

  const wheels = [
    { key: "mainIndex", role: livery.roles[0] },
    { key: "accentIndex", role: livery.roles[1] }
  ];

  if (livery.files.accent2) {
    wheels.push({ key: "accent2Index", role: livery.roles[2] });
  }

  wheels.forEach(wheel => {
    const material = materials[state[wheel.key]];

    const block = document.createElement("div");
    block.className = "color-selector";

    block.innerHTML = `
      <div class="color-wheel-row">
        <div class="wheel-arrow">‹</div>
        <div id="${wheel.key}Wheel" class="color-wheel"></div>
        <div class="wheel-arrow">›</div>
      </div>

      <div id="${wheel.key}Name" class="color-name">${material.name}</div>
      <div class="color-role">${wheel.role}</div>
    `;

    container.appendChild(block);

    renderColorWheel(`${wheel.key}Wheel`, state[wheel.key], index => {
      state[wheel.key] = index;
      updateCabinet();
    });
  });
}

function renderColorWheel(wheelId, selectedIndex, onSelect) {
  const wheel = document.getElementById(wheelId);
  wheel.innerHTML = "";

  let isProgrammaticScroll = false;
  let scrollTimer;
  let lastIndex = selectedIndex;

  materials.forEach((material, index) => {
    const button = document.createElement("button");
    button.className = "color-item";
    button.type = "button";
    button.setAttribute("aria-label", material.name);

    button.innerHTML = `<img src="${material.swatch}" alt="${material.name}">`;

    button.addEventListener("click", () => {
      isProgrammaticScroll = true;
      onSelect(index);
      scrollColorWheelToIndex(wheel, index, "smooth");

      setTimeout(() => {
        isProgrammaticScroll = false;
        lastIndex = index;
      }, 350);
    });

    wheel.appendChild(button);
  });

  updateWheelSelection(wheel, selectedIndex);

  requestAnimationFrame(() => {
    isProgrammaticScroll = true;
    scrollColorWheelToIndex(wheel, selectedIndex, "auto");

    setTimeout(() => {
      isProgrammaticScroll = false;
      lastIndex = selectedIndex;
    }, 100);
  });

  wheel.addEventListener("scroll", () => {
    if (isProgrammaticScroll) return;

    const liveIndex = getCenteredColorIndex(wheel);

    if (liveIndex !== lastIndex) {
      lastIndex = liveIndex;
      onSelect(liveIndex);
    }

    clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {
      const finalIndex = getCenteredColorIndex(wheel);
      lastIndex = finalIndex;

      isProgrammaticScroll = true;
      onSelect(finalIndex);
      scrollColorWheelToIndex(wheel, finalIndex, "smooth");

      setTimeout(() => {
        isProgrammaticScroll = false;
      }, 350);
    }, 120);
  });
}

function getCenteredColorIndex(wheel) {
  const items = [...wheel.querySelectorAll(".color-item")];
  const wheelCenter = wheel.getBoundingClientRect().left + wheel.clientWidth / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distance = Math.abs(wheelCenter - itemCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function scrollColorWheelToIndex(wheel, index, behavior = "smooth") {
  const item = wheel.querySelectorAll(".color-item")[index];
  if (!item) return;

  const target =
    item.offsetLeft - wheel.clientWidth / 2 + item.offsetWidth / 2;

  wheel.scrollTo({
    left: target,
    behavior
  });
}

function updateWheelSelection(wheel, selectedIndex) {
  wheel.querySelectorAll(".color-item").forEach((item, index) => {
    item.classList.toggle("selected", index === selectedIndex);
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

    button.innerHTML = `
      <img src="assets/swatches/grills/${grill.id}_${index === state.grillIndex ? "active" : "idle"}.png" alt="${grill.name}">
    `;

    button.addEventListener("click", () => {
      state.grillIndex = index;
      updateCabinet();
    });

    container.appendChild(button);
  });
}

function buildTrimButtons() {
  const container = document.getElementById("grillTrimButtons");
  container.innerHTML = "";

  trimOptions.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "trim-btn";
    button.type = "button";
    button.textContent = option.name;

    button.addEventListener("click", () => {
      state.grillTrimIndex = index;
      updateCabinet();
    });

    container.appendChild(button);
  });
}

function updateLabels() {
  const labels = [
    { key: "mainIndex", id: "mainIndexName" },
    { key: "accentIndex", id: "accentIndexName" },
    { key: "accent2Index", id: "accent2IndexName" }
  ];

  labels.forEach(label => {
    const el = document.getElementById(label.id);
    if (el) el.textContent = materials[state[label.key]].name;
  });

  document.getElementById("grillName").textContent =
    grills[state.grillIndex].name;

  ["mainIndex", "accentIndex", "accent2Index"].forEach(key => {
    const wheel = document.getElementById(`${key}Wheel`);
    if (wheel) updateWheelSelection(wheel, state[key]);
  });
}

function updateButtonStates() {
  document.querySelectorAll(".size-btn").forEach((button, index) => {
    const img = button.querySelector("img");
    const cab = cabSizes[index];

    button.classList.toggle("active", index === state.cabIndex);
    img.src = index === state.cabIndex ? cab.active : cab.idle;
  });

  document.querySelectorAll(".livery-btn").forEach((button, index) => {
    const img = button.querySelector("img");
    const livery = liveries[index];

    button.classList.toggle("active", index === state.liveryIndex);
    img.src = index === state.liveryIndex ? livery.active : livery.idle;
  });

  document.querySelectorAll(".grill-btn").forEach((button, index) => {
    const img = button.querySelector("img");
    const grill = grills[index];

    button.classList.toggle("active", index === state.grillIndex);
    img.src = `assets/swatches/grills/${grill.id}_${index === state.grillIndex ? "active" : "idle"}.png`;
  });

  document.querySelectorAll(".trim-btn").forEach((button, index) => {
    button.classList.toggle("active", index === state.grillTrimIndex);
  });
}

async function init() {
  activeCab = currentCab().id;

  buildSizeButtons();
  buildLiveryButtons();
  buildColorWheels();
  buildGrillButtons();
  buildTrimButtons();

  await loadCabAssets();
  updateCabinet();
}

init();