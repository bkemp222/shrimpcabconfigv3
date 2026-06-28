const materials = [
  {
    id: "black",
    name: "Black",
    style: "Levant",
    vendor: "SBS",
    color: "#222222",
    swatch: "assets/swatches/colors/black.png"
  },
  {
    id: "teal",
    name: "Teal",
    style: "Levant",
    vendor: "Mojotone",
    color: "#0aa6a1",
    swatch: "assets/swatches/colors/teal_levant.png"
  },
  {
    id: "purple",
    name: "Purple",
    style: "Levant",
    vendor: "SBS",
    color: "#3b2f66",
    swatch: "assets/swatches/colors/purple.png"
  },
  {
    id: "flamingo-pink",
    name: "Flamingo Pink",
    style: "Levant",
    vendor: "Mojotone",
    color: "#ec5d75",
    swatch: "assets/swatches/colors/flamingo pink.png"
  },
  {
    id: "orange",
    name: "Orange",
    style: "Levant",
    vendor: "SBS",
    color: "#f27f2f",
    swatch: "assets/swatches/colors/orange.png"
  }
];

const state = {
  bodyIndex: 0,
  accentIndex: 1
};

async function loadSVG(layerId, path) {
  const response = await fetch(path);
  const svgText = await response.text();

  const layer = document.getElementById(layerId);
  layer.innerHTML = svgText;

  const svg = layer.querySelector("svg");

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

function renderWheel(wheelId, selectedIndex, onSelect) {
  const wheel = document.getElementById(wheelId);

  wheel.innerHTML = "";

  materials.forEach((material, index) => {
    const item = document.createElement("button");
    item.className = "wheel-item";
    item.type = "button";
    item.dataset.index = index;
    item.setAttribute("aria-label", material.name);

    const img = document.createElement("img");
    img.className = "swatch";
    img.src = material.swatch;
    img.alt = material.name;

    item.appendChild(img);

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

function updateSelectionText() {
  const body = materials[state.bodyIndex];
  const accent = materials[state.accentIndex];

  document.getElementById("bodyName").textContent = body.name;
  document.getElementById("bodyMeta").textContent = `${body.style} · ${body.vendor}`;

  document.getElementById("accentName").textContent = accent.name;
  document.getElementById("accentMeta").textContent = `${accent.style} · ${accent.vendor}`;
}

function updateCabinet() {
  const body = materials[state.bodyIndex];
  const accent = materials[state.accentIndex];

  setLayerColor("bodyLayer", body.color);
  setLayerColor("stripeLayer", accent.color);

  updateSelectionText();

  updateWheelSelection(document.getElementById("bodyWheel"), state.bodyIndex);
  updateWheelSelection(document.getElementById("accentWheel"), state.accentIndex);
}

async function init() {
  await loadSVG("bodyLayer", "assets/liveries/tiger/212_tiger_body.svg");
  await loadSVG("stripeLayer", "assets/liveries/tiger/212_tiger_stripes.svg");

  renderWheel("bodyWheel", state.bodyIndex, index => {
    state.bodyIndex = index;
    updateCabinet();
  });

  renderWheel("accentWheel", state.accentIndex, index => {
    state.accentIndex = index;
    updateCabinet();
  });

  updateCabinet();
}

init();