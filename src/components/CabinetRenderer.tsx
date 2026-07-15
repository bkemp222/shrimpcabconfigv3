import type { CabinetSize, Corner, Grill, Livery, PipeColor, SpeakerAssignment, TolexColor } from "../data/configuratorData";
import { grills, liveries, sizes, speakerLayouts, speakerOptions, tolexColors } from "../data/configuratorData";

type Props = {
  instrument: "guitar" | "bass";
  size: CabinetSize;
  livery: Livery;
  tolex: [TolexColor, TolexColor, TolexColor];
  grill: Grill;
  grillPipe: PipeColor;
  corners: Corner;
  speakers?: SpeakerAssignment[];
  showSpeakers?: boolean;
  compact?: boolean;
};

function liveryAsset(size: CabinetSize, livery: Livery, layer: string) {
  return `/assets/${size}/svg/${livery}_${layer}.svg`;
}

export function CabinetRenderer({ instrument, size, livery, tolex, grill, grillPipe, corners, speakers = [], showSpeakers = false, compact = false }: Props) {
  const layerNames = liveries[livery].layers;
  const colors = layerNames.map((_, index) => tolexColors[tolex[index] ?? tolex[0]].hex);

  return (
    <div className={`cabinetRenderer ${compact ? "cabinetRendererCompact" : ""}`} aria-label="Cabinet preview">
      <img className="renderLayer" src={sizes[size].base} alt="" draggable={false} />
      {layerNames.map((layer, index) => (
        <span
          className="renderLayer maskLayer"
          key={`${livery}-${layer}`}
          style={{
            backgroundColor: colors[index],
            WebkitMaskImage: `url("${liveryAsset(size, livery, layer)}")`,
            maskImage: `url("${liveryAsset(size, livery, layer)}")`,
          }}
        />
      ))}
      <img className="renderLayer" src={`/assets/${size}/piping/${livery}_${grillPipe}.png`} alt="" draggable={false} />
      {instrument === "guitar" && (
        <>
          <img className="renderLayer" src={`/assets/${size}/grills/${grills[grill].assetName}.png`} alt="" draggable={false} />
          <img className="renderLayer" src={`/assets/${size}/piping/grill_${grillPipe}.png`} alt="" draggable={false} />
          {corners === "chrome" && <img className="renderLayer" src={`/assets/${size}/corners/chrome.png`} alt="" draggable={false} />}
          {showSpeakers && size !== "210" && (
            <div className="speakerPreviewLayer">
              {(speakerLayouts[size as Exclude<CabinetSize, "210">] ?? []).map((pos, index) => {
                const speaker = speakers[index];
                return (
                  <span className="speakerPreview" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} key={index}>
                    {speaker ? <img src={speakerOptions[speaker].asset} alt="" draggable={false} /> : <span />}
                  </span>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
