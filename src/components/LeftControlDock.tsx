import React from 'react';
import { BookOpen, Eye, Sliders, Wind } from 'lucide-react';
import {
  InputMode,
  LabModule,
  PhenomenonId,
  Translations,
} from '../i18n/translations';
import { ProgressiveSlider } from './ProgressiveSlider';
import { PhenomenonParams } from './Module3Canvas';

interface LeftControlDockProps {
  activeModule: LabModule;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  dryBulbC: number;
  setDryBulbC: (v: number) => void;
  wetBulbInputC: number;
  setWetBulbInputC: (v: number) => void;
  trueRH: number;
  setTrueRH: (v: number) => void;
  airflowActive: boolean;
  setAirflowActive: (v: boolean) => void;
  showLoupes: boolean;
  setShowLoupes: (v: boolean) => void;
  onApplyPreset: (dryC: number, rh: number) => void;
  onApplyReadingCase: (dryC: number, wetC: number) => void;
  onOpenTables: () => void;
  phenomenon: PhenomenonId;
  setPhenomenon: (p: PhenomenonId) => void;
  phenomenonParams: PhenomenonParams;
  updatePhenomenonParam: <K extends keyof PhenomenonParams>(
    key: K,
    val: PhenomenonParams[K]
  ) => void;
  t: Translations;
}

export const LeftControlDock: React.FC<LeftControlDockProps> = ({
  activeModule,
  inputMode,
  setInputMode,
  dryBulbC,
  setDryBulbC,
  wetBulbInputC,
  setWetBulbInputC,
  trueRH,
  setTrueRH,
  airflowActive,
  setAirflowActive,
  showLoupes,
  setShowLoupes,
  onApplyPreset,
  onApplyReadingCase,
  onOpenTables,
  phenomenon,
  setPhenomenon,
  phenomenonParams,
  updatePhenomenonParam,
  t,
}) => {
  const presets = [
    { label: t.controls.presets.pleasant, dryC: 28, rh: 55 },
    { label: t.controls.presets.storm, dryC: 30, rh: 92 },
    { label: t.controls.presets.dryWinter, dryC: 15, rh: 22 },
    { label: t.controls.presets.saturated, dryC: 24, rh: 100 },
  ];

  const interpolationCases = [
    { label: t.controls.cases.c1, dryC: 28.0, wetC: 22.5 },
    { label: t.controls.cases.c2, dryC: 27.4, wetC: 21.6 },
    { label: t.controls.cases.c3, dryC: 15.5, wetC: 9.2 },
    { label: t.controls.cases.c4, dryC: 7.0, wetC: 4.8 },
  ];

  const phenomenaTabs: { id: PhenomenonId; label: string }[] = [
    { id: 'cities', label: t.phenomena.cities.tab },
    { id: 'glasses', label: t.phenomena.glasses.tab },
    { id: 'winter', label: t.phenomena.winter.tab },
    { id: 'pitcher', label: t.phenomena.pitcher.tab },
  ];

  return (
    <aside className="w-full lg:w-[340px] shrink-0 bg-white/95 backdrop-blur-sm border border-sky-200 shadow-sm rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
      {activeModule !== 3 ? (
        <>
          <div className="border-b border-sky-100 pb-3">
            <h2 className="text-sm font-bold text-slate-950">
              {t.controls.sectionTitle}
            </h2>
          </div>

          {/* Input Mode Switcher: Environment (θ1, R%) vs Thermometer Readings (θ1, θ2) */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              {t.controls.inputModeLabel}
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 bg-sky-50 border border-sky-200 rounded-xl">
              <button
                type="button"
                onClick={() => setInputMode('environment')}
                className={`py-1.5 px-2 rounded-lg text-[11.5px] font-semibold transition-colors cursor-pointer ${
                  inputMode === 'environment'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                {t.controls.modeEnvironment}
              </button>
              <button
                type="button"
                onClick={() => setInputMode('readings')}
                className={`py-1.5 px-2 rounded-lg text-[11.5px] font-semibold transition-colors cursor-pointer ${
                  inputMode === 'readings'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                {t.controls.modeReadings}
              </button>
            </div>
          </div>

          {/* Primary Sliders depending on Input Mode */}
          {inputMode === 'environment' ? (
            <div className="space-y-4">
              <ProgressiveSlider
                id="slider-dry-bulb"
                label={t.controls.dryBulbLabel}
                value={dryBulbC}
                min={5}
                max={45}
                step={0.5}
                unit="°C"
                decimals={1}
                onChange={setDryBulbC}
              />

              <ProgressiveSlider
                id="slider-rh"
                label={t.controls.humidityLabel}
                value={trueRH}
                min={10}
                max={100}
                step={1}
                unit="%"
                decimals={0}
                onChange={setTrueRH}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <ProgressiveSlider
                  id="slider-obs-dry"
                  label={t.controls.dryBulbLabel}
                  value={dryBulbC}
                  min={5}
                  max={45}
                  step={0.1}
                  unit="°C"
                  decimals={1}
                  onChange={(val) => {
                    setDryBulbC(val);
                    if (wetBulbInputC > val) {
                      setWetBulbInputC(val);
                    }
                  }}
                />
                <div className="flex items-center justify-end gap-1.5">
                  <input
                    type="number"
                    aria-label={t.controls.dryBulbLabel}
                    min={5}
                    max={45}
                    step={0.1}
                    value={dryBulbC}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (!Number.isNaN(v)) {
                        const clamped = Math.max(5, Math.min(45, v));
                        setDryBulbC(clamped);
                        if (wetBulbInputC > clamped) setWetBulbInputC(clamped);
                      }
                    }}
                    className="w-20 px-2 py-1 text-xs font-mono-num font-bold text-slate-900 bg-sky-50 border border-sky-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] font-mono-num text-slate-500">°C</span>
                </div>
              </div>

              <div className="space-y-2">
                <ProgressiveSlider
                  id="slider-obs-wet"
                  label={t.controls.wetBulbLabel}
                  value={Math.min(wetBulbInputC, dryBulbC)}
                  min={0}
                  max={dryBulbC}
                  step={0.1}
                  unit="°C"
                  decimals={1}
                  onChange={setWetBulbInputC}
                />
                <div className="flex items-center justify-end gap-1.5">
                  <input
                    type="number"
                    aria-label={t.controls.wetBulbLabel}
                    min={0}
                    max={dryBulbC}
                    step={0.1}
                    value={Math.min(wetBulbInputC, dryBulbC)}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (!Number.isNaN(v)) {
                        setWetBulbInputC(Math.max(0, Math.min(dryBulbC, v)));
                      }
                    }}
                    className="w-20 px-2 py-1 text-xs font-mono-num font-bold text-slate-900 bg-sky-50 border border-sky-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[11px] font-mono-num text-slate-500">°C</span>
                </div>
              </div>
            </div>
          )}

          {/* Airflow & Loupe Toggles */}
          <div className="space-y-3 pt-2 border-t border-sky-100">
            {inputMode === 'environment' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
                    {t.controls.airflowLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-sky-50 border border-sky-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAirflowActive(true)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      airflowActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    {t.controls.airflowOn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAirflowActive(false)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      !airflowActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    {t.controls.airflowOff}
                  </button>
                </div>
                {!airflowActive && (
                  <p className="text-[11px] leading-relaxed text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                    {t.controls.airflowHintOff}
                  </p>
                )}
              </div>
            )}

            {activeModule === 1 && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
                  {t.controls.loupeLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setShowLoupes(!showLoupes)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    showLoupes
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  {showLoupes ? t.controls.loupeOn : t.controls.loupeOff}
                </button>
              </div>
            )}
          </div>

          {/* Presets or Interpolation Cases */}
          <div className="space-y-2 pt-2 border-t border-sky-100">
            <h3 className="text-xs font-bold text-slate-700">
              {inputMode === 'environment'
                ? t.controls.presetsTitle
                : t.controls.casesTitle}
            </h3>
            <div className="grid grid-cols-1 gap-1.5">
              {inputMode === 'environment'
                ? presets.map((preset) => {
                    const isSelected =
                      Math.abs(dryBulbC - preset.dryC) < 0.1 &&
                      Math.abs(trueRH - preset.rh) < 0.5;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => onApplyPreset(preset.dryC, preset.rh)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                            : 'bg-sky-50/60 border-sky-200 text-slate-800 hover:bg-sky-100/70'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })
                : interpolationCases.map((c) => {
                    const isSelected =
                      Math.abs(dryBulbC - c.dryC) < 0.05 &&
                      Math.abs(wetBulbInputC - c.wetC) < 0.05;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => onApplyReadingCase(c.dryC, c.wetC)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                            : 'bg-sky-50/60 border-sky-200 text-slate-800 hover:bg-sky-100/70'
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
            </div>
          </div>

          {/* Reference SVP & Glaisher Tables Modal Button */}
          <div className="mt-auto pt-2 border-t border-sky-100">
            <button
              type="button"
              onClick={onOpenTables}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>{t.controls.openTablesBtn}</span>
            </button>
          </div>
        </>
      ) : (
        /* Module 3 Controls: Scenario Selector + Scenario-specific Sliders */
        <>
          <div className="border-b border-sky-100 pb-3">
            <h2 className="text-sm font-bold text-slate-950">
              {t.controls.scenarioTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {phenomenaTabs.map((item) => {
              const active = phenomenon === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPhenomenon(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-sky-50/70 border-sky-200 text-slate-800 hover:bg-sky-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-4 pt-3 border-t border-sky-100">
            {phenomenon === 'cities' && (
              <>
                <ProgressiveSlider
                  id="m3-city-temp"
                  label={t.phenomena.cities.tempSlider}
                  value={phenomenonParams.cityTempC}
                  min={22}
                  max={42}
                  step={0.5}
                  unit="°C"
                  decimals={1}
                  onChange={(v) => updatePhenomenonParam('cityTempC', v)}
                />
                <ProgressiveSlider
                  id="m3-dhaka-rh"
                  label={t.phenomena.cities.dhakaRhSlider}
                  value={phenomenonParams.dhakaRH}
                  min={15}
                  max={95}
                  step={1}
                  unit="%"
                  decimals={0}
                  onChange={(v) => updatePhenomenonParam('dhakaRH', v)}
                />
                <ProgressiveSlider
                  id="m3-coxs-rh"
                  label={t.phenomena.cities.coxsRhSlider}
                  value={phenomenonParams.coxsRH}
                  min={15}
                  max={98}
                  step={1}
                  unit="%"
                  decimals={0}
                  onChange={(v) => updatePhenomenonParam('coxsRH', v)}
                />
              </>
            )}

            {phenomenon === 'glasses' && (
              <>
                <ProgressiveSlider
                  id="m3-lens-temp"
                  label={t.phenomena.glasses.lensTempSlider}
                  value={phenomenonParams.lensTempC}
                  min={10}
                  max={35}
                  step={0.5}
                  unit="°C"
                  decimals={1}
                  onChange={(v) => updatePhenomenonParam('lensTempC', v)}
                />
                <ProgressiveSlider
                  id="m3-outdoor-temp"
                  label={t.phenomena.glasses.outdoorTempSlider}
                  value={phenomenonParams.outdoorTempC}
                  min={20}
                  max={42}
                  step={0.5}
                  unit="°C"
                  decimals={1}
                  onChange={(v) => updatePhenomenonParam('outdoorTempC', v)}
                />
                <ProgressiveSlider
                  id="m3-outdoor-rh"
                  label={t.phenomena.glasses.outdoorRhSlider}
                  value={phenomenonParams.outdoorRH}
                  min={20}
                  max={98}
                  step={1}
                  unit="%"
                  decimals={0}
                  onChange={(v) => updatePhenomenonParam('outdoorRH', v)}
                />
              </>
            )}

            {phenomenon === 'winter' && (
              <>
                <ProgressiveSlider
                  id="m3-winter-temp"
                  label={t.phenomena.winter.winterTempSlider}
                  value={phenomenonParams.winterTempC}
                  min={5}
                  max={28}
                  step={0.5}
                  unit="°C"
                  decimals={1}
                  onChange={(v) => updatePhenomenonParam('winterTempC', v)}
                />
                <ProgressiveSlider
                  id="m3-winter-rh"
                  label={t.phenomena.winter.winterRhSlider}
                  value={phenomenonParams.winterRH}
                  min={10}
                  max={95}
                  step={1}
                  unit="%"
                  decimals={0}
                  onChange={(v) => updatePhenomenonParam('winterRH', v)}
                />
              </>
            )}

            {phenomenon === 'pitcher' && (
              <>
                <ProgressiveSlider
                  id="m3-pitcher-temp"
                  label={t.phenomena.pitcher.ambientTempSlider}
                  value={phenomenonParams.pitcherAmbientC}
                  min={18}
                  max={45}
                  step={0.5}
                  unit="°C"
                  decimals={1}
                  onChange={(v) => updatePhenomenonParam('pitcherAmbientC', v)}
                />
                <ProgressiveSlider
                  id="m3-pitcher-rh"
                  label={t.phenomena.pitcher.ambientRhSlider}
                  value={phenomenonParams.pitcherRH}
                  min={10}
                  max={95}
                  step={1}
                  unit="%"
                  decimals={0}
                  onChange={(v) => updatePhenomenonParam('pitcherRH', v)}
                />
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-slate-800 block">
                    {t.phenomena.pitcher.materialLabel}
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        updatePhenomenonParam('pitcherMaterial', 'clay')
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        phenomenonParams.pitcherMaterial === 'clay'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-sky-50 border-sky-200 text-slate-800 hover:bg-sky-100'
                      }`}
                    >
                      {t.phenomena.pitcher.materialClay}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updatePhenomenonParam('pitcherMaterial', 'metal')
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        phenomenonParams.pitcherMaterial === 'metal'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-sky-50 border-sky-200 text-slate-800 hover:bg-sky-100'
                      }`}
                    >
                      {t.phenomena.pitcher.materialMetal}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto pt-2 border-t border-sky-100">
            <button
              type="button"
              onClick={onOpenTables}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>{t.controls.openTablesBtn}</span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
};
