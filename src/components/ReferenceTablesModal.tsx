import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GLAISHER_TABLE, SVP_TABLE_0_TO_50 } from '../physics/hygrometry';
import { Translations } from '../i18n/translations';

interface ReferenceTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  dryBulbC: number;
  dewPointC: number;
  t: Translations;
}

export const ReferenceTablesModal: React.FC<ReferenceTablesModalProps> = ({
  isOpen,
  onClose,
  dryBulbC,
  dewPointC,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<'svp' | 'glaisher'>('svp');

  if (!isOpen) return null;

  const airLow = Math.floor(dryBulbC);
  const airHigh = Math.ceil(dryBulbC);
  const dewLow = Math.floor(dewPointC);
  const dewHigh = Math.ceil(dewPointC);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ref-table-title"
    >
      <div className="w-full max-w-2xl max-h-[86vh] bg-white border border-sky-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-sky-100 flex items-start justify-between gap-4">
          <div>
            <h2
              id="ref-table-title"
              className="text-base font-bold text-slate-950"
            >
              {t.modal.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">{t.modal.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={t.modal.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-tabs */}
        <div className="px-5 py-2.5 bg-sky-50/70 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 bg-white border border-sky-200 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('svp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'svp'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-700 hover:bg-sky-50'
              }`}
            >
              {t.modal.svpTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('glaisher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'glaisher'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-700 hover:bg-sky-50'
              }`}
            >
              {t.modal.glaisherTab}
            </button>
          </div>
          <span className="text-[11px] font-medium text-slate-600">
            {t.modal.activeRowLegend}
          </span>
        </div>

        {/* Scrollable Table Body */}
        <div className="p-5 overflow-y-auto studio-scroll flex-1">
          {activeTab === 'svp' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[0, 26].map((startIdx) => (
                <table
                  key={startIdx}
                  className="w-full text-left border border-sky-200 rounded-xl overflow-hidden text-xs"
                >
                  <thead className="bg-sky-100/70 text-slate-800">
                    <tr>
                      <th className="px-3 py-2 font-bold">{t.modal.tempCol}</th>
                      <th className="px-3 py-2 font-bold text-right">
                        {t.modal.svpCol}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100 font-mono-num">
                    {SVP_TABLE_0_TO_50.slice(
                      startIdx,
                      startIdx === 0 ? 26 : 51
                    ).map((row) => {
                      const isAir = row.tempC === airLow || row.tempC === airHigh;
                      const isDew = row.tempC === dewLow || row.tempC === dewHigh;
                      return (
                        <tr
                          key={row.tempC}
                          className={
                            isAir
                              ? 'bg-amber-100/80 font-bold text-slate-950'
                              : isDew
                              ? 'bg-emerald-100/80 font-bold text-emerald-950'
                              : 'hover:bg-sky-50/50 text-slate-800'
                          }
                        >
                          <td className="px-3 py-1.5">{row.tempC} °C</td>
                          <td className="px-3 py-1.5 text-right">
                            {row.svpMmHg.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ))}
            </div>
          ) : (
            <table className="w-full text-left border border-sky-200 rounded-xl overflow-hidden text-xs">
              <thead className="bg-sky-100/70 text-slate-800">
                <tr>
                  <th className="px-4 py-2.5 font-bold">{t.modal.tempCol}</th>
                  <th className="px-4 py-2.5 font-bold text-right">
                    {t.modal.glaisherCol}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 font-mono-num">
                {GLAISHER_TABLE.map((row) => {
                  const isNear = Math.abs(row.tempC - dryBulbC) <= 1.2;
                  return (
                    <tr
                      key={row.tempC}
                      className={
                        isNear
                          ? 'bg-emerald-100/80 font-bold text-emerald-950'
                          : 'hover:bg-sky-50/50 text-slate-800'
                      }
                    >
                      <td className="px-4 py-2">{row.tempC} °C</td>
                      <td className="px-4 py-2 text-right">
                        {row.factor.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-sky-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            {t.modal.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
