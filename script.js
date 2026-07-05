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
    labels: ["Body", "Stripes"],
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
    id: "nitro",
    name: "Nitro",
    labels: ["Body", "Flames"],
    layers: {
      body: `assets/${activeCab}/svg/nitro_body.svg`,
      accent: `assets/${activeCab}/svg/nitro_flames.svg`,
      third: null
    },
    piping: {
      black: `assets/${activeCab}/piping/nitro_black.png`,
      white: `assets/${activeCab}/piping/nitro_white.png`
    }
  },
  {
    id: "shock",
    name: "Shock",
    labels: ["Top", "Bottom", "Bolt"],
    layers: {
      body: `assets/${activeCab}/svg/shock_top.svg`,
      accent: `assets/${activeCab}/svg/shock_bottom.svg`,
      third: `assets/${activeCab}/svg/shock_bolt.svg`
    },
    piping: {
      black: `assets/${activeCab}/piping/shock_black.png`,
      white: `assets/${activeCab}/piping/shock_white.png`
    }
  }
];

const grills = [
  { id: "blackbasket", name: "Black Basket", file: `assets/${activeCab}/grills/blackbasket.png` },
  { id: "saltpepper", name: "Salt & Pepper", file: `assets/${activeCab}/grills/saltpepper.png` },
  { id: "smallcane", name: "Small Cane", file: `assets/${activeCab}/grills/smallcane.png` },
  { id: "agedsilver", name: "Aged Silver", file: `assets/${activeCab}/grills/agedsilver.png` },
  { id: "fendersilver", name: "Fender Silver", file: `assets/${activeCab}/grills/fendersilver.png` },
  { id: "oxblood", name: "Oxblood", file: `assets/${activeCab}/grills/oxblood.png` }
];

const pipingOptions = [
  { id: "white", name: "White" },
  { id: "black", name: "Black" }
];

const state = {
  liveryIndex: 0,
  bodyIndex: 0,
  accentIndex: 6,
  thirdIndex: 3,
  grillIndex: 0,
  pipingIndex: 0
};

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

function renderWheel({ wheelId, items, selectedIndex, onSelect, type = "swatch" }) {
  const wheel = document.getElementById(wheelId);
  wheel.innerHTML = "";

  items.forEach((itemData, index) => {
    const item = document.createElement("button");
    item.className = "wheel-item";
    item.type = "button";
    item.dataset.index = index;
    item.setAttribute("aria-label", itemData.name);

    if (type === "swatch") {
      const img = document.createElement("img");
      img.className = "swatch";
      img.src = itemData.swatch;
      img.alt = itemData.name;
      item.appendChild(img);
    } else {
      const chip = document.createElement("div");
      chip.className = "text-chip";
      chip.textContent = itemData.name;
      item.appendChild(chip);
    }

    item.addEventListener("click", () => {
      onSelect(index);
      scrollToIndex(wheel, index);
    });

    wheel.appendChild(item);
  });

  updateWheelSelection(wheel, selectedIndex);
  requestAnimationFrame(() => scrollToIndex(wheel, selectedIndex));

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
      scrollToIndex(wheel, finalIndex);
    }, 90);
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

function scrollToIndex(wheel, index) {
  const item = wheel.querySelectorAll(".wheel-item")[index];
  if (!item) return;

  item.scrollIntoView({
    block: "center",
    behavior: "smooth"
  });
}

function updateWheelSelection(wheel, selectedIndex) {
  wheel.querySelectorAll(".wheel-item").forEach((item, index) => {
    item.classList.toggle("selected", index === selectedIndex);
  });
}

async function updateLiveryAssets() {
  const livery = liveries[state.liveryIndex];

  await loadSVG("bodyLayer", livery.layers.body);
  await loadSVG("accentLayer", livery.layers.accent);
  await loadSVG("thirdLayer", livery.layers.third);

  document.getElementById("thirdSelector").classList.toggle("hidden", !livery.layers.third);

  document.getElementById("bodyLabel").textContent = livery.labels[0];
  document.getElementById("accentLabel").textContent = livery.labels[1];

  if (livery.labels[2]) {
    document.getElementById("thirdLabel").textContent = livery.labels[2];
  }

  updateCabinet();
}

function updateSelectionText() {
  const livery = liveries[state.liveryIndex];
  const body = materials[state.bodyIndex];
  const accent = materials[state.accentIndex];
  const third = materials[state.thirdIndex];
  const grill = grills[state.grillIndex];
  const piping = pipingOptions[state.pipingIndex];

  document.getElementById("liveryName").textContent = livery.name;

  document.getElementById("bodyName").textContent = body.name;
  document.getElementById("bodyMeta").textContent = body.style;

  document.getElementById("accentName").textContent = accent.name;
  document.getElementById("accentMeta").textContent = accent.style;

  document.getElementById("thirdName").textContent = third.name;
  document.getElementById("thirdMeta").textContent = third.style;

  document.getElementById("grillName").textContent = grill.name;
  document.getElementById("pipingName").textContent = piping.name;
}

function updateCabinet() {
  const livery = liveries[state.liveryIndex];
  const body = materials[state.bodyIndex];
  const accent = materials[state.accentIndex];
  const third = materials[state.thirdIndex];
  const grill = grills[state.grillIndex];
  const piping = pipingOptions[state.pipingIndex];

  setLayerColor("bodyLayer", body.color);
  setLayerColor("accentLayer", accent.color);
  setLayerColor("thirdLayer", third.color);

  document.getElementById("grillLayer").src = grill.file;
  document.getElementById("pipingLayer").src = livery.piping[piping.id];

  updateSelectionText();

  updateWheelSelection(document.getElementById("liveryWheel"), state.liveryIndex);
  updateWheelSelection(document.getElementById("bodyWheel"), state.bodyIndex);
  updateWheelSelection(document.getElementById("accentWheel"), state.accentIndex);
  updateWheelSelection(document.getElementById("thirdWheel"), state.thirdIndex);
  updateWheelSelection(document.getElementById("grillWheel"), state.grillIndex);
  updateWheelSelection(document.getElementById("pipingWheel"), state.pipingIndex);
}

async function init() {
  renderWheel({
    wheelId: "liveryWheel",
    items: liveries,
    selectedIndex: state.liveryIndex,
    type: "text",
    onSelect: async index => {
      if (state.liveryIndex === index) return;
      state.liveryIndex = index;
      await updateLiveryAssets();
    }
  });

  renderWheel({
    wheelId: "bodyWheel",
    items: materials,
    selectedIndex: state.bodyIndex,
    onSelect: index => {
      state.bodyIndex = index;
      updateCabinet();
    }
  });

  renderWheel({
    wheelId: "accentWheel",
    items: materials,
    selectedIndex: state.accentIndex,
    onSelect: index => {
      state.accentIndex = index;
      updateCabinet();
    }
  });

  renderWheel({
    wheelId: "thirdWheel",
    items: materials,
    selectedIndex: state.thirdIndex,
    onSelect: index => {
      state.thirdIndex = index;
      updateCabinet();
    }
  });

  renderWheel({
    wheelId: "grillWheel",
    items: grills,
    selectedIndex: state.grillIndex,
    type: "text",
    onSelect: index => {
      state.grillIndex = index;
      updateCabinet();
    }
  });

  renderWheel({
    wheelId: "pipingWheel",
    items: pipingOptions,
    selectedIndex: state.pipingIndex,
    type: "text",
    onSelect: index => {
      state.pipingIndex = index;
      updateCabinet();
    }
  });

  await updateLiveryAssets();
}

init();