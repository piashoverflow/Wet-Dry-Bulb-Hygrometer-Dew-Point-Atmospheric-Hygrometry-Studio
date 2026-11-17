import React from 'react';
import { Globe, RotateCcw } from 'lucide-react';
import { LabModule, Language, Translations } from '../i18n/translations';

interface HeaderBarProps {
  activeModule: LabModule;
  onSelectModule: (mod: LabModule) => void;
  language: Language;
  onToggleLanguage: () => void;
  onReset: () => void;
  t: Translations;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeModule,
  onSelectModule,
  onToggleLanguage,
  onReset,
  t,
}) => {
  const tabs: { id: LabModule; label: string }[] = [
    { id: 1, label: t.tabs.m1 },
    { id: 2, label: t.tabs.m2 },
    { id: 3, label: t.tabs.m3 },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-200 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-2.5 flex flex-wrap xl:flex-nowrap items-center justify-between gap-3 xl:gap-6">
        {/* Left: Dynamic Studio Title */}
        <div className="flex items-center min-w-0">
          <h1 className="text-base lg:text-lg font-bold tracking-tight text-slate-950 truncate">
            {t.studioTitle}
          </h1>
        </div>

        {/* Center: 3 Interactive Lab Mode Tabs (Pill Navigation) */}
        <nav
          aria-label="Lab Modules"
          className="order-3 xl:order-2 w-full xl:w-auto flex items-center gap-1 p-1 bg-sky-100/80 border border-sky-200 rounded-full overflow-x-auto"
        >
          {tabs.map((tab) => {
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectModule(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Language Switcher, Reset Button & Institution Badge */}
        <div className="order-2 xl:order-3 flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-900 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <Globe className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
            <span>{t.langToggle}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
            <span>{t.resetBtn}</span>
          </button>

          <span className="bg-rose-50 border border-rose-300 text-rose-600 font-extrabold px-3 py-1 rounded-full text-sm whitespace-nowrap shrink-0">
            উদ্ভাস
          </span>
        </div>
      </div>
    </header>
  );
};
