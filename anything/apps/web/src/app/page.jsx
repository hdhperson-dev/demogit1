"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Check,
  Download,
  Sparkles,
  RefreshCw,
  User,
  Trash2,
  Search,
  Sun,
  Moon,
  ChevronRight,
  Zap,
  Globe,
  Shuffle,
  CheckSquare,
  History,
  Filter,
  X,
  ArrowRight,
} from "lucide-react";
import { COUNTRIES, COUNTRY_CODES } from "../data/countries";
import { generateBatch, formatAsCSV } from "../utils/generator";
import IdentityCard from "../components/IdentityCard";
import MatrixRain from "../components/MatrixRain";
import OrbitalGlobe from "../components/OrbitalGlobe";

const GENDER_OPTIONS = [
  { value: "random", label: "Random", icon: Shuffle },
  { value: "male", label: "Male", icon: null },
  { value: "female", label: "Female", icon: null },
];

const COUNT_OPTIONS = [1, 5, 10, 25, 50, 100];

// Apero-inspired: deep midnight navy bg + warm orange accent
const T = {
  dark: {
    bg: "#0E0B1F",
    bgSecondary: "#15122B",
    panel: "#1A1734",
    panelElevated: "#221E40",
    border: "#2E2A52",
    borderSoft: "#231F44",
    text: "#F5F1E8",
    textMuted: "#9B96B8",
    textDim: "#6B6886",
    accent: "#FB923C",
    accentSoft: "rgba(251,146,60,0.12)",
    accentBright: "#FDBA74",
    cyan: "#FCD34D",
    pink: "#F472B6",
    amber: "#FACC15",
    green: "#86EFAC",
    red: "#FCA5A5",
    purple: "#FDBA74",
    gradient1: "#F97316",
    gradient2: "#FBBF24",
  },
  light: {
    bg: "#FFFBF5",
    bgSecondary: "#FFF4E6",
    panel: "#FFFFFF",
    panelElevated: "#FFFFFF",
    border: "#FDE4C8",
    borderSoft: "#FFEFDC",
    text: "#1A1208",
    textMuted: "#7C5E47",
    textDim: "#A08869",
    accent: "#EA580C",
    accentSoft: "rgba(234,88,12,0.08)",
    accentBright: "#C2410C",
    cyan: "#D97706",
    pink: "#DB2777",
    amber: "#D97706",
    green: "#059669",
    red: "#DC2626",
    purple: "#EA580C",
    gradient1: "#EA580C",
    gradient2: "#F59E0B",
  },
};

const BOOT_LINES = [
  { text: "$ initializing identity_forge.exe", status: "" },
  { text: "$ loading 26 regional datasets", status: "OK" },
  { text: "$ mounting /dev/random", status: "OK" },
  { text: "$ establishing entropy pool", status: "OK" },
  { text: "$ system ready", status: "" },
];

function TypewriterLine({ text, speed = 18, onDone }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onDone]);
  return <span>{displayed}</span>;
}

function StatCard({ label, value, theme, color, icon: Icon }) {
  return (
    <div
      className="rounded-xl px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 group"
      style={{
        background: theme.panel,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div
          className="text-[10px] uppercase tracking-[0.14em] font-mono"
          style={{ color: theme.textMuted }}
        >
          {label}
        </div>
        {Icon && (
          <Icon
            className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
            style={{ color: color || theme.accent }}
          />
        )}
      </div>
      <div
        className="text-[24px] font-semibold tracking-tight tabular-nums leading-none"
        style={{
          color: color || theme.text,
          fontFamily: "var(--font-display)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isDark, setIsDark] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const [selectedCountries, setSelectedCountries] = useState(["US"]);
  // input value = updates instantly on keystroke (smooth typing)
  // debounced value = used for the expensive filter pass
  const [countrySearchInput, setCountrySearchInput] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [gender, setGender] = useState("random");
  const [count, setCount] = useState(5);

  const [identities, setIdentities] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [exported, setExported] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [flashCount, setFlashCount] = useState(0);
  const [themeTransitioning, setThemeTransitioning] = useState(false);

  const resultsRef = useRef(null);
  const theme = isDark ? T.dark : T.light;

  // Debounce country search so the input never feels laggy
  useEffect(() => {
    const t = setTimeout(() => setCountrySearch(countrySearchInput), 120);
    return () => clearTimeout(t);
  }, [countrySearchInput]);

  // Debounce results filter
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 150);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (bootStep >= BOOT_LINES.length) {
      setBootDone(true);
      const t = setTimeout(() => setPageReady(true), 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBootStep((s) => s + 1), 280);
    return () => clearTimeout(t);
  }, [bootStep]);

  const toggleTheme = useCallback(() => {
    setThemeTransitioning(true);
    setTimeout(() => {
      setIsDark((v) => !v);
      setTimeout(() => setThemeTransitioning(false), 100);
    }, 200);
  }, []);

  const toggleCountry = useCallback((code) => {
    setSelectedCountries((prev) => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  }, []);

  const selectAllCountries = useCallback(() => {
    setSelectedCountries([...COUNTRY_CODES]);
  }, []);

  const selectNoneCountries = useCallback(() => {
    setSelectedCountries(["US"]);
  }, []);

  const filteredCountryList = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRY_CODES;
    const q = countrySearch.toLowerCase();
    return COUNTRY_CODES.filter((code) => {
      const c = COUNTRIES[code];
      return code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
    });
  }, [countrySearch]);

  const handleGenerate = useCallback(() => {
    if (generating || selectedCountries.length === 0) return;
    setGenerating(true);
    setTimeout(() => {
      const batch = generateBatch(selectedCountries, count, gender);
      setIdentities((prev) => [...batch, ...prev]);
      setHistory((prev) =>
        [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            count: batch.length,
            countries: [...selectedCountries],
            gender,
            identities: batch,
          },
          ...prev,
        ].slice(0, 5),
      );
      setFlashCount(batch.length);
      setGenerating(false);
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 80);
      setTimeout(() => setFlashCount(0), 1800);
    }, 320);
  }, [selectedCountries, count, gender, generating]);

  const handleClear = useCallback(() => setIdentities([]), []);

  const handleRemove = useCallback((id) => {
    setIdentities((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleExportCSV = useCallback(() => {
    if (identities.length === 0 || typeof document === "undefined") return;
    const csv = formatAsCSV(identities);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `identities-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 1500);
  }, [identities]);

  const handleExportJSON = useCallback(() => {
    if (identities.length === 0 || typeof document === "undefined") return;
    const json = JSON.stringify(identities, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `identities-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [identities]);

  const handleRestoreBatch = useCallback(
    (batchId) => {
      const batch = history.find((h) => h.id === batchId);
      if (!batch) return;
      setIdentities((prev) => [...batch.identities, ...prev]);
      setFlashCount(batch.identities.length);
      setTimeout(() => setFlashCount(0), 1800);
    },
    [history],
  );

  const filteredIdentities = useMemo(() => {
    if (!search.trim()) return identities;
    const q = search.toLowerCase();
    return identities.filter(
      (i) =>
        i.fullName.toLowerCase().includes(q) ||
        i.country.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        i.zipCode.toLowerCase().includes(q) ||
        i.phone.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.occupation.toLowerCase().includes(q),
    );
  }, [identities, search]);

  const countByCountry = useMemo(() => {
    const map = {};
    identities.forEach((i) => {
      map[i.countryCode] = (map[i.countryCode] || 0) + 1;
    });
    return map;
  }, [identities]);

  const statusLabel = generating ? "PROCESSING" : "READY";
  const statusColor = generating ? theme.amber : theme.green;

  const generateBtnStyle = {
    background: `linear-gradient(135deg, ${theme.gradient1}, ${theme.gradient2})`,
    color: "#FFFFFF",
    boxShadow: isDark
      ? `0 0 0 1px ${theme.accent}33, 0 8px 24px ${theme.accent}33`
      : `0 4px 12px ${theme.accent}33`,
  };

  const regionsLabel =
    selectedCountries.length === 1
      ? `Single region · ${COUNTRIES[selectedCountries[0]]?.name}`
      : `${selectedCountries.length} regions · random pick per record`;

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: theme.bg,
        color: theme.text,
        transition: "background-color 0.4s ease, color 0.4s ease",
        fontFamily: "var(--font-display)",
      }}
    >
      <MatrixRain isDark={isDark} accentColor={theme.accent} />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: isDark
            ? `radial-gradient(at 20% 10%, ${theme.accent}22 0px, transparent 50%), radial-gradient(at 80% 80%, ${theme.cyan}1A 0px, transparent 50%), radial-gradient(at 70% 20%, ${theme.pink}15 0px, transparent 50%)`
            : `radial-gradient(at 20% 10%, ${theme.accent}11 0px, transparent 50%), radial-gradient(at 80% 80%, ${theme.cyan}0E 0px, transparent 50%)`,
          transition: "opacity 0.4s",
          opacity: pageReady ? 1 : 0,
        }}
      />

      {themeTransitioning && (
        <div
          className="fixed inset-0 pointer-events-none z-[100]"
          style={{
            background: theme.bg,
            animation: "themeFlash 0.4s ease",
          }}
        />
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          background: `${theme.bg}CC`,
          borderColor: theme.borderSoft,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          transition: "background-color 0.4s ease, border-color 0.4s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.gradient1}, ${theme.gradient2})`,
                boxShadow: `0 0 20px ${theme.accent}55`,
              }}
            >
              <Sparkles className="w-5 h-5 text-white relative z-10" />
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.8), transparent 60%)",
                }}
              />
            </div>
            <div>
              <div
                className="text-[15px] font-semibold tracking-tight leading-none"
                style={{ color: theme.text }}
              >
                Identity Forge
              </div>
              <div
                className="text-[11px] mt-1 font-mono"
                style={{ color: theme.textMuted }}
              >
                v2.1 · {COUNTRY_CODES.length} regions · {identities.length}{" "}
                generated
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="text-[10px] uppercase tracking-[0.14em] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-mono"
              style={{
                background: `${statusColor}15`,
                color: statusColor,
                border: `1px solid ${statusColor}30`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{
                  background: statusColor,
                  boxShadow: `0 0 8px ${statusColor}`,
                  animation: "softPulse 2s ease-in-out infinite",
                }}
              />
              {statusLabel}
            </div>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.panel,
                color: theme.text,
              }}
              title={isDark ? "Switch to light" : "Switch to dark"}
            >
              <span
                className="block transition-transform duration-500"
                style={{
                  transform: isDark ? "rotate(0deg)" : "rotate(360deg)",
                }}
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main
        className="max-w-7xl mx-auto px-6 py-8 relative"
        style={{
          zIndex: 10,
          opacity: pageReady ? 1 : 0,
          transform: pageReady ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Hero — Apero-inspired editorial layout */}
        <section className="relative mb-16 pt-8 pb-32 overflow-hidden">
          {/* Orbital globe in the lower half */}
          <div
            className="absolute left-0 right-0 bottom-0 h-[420px]"
            style={{ zIndex: 0 }}
          >
            <OrbitalGlobe accentColor={theme.accent} isDark={isDark} />
          </div>

          <div className="relative" style={{ zIndex: 2 }}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono mb-8"
              style={{
                background: theme.accentSoft,
                color: theme.accent,
                border: `1px solid ${theme.accent}33`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: theme.accent,
                  boxShadow: `0 0 8px ${theme.accent}`,
                }}
              />
              REALISTIC FAKE DATA · 26 REGIONS · LOCAL-FIRST
            </div>

            <h1
              className="font-semibold tracking-[-0.02em] leading-[0.95] mb-6"
              style={{
                color: theme.text,
                fontSize: "clamp(40px, 8vw, 96px)",
              }}
            >
              <span className="block">
                Identities{" "}
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: theme.accent,
                  }}
                >
                  for
                </span>{" "}
                a world
              </span>
              <span className="block">
                of{" "}
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  realistic
                </span>{" "}
                testing.
              </span>
            </h1>

            <p
              className="text-[15px] md:text-[17px] max-w-xl leading-relaxed mb-8"
              style={{ color: theme.textMuted }}
            >
              Forge culturally accurate names, addresses, phones, IDs and more
              from 26 regions — all generated locally, instantly, and never
              tracked.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (typeof document !== "undefined") {
                    const el = document.getElementById("generator-panel");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={generateBtnStyle}
              >
                Start generating
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (typeof document !== "undefined") {
                    const el = document.getElementById("results-section");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[13px] transition-all hover:scale-[1.02]"
                style={{
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: theme.text,
                }}
              >
                See results
              </button>
            </div>

            {/* Stat strip overlaid on globe */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mt-24">
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.18em] font-mono mb-1"
                  style={{ color: theme.textMuted }}
                >
                  Regions
                </div>
                <div
                  className="text-[40px] font-semibold tracking-tight leading-none"
                  style={{ color: theme.text }}
                >
                  {COUNTRY_CODES.length}
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      color: theme.accent,
                      fontWeight: 400,
                    }}
                  >
                    +
                  </span>
                </div>
              </div>
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.18em] font-mono mb-1"
                  style={{ color: theme.textMuted }}
                >
                  Generated
                </div>
                <div
                  className="text-[40px] font-semibold tracking-tight leading-none tabular-nums"
                  style={{ color: theme.text }}
                >
                  {identities.length}
                </div>
              </div>
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.18em] font-mono mb-1"
                  style={{ color: theme.textMuted }}
                >
                  Selected
                </div>
                <div
                  className="text-[40px] font-semibold tracking-tight leading-none tabular-nums"
                  style={{ color: theme.text }}
                >
                  {selectedCountries.length}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Boot console */}
        <div
          className="rounded-xl p-4 mb-6 font-mono text-[11px] overflow-hidden"
          style={{
            background: theme.panel,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            className="flex items-center gap-2 mb-2 pb-2"
            style={{ borderBottom: `1px solid ${theme.borderSoft}` }}
          >
            <div className="flex gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#FF5F57" }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#FEBC2E" }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "#28C840" }}
              />
            </div>
            <div
              className="text-[10px] uppercase tracking-widest ml-1"
              style={{ color: theme.textMuted }}
            >
              ~/forge
            </div>
          </div>
          <div className="space-y-0.5">
            {BOOT_LINES.slice(0, bootStep).map((line, i) => {
              const isLast = i === bootStep - 1 && i < BOOT_LINES.length - 1;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <span className="flex-1">
                    {isLast ? (
                      <TypewriterLine text={line.text} speed={12} />
                    ) : (
                      line.text
                    )}
                  </span>
                  {line.status && (
                    <span style={{ color: theme.green }}>[{line.status}]</span>
                  )}
                </div>
              );
            })}
            {bootDone && (
              <div
                className="flex items-center gap-1 mt-1"
                style={{ color: theme.accent }}
              >
                <ChevronRight className="w-3 h-3" />
                <span>awaiting command</span>
                <span
                  className="inline-block w-1.5 h-3 ml-0.5"
                  style={{
                    background: theme.accent,
                    animation: "blink 1s steps(2) infinite",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Generated"
            value={identities.length}
            theme={theme}
            color={theme.accent}
            icon={User}
          />
          <StatCard
            label="Regions Hit"
            value={Object.keys(countByCountry).length}
            theme={theme}
            color={theme.cyan}
            icon={Globe}
          />
          <StatCard
            label="Selected"
            value={selectedCountries.length}
            theme={theme}
            color={theme.amber}
            icon={CheckSquare}
          />
          <StatCard
            label="Batches"
            value={history.length}
            theme={theme}
            color={theme.pink}
            icon={History}
          />
        </div>

        {/* Generator panel */}
        <div
          id="generator-panel"
          className="rounded-2xl mb-6 overflow-hidden"
          style={{
            background: theme.panel,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{
              borderBottom: `1px solid ${theme.borderSoft}`,
              background: theme.bgSecondary,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: theme.accentSoft,
                  color: theme.accent,
                }}
              >
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span
                className="text-[13px] font-semibold tracking-tight"
                style={{ color: theme.text }}
              >
                Generator
              </span>
            </div>
            <span
              className="text-[11px] font-mono"
              style={{ color: theme.textMuted }}
            >
              {regionsLabel}
            </span>
          </div>

          <div className="p-5">
            {/* Country multi-select */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] uppercase tracking-[0.14em] font-mono font-semibold"
                    style={{ color: theme.text }}
                  >
                    Countries
                  </span>
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded font-mono"
                    style={{
                      background: theme.accentSoft,
                      color: theme.accent,
                    }}
                  >
                    {selectedCountries.length}/{COUNTRY_CODES.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={selectAllCountries}
                    className="text-[11px] px-2 py-1 rounded-md font-mono transition-all hover:scale-105"
                    style={{
                      border: `1px solid ${theme.borderSoft}`,
                      color: theme.textMuted,
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={selectNoneCountries}
                    className="text-[11px] px-2 py-1 rounded-md font-mono transition-all hover:scale-105"
                    style={{
                      border: `1px solid ${theme.borderSoft}`,
                      color: theme.textMuted,
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="relative mb-2">
                <Filter
                  className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.textMuted }}
                />
                <input
                  type="text"
                  value={countrySearchInput}
                  onChange={(e) => setCountrySearchInput(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full rounded-lg pl-9 pr-3 py-2 text-[12px] focus:outline-none transition-colors"
                  style={{
                    background: theme.bgSecondary,
                    border: `1px solid ${theme.borderSoft}`,
                    color: theme.text,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5">
                {filteredCountryList.map((code) => {
                  const c = COUNTRIES[code];
                  const isActive = selectedCountries.includes(code);
                  const itemGlow =
                    isActive && isDark ? `0 0 16px ${theme.accent}33` : "none";
                  return (
                    <button
                      key={code}
                      onClick={() => toggleCountry(code)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        border: `1px solid ${isActive ? theme.accent : theme.borderSoft}`,
                        background: isActive ? theme.accentSoft : "transparent",
                        boxShadow: itemGlow,
                      }}
                    >
                      <span className="text-base flex-shrink-0">{c.flag}</span>
                      <span
                        className="text-[12px] truncate flex-1"
                        style={{
                          color: isActive ? theme.accent : theme.text,
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {c.name}
                      </span>
                      {isActive && (
                        <Check
                          className="w-3 h-3 flex-shrink-0"
                          style={{ color: theme.accent }}
                        />
                      )}
                    </button>
                  );
                })}
                {filteredCountryList.length === 0 && (
                  <div
                    className="col-span-full text-center py-4 text-[12px]"
                    style={{ color: theme.textMuted }}
                  >
                    No matches for "{countrySearchInput}"
                  </div>
                )}
              </div>

              {selectedCountries.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedCountries.map((code) => {
                    const c = COUNTRIES[code];
                    return (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px]"
                        style={{
                          background: theme.accentSoft,
                          color: theme.accent,
                          border: `1px solid ${theme.accent}33`,
                        }}
                      >
                        {c.flag} {code}
                        <button
                          onClick={() => toggleCountry(code)}
                          className="hover:scale-125 transition-transform"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Gender + Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <div
                  className="text-[11px] uppercase tracking-[0.14em] font-mono font-semibold mb-2"
                  style={{ color: theme.text }}
                >
                  Gender
                </div>
                <div className="flex gap-1.5">
                  {GENDER_OPTIONS.map((g) => {
                    const isActive = gender === g.value;
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.value}
                        onClick={() => setGender(g.value)}
                        className="flex-1 px-3 py-2.5 rounded-lg text-[12px] transition-all inline-flex items-center justify-center gap-1.5"
                        style={{
                          border: `1px solid ${isActive ? theme.accent : theme.borderSoft}`,
                          background: isActive
                            ? theme.accentSoft
                            : "transparent",
                          color: isActive ? theme.accent : theme.text,
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {Icon && <Icon className="w-3 h-3" />}
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div
                  className="text-[11px] uppercase tracking-[0.14em] font-mono font-semibold mb-2"
                  style={{ color: theme.text }}
                >
                  Quantity
                </div>
                <div className="flex gap-1.5">
                  {COUNT_OPTIONS.map((n) => {
                    const isActive = count === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setCount(n)}
                        className="flex-1 px-3 py-2.5 rounded-lg text-[12px] font-mono transition-all"
                        style={{
                          border: `1px solid ${isActive ? theme.accent : theme.borderSoft}`,
                          background: isActive
                            ? theme.accentSoft
                            : "transparent",
                          color: isActive ? theme.accent : theme.text,
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        ×{n}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex flex-col sm:flex-row gap-2 pt-4"
              style={{ borderTop: `1px dashed ${theme.borderSoft}` }}
            >
              <button
                onClick={handleGenerate}
                disabled={generating || selectedCountries.length === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-300 disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
                style={generateBtnStyle}
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate {count} {count === 1 ? "identity" : "identities"}
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={identities.length === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: theme.text,
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
              <div className="flex-1" />
              <button
                onClick={handleExportJSON}
                disabled={identities.length === 0}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-[12px] transition-all disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  border: `1px solid ${theme.border}`,
                  background: theme.bgSecondary,
                  color: theme.cyan,
                }}
              >
                <Download className="w-3.5 h-3.5" />
                JSON
              </button>
              <button
                onClick={handleExportCSV}
                disabled={identities.length === 0}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: theme.accentSoft,
                  border: `1px solid ${theme.accent}33`,
                  color: theme.accent,
                }}
              >
                {exported ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                {exported ? "Saved" : "Export CSV"}
              </button>
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div
            className="rounded-xl p-4 mb-6"
            style={{
              background: theme.panel,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <History
                className="w-3.5 h-3.5"
                style={{ color: theme.textMuted }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.14em] font-mono font-semibold"
                style={{ color: theme.text }}
              >
                Recent Batches
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {history.map((batch) => {
                const flagsPreview = batch.countries
                  .slice(0, 3)
                  .map((c) => COUNTRIES[c]?.flag)
                  .join("");
                const moreFlags =
                  batch.countries.length > 3
                    ? ` +${batch.countries.length - 3}`
                    : "";
                return (
                  <button
                    key={batch.id}
                    onClick={() => handleRestoreBatch(batch.id)}
                    className="flex-shrink-0 rounded-lg px-3 py-2 text-left transition-all hover:-translate-y-0.5"
                    style={{
                      background: theme.bgSecondary,
                      border: `1px solid ${theme.borderSoft}`,
                    }}
                    title="Re-add this batch"
                  >
                    <div
                      className="text-[11px] font-mono"
                      style={{ color: theme.textMuted }}
                    >
                      {batch.time}
                    </div>
                    <div
                      className="text-[12px] font-semibold mt-0.5"
                      style={{ color: theme.text }}
                    >
                      {batch.count} × {flagsPreview}
                      {moreFlags}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        <div id="results-section" ref={resultsRef}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <h2
                className="text-[18px] font-semibold tracking-tight"
                style={{ color: theme.text }}
              >
                Results
              </h2>
              <span
                className="text-[12px] px-2 py-0.5 rounded-md font-mono"
                style={{
                  background: theme.accentSoft,
                  color: theme.accent,
                }}
              >
                {filteredIdentities.length}
              </span>
              {flashCount > 0 && (
                <span
                  className="text-[11px] px-2 py-0.5 rounded-md font-mono font-semibold"
                  style={{
                    background: `${theme.green}20`,
                    color: theme.green,
                    border: `1px solid ${theme.green}40`,
                    animation: "fadeOut 1.8s ease-out forwards",
                  }}
                >
                  +{flashCount} new
                </span>
              )}
            </div>

            {identities.length > 0 && (
              <div className="relative w-full max-w-xs">
                <Search
                  className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.textMuted }}
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Filter results..."
                  className="w-full rounded-lg pl-9 pr-3 py-2 text-[12px] focus:outline-none transition-colors"
                  style={{
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                />
              </div>
            )}
          </div>

          {identities.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center"
              style={{
                background: theme.panel,
                border: `1px dashed ${theme.border}`,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: theme.accentSoft,
                  color: theme.accent,
                }}
              >
                <Sparkles className="w-6 h-6" />
              </div>
              <div
                className="text-[15px] font-semibold mb-1"
                style={{ color: theme.text }}
              >
                Ready when you are
              </div>
              <div className="text-[12px]" style={{ color: theme.textMuted }}>
                Pick some countries above, then hit{" "}
                <span style={{ color: theme.accent, fontWeight: 600 }}>
                  Generate
                </span>{" "}
                to forge your first batch.
              </div>
            </div>
          ) : filteredIdentities.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center text-[12px]"
              style={{
                background: theme.panel,
                border: `1px dashed ${theme.border}`,
                color: theme.textMuted,
              }}
            >
              No results matching "{searchInput}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredIdentities.map((identity, idx) => (
                <IdentityCard
                  key={identity.id}
                  identity={identity}
                  onRemove={handleRemove}
                  theme={theme}
                  index={idx}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="mt-12 pt-6 text-[11px] text-center"
          style={{
            color: theme.textMuted,
            borderTop: `1px dashed ${theme.borderSoft}`,
          }}
        >
          All data generated locally in your browser · 100% fictional · For
          testing & seeding only
        </div>
      </main>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap");

        :root {
          --font-display: "Space Grotesk", -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          --font-serif: "Instrument Serif", "Times New Roman", Georgia, serif;
          --font-mono: "JetBrains Mono", "SF Mono", Menlo, monospace;
        }

        body {
          font-family: var(--font-display);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .font-mono {
          font-family: var(--font-mono) !important;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        @keyframes softPulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.3);
          }
        }
        @keyframes themeFlash {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
          }
        }

        ::selection {
          background: ${theme.accent};
          color: #fff;
        }

        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.textMuted};
        }
      `}</style>
    </div>
  );
}
