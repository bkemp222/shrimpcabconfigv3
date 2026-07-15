import { assetPath } from "./assets";

export type Instrument = "guitar" | "bass";
export type Screen = "instrument" | "configurator" | "speakers" | "review";
export type CabinetSize = "112" | "212h" | "212v" | "412" | "210";
export type Livery = "nitro" | "tiger" | "shock";
export type Grill = "agedsilver" | "blackbasket" | "fendersilver" | "oxblood" | "saltpepper" | "smallcane";
export type PipeColor = "black" | "white";
export type Corner = "black" | "chrome";
export type TolexColor =
  | "black"
  | "emerald_green"
  | "teal_levant"
  | "navy"
  | "regency_blue"
  | "purple"
  | "apple_green"
  | "cocoa"
  | "seafoam_green"
  | "metallic_gold"
  | "carolina_blue"
  | "metallic_silver"
  | "pink"
  | "ivory"
  | "yellow"
  | "white"
  | "flamingo_pink"
  | "orange"
  | "red";
export type Speaker = "v30" | "creamback" | "greenback";
export type SpeakerAssignment = Speaker | null;

export const tolexColors: Record<TolexColor, { label: string; hex: string; vendor: string; style: string; swatch: string }> = {
  black: { label: "Black", hex: "#222222", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/black.png") },
  emerald_green: { label: "Emerald Green", hex: "#274037", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/british_green.png") },
  teal_levant: { label: "Teal", hex: "#0aa6a1", vendor: "Mojotone", style: "Levant", swatch: assetPath("assets/swatches/colors/teal_levant.png") },
  navy: { label: "Navy", hex: "#112a49", vendor: "Mojotone", style: "Levant", swatch: assetPath("assets/swatches/colors/navy.png") },
  regency_blue: { label: "Regency Blue", hex: "#1662cf", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/regency_blue.png") },
  purple: { label: "Purple", hex: "#3b2f66", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/purple.png") },
  apple_green: { label: "Apple Green", hex: "#64b630", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/apple_green.png") },
  cocoa: { label: "Cocoa", hex: "#65574d", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/cocoa.png") },
  seafoam_green: { label: "Seafoam Green", hex: "#7fac74", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/seafoam_green.png") },
  metallic_gold: { label: "Gold", hex: "#b88758", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/metallic_gold.png") },
  carolina_blue: { label: "Carolina Blue", hex: "#8dbad6", vendor: "Mojotone", style: "Levant", swatch: assetPath("assets/swatches/colors/carolina_blue.png") },
  metallic_silver: { label: "Silver", hex: "#a4aeac", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/metallic_silver.png") },
  pink: { label: "Pink", hex: "#bd8897", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/pink.png") },
  ivory: { label: "Ivory", hex: "#d4c49b", vendor: "Mojotone", style: "Levant", swatch: assetPath("assets/swatches/colors/ivory.png") },
  yellow: { label: "Yellow", hex: "#dfce5b", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/yellow.png") },
  white: { label: "White", hex: "#e9e9e9", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/white.png") },
  flamingo_pink: { label: "Flamingo Pink", hex: "#ec5d75", vendor: "Mojotone", style: "Levant", swatch: assetPath("assets/swatches/colors/flamingo_pink.png") },
  orange: { label: "Orange", hex: "#f27f2f", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/orange.png") },
  red: { label: "Red", hex: "#ffffff", vendor: "SBS", style: "Levant", swatch: assetPath("assets/swatches/colors/red.png") },
};

export const colorOrder = Object.keys(tolexColors) as TolexColor[];

export const sizes: Record<CabinetSize, { label: string; shortLabel: string; speakerCount: number; base: string; swatch?: string }> = {
  "112": { label: "1x12", shortLabel: "1x12", speakerCount: 1, base: assetPath("assets/112/base/base.png"), swatch: assetPath("assets/swatches/size/112_idle.png") },
  "212h": { label: "2x12 Horizontal", shortLabel: "2x12-H", speakerCount: 2, base: assetPath("assets/212h/base/212h_base.png"), swatch: assetPath("assets/swatches/size/212h_idle.png") },
  "212v": { label: "2x12 Vertical", shortLabel: "2x12-V", speakerCount: 2, base: assetPath("assets/212v/base/base.png"), swatch: assetPath("assets/swatches/size/212v_idle.png") },
  "412": { label: "4x12", shortLabel: "4x12", speakerCount: 4, base: assetPath("assets/412/base/base.png"), swatch: assetPath("assets/swatches/size/412_idle.png") },
  "210": { label: "2x10 Bass", shortLabel: "2x10", speakerCount: 2, base: assetPath("assets/210/base/base.png") },
};

export const liveries: Record<Livery, { label: string; swatch: string; layers: string[] }> = {
  nitro: { label: "Nitro", swatch: assetPath("assets/swatches/liveries/nitro_idle.png"), layers: ["body", "flames"] },
  tiger: { label: "Tiger", swatch: assetPath("assets/swatches/liveries/tiger_idle.png"), layers: ["body", "stripes"] },
  shock: { label: "Shock", swatch: assetPath("assets/swatches/liveries/shock_idle.png"), layers: ["top", "bottom", "bolt"] },
};

export const grills: Record<Grill, { label: string; assetName: string; swatch: string }> = {
  agedsilver: { label: "Aged Silver", assetName: "agedsilver", swatch: assetPath("assets/swatches/grills/agedsilver_idle.png") },
  blackbasket: { label: "Black Basket", assetName: "blackbasket", swatch: assetPath("assets/swatches/grills/blackbasket_idle.png") },
  fendersilver: { label: "Fender Silver", assetName: "fendersilver", swatch: assetPath("assets/swatches/grills/fendersilver_idle.png") },
  oxblood: { label: "Oxblood", assetName: "oxblood", swatch: assetPath("assets/swatches/grills/oxblood_idle.png") },
  saltpepper: { label: "Salt & Pepper", assetName: "saltpepper", swatch: assetPath("assets/swatches/grills/saltpepper_idle.png") },
  smallcane: { label: "Small Cane", assetName: "smallcane", swatch: assetPath("assets/swatches/grills/smallcane_idle.png") },
};

export const speakerOptions: Record<Speaker, { label: string; tone: string; asset: string }> = {
  v30: { label: "Vintage 30", tone: "Aggressive", asset: assetPath("assets/speakers/v30.svg") },
  creamback: { label: "Creamback 65", tone: "Balanced", asset: assetPath("assets/speakers/creamback.svg") },
  greenback: { label: "Greenback 25", tone: "Vintage", asset: assetPath("assets/speakers/greenback.svg") },
};

export const guitarSizes: CabinetSize[] = ["112", "212h", "212v", "412"];
export const liveryOrder: Livery[] = ["tiger", "nitro", "shock"];
export const grillOrder: Grill[] = ["agedsilver", "blackbasket", "fendersilver", "oxblood", "saltpepper", "smallcane"];
export const speakerOrder: Speaker[] = ["v30", "creamback", "greenback"];

export const speakerLayouts: Record<Exclude<CabinetSize, "210">, { x: number; y: number }[]> = {
  "112": [{ x: 50, y: 50 }],
  "212h": [
    { x: 36, y: 50 },
    { x: 64, y: 50 },
  ],
  "212v": [
    { x: 50, y: 34 },
    { x: 50, y: 66 },
  ],
  "412": [
    { x: 36, y: 36 },
    { x: 64, y: 36 },
    { x: 36, y: 64 },
    { x: 64, y: 64 },
  ],
};

export const speakerPlateAssets: Record<Exclude<CabinetSize, "210">, string> = {
  "112": assetPath("assets/speakers/112_speakers.svg"),
  "212h": assetPath("assets/speakers/212h_speakers.svg"),
  "212v": assetPath("assets/speakers/212v_speakers.svg"),
  "412": assetPath("assets/speakers/412_speakers.svg"),
};
