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

function getCurrentLivery() {
  return liveries[state.liveryIndex];
}

function getSelectorDefinitions() {
  const livery = getCurrentLivery();

  const selectors = [
    {
      key: "liveryIndex",
      label: "Livery",
      meta: "4x12",
      items: liveries,
      type: "text"
    },
    {
      key: "bodyIndex",
      label: livery.labels[0],
      meta: materials[state.bodyIndex].style,
      items: materials,
      type: "swatch"
    },
    {
      key: "accentIndex",
      label: livery.labels[1],
      meta: materials[state.accentIndex].style,
      items: materials,
      type: "swatch"
    }
  ];

  if (livery.layers.third) {
    selectors.push({
      key: "thirdIndex",
      label: livery.labels[2],
      meta: materials[state.thirdIndex].style,
      items: materials,
      type: "swatch"
    });
  }

  selectors.push(
    {
      key: "grillIndex",
      label: "Grill",
      meta: "Grill Cloth",
      items: grills,
      type: "text"
    },
    {
      key: "grillPipingIndex",
      label: "Grill Trim",
      meta: "Trim",
      items: trimOptions,
      type: "text"
    },
    {
      key: "pipingIndex",
      label: "Cab Trim",
      meta: "Trim",
      items: trimOptions,
      type: "text"
    }
  );

  return selectors;
}

function buildSelectors() {
  const card = document.getElementById("selectorsCard");
  card.innerHTML = "";

  getSelectorDefinitions().forEach(selector => {
    const selectedItem = selector.items[state[selector.key]];

    const block = document.createElement("div");
    block.className = "selector-block";

    block.innerHTML = `
      <div class="selector-label">${selector.label}</div>
      <div class="selected-name">${selectedItem.name}</div>
      <div class="selected-meta">${selector.meta || ""}</div>

      <div class="wheel-arrow up">⌃</div>

      <div class="wheel-wrap">
        <div class="wheel-zone"></div>
        <div id="${selector.key}Wheel" class="wheel ${selector.type === "text" ? "text-wheel" : ""}"></div>
      </div>

      <div class="wheel-arrow down">⌄</div>
    `;

    card.appendChild(block);

    renderWheel({
      wheelId: `${selector.key}Wheel`,
      items: selector.items,
      selectedIndex: state[selector.key],
      type: selector.type,
      onSelect: async index => {
        state[selector.key] = index;

        if (selector.key === "liveryIndex") {
          await updateLiveryAssets();
          buildSelectors();
          updateCabinet();
          return;
        }

        updateCabinet();
        buildSelectors();
      }
    });
  });
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

async function updateLiveryAssets() {
  const livery = getCurrentLivery();

  await loadSVG("bodyLayer", livery.layers.body);
  await loadSVG("accentLayer", livery.layers.accent);
  await loadSVG("thirdLayer", livery.layers.third);
}

function updateCabinet() {
  const livery = getCurrentLivery();

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

  getSelectorDefinitions().forEach(selector => {
    const wheel = document.getElementById(`${selector.key}Wheel`);
    if (wheel) {
      updateWheelSelection(wheel, state[selector.key]);
    }
  });
}

async function init() {
  await updateLiveryAssets();
  buildSelectors();
  updateCabinet();
}

init();