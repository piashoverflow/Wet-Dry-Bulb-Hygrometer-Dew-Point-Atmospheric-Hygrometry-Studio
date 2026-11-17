import React from 'react';

interface ProgressiveSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  decimals?: number;
  onChange: (value: number) => void;
  sublabel?: string;
}

export const ProgressiveSlider: React.FC<ProgressiveSliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 0.5,
  unit,
  decimals = 1,
  onChange,
  sublabel,
}) => {
  const pct = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-slate-800 leading-snug">
          {label}
        </label>
        <span className="font-mono-num text-sm font-bold text-emerald-700 shrink-0">
          {value.toFixed(decimals)}
          <span className="text-xs font-medium text-slate-500 ml-0.5">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="emerald-slider"
        style={{
          background: `linear-gradient(to right, #059669 0%, #059669 ${pct}%, #d1fae5 ${pct}%, #d1fae5 100%)`,
        }}
      />
      <div className="flex items-center justify-between text-[11px] font-mono-num text-slate-500">
        <span>
          {min}
          {unit}
        </span>
        {sublabel && <span className="font-sans text-[11px] text-slate-500">{sublabel}</span>}
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
};
