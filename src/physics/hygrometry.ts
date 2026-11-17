export interface SVPEntry {
  tempC: number;
  svpMmHg: number;
}

export interface GlaisherEntry {
  tempC: number;
  factor: number;
}

// Standard Saturation Vapor Pressure (SVP) Table from 0°C to 50°C in mmHg
export const SVP_TABLE_0_TO_50: SVPEntry[] = [
  { tempC: 0, svpMmHg: 4.58 },
  { tempC: 1, svpMmHg: 4.93 },
  { tempC: 2, svpMmHg: 5.29 },
  { tempC: 3, svpMmHg: 5.69 },
  { tempC: 4, svpMmHg: 6.10 },
  { tempC: 5, svpMmHg: 6.54 },
  { tempC: 6, svpMmHg: 7.01 },
  { tempC: 7, svpMmHg: 7.51 },
  { tempC: 8, svpMmHg: 8.05 },
  { tempC: 9, svpMmHg: 8.61 },
  { tempC: 10, svpMmHg: 9.21 },
  { tempC: 11, svpMmHg: 9.84 },
  { tempC: 12, svpMmHg: 10.52 },
  { tempC: 13, svpMmHg: 11.23 },
  { tempC: 14, svpMmHg: 11.99 },
  { tempC: 15, svpMmHg: 12.79 },
  { tempC: 16, svpMmHg: 13.63 },
  { tempC: 17, svpMmHg: 14.53 },
  { tempC: 18, svpMmHg: 15.48 },
  { tempC: 19, svpMmHg: 16.48 },
  { tempC: 20, svpMmHg: 17.54 },
  { tempC: 21, svpMmHg: 18.65 },
  { tempC: 22, svpMmHg: 19.83 },
  { tempC: 23, svpMmHg: 21.07 },
  { tempC: 24, svpMmHg: 22.38 },
  { tempC: 25, svpMmHg: 23.76 },
  { tempC: 26, svpMmHg: 25.21 },
  { tempC: 27, svpMmHg: 26.74 },
  { tempC: 28, svpMmHg: 28.35 },
  { tempC: 29, svpMmHg: 30.04 },
  { tempC: 30, svpMmHg: 31.82 },
  { tempC: 31, svpMmHg: 33.70 },
  { tempC: 32, svpMmHg: 35.66 },
  { tempC: 33, svpMmHg: 37.73 },
  { tempC: 34, svpMmHg: 39.90 },
  { tempC: 35, svpMmHg: 42.18 },
  { tempC: 36, svpMmHg: 44.56 },
  { tempC: 37, svpMmHg: 47.07 },
  { tempC: 38, svpMmHg: 49.69 },
  { tempC: 39, svpMmHg: 52.44 },
  { tempC: 40, svpMmHg: 55.32 },
  { tempC: 41, svpMmHg: 58.34 },
  { tempC: 42, svpMmHg: 61.50 },
  { tempC: 43, svpMmHg: 64.80 },
  { tempC: 44, svpMmHg: 68.26 },
  { tempC: 45, svpMmHg: 71.88 },
  { tempC: 46, svpMmHg: 75.65 },
  { tempC: 47, svpMmHg: 79.60 },
  { tempC: 48, svpMmHg: 83.71 },
  { tempC: 49, svpMmHg: 88.02 },
  { tempC: 50, svpMmHg: 92.51 },
];

// Sub-zero SVP extension (supercooled water, Magnus formula anchored smoothly at 0°C = 4.58 mmHg)
const SUBZERO_SVP: SVPEntry[] = Array.from({ length: 30 }, (_, idx) => {
  const t = -30 + idx; // -30 to -1
  const svp = 4.58 * Math.exp((17.625 * t) / (243.04 + t));
  return { tempC: t, svpMmHg: Number(svp.toFixed(3)) };
});

const FULL_SVP_TABLE: SVPEntry[] = [...SUBZERO_SVP, ...SVP_TABLE_0_TO_50];

// Standard Glaisher's Factor Table (G vs Dry Bulb Temperature θ1)
export const GLAISHER_TABLE: GlaisherEntry[] = [
  { tempC: 0, factor: 3.32 },
  { tempC: 1, factor: 3.04 },
  { tempC: 2, factor: 2.77 },
  { tempC: 3, factor: 2.57 },
  { tempC: 4, factor: 2.39 },
  { tempC: 5, factor: 2.26 },
  { tempC: 6, factor: 2.18 },
  { tempC: 8, factor: 2.09 },
  { tempC: 10, factor: 2.06 },
  { tempC: 12, factor: 1.99 },
  { tempC: 14, factor: 1.92 },
  { tempC: 15, factor: 1.89 },
  { tempC: 16, factor: 1.87 },
  { tempC: 18, factor: 1.82 },
  { tempC: 20, factor: 1.79 },
  { tempC: 22, factor: 1.75 },
  { tempC: 24, factor: 1.72 },
  { tempC: 25, factor: 1.70 },
  { tempC: 26, factor: 1.68 },
  { tempC: 28, factor: 1.65 },
  { tempC: 30, factor: 1.65 },
  { tempC: 32, factor: 1.63 },
  { tempC: 34, factor: 1.61 },
  { tempC: 35, factor: 1.60 },
  { tempC: 36, factor: 1.59 },
  { tempC: 38, factor: 1.57 },
  { tempC: 40, factor: 1.55 },
  { tempC: 45, factor: 1.51 },
  { tempC: 50, factor: 1.47 },
];

export interface SVPBracket {
  lowTemp: number;
  highTemp: number;
  lowSVP: number;
  highSVP: number;
  interpolatedSVP: number;
  isExactMatch: boolean;
}

export interface GlaisherBracket {
  lowTemp: number;
  highTemp: number;
  lowG: number;
  highG: number;
  interpolatedG: number;
  isExactMatch: boolean;
}

/**
 * Linearly interpolates Saturation Vapor Pressure (mmHg) from the lookup table.
 */
export function getSVPWithBracket(tempC: number): SVPBracket {
  const clamped = Math.max(-30, Math.min(50, tempC));
  const lowIndex = Math.floor(clamped) - FULL_SVP_TABLE[0].tempC;
  const safeLowIdx = Math.max(0, Math.min(FULL_SVP_TABLE.length - 2, lowIndex));
  const low = FULL_SVP_TABLE[safeLowIdx];
  const high = FULL_SVP_TABLE[safeLowIdx + 1];
  const frac = clamped - low.tempC;
  const interpolatedSVP = low.svpMmHg + frac * (high.svpMmHg - low.svpMmHg);
  const isExactMatch = Math.abs(clamped - low.tempC) < 0.005 || Math.abs(clamped - high.tempC) < 0.005;
  return {
    lowTemp: low.tempC,
    highTemp: high.tempC,
    lowSVP: low.svpMmHg,
    highSVP: high.svpMmHg,
    interpolatedSVP,
    isExactMatch,
  };
}

export function getSVP(tempC: number): number {
  return getSVPWithBracket(tempC).interpolatedSVP;
}

/**
 * Inverse linear interpolation: finds Dew Point temperature (°C) for a given vapor pressure (mmHg).
 */
export function getTempFromSVP(vaporPressureMmHg: number): number {
  if (vaporPressureMmHg <= FULL_SVP_TABLE[0].svpMmHg) {
    return FULL_SVP_TABLE[0].tempC;
  }
  const last = FULL_SVP_TABLE[FULL_SVP_TABLE.length - 1];
  if (vaporPressureMmHg >= last.svpMmHg) {
    return last.tempC;
  }
  for (let i = 0; i < FULL_SVP_TABLE.length - 1; i++) {
    const low = FULL_SVP_TABLE[i];
    const high = FULL_SVP_TABLE[i + 1];
    if (vaporPressureMmHg >= low.svpMmHg && vaporPressureMmHg <= high.svpMmHg) {
      const span = high.svpMmHg - low.svpMmHg;
      const frac = span > 0 ? (vaporPressureMmHg - low.svpMmHg) / span : 0;
      return low.tempC + frac * (high.tempC - low.tempC);
    }
  }
  return 0;
}

/**
 * Linearly interpolates Glaisher's Factor G for a given dry-bulb temperature θ1,
 * returning both the factor and the bracketing table rows used for interpolation.
 */
export function getGlaisherFactorWithBracket(dryBulbTempC: number): GlaisherBracket {
  const clamped = Math.max(0, Math.min(50, dryBulbTempC));
  for (let i = 0; i < GLAISHER_TABLE.length - 1; i++) {
    const low = GLAISHER_TABLE[i];
    const high = GLAISHER_TABLE[i + 1];
    if (clamped >= low.tempC && clamped <= high.tempC) {
      const frac = (clamped - low.tempC) / (high.tempC - low.tempC);
      const interpolatedG = low.factor + frac * (high.factor - low.factor);
      const isExactMatch =
        Math.abs(clamped - low.tempC) < 0.005 ||
        Math.abs(clamped - high.tempC) < 0.005;
      return {
        lowTemp: low.tempC,
        highTemp: high.tempC,
        lowG: low.factor,
        highG: high.factor,
        interpolatedG,
        isExactMatch,
      };
    }
  }
  const last = GLAISHER_TABLE[GLAISHER_TABLE.length - 1];
  return {
    lowTemp: last.tempC,
    highTemp: last.tempC,
    lowG: last.factor,
    highG: last.factor,
    interpolatedG: last.factor,
    isExactMatch: true,
  };
}

export function getGlaisherFactor(dryBulbTempC: number): number {
  return getGlaisherFactorWithBracket(dryBulbTempC).interpolatedG;
}

export type WeatherCategory = 'storm' | 'humid' | 'pleasant' | 'dry';

export interface PsychrometricResult {
  dryBulbC: number;           // θ1
  wetBulbC: number;           // θ2 (actual displayed wet-bulb reading)
  trueWetBulbC: number;       // θ2_ideal (ventilated equilibrium)
  depressionC: number;        // θ1 - θ2
  glaisherG: number;          // G at θ1
  glaisherBracket: GlaisherBracket;
  dewPointC: number;          // θ = θ1 - G(θ1 - θ2)
  trueDewPointC: number;      // θ_true from ambient R%
  svpAtAirF: number;          // F = SVP(θ1)
  svpAtDewf: number;          // f = SVP(θ)
  airBracket: SVPBracket;
  dewBracket: SVPBracket;
  measuredRH: number;         // R_calc = (f / F) * 100%
  trueRH: number;             // Ambient RH%
  vaporDeficitMmHg: number;   // F - f
  evaporationRateNorm: number;// 0..1 normalized evaporative flux
  weatherCategory: WeatherCategory;
  airflowActive: boolean;
}

function classifyWeather(measuredRH: number, depressionC: number): WeatherCategory {
  if (measuredRH >= 85 || (depressionC <= 2.2 && measuredRH >= 80)) {
    return 'storm';
  }
  if (measuredRH >= 70) {
    return 'humid';
  }
  if (measuredRH <= 35) {
    return 'dry';
  }
  return 'pleasant';
}

/**
 * Environment Mode: Computes full psychrometric state from ambient dry-bulb temperature (θ1),
 * true ambient relative humidity (R%), and whether gentle ventilation airflow is active.
 */
export function computePsychrometrics(
  dryBulbC: number,
  trueRH: number,
  airflowActive: boolean
): PsychrometricResult {
  const airBracket = getSVPWithBracket(dryBulbC);
  const svpAtAirF = airBracket.interpolatedSVP;
  const trueVaporPressure = svpAtAirF * (trueRH / 100);
  const trueDewPointC = getTempFromSVP(trueVaporPressure);
  const glaisherBracket = getGlaisherFactorWithBracket(dryBulbC);
  const glaisherG = glaisherBracket.interpolatedG;

  // Ideal ventilated wet-bulb temperature from Glaisher's relation
  const idealDepression = Math.max(0, (dryBulbC - trueDewPointC) / glaisherG);
  const trueWetBulbC = dryBulbC - idealDepression;

  // Without gentle air circulation, a humid boundary layer stalls around the wet muslin wick,
  // reducing wet-bulb cooling efficiency to ~84% of ventilated equilibrium.
  const efficiency = airflowActive ? 1.0 : 0.84;
  const actualDepression = idealDepression * efficiency;
  const wetBulbC = dryBulbC - actualDepression;

  // Apply Glaisher's formula directly to the displayed thermometer readings (θ1, θ2)
  const dewPointC = dryBulbC - glaisherG * actualDepression;
  const dewBracket = getSVPWithBracket(dewPointC);
  const svpAtDewf = Math.min(svpAtAirF, dewBracket.interpolatedSVP);
  const measuredRH = Math.min(100, Math.max(0, (svpAtDewf / svpAtAirF) * 100));
  const vaporDeficitMmHg = Math.max(0, svpAtAirF - svpAtDewf);

  const baseEvap = Math.max(0, (100 - trueRH) / 90);
  const evaporationRateNorm = Math.min(1, baseEvap * (airflowActive ? 1.0 : 0.62));
  const weatherCategory = classifyWeather(measuredRH, actualDepression);

  return {
    dryBulbC,
    wetBulbC,
    trueWetBulbC,
    depressionC: actualDepression,
    glaisherG,
    glaisherBracket,
    dewPointC,
    trueDewPointC,
    svpAtAirF,
    svpAtDewf,
    airBracket,
    dewBracket,
    measuredRH,
    trueRH,
    vaporDeficitMmHg,
    evaporationRateNorm,
    weatherCategory,
    airflowActive,
  };
}

/**
 * Direct Hygrometer Observation Mode: Given Dry Bulb (θ1) and Wet Bulb (θ2) thermometer readings,
 * computes Glaisher's Factor G (with linear interpolation), Dew Point θ = θ1 - G(θ1 - θ2),
 * interpolated SVPs f and F, and Relative Humidity R = (f / F) * 100%.
 */
export function computePsychrometricsFromReadings(
  dryBulbC: number,
  rawWetBulbC: number,
  airflowActive = true
): PsychrometricResult {
  const wetBulbC = Math.min(dryBulbC, Math.max(0, rawWetBulbC));
  const depressionC = Math.max(0, dryBulbC - wetBulbC);
  const glaisherBracket = getGlaisherFactorWithBracket(dryBulbC);
  const glaisherG = glaisherBracket.interpolatedG;

  const dewPointC = dryBulbC - glaisherG * depressionC;
  const airBracket = getSVPWithBracket(dryBulbC);
  const dewBracket = getSVPWithBracket(dewPointC);

  const svpAtAirF = airBracket.interpolatedSVP;
  const svpAtDewf = Math.min(svpAtAirF, dewBracket.interpolatedSVP);
  const measuredRH = Math.min(100, Math.max(0, (svpAtDewf / svpAtAirF) * 100));
  const vaporDeficitMmHg = Math.max(0, svpAtAirF - svpAtDewf);

  const baseEvap = Math.max(0, (100 - measuredRH) / 90);
  const evaporationRateNorm = Math.min(1, baseEvap * (airflowActive ? 1.0 : 0.62));
  const weatherCategory = classifyWeather(measuredRH, depressionC);

  return {
    dryBulbC,
    wetBulbC,
    trueWetBulbC: wetBulbC,
    depressionC,
    glaisherG,
    glaisherBracket,
    dewPointC,
    trueDewPointC: dewPointC,
    svpAtAirF,
    svpAtDewf,
    airBracket,
    dewBracket,
    measuredRH,
    trueRH: measuredRH,
    vaporDeficitMmHg,
    evaporationRateNorm,
    weatherCategory,
    airflowActive,
  };
}

/**
 * Computes Heat Index (Apparent Temperature in °C) using Steadman / NOAA polynomial
 * when T >= 26°C, or smooth wind/humidity apparent feel below 26°C.
 */
export function computeApparentTempC(tempC: number, rh: number): number {
  if (tempC < 26) {
    return tempC + (rh - 50) * 0.03;
  }
  const T = (tempC * 9) / 5 + 32;
  const R = rh;
  let HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;

  if (R < 13 && T >= 80 && T <= 112) {
    HI -= ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
  } else if (R > 85 && T >= 80 && T <= 87) {
    HI += ((R - 85) / 10) * ((87 - T) / 5);
  }
  return ((HI - 32) * 5) / 9;
}
