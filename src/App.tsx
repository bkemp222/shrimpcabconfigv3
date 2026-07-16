import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CabinetSize, Grill, Instrument, Livery, Speaker, TolexColor } from "./data/configuratorData";
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
const wheelCopies = 5;
const wheelMiddleCopy = Math.floor(wheelCopies / 2);
const loopedColors = Array.from({ length: wheelCopies }, () => colorOrder).flat();
const wheelFriction = 0.962;
const wheelVelocityThreshold = 0.045;
const wheelMaxVelocity = 1.45;
const wheelSnapDuration = 230;
const startupMessages = [
  "Cutting tolex…",
  "Spilling the glue…",
  "Reloading staple gun…",
  "Looking for good album to play…",
  "Sanding…",
  "More sanding…",
  "Even more sanding…",
  "Feeding the shrimp…",
  "Bathroom break…",
  "Reticulating splines…",
  "Riff break…",
  "Daydreaming about stuff…",
  "Stretching grill cloth…",
  "Summoning cabinet gnomes for assistance…",
] as const;
const startupSpinDuration = 2800;
const startupMinimumDuration = 1500;

function startupAssets() {
  const defaultSize = "212v" as const;
  const defaultLivery = "nitro" as const;
  const defaultGrill = "blackbasket" as const;

  return [
    assetPath("assets/loading_icon.svg"),
    assetPath("assets/config_header.png"),
    assetPath("assets/instrument_select.png"),
    assetPath("assets/swatches/instruments/bass_idle.png"),
    assetPath("assets/swatches/instruments/bass_active.png"),
    assetPath("assets/swatches/instruments/guitar_idle.png"),
    assetPath("assets/swatches/instruments/guitar_active.png"),
    sizes[defaultSize].base,
    sizes[defaultSize].swatch,
    liveries[defaultLivery].swatch,
    assetPath(`assets/${defaultSize}/svg/${defaultLivery}_body.svg`),
    assetPath(`assets/${defaultSize}/svg/${defaultLivery}_flames.svg`),
    assetPath(`assets/${defaultSize}/grills/${grills[defaultGrill].assetName}.png`),
    grills[defaultGrill].swatch,
    assetPath(`assets/${defaultSize}/piping/${defaultLivery}_white.png`),
    assetPath(`assets/${defaultSize}/piping/grill_white.png`),
  ].filter(Boolean) as string[];
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const timeout = window.setTimeout(() => {
      console.warn("Startup asset preload timed out", src);
      resolve();
    }, 3500);
    const finish = (failed = false) => {
      window.clearTimeout(timeout);
      if (failed) console.warn("Startup asset failed to preload", src);
      resolve();
    };
    image.onload = () => finish();
    image.onerror = () => finish(true);
    image.src = src;
  });
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function wrapColorIndex(index: number) {
  return ((index % colorOrder.length) + colorOrder.length) % colorOrder.length;
}

function scrollByPage(container: HTMLDivElement | null, direction: -1 | 1) {
  container?.scrollBy({ left: direction * container.clientWidth * 0.72, behavior: "smooth" });
}

function zoneStyle(zone: { x: number; y: number; width: number; height: number }) {
  return {
    left: `${(zone.x / 2000) * 100}%`,
    top: `${(zone.y / 2000) * 100}%`,
    width: `${(zone.width / 2000) * 100}%`,
    height: `${(zone.height / 2000) * 100}%`,
  };
}

function segmentButton(active: boolean, label: string, onClick: () => void) {
  return (
    <button className={active ? "active" : ""} type="button" aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );
}

function HorizontalSelector({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="horizontalSelector">
      <button className="selectorArrow selectorArrowLeft" type="button" aria-label="Previous options" onClick={() => scrollByPage(ref.current, -1)}>
        <span className="arrowIcon left" aria-hidden />
      </button>
      <div className={className} ref={ref}>
        {children}
      </div>
      <button className="selectorArrow selectorArrowRight" type="button" aria-label="Next options" onClick={() => scrollByPage(ref.current, 1)}>
        <span className="arrowIcon right" aria-hidden />
      </button>
    </div>
  );
}

function Header() {
  return (
    <header className="brandHeader">
      <img src={assetPath("assets/config_header.png")} alt="Build Your Shrimp" />
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

function StartupPreloader({ onDone }: { onDone: () => void }) {
  const [messageIndex, setMessageIndex] = useState(() => Math.floor(Math.random() * startupMessages.length));
  const [messageVisible, setMessageVisible] = useState(true);
  const [isSpinning, setIsSpinning] = useState(true);
  const [settleAngle, setSettleAngle] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const spinStart = useRef(performance.now());
  const ready = useRef(false);

  useEffect(() => {
    const tick = () => {
      if (ready.current) return;
      setMessageVisible(false);
      window.setTimeout(() => {
        if (ready.current) return;
        setMessageIndex((index) => (index + 1) % startupMessages.length);
        setMessageVisible(true);
      }, 180);
      window.setTimeout(tick, 1200 + Math.random() * 600);
    };
    const timer = window.setTimeout(tick, 1200 + Math.random() * 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([Promise.all(startupAssets().map(preloadImage)), new Promise((resolve) => window.setTimeout(resolve, startupMinimumDuration))]).then(() => {
      if (cancelled) return;
      ready.current = true;
      setMessageVisible(false);

      window.setTimeout(() => {
        if (cancelled) return;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
          setIsSpinning(false);
          setSettleAngle(0);
          setIsExiting(true);
          window.setTimeout(() => {
            if (!cancelled) onDone();
          }, 140);
          return;
        }
        const currentAngle = ((performance.now() - spinStart.current) % startupSpinDuration) / startupSpinDuration * 360;
        const remaining = currentAngle === 0 ? 360 : 360 - currentAngle;
        const settleDuration = Math.max(420, Math.min(900, (remaining / 360) * startupSpinDuration));
        const settleStartedAt = performance.now();

        setIsSpinning(false);
        setSettleAngle(currentAngle);

        const animateSettle = (now: number) => {
          if (cancelled) return;
          const progress = Math.min(1, (now - settleStartedAt) / settleDuration);
          setSettleAngle(currentAngle + remaining * easeOutCubic(progress));
          if (progress < 1) {
            window.requestAnimationFrame(animateSettle);
            return;
          }
          setSettleAngle(360);
          setIsExiting(true);
          window.setTimeout(() => {
            if (!cancelled) onDone();
          }, 460);
        };

        window.requestAnimationFrame(animateSettle);
      }, 260);
    });

    return () => {
      cancelled = true;
    };
  }, [onDone]);

  return (
    <section className={`startupPreloader ${isExiting ? "exiting" : ""}`} aria-label="Loading Build Your Shrimp">
      <div className="startupPreloaderInner">
        <img
          className={`startupPreloaderIcon ${isSpinning ? "spinning" : ""}`}
          src={assetPath("assets/loading_icon.svg")}
          alt=""
          style={isSpinning ? undefined : { transform: `rotate(${settleAngle}deg)` }}
        />
        <p className={`startupPreloaderMessage ${messageVisible ? "visible" : ""}`}>{startupMessages[messageIndex]}</p>
      </div>
    </section>
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
        <h3>Choose Your Instrument</h3>
        <span className="upIcon" aria-hidden />
      </section>
      <section className="disclaimer">
        <h4>Super Technical and Critical Disclaimer</h4>
        <p>The renders are digital and our cabs are real. Colors, patterns, textures, and stage vibes may differ slightly in person.</p>
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
        grillPiping={config.grillPiping}
        liveryPiping={config.liveryPiping}
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
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  return (
    <button className={`optionCard ${active ? "selected" : ""}`} onClick={onClick} ref={ref}>
      <strong>{label}</strong>
      {children}
    </button>
  );
}

function SizePanel() {
  const { config, setSize } = useConfigurator();
  if (config.instrument === "bass") {
    return (
      <HorizontalSelector className="optionGrid fixedBassGrid">
        <OptionButton active onClick={() => undefined} label={sizes["210"].shortLabel}>
          <span className="fixedNote">Fixed bass cabinet</span>
        </OptionButton>
      </HorizontalSelector>
    );
  }

  return (
    <HorizontalSelector className="optionGrid sizeGrid">
      {guitarSizes.map((size) => (
        <OptionButton key={size} active={config.size === size} onClick={() => setSize(size)} label={sizes[size].shortLabel}>
          <img src={sizes[size].swatch} alt="" />
        </OptionButton>
      ))}
    </HorizontalSelector>
  );
}

function LiveryPanel() {
  const { config, setLivery } = useConfigurator();
  return (
    <HorizontalSelector className="optionGrid threeGrid">
      {liveryOrder.map((livery) => (
        <OptionButton key={livery} active={config.livery === livery} onClick={() => setLivery(livery)} label={liveries[livery].label}>
          <img src={liveries[livery].swatch} alt="" />
        </OptionButton>
      ))}
    </HorizontalSelector>
  );
}

function TolexWheel({ slot, value, onChange }: { slot: 0 | 1 | 2; value: TolexColor; onChange: (slot: 0 | 1 | 2, color: TolexColor) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemPitch = useRef(54);
  const itemHeight = useRef(46);
  const trackInset = useRef(0);
  const position = useRef(wheelMiddleCopy * colorOrder.length + colorOrder.indexOf(value));
  const selectedColor = useRef(value);
  const pointer = useRef<{ id: number; y: number; time: number; velocity: number; dragged: boolean } | null>(null);
  const animation = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);
  const reduceMotion = useRef(false);
  const [, forceFrame] = useState(0);

  function stopAnimation() {
    if (animation.current !== null) window.cancelAnimationFrame(animation.current);
    animation.current = null;
    if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    settleTimer.current = null;
  }

  function normalizedPosition(nextPosition: number) {
    const setLength = colorOrder.length;
    const low = setLength * (wheelMiddleCopy - 0.5);
    const high = setLength * (wheelMiddleCopy + 1.5);
    let normalized = nextPosition;
    while (normalized < low) normalized += setLength;
    while (normalized > high) normalized -= setLength;
    return normalized;
  }

  function applyPosition(nextPosition: number, commit = true) {
    position.current = normalizedPosition(nextPosition);
    const centeredColor = colorOrder[wrapColorIndex(Math.round(position.current))];
    if (centeredColor && centeredColor !== selectedColor.current) {
      selectedColor.current = centeredColor;
      if (commit) onChange(slot, centeredColor);
    }
    forceFrame((frame) => frame + 1);
  }

  function measureWheel() {
    const wheel = ref.current;
    const first = trackRef.current?.querySelector<HTMLButtonElement>("[data-index]");
    const second = trackRef.current?.querySelector<HTMLButtonElement>('[data-index="1"]');
    const track = trackRef.current;
    if (!wheel || !track || !first) return;
    trackInset.current = track.offsetTop;
    itemHeight.current = first.offsetHeight || itemHeight.current;
    if (second) {
      itemPitch.current = Math.max(1, second.offsetTop - first.offsetTop);
    } else {
      itemPitch.current = itemHeight.current + 8;
    }
    applyPosition(position.current, false);
  }

  function settleTo(target: number, duration = wheelSnapDuration) {
    stopAnimation();
    const from = position.current;
    const startedAt = performance.now();

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      applyPosition(from + (target - from) * easeOutCubic(progress));
      if (progress < 1) {
        animation.current = window.requestAnimationFrame(animate);
        return;
      }
      applyPosition(target);
      ref.current?.classList.add("settled");
      settleTimer.current = window.setTimeout(() => ref.current?.classList.remove("settled"), 180);
      animation.current = null;
    };

    animation.current = window.requestAnimationFrame(animate);
  }

  function startInertia(velocity: number) {
    if (reduceMotion.current) {
      settleTo(Math.round(position.current), 120);
      return;
    }

    let currentVelocity = Math.max(-wheelMaxVelocity, Math.min(wheelMaxVelocity, velocity));
    let lastTime = performance.now();

    const coast = (now: number) => {
      const elapsed = Math.min(32, now - lastTime);
      lastTime = now;
      applyPosition(position.current + (currentVelocity * elapsed) / itemPitch.current);
      currentVelocity *= Math.pow(wheelFriction, elapsed / 16.67);

      if (Math.abs(currentVelocity) > wheelVelocityThreshold) {
        animation.current = window.requestAnimationFrame(coast);
        return;
      }

      animation.current = null;
      settleTo(Math.round(position.current));
    };

    animation.current = window.requestAnimationFrame(coast);
  }

  useLayoutEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measureWheel();
    const onResize = () => measureWheel();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useLayoutEffect(() => {
    if (value === selectedColor.current) return;
    selectedColor.current = value;
    position.current = wheelMiddleCopy * colorOrder.length + colorOrder.indexOf(value);
    applyPosition(position.current, false);
  }, [value]);

  useEffect(() => () => stopAnimation(), []);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    stopAnimation();
    ref.current?.setPointerCapture(event.pointerId);
    pointer.current = {
      id: event.pointerId,
      y: event.clientY,
      time: event.timeStamp,
      velocity: 0,
      dragged: false,
    };

    const release = () => {
      const activePointer = pointer.current;
      if (!activePointer) return;
      finishPointer(activePointer);
    };
    window.addEventListener("pointerup", release, { once: true });
    window.addEventListener("mouseup", release, { once: true });
    window.addEventListener("touchend", release, { once: true });
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const activePointer = pointer.current;
    if (!activePointer || activePointer.id !== event.pointerId) return;
    event.preventDefault();
    const deltaY = event.clientY - activePointer.y;
    const elapsed = Math.max(1, event.timeStamp - activePointer.time);
    if (Math.abs(deltaY) > 2) activePointer.dragged = true;
    applyPosition(position.current - deltaY / itemPitch.current);
    const instantVelocity = -deltaY / elapsed;
    activePointer.velocity = activePointer.velocity * 0.72 + instantVelocity * 0.28;
    activePointer.y = event.clientY;
    activePointer.time = event.timeStamp;
  }

  function finishPointer(activePointer: { velocity: number; dragged: boolean }) {
    pointer.current = null;
    if (activePointer.dragged) {
      startInertia(activePointer.velocity);
      return;
    }
    settleTo(Math.round(position.current), reduceMotion.current ? 120 : 180);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const activePointer = pointer.current;
    if (!activePointer || activePointer.id !== event.pointerId) return;
    if (ref.current?.hasPointerCapture(event.pointerId)) ref.current.releasePointerCapture(event.pointerId);
    finishPointer(activePointer);
  }

  function handleMouseUp() {
    const activePointer = pointer.current;
    if (!activePointer) return;
    finishPointer(activePointer);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const direction = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    settleTo(Math.round(position.current) + direction, reduceMotion.current ? 120 : wheelSnapDuration);
  }

  const trackOffset = ref.current ? ref.current.clientHeight / 2 - itemHeight.current / 2 - trackInset.current - position.current * itemPitch.current : 0;
  const activeIndex = Math.round(position.current);

  return (
    <div
      className="colorWheel"
      role="listbox"
      aria-label={`Tolex layer ${slot + 1}`}
      aria-activedescendant={`tolex-${slot}-${activeIndex}`}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onLostPointerCapture={handleMouseUp}
      onMouseUp={handleMouseUp}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={ref}
      tabIndex={0}
    >
      <div className="colorWheelTrack" ref={trackRef} style={{ transform: `translate3d(0, ${trackOffset}px, 0)` }}>
        {loopedColors.map((color, index) => {
          const distance = Math.min(4, Math.abs(index - position.current));
          const scale = Math.max(0.68, 1.14 - distance * 0.15);
          const opacity = Math.max(0.24, 1 - distance * 0.24);
          const isActive = index === activeIndex;
          return (
            <button
              aria-selected={isActive}
              className={isActive ? "active" : ""}
              data-color={color}
              data-index={index}
              id={`tolex-${slot}-${index}`}
              key={`${color}-${index}`}
              style={{ backgroundColor: tolexColors[color].hex, opacity, transform: `scale(${scale})` }}
              title={tolexColors[color].label}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                if (pointer.current?.dragged) return;
                settleTo(index, reduceMotion.current ? 120 : wheelSnapDuration);
              }}
            >
              <span>{tolexColors[color].label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TolexPanel() {
  const { config, setTolex } = useConfigurator();
  const visibleSlots = config.livery === "shock" ? 3 : 2;
  return (
    <div className="tolexPanel">
      {([0, 1, 2] as const).slice(0, visibleSlots).map((slot) => (
        <section className="tolexSlot" key={slot}>
          <h3>{tolexColors[config.tolex[slot]].label}</h3>
          <TolexWheel slot={slot} value={config.tolex[slot]} onChange={setTolex} />
        </section>
      ))}
    </div>
  );
}

function GrillPanel() {
  const { config, setGrill } = useConfigurator();
  if (config.instrument === "bass") {
    return (
      <div className="fixedPanel">
        <h2>Black Aluminum Grill</h2>
        <p>Aluminum grill, black powder coated.</p>
      </div>
    );
  }

  return (
    <HorizontalSelector className="optionGrid grillGrid">
      {grillOrder.map((grill) => (
        <OptionButton key={grill} active={config.grill === grill} onClick={() => setGrill(grill)} label={grills[grill].label}>
          <img src={grills[grill].swatch} alt="" />
        </OptionButton>
      ))}
    </HorizontalSelector>
  );
}

function TrimPanel() {
  const { config, setGrillPiping, setLiveryPiping, setCorners } = useConfigurator();
  if (config.instrument === "bass") {
    return (
      <div className="fixedPanel">
        <h2>Fixed Bass Trim</h2>
        <p>Bass corners, grill trim, and speaker loading are represented in the 2x10 render and are not exposed as options in this prototype phase.</p>
      </div>
    );
  }

  return (
    <div className="trimPanel">
      <section className="trimSegmentRow">
        <h3>Grill Trim</h3>
        <div className="segmentedControl">
          {segmentButton(config.grillPiping === "black", "Black", () => setGrillPiping("black"))}
          {segmentButton(config.grillPiping === "white", "White", () => setGrillPiping("white"))}
        </div>
      </section>
      <section className="trimSegmentRow">
        <h3>Livery Trim</h3>
        <div className="segmentedControl">
          {segmentButton(config.liveryPiping === "black", "Black", () => setLiveryPiping("black"))}
          {segmentButton(config.liveryPiping === "white", "White", () => setLiveryPiping("white"))}
        </div>
      </section>
      <section className="trimSegmentRow">
        <h3>Corners</h3>
        <div className="segmentedControl">
          {segmentButton(config.corners === "black", "Black", () => setCorners("black"))}
          {segmentButton(config.corners === "chrome", "Chrome", () => setCorners("chrome"))}
        </div>
      </section>
    </div>
  );
}

function ConfiguratorScreen() {
  const { config, setActiveTab } = useConfigurator();
  if (!config.instrument) return null;

  return (
    <main className="workbench">
      <PreviewPanel />
      <section className="controlDock">
        <nav className="tabs" aria-label="Cabinet configuration">
          {tabs.map((tab) => (
            <button className={config.activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} key={tab}>
              {tab}
            </button>
          ))}
        </nav>
        <ConfiguratorTab />
      </section>
    </main>
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
  const [selectedHole, setSelectedHole] = useState<number | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker>("creamback");
  const [needsHole, setNeedsHole] = useState(false);
  if (!config.size || config.size === "210") return null;

  const handleDrop = (index: number, speaker: Speaker) => {
    setSpeaker(index, speaker);
    setSelectedHole(null);
    setNeedsHole(false);
  };
  const layout = speakerLayouts[config.size as Exclude<CabinetSize, "210">];

  return (
    <main className="speakerScreen">
      <section className="speakerTop">
        <div className="previewControls speakerControls">
          <NavButton direction="back" onClick={back}>Back</NavButton>
          <NavButton direction="next" onClick={next}>Next</NavButton>
        </div>
        <div className={`speakerPlate ${needsHole ? "needsHole" : ""}`}>
          <img src={speakerPlateAssets[config.size as Exclude<CabinetSize, "210">]} alt="" />
          {Array.from({ length: sizes[config.size].speakerCount }).map((_, index) => (
            <button
              className={`speakerHole ${selectedHole === index ? "selected" : ""}`}
              style={zoneStyle(layout[index])}
              key={layout[index].id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(index, event.dataTransfer.getData("speaker") as Speaker)}
              onPointerUp={() => {
                setSelectedHole(index);
                setNeedsHole(false);
              }}
              aria-label={`Speaker position ${index + 1}${config.speakers[index] ? `, ${speakerOptions[config.speakers[index] as Speaker].label}` : ", unloaded"}`}
              aria-pressed={selectedHole === index}
            >
              {config.speakers[index] ? <img src={speakerOptions[config.speakers[index] as Speaker].asset} alt="" /> : <span />}
            </button>
          ))}
        </div>
      </section>
      <section className="speakerChooser">
        <p className={needsHole ? "speakerCue" : ""}>{needsHole ? "Choose a speaker position first." : "Select a position, then tap a speaker."}</p>
        <HorizontalSelector className="speakerOptions">
          {speakerOrder.map((speaker) => (
            <button
              className={selectedSpeaker === speaker ? "selected" : ""}
              key={speaker}
              draggable
              onDragStart={(event) => {
                setSelectedSpeaker(speaker);
                event.dataTransfer.setData("speaker", speaker);
              }}
              onClick={() => {
                setSelectedSpeaker(speaker);
                if (selectedHole === null) {
                  setNeedsHole(true);
                  window.setTimeout(() => setNeedsHole(false), 1400);
                  return;
                }
                const targetIndex = selectedHole;
                setSpeaker(targetIndex, speaker);
                setSelectedHole(null);
                setNeedsHole(false);
              }}
            >
              <strong>{speakerOptions[speaker].label}</strong>
              <img src={speakerOptions[speaker].asset} alt="" />
              <span>{speakerOptions[speaker].tone}</span>
            </button>
          ))}
        </HorizontalSelector>
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
          grillPiping={config.grillPiping}
          liveryPiping={config.liveryPiping}
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
          <dt>Grill Trim</dt><dd>{isGuitar ? config.grillPiping : "Fixed"}</dd>
          <dt>Livery Trim</dt><dd>{isGuitar ? config.liveryPiping : "Fixed"}</dd>
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
  const [preloaderDone, setPreloaderDone] = useState(false);
  const finishPreloader = useCallback(() => setPreloaderDone(true), []);

  return (
    <div className={`app ${config.screen === "review" ? "reviewMode" : ""} ${preloaderDone ? "preloaderReady" : "preloaderActive"}`}>
      <Header />
      {config.screen === "instrument" && <InstrumentSelection />}
      {config.screen === "configurator" && <ConfiguratorScreen />}
      {config.screen === "speakers" && <SpeakerSelection />}
      {config.screen === "review" && <ReviewScreen />}
      {!preloaderDone && <StartupPreloader onDone={finishPreloader} />}
    </div>
  );
}
