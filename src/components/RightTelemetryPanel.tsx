import React from 'react';
import {
  AlertTriangle,
  CloudDrizzle,
  CloudRain,
  Sun,
  Wind,
} from 'lucide-react';
import {
  PsychrometricResult,
  computeApparentTempC,
  computePsychrometrics,
} from '../physics/hygrometry';
import { LabModule, PhenomenonId, Translations } from '../i18n/translations';
import { PhenomenonParams } from './Module3Canvas';

interface RightTelemetryPanelProps {
  activeModule: LabModule;
  psychro: PsychrometricResult;
  phenomenon: PhenomenonId;
  phenomenonParams: PhenomenonParams;
  t: Translations;
}

export const RightTelemetryPanel: React.FC<RightTelemetryPanelProps> = ({
  activeModule,
  psychro,
  phenomenon,
  phenomenonParams,
  t,
}) => {
  const weather = t.telemetry.weather[psychro.weatherCategory];

  const weatherColors = {
    storm: 'bg-rose-50 border-rose-200 text-rose-900',
    humid: 'bg-amber-50 border-amber-200 text-amber-900',
    pleasant: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    dry: 'bg-orange-50 border-orange-200 text-orange-900',
  }[psychro.weatherCategory];

  const WeatherIcon = {
    storm: CloudRain,
    humid: CloudDrizzle,
    pleasant: Sun,
    dry: Wind,
  }[psychro.weatherCategory];

  if (activeModule === 3) {
    const activePh = t.phenomena[phenomenon];
    const glassesPsychro = computePsychrometrics(
      phenomenonParams.outdoorTempC,
      phenomenonParams.outdoorRH,
      true
    );
    const pitcherPsychro = computePsychrometrics(
      phenomenonParams.pitcherAmbientC,
      phenomenonParams.pitcherRH,
      true
    );

    return (
      <aside className="w-full lg:w-[340px] shrink-0 bg-white/95 backdrop-blur-sm border border-sky-200 shadow-sm rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
        <div className="border-b border-sky-100 pb-3">
          <h2 className="text-sm font-bold text-slate-950">
            {activePh.explanationTitle}
          </h2>
        </div>

        <p className="text-xs leading-relaxed text-slate-700 bg-sky-50/80 border border-sky-100 rounded-xl p-3.5">
          {activePh.explanationBody}
        </p>

        {phenomenon === 'cities' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
              <div className="text-xs font-semibold text-slate-700">
                {t.phenomena.cities.dhakaName}
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-[11px] text-slate-500">
                  {t.phenomena.cities.apparentTemp}
                </span>
                <span className="font-mono-num text-base font-bold text-emerald-700">
                  {computeApparentTempC(
                    phenomenonParams.cityTempC,
                    phenomenonParams.dhakaRH
                  ).toFixed(1)}{' '}
                  °C
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-xs font-semibold text-slate-700">
                {t.phenomena.cities.coxsName}
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-[11px] text-slate-500">
                  {t.phenomena.cities.apparentTemp}
                </span>
                <span className="font-mono-num text-base font-bold text-rose-700">
                  {computeApparentTempC(
                    phenomenonParams.cityTempC,
                    phenomenonParams.coxsRH
                  ).toFixed(1)}{' '}
                  °C
                </span>
              </div>
            </div>
          </div>
        )}

        {phenomenon === 'glasses' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                {t.phenomena.glasses.dewPointReadout}
              </span>
              <span className="font-mono-num text-base font-bold text-sky-800">
                {glassesPsychro.dewPointC.toFixed(1)} °C
              </span>
            </div>
            <div
              className={`p-3 rounded-xl border text-xs font-bold ${
                phenomenonParams.lensTempC < glassesPsychro.dewPointC
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {phenomenonParams.lensTempC < glassesPsychro.dewPointC
                ? t.phenomena.glasses.lensStatusFogged
                : t.phenomena.glasses.lensStatusClear}
            </div>
          </div>
        )}

        {phenomenon === 'winter' && (
          <div className="space-y-2.5">
            {(() => {
              const winPsychro = computePsychrometrics(
                phenomenonParams.winterTempC,
                phenomenonParams.winterRH,
                true
              );
              return (
                <>
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      {t.telemetry.vaporDeficitLabel}
                    </span>
                    <span className="font-mono-num text-base font-bold text-sky-800">
                      {winPsychro.vaporDeficitMmHg.toFixed(2)} mmHg
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      {t.telemetry.dewPointLabel}
                    </span>
                    <span className="font-mono-num text-base font-bold text-emerald-800">
                      {winPsychro.dewPointC.toFixed(1)} °C
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {phenomenon === 'pitcher' && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                {t.telemetry.wetBulbReading}
              </span>
              <span className="font-mono-num text-base font-bold text-sky-800">
                {pitcherPsychro.wetBulbC.toFixed(1)} °C
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                {t.telemetry.depressionLabel}
              </span>
              <span className="font-mono-num text-base font-bold text-emerald-800">
                {pitcherPsychro.depressionC.toFixed(1)} °C
              </span>
            </div>
          </div>
        )}
      </aside>
    );
  }

  const gb = psychro.glaisherBracket;
  const db = psychro.dewBracket;
  const ab = psychro.airBracket;

  const gFrac =
    gb.highTemp > gb.lowTemp
      ? (psychro.dryBulbC - gb.lowTemp) / (gb.highTemp - gb.lowTemp)
      : 0;
  const dewFrac = psychro.dewPointC - db.lowTemp;
  const airFrac = psychro.dryBulbC - ab.lowTemp;

  return (
    <aside className="w-full lg:w-[340px] shrink-0 bg-white/95 backdrop-blur-sm border border-sky-200 shadow-sm rounded-2xl p-4 lg:p-5 flex flex-col gap-3.5 studio-scroll">
      <div className="border-b border-sky-100 pb-2.5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-950">
          {t.telemetry.title}
        </h2>
      </div>

      {!psychro.airflowActive && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-snug">
          <AlertTriangle
            className="w-4 h-4 shrink-0 mt-0.5 text-amber-600"
            aria-hidden="true"
          />
          <span>{t.telemetry.stagnantWarning}</span>
        </div>
      )}

      {/* Primary Thermometer Pair */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200">
          <div className="text-[11px] font-semibold text-slate-600">
            {t.telemetry.dryBulbReading}
          </div>
          <div className="font-mono-num text-lg font-bold text-rose-700 mt-0.5">
            {psychro.dryBulbC.toFixed(1)}
            <span className="text-xs font-semibold text-slate-500 ml-0.5">
              °C
            </span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
          <div className="text-[11px] font-semibold text-slate-600">
            {t.telemetry.wetBulbReading}
          </div>
          <div className="font-mono-num text-lg font-bold text-sky-700 mt-0.5">
            {psychro.wetBulbC.toFixed(1)}
            <span className="text-xs font-semibold text-slate-500 ml-0.5">
              °C
            </span>
          </div>
        </div>
      </div>

      {/* Key Psychrometric Summary */}
      <div className="divide-y divide-sky-100 border border-sky-200 rounded-xl bg-sky-50/40 px-3">
        <div className="py-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-700">
            {t.telemetry.dewPointLabel}
          </span>
          <span className="font-mono-num text-sm font-bold text-emerald-700">
            {psychro.dewPointC.toFixed(2)} °C
          </span>
        </div>
        <div className="py-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-700">
            {t.telemetry.glaisherFactor}
          </span>
          <span className="font-mono-num text-sm font-bold text-slate-950">
            {psychro.glaisherG.toFixed(3)}
          </span>
        </div>
        <div className="py-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-900">
            {t.telemetry.calcHumidityLabel}
          </span>
          <span className="font-mono-num text-base font-extrabold text-emerald-700">
            {psychro.measuredRH.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Step-by-Step Interpolation & Glaisher's Formula Breakdown */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
        <div className="text-xs font-bold text-slate-900">
          {t.telemetry.formulaCardTitle}
        </div>
        <div className="space-y-2 text-[11px] font-mono-num text-slate-800">
          {/* Step 1: Depression */}
          <div>
            <div className="font-sans text-[11px] font-semibold text-slate-500">
              {t.telemetry.step1Title}
            </div>
            <div>
              Δθ = {psychro.dryBulbC.toFixed(1)} − {psychro.wetBulbC.toFixed(1)}{' '}
              ={' '}
              <span className="font-bold text-slate-950">
                {psychro.depressionC.toFixed(2)}°C
              </span>
            </div>
          </div>

          {/* Step 2: Glaisher's Factor G Interpolation */}
          <div className="pt-1.5 border-t border-slate-200">
            <div className="font-sans text-[11px] font-semibold text-slate-500">
              {t.telemetry.step2GlaisherInterpTitle}
            </div>
            {gb.isExactMatch ? (
              <div>
                {t.telemetry.step2ExactTable}{' '}
                <span className="font-bold text-slate-950">
                  G({psychro.dryBulbC.toFixed(1)}°C) ={' '}
                  {psychro.glaisherG.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="space-y-0.5 leading-snug">
                <div className="text-slate-600">
                  [{gb.lowTemp}°C → {gb.lowG.toFixed(2)}] , [{gb.highTemp}°C →{' '}
                  {gb.highG.toFixed(2)}]
                </div>
                <div>
                  G = {gb.lowG.toFixed(2)} + ({gFrac.toFixed(2)})×(
                  {(gb.highG - gb.lowG).toFixed(2)}) ={' '}
                  <span className="font-bold text-blue-700">
                    {psychro.glaisherG.toFixed(3)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Dew Point θ via Glaisher's Formula */}
          <div className="pt-1.5 border-t border-slate-200">
            <div className="font-sans text-[11px] font-semibold text-slate-500">
              {t.telemetry.step2Title}
            </div>
            <div>θ = θ₁ − G(θ₁ − θ₂)</div>
            <div>
              θ = {psychro.dryBulbC.toFixed(1)} − {psychro.glaisherG.toFixed(3)}{' '}
              × {psychro.depressionC.toFixed(2)} ={' '}
              <span className="font-bold text-emerald-700">
                {psychro.dewPointC.toFixed(2)}°C
              </span>
            </div>
          </div>

          {/* Step 4: Linear Interpolation for f and F */}
          <div className="pt-1.5 border-t border-slate-200 space-y-1">
            <div className="font-sans text-[11px] font-semibold text-slate-500">
              {t.telemetry.step3Title}
            </div>
            <div className="leading-snug">
              <span className="text-emerald-800 font-semibold">f(θ):</span>{' '}
              {db.isExactMatch ? (
                <span>
                  SVP({Math.round(psychro.dewPointC)}°C) ={' '}
                  <b>{psychro.svpAtDewf.toFixed(2)}</b>
                </span>
              ) : (
                <span>
                  {db.lowSVP.toFixed(2)} + ({dewFrac.toFixed(2)})×(
                  {(db.highSVP - db.lowSVP).toFixed(2)}) ={' '}
                  <b className="text-emerald-700">
                    {psychro.svpAtDewf.toFixed(2)}
                  </b>
                </span>
              )}
            </div>
            <div className="leading-snug">
              <span className="text-blue-800 font-semibold">F(θ₁):</span>{' '}
              {ab.isExactMatch ? (
                <span>
                  SVP({Math.round(psychro.dryBulbC)}°C) ={' '}
                  <b>{psychro.svpAtAirF.toFixed(2)}</b>
                </span>
              ) : (
                <span>
                  {ab.lowSVP.toFixed(2)} + ({airFrac.toFixed(2)})×(
                  {(ab.highSVP - ab.lowSVP).toFixed(2)}) ={' '}
                  <b className="text-blue-700">
                    {psychro.svpAtAirF.toFixed(2)}
                  </b>
                </span>
              )}
            </div>
          </div>

          {/* Step 5: Relative Humidity */}
          <div className="pt-1.5 border-t border-slate-200">
            <div className="font-sans text-[11px] font-semibold text-slate-500">
              {t.telemetry.step4Title}
            </div>
            <div>
              R = ({psychro.svpAtDewf.toFixed(2)} /{' '}
              {psychro.svpAtAirF.toFixed(2)}) × 100% ={' '}
              <span className="font-bold text-emerald-700">
                {psychro.measuredRH.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Forecast Status Card */}
      <div className={`p-3 rounded-xl border space-y-1 ${weatherColors}`}>
        <div className="flex items-center gap-2">
          <WeatherIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-wide opacity-80">
            {t.telemetry.forecastTitle}
          </span>
        </div>
        <div className="text-sm font-bold">{weather.badge}</div>
        <p className="text-xs leading-relaxed opacity-90">{weather.summary}</p>
      </div>
    </aside>
  );
};
