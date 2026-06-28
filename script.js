const bodyPicker = document.getElementById("bodyColor");
const stripePicker = document.getElementById("stripeColor");

const bodyHex = document.getElementById("bodyHex");
const stripeHex = document.getElementById("stripeHex");

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

function updateColors() {
  const bodyColor = bodyPicker.value;
  const stripeColor = stripePicker.value;

  setLayerColor("bodyLayer", bodyColor);
  setLayerColor("stripeLayer", stripeColor);

  bodyHex.textContent = bodyColor.toUpperCase();
  stripeHex.textContent = stripeColor.toUpperCase();
}

async function init() {
  await loadSVG("bodyLayer", "assets/liveries/tiger/212_tiger_body.svg");
  await loadSVG("stripeLayer", "assets/liveries/tiger/212_tiger_stripes.svg");

  updateColors();

  bodyPicker.addEventListener("input", updateColors);
  stripePicker.addEventListener("input", updateColors);
}

init();