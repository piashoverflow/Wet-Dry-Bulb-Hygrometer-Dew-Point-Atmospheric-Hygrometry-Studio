import { useEffect, useMemo, useState } from 'react';
import {
  InputMode,
  LabModule,
  Language,
  PhenomenonId,
  TRANSLATIONS,
} from './i18n/translations';
import {
  computePsychrometrics,
  computePsychrometricsFromReadings,
} from './physics/hygrometry';
import { HeaderBar } from './components/HeaderBar';
import { LeftControlDock } from './components/LeftControlDock';
import { RightTelemetryPanel } from './components/RightTelemetryPanel';
import { Module1Canvas } from './components/Module1Canvas';
import { Module2Canvas } from './components/Module2Canvas';
import { Module3Canvas, PhenomenonParams } from './components/Module3Canvas';
import { ReferenceTablesModal } from './components/ReferenceTablesModal';

const DEFAULT_DRY_BULB = 28.0;
const DEFAULT_WET_BULB = 22.5;
const DEFAULT_RH = 55;
const DEFAULT_PHENOMENON_PARAMS: PhenomenonParams = {
  cityTempC: 34.0,
  dhakaRH: 45,
  coxsRH: 88,
  lensTempC: 16.0,
  outdoorTempC: 32.0,
  outdoorRH: 75,
  winterTempC: 14.0,
  winterRH: 25,
  pitcherAmbientC: 36.0,
  pitcherRH: 30,
  pitcherMaterial: 'clay',
};

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [activeModule, setActiveModule] = useState<LabModule>(1);
  const [inputMode, setInputMode] = useState<InputMode>('environment');

  // Module 1 & 2 shared psychrometric state
  const [dryBulbC, setDryBulbC] = useState<number>(DEFAULT_DRY_BULB);
  const [wetBulbInputC, setWetBulbInputC] = useState<number>(DEFAULT_WET_BULB);
  const [trueRH, setTrueRH] = useState<number>(DEFAULT_RH);
  const [airflowActive, setAirflowActive] = useState<boolean>(true);
  const [showLoupes, setShowLoupes] = useState<boolean>(true);
  const [tablesOpen, setTablesOpen] = useState<boolean>(false);

  // Module 3 state
  const [phenomenon, setPhenomenon] = useState<PhenomenonId>('cities');
  const [phenomenonParams, setPhenomenonParams] = useState<PhenomenonParams>(
    DEFAULT_PHENOMENON_PARAMS
  );

  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const psychro = useMemo(() => {
    if (inputMode === 'readings') {
      return computePsychrometricsFromReadings(dryBulbC, wetBulbInputC, true);
    }
    return computePsychrometrics(dryBulbC, trueRH, airflowActive);
  }, [inputMode, dryBulbC, wetBulbInputC, trueRH, airflowActive]);

  const handleModeChange = (nextMode: InputMode) => {
    if (nextMode === 'readings' && inputMode === 'environment') {
      // Seed direct wet-bulb input with current computed wet bulb for continuity
      setWetBulbInputC(Number(psychro.wetBulbC.toFixed(1)));
    } else if (nextMode === 'environment' && inputMode === 'readings') {
      setTrueRH(Math.max(10, Math.min(100, Math.round(psychro.measuredRH))));
    }
    setInputMode(nextMode);
  };

  const handleReset = () => {
    if (activeModule === 3) {
      setPhenomenonParams(DEFAULT_PHENOMENON_PARAMS);
    } else {
      setDryBulbC(DEFAULT_DRY_BULB);
      setWetBulbInputC(DEFAULT_WET_BULB);
      setTrueRH(DEFAULT_RH);
      setAirflowActive(true);
      setShowLoupes(true);
    }
  };

  const handleApplyPreset = (dryC: number, rh: number) => {
    setDryBulbC(dryC);
    setTrueRH(rh);
  };

  const handleApplyReadingCase = (dryC: number, wetC: number) => {
    setDryBulbC(dryC);
    setWetBulbInputC(wetC);
  };

  const updatePhenomenonParam = <K extends keyof PhenomenonParams>(
    key: K,
    val: PhenomenonParams[K]
  ) => {
    setPhenomenonParams((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 text-slate-950">
      <HeaderBar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        language={language}
        onToggleLanguage={() =>
          setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))
        }
        onReset={handleReset}
        t={t}
      />

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-4 lg:p-5 flex flex-col lg:flex-row items-stretch gap-4">
        {/* Left Vertical Control Dock (340px on desktop) */}
        <LeftControlDock
          activeModule={activeModule}
          inputMode={inputMode}
          setInputMode={handleModeChange}
          dryBulbC={dryBulbC}
          setDryBulbC={setDryBulbC}
          wetBulbInputC={wetBulbInputC}
          setWetBulbInputC={setWetBulbInputC}
          trueRH={trueRH}
          setTrueRH={setTrueRH}
          airflowActive={airflowActive}
          setAirflowActive={setAirflowActive}
          showLoupes={showLoupes}
          setShowLoupes={setShowLoupes}
          onApplyPreset={handleApplyPreset}
          onApplyReadingCase={handleApplyReadingCase}
          onOpenTables={() => setTablesOpen(true)}
          phenomenon={phenomenon}
          setPhenomenon={setPhenomenon}
          phenomenonParams={phenomenonParams}
          updatePhenomenonParam={updatePhenomenonParam}
          t={t}
        />

        {/* Center Canvas Stage (Flexible width) */}
        <section
          aria-label="Interactive Simulation Stage"
          className="flex-1 min-w-0 bg-white/95 backdrop-blur-sm border border-sky-200 shadow-sm rounded-2xl p-2 sm:p-3 flex flex-col"
        >
          {activeModule === 1 && (
            <Module1Canvas
              psychro={psychro}
              showLoupes={showLoupes}
              t={t}
            />
          )}
          {activeModule === 2 && (
            <Module2Canvas psychro={psychro} t={t} />
          )}
          {activeModule === 3 && (
            <Module3Canvas
              phenomenon={phenomenon}
              params={phenomenonParams}
              t={t}
            />
          )}
        </section>

        {/* Right Telemetry Panel (340px on desktop) */}
        <RightTelemetryPanel
          activeModule={activeModule}
          psychro={psychro}
          phenomenon={phenomenon}
          phenomenonParams={phenomenonParams}
          t={t}
        />
      </main>

      <ReferenceTablesModal
        isOpen={tablesOpen}
        onClose={() => setTablesOpen(false)}
        dryBulbC={dryBulbC}
        dewPointC={psychro.dewPointC}
        t={t}
      />
    </div>
  );
}
