/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConditionKey, CONDITION_THEMES } from '../utils/conditionTheme';
import { Info, Sparkles } from 'lucide-react';

interface ConditionFrameSelectorProps {
  selectedCondition: ConditionKey | 'all';
  onSelectCondition: (cond: ConditionKey | 'all') => void;
  countsByCondition?: Record<ConditionKey, number>;
  conditionCounts?: Record<ConditionKey | 'all', number>;
}

export const ConditionFrameSelector: React.FC<ConditionFrameSelectorProps> = ({
  selectedCondition,
  onSelectCondition,
  countsByCondition,
  conditionCounts,
}) => {
  const resolvedCounts = conditionCounts || countsByCondition;
  const conditions: Array<{ key: ConditionKey | 'all'; label: string; dot: string; color: string; desc: string }> = [
    {
      key: 'all',
      label: 'Tüm Kondisyonlar',
      dot: '✨',
      color: '#44403C',
      desc: 'Her eşya kendi kondisyon rengini taşır',
    },
    {
      key: 'yeni_gibi',
      label: 'Yeni Gibi (Kusursuz)',
      dot: '🟢',
      color: '#10B981',
      desc: 'Yeşil çerçeve • Sıfır ayarında',
    },
    {
      key: 'az_kullanilmis',
      label: 'Az Kullanılmış (Çok İyi)',
      dot: '🔵',
      color: '#3B82F6',
      desc: 'Mavi çerçeve • Çok temiz',
    },
    {
      key: 'cok_kullanilmis',
      label: 'Çok Kullanılmış (Yaşanmışlık İzi)',
      dot: '🟠',
      color: '#D97706',
      desc: 'Kehribar çerçeve • Doğal patinalı',
    },
    {
      key: 'vintage',
      label: 'Vintage (Koleksiyonluk)',
      dot: '🟤',
      color: '#9E4424',
      desc: 'Kiremit çerçeve • Dönem hatırası',
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#2A241F]">
          <span className="text-sm">🎨</span>
          <span>Kondisyon Çerçeve Renkleri:</span>
          <span className="text-[11px] font-normal text-stone-500">
            Seçiminize göre eşyaların çerçeveleri renk değiştirir.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Yeni Gibi</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Az Kullanılmış</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Çok Kullanılmış</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#9E4424] inline-block" /> Vintage</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {conditions.map((item) => {
          const isSelected = selectedCondition === item.key;
          const count =
            item.key === 'all'
              ? conditionCounts?.all
              : (conditionCounts?.[item.key] ?? countsByCondition?.[item.key]);

          return (
            <button
              key={item.key}
              onClick={() => onSelectCondition(item.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border shrink-0 cursor-pointer shadow-2xs ${
                isSelected
                  ? item.key === 'yeni_gibi'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-500/30 font-bold'
                    : item.key === 'az_kullanilmis'
                    ? 'bg-blue-50 text-blue-900 border-blue-500 ring-2 ring-blue-500/30 font-bold'
                    : item.key === 'cok_kullanilmis'
                    ? 'bg-amber-50 text-amber-950 border-amber-500 ring-2 ring-amber-500/30 font-bold'
                    : item.key === 'vintage'
                    ? 'bg-[#FAF3EB] text-[#7A3319] border-[#9E4424] ring-2 ring-[#9E4424]/30 font-bold'
                    : 'bg-[#2A241F] text-white border-[#2A241F] ring-2 ring-stone-900/20 font-bold'
                  : 'bg-white text-stone-700 border-[#E2DBD0] hover:border-stone-400 hover:bg-[#FAF8F5]'
              }`}
            >
              <span>{item.dot}</span>
              <span>{item.label}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-black/10' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
