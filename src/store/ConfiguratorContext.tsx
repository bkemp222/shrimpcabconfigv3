import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  CabinetSize,
  Corner,
  Grill,
  Instrument,
  Livery,
  PipeColor,
  Screen,
  SpeakerAssignment,
  TolexColor,
} from "../data/configuratorData";
import { sizes } from "../data/configuratorData";

export type ConfiguratorState = {
  instrument: Instrument | null;
  screen: Screen;
  activeTab: "size" | "livery" | "tolex" | "grill" | "trim";
  size: CabinetSize | null;
  livery: Livery;
  tolex: [TolexColor, TolexColor, TolexColor];
  grill: Grill;
  grillPiping: PipeColor;
  liveryPiping: PipeColor;
  corners: Corner;
  speakers: SpeakerAssignment[];
};

type ConfiguratorContextValue = {
  config: ConfiguratorState;
  chooseInstrument: (instrument: Instrument) => void;
  setScreen: (screen: Screen) => void;
  setActiveTab: (tab: ConfiguratorState["activeTab"]) => void;
  setSize: (size: CabinetSize) => void;
  setLivery: (livery: Livery) => void;
  setTolex: (slot: 0 | 1 | 2, color: TolexColor) => void;
  setGrill: (grill: Grill) => void;
  setGrillPiping: (color: PipeColor) => void;
  setLiveryPiping: (color: PipeColor) => void;
  setCorners: (corner: Corner) => void;
  setSpeaker: (index: number, speaker: SpeakerAssignment) => void;
  next: () => void;
  back: () => void;
  startOver: () => void;
};

const initialState: ConfiguratorState = {
  instrument: null,
  screen: "instrument",
  activeTab: "size",
  size: null,
  livery: "nitro",
  tolex: ["apple_green", "purple", "black"],
  grill: "blackbasket",
  grillPiping: "white",
  liveryPiping: "white",
  corners: "black",
  speakers: [],
};

const Context = createContext<ConfiguratorContextValue | null>(null);
const STORAGE_KEY = "build-your-shrimp-v3-config";

function buildSpeakers(size: CabinetSize) {
  return Array.from({ length: sizes[size].speakerCount }, () => null);
}

function migrateConfig(saved: unknown): ConfiguratorState {
  if (!saved || typeof saved !== "object") return initialState;
  const source = saved as Partial<ConfiguratorState> & { grillPipe?: PipeColor };
  const sharedPipe = source.grillPipe ?? "white";
  return {
    ...initialState,
    ...source,
    grillPiping: source.grillPiping ?? sharedPipe,
    liveryPiping: source.liveryPiping ?? sharedPipe,
  };
}

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? migrateConfig(JSON.parse(raw)) : initialState;
  } catch {
    return initialState;
  }
}

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfiguratorState>(loadInitialState);

  useEffect(() => {
    const save = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }, 220);
    return () => window.clearTimeout(save);
  }, [config]);

  const value = useMemo<ConfiguratorContextValue>(
    () => ({
      config,
      chooseInstrument: (instrument) => {
        setConfig({
          ...initialState,
          instrument,
          screen: "configurator",
          size: instrument === "guitar" ? "212v" : "210",
          speakers: instrument === "guitar" ? buildSpeakers("212v") : ["creamback", "creamback"],
        });
      },
      setScreen: (screen) => setConfig((current) => ({ ...current, screen })),
      setActiveTab: (activeTab) => setConfig((current) => ({ ...current, activeTab })),
      setSize: (size) =>
        setConfig((current) => ({
          ...current,
          size,
          speakers: current.instrument === "guitar" ? buildSpeakers(size) : current.speakers,
        })),
      setLivery: (livery) =>
        setConfig((current) => ({
          ...current,
          livery,
          activeTab: livery === "shock" ? current.activeTab : current.activeTab,
        })),
      setTolex: (slot, color) =>
        setConfig((current) => {
          const nextTolex = [...current.tolex] as ConfiguratorState["tolex"];
          nextTolex[slot] = color;
          return { ...current, tolex: nextTolex };
        }),
      setGrill: (grill) => setConfig((current) => ({ ...current, grill })),
      setGrillPiping: (grillPiping) => setConfig((current) => ({ ...current, grillPiping })),
      setLiveryPiping: (liveryPiping) => setConfig((current) => ({ ...current, liveryPiping })),
      setCorners: (corners) => setConfig((current) => ({ ...current, corners })),
      setSpeaker: (index, speaker) =>
        setConfig((current) => {
          const speakers = [...current.speakers];
          speakers[index] = speaker;
          return { ...current, speakers };
        }),
      next: () =>
        setConfig((current) => {
          if (current.screen === "instrument") return current;
          if (current.screen === "configurator") {
            return { ...current, screen: current.instrument === "guitar" ? "speakers" : "review" };
          }
          if (current.screen === "speakers") return { ...current, screen: "review" };
          return current;
        }),
      back: () =>
        setConfig((current) => {
          if (current.screen === "configurator") return { ...current, screen: "instrument", instrument: null, size: null };
          if (current.screen === "speakers") return { ...current, screen: "configurator" };
          if (current.screen === "review") {
            return { ...current, screen: current.instrument === "guitar" ? "speakers" : "configurator" };
          }
          return current;
        }),
      startOver: () => setConfig(initialState),
    }),
    [config],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useConfigurator() {
  const context = useContext(Context);
  if (!context) throw new Error("useConfigurator must be used inside ConfiguratorProvider");
  return context;
}
