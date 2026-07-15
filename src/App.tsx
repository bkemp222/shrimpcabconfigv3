import type { CabinetSize, Grill, Instrument, Livery, PipeColor, Speaker, TolexColor } from "./data/configuratorData";
import {
  colorOrder,
  grills,
  grillOrder,
  guitarSizes,
  liveries,
  liveryOrder,
  sizes,
  speakerOptions,
  speakerOrder,
  speakerLayouts,
  speakerPlateAssets,
  tolexColors,
} from "./data/configuratorData";
import { CabinetRenderer } from "./components/CabinetRenderer";
import { assetPath } from "./data/assets";
import { useConfigurator } from "./store/ConfiguratorContext";

const tabs = ["size", "livery", "tolex", "grill", "trim"] as const;

function Header() {
  return (
    <header className="brandHeader">
      <div className="buildMark">
        <span />
        <strong>Build Your</strong>
        <span />
      </div>
      <img src={assetPath("assets/shrimp_header logo.png")} alt="Shrimp" />
    </header>
  );
}

function NavButton({ direction, onClick, children }: { direction: "back" | "next"; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`navButton ${direction}`} onClick={onClick}>
      {direction === "back" && <span className="arrowIcon left" aria-hidden />}
      {children}
      {direction === "next" && <span className="arrowIcon right" aria-hidden />}
    </button>
  );
}

function InstrumentSelection() {
  const { chooseInstrument } = useConfigurator();
  const option = (instrument: Instrument) => (
    <button className="instrumentPick" onClick={() => chooseInstrument(instrument)}>
      <img src={assetPath(`assets/swatches/instruments/${instrument}_idle.png`)} alt="" />
      <span>{instrument}</span>
    </button>
  );

  return (
    <main className="landingScreen">
      <div className="stageHero">
        <img className="stageArt" src={assetPath("assets/instrument_select.png")} alt="" />
        <div className="instrumentChoices">
          {option("bass")}
          {option("guitar")}
        </div>
      </div>
      <section className="chooserBand">
        <span className="upIcon" aria-hidden />
        <h1>Choose Your Instrument</h1>
        <span className="upIcon" aria-hidden />
      </section>
      <section className="disclaimer">
        <h2>Super Technical and Critical Disclaimer</h2>
        <p>The renders are digital and our cabs are real. Colors, patterns, textures, and stage vibes may vary when the amp gets loud.</p>
      </section>
    </main>
  );
}

function PreviewPanel({ showSpeakers = false }: { showSpeakers?: boolean }) {
  const { config, back, next } = useConfigurator();
  if (!config.instrument || !config.size) return null;

  return (
    <section className="previewPanel">
      <div className="previewControls">
        <NavButton direction="back" onClick={back}>
          Back
        </NavButton>
        <NavButton direction="next" onClick={next}>
          Next
        </NavButton>
      </div>
      <CabinetRenderer
        instrument={config.instrument}
        size={config.size}
        livery={config.livery}
        tolex={config.tolex}
        grill={config.grill}
        grillPipe={config.grillPipe}
        corners={config.corners}
        speakers={config.speakers}
        showSpeakers={showSpeakers}
      />
    </section>
  );
}

function OptionButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <button className={`optionCard ${active ? "selected" : ""}`} onClick={onClick}>
      <strong>{label}</strong>
      {children}
    </button>
  );
}

function SizePanel() {
  const { config, setSize } = useConfigurator();
  return (
    <div className="optionGrid sizeGrid">
      {guitarSizes.map((size) => (
        <OptionButton key={size} active={config.size === size} onClick={() => setSize(size)} label={sizes[size].shortLabel}>
          <img src={sizes[size].swatch} alt="" />
        </OptionButton>
      ))}
    </div>
  );
}

function LiveryPanel() {
  const { config, setLivery } = useConfigurator();
  return (
    <div className="optionGrid threeGrid">
      {liveryOrder.map((livery) => (
        <OptionButton key={livery} active={config.livery === livery} onClick={() => setLivery(livery)} label={liveries[livery].label}>
          <img src={liveries[livery].swatch} alt="" />
        </OptionButton>
      ))}
    </div>
  );
}

function TolexPanel() {
  const { config, setTolex } = useConfigurator();
  const visibleSlots = config.livery === "shock" ? 3 : 2;
  return (
    <div className="tolexPanel">
      {([0, 1, 2] as const).map((slot) => (
        <section className={`tolexSlot ${slot >= visibleSlots ? "locked" : ""}`} key={slot}>
          <h3>{slot >= visibleSlots ? "N/A" : tolexColors[config.tolex[slot]].label}</h3>
          {slot >= visibleSlots ? (
            <div className="lockBadge">Locked</div>
          ) : (
            <select value={config.tolex[slot]} onChange={(event) => setTolex(slot, event.target.value as TolexColor)}>
              {colorOrder.map((color) => (
                <option value={color} key={color}>
                  {tolexColors[color].label}
                </option>
              ))}
            </select>
          )}
          <div
            className="bigSwatch"
            style={{ backgroundColor: slot >= visibleSlots ? "#e8dfdc" : tolexColors[config.tolex[slot]].hex }}
          />
        </section>
      ))}
    </div>
  );
}

function GrillPanel() {
  const { config, setGrill } = useConfigurator();
  return (
    <div className="optionGrid grillGrid">
      {grillOrder.map((grill) => (
        <OptionButton key={grill} active={config.grill === grill} onClick={() => setGrill(grill)} label={grills[grill].label}>
          <img src={grills[grill].swatch} alt="" />
        </OptionButton>
      ))}
    </div>
  );
}

function TrimPanel() {
  const { config, setGrillPipe, setCorners } = useConfigurator();
  const trimChoice = (type: "pipe" | "corner", value: PipeColor | "chrome", label: string) => {
    const active = type === "pipe" ? config.grillPipe === value : config.corners === value;
    return (
      <OptionButton
        active={active}
        onClick={() => (type === "pipe" ? setGrillPipe(value as PipeColor) : setCorners(value as "black" | "chrome"))}
        label={label}
      >
        <span className={`materialDot ${value}`} />
      </OptionButton>
    );
  };
  return (
    <div className="trimPanel">
      <section>
        <h3>Grill Trim</h3>
        <div className="trimChoices">{trimChoice("pipe", "black", "Black")}{trimChoice("pipe", "white", "White")}</div>
      </section>
      <section>
        <h3>Corners</h3>
        <div className="trimChoices">{trimChoice("corner", "black", "Black")}{trimChoice("corner", "chrome", "Chrome")}</div>
      </section>
    </div>
  );
}

function ConfiguratorScreen() {
  const { config, setActiveTab } = useConfigurator();
  if (!config.instrument) return null;
  const isBass = config.instrument === "bass";

  return (
    <main className="workbench">
      <PreviewPanel />
      <section className="controlDock">
        {!isBass && (
          <nav className="tabs" aria-label="Cabinet configuration">
            {tabs.map((tab) => (
              <button className={config.activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} key={tab}>
                {tab}
              </button>
            ))}
          </nav>
        )}
        {isBass ? <BassFixedPanel /> : <ConfiguratorTab />}
      </section>
    </main>
  );
}

function BassFixedPanel() {
  const { config, setLivery } = useConfigurator();
  return (
    <div className="bassPanel">
      <h2>2x10 Bass Cab</h2>
      <p>Fixed black powder-coated aluminum grill, fixed corners, and two Celestion BN10-300X drivers.</p>
      <div className="optionGrid threeGrid">
        {liveryOrder.map((livery) => (
          <OptionButton key={livery} active={config.livery === livery} onClick={() => setLivery(livery)} label={liveries[livery].label}>
            <img src={liveries[livery].swatch} alt="" />
          </OptionButton>
        ))}
      </div>
      <TolexPanel />
    </div>
  );
}

function ConfiguratorTab() {
  const { config } = useConfigurator();
  if (config.activeTab === "size") return <SizePanel />;
  if (config.activeTab === "livery") return <LiveryPanel />;
  if (config.activeTab === "tolex") return <TolexPanel />;
  if (config.activeTab === "grill") return <GrillPanel />;
  return <TrimPanel />;
}

function SpeakerSelection() {
  const { config, back, next, setSpeaker } = useConfigurator();
  if (!config.size || config.size === "210") return null;

  const handleDrop = (index: number, speaker: Speaker) => setSpeaker(index, speaker);
  const layout = speakerLayouts[config.size as Exclude<CabinetSize, "210">];

  return (
    <main className="speakerScreen">
      <section className="speakerTop">
        <NavButton direction="back" onClick={back}>Back</NavButton>
        <div className="speakerPlate">
          <img src={speakerPlateAssets[config.size as Exclude<CabinetSize, "210">]} alt="" />
          {Array.from({ length: sizes[config.size].speakerCount }).map((_, index) => (
            <button
              className="speakerHole"
              style={{ left: `${layout[index].x}%`, top: `${layout[index].y}%` }}
              key={index}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(index, event.dataTransfer.getData("speaker") as Speaker)}
              onPointerUp={() => {
                if (!config.speakers[index]) setSpeaker(index, "creamback");
              }}
            >
              {config.speakers[index] ? <img src={speakerOptions[config.speakers[index] as Speaker].asset} alt="" /> : <span />}
            </button>
          ))}
        </div>
        <NavButton direction="next" onClick={next}>Next</NavButton>
      </section>
      <section className="speakerChooser">
        <h1>Choose Your Speakers</h1>
        <p>Drag a speaker into an opening, or tap an empty opening for Creamback.</p>
        <div className="speakerOptions">
          {speakerOrder.map((speaker) => (
            <button
              key={speaker}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("speaker", speaker)}
              onClick={() => {
                const emptyIndex = config.speakers.findIndex((item) => !item);
                setSpeaker(emptyIndex === -1 ? 0 : emptyIndex, speaker);
              }}
            >
              <strong>{speakerOptions[speaker].label}</strong>
              <img src={speakerOptions[speaker].asset} alt="" />
              <span>{speakerOptions[speaker].tone}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function ReviewScreen() {
  const { config, back, startOver } = useConfigurator();
  if (!config.instrument || !config.size) return null;
  const isGuitar = config.instrument === "guitar";
  const liverySlots = liveries[config.livery].layers.length;

  return (
    <main className="reviewScreen">
      <section className="reviewPreview">
        <CabinetRenderer
          compact
          instrument={config.instrument}
          size={config.size}
          livery={config.livery}
          tolex={config.tolex}
          grill={config.grill}
          grillPipe={config.grillPipe}
          corners={config.corners}
          speakers={config.speakers}
        />
      </section>
      <section className="reviewDetails">
        <h1>Review Your Shrimp</h1>
        <dl>
          <dt>Instrument</dt><dd>{config.instrument}</dd>
          <dt>Cabinet Size</dt><dd>{sizes[config.size].label}</dd>
          <dt>Livery</dt><dd>{liveries[config.livery].label}</dd>
          <dt>Tolex</dt><dd>{config.tolex.slice(0, liverySlots).map((color, index) => `Layer ${index + 1}: ${tolexColors[color].label}`).join(" / ")}</dd>
          <dt>Grill</dt><dd>{isGuitar ? grills[config.grill].label : "Black powder-coated aluminum"}</dd>
          <dt>Grill Piping</dt><dd>{isGuitar ? config.grillPipe : "Fixed"}</dd>
          <dt>Corners</dt><dd>{isGuitar ? config.corners : "Fixed"}</dd>
          <dt>Speakers</dt>
          <dd>
            {isGuitar
              ? config.speakers.map((speaker, index) => `Opening ${index + 1}: ${speaker ? speakerOptions[speaker].label : "Unloaded"}`).join(" / ")
              : "Two Celestion BN10-300X drivers"}
          </dd>
        </dl>
        <div className="reviewActions">
          <NavButton direction="back" onClick={back}>Back</NavButton>
          <button className="startOver" onClick={startOver}>Start Over</button>
        </div>
      </section>
    </main>
  );
}

export function App() {
  const { config } = useConfigurator();
  return (
    <div className="app">
      <Header />
      {config.screen === "instrument" && <InstrumentSelection />}
      {config.screen === "configurator" && <ConfiguratorScreen />}
      {config.screen === "speakers" && <SpeakerSelection />}
      {config.screen === "review" && <ReviewScreen />}
    </div>
  );
}
