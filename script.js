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

function updateBody(color) {
  const hex = color.hexString;
  setLayerColor("bodyLayer", hex);
  bodyHex.textContent = hex.toUpperCase();
}

function updateStripes(color) {
  const hex = color.hexString;
  setLayerColor("stripeLayer", hex);
  stripeHex.textContent = hex.toUpperCase();
}

async function init() {
  await loadSVG("bodyLayer", "assets/liveries/tiger/212_tiger_body.svg");
  await loadSVG("stripeLayer", "assets/liveries/tiger/212_tiger_stripes.svg");

  const bodyPicker = new iro.ColorPicker("#bodyPicker", {
    width: 260,
    color: "#5b3a29",
    layout: [
      { component: iro.ui.Wheel },
      { component: iro.ui.Slider, options: { sliderType: "value" } }
    ]
  });

  const stripePicker = new iro.ColorPicker("#stripePicker", {
    width: 260,
    color: "#d8a11d",
    layout: [
      { component: iro.ui.Wheel },
      { component: iro.ui.Slider, options: { sliderType: "value" } }
    ]
  });

  bodyPicker.on("color:change", updateBody);
  stripePicker.on("color:change", updateStripes);

  updateBody(bodyPicker.color);
  updateStripes(stripePicker.color);
}

init();