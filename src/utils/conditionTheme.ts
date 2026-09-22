/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConditionKey = 'yeni_gibi' | 'az_kullanilmis' | 'cok_kullanilmis' | 'vintage';

export interface ConditionTheme {
  key: ConditionKey;
  label: string;
  sublabel: string;
  dotEmoji: string;
  borderClass: string;
  glowRingClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  badgeBorderClass: string;
  hexColor: string;
  description: string;
}

export const CONDITION_THEMES: Record<ConditionKey, ConditionTheme> = {
  yeni_gibi: {
    key: 'yeni_gibi',
    label: 'Yeni Gibi',
    sublabel: 'Kusursuz / Sıfır Ayarında',
    dotEmoji: '🟢',
    borderClass: 'border-emerald-500',
    glowRingClass: 'ring-2 ring-emerald-500/50 shadow-[0_0_18px_rgba(16,185,129,0.28)]',
    badgeBgClass: 'bg-emerald-50',
    badgeTextClass: 'text-emerald-800',
    badgeBorderClass: 'border-emerald-300',
    hexColor: '#10B981',
    description: 'Etiketsiz sıfır veya yalnızca 1-2 kez özenle kullanılmış, hiçbir kusuru olmayan ürünler.',
  },
  az_kullanilmis: {
    key: 'az_kullanilmis',
    label: 'Az Kullanılmış',
    sublabel: 'Çok İyi Kondisyon',
    dotEmoji: '🔵',
    borderClass: 'border-blue-500',
    glowRingClass: 'ring-2 ring-blue-500/50 shadow-[0_0_18px_rgba(59,130,246,0.28)]',
    badgeBgClass: 'bg-blue-50',
    badgeTextClass: 'text-blue-800',
    badgeBorderClass: 'border-blue-300',
    hexColor: '#3B82F6',
    description: 'Çok temiz, formunu ve kalitesini tam olarak koruyan, sadece hafif kullanım izi olan parçalar.',
  },
  cok_kullanilmis: {
    key: 'cok_kullanilmis',
    label: 'Çok Kullanılmış',
    sublabel: 'Yaşanmışlık İzi / Karakterli',
    dotEmoji: '🟠',
    borderClass: 'border-amber-600',
    glowRingClass: 'ring-2 ring-amber-600/50 shadow-[0_0_18px_rgba(217,119,6,0.28)]',
    badgeBgClass: 'bg-amber-50',
    badgeTextClass: 'text-amber-900',
    badgeBorderClass: 'border-amber-300',
    hexColor: '#D97706',
    description: 'Yılların getirdiği doğal patina, yaşanmışlık çizgileri ve derin vintage karakteri olan eşyalar.',
  },
  vintage: {
    key: 'vintage',
    label: 'Vintage / Koleksiyonluk',
    sublabel: 'Dönem İzi / Antika Değer',
    dotEmoji: '🟤',
    borderClass: 'border-[#9E4424]',
    glowRingClass: 'ring-2 ring-[#9E4424]/50 shadow-[0_0_18px_rgba(158,68,36,0.28)]',
    badgeBgClass: 'bg-[#FAF3EB]',
    badgeTextClass: 'text-[#85361A]',
    badgeBorderClass: 'border-[#E8CEB8]',
    hexColor: '#9E4424',
    description: '30 yılı aşkın tarihe sahip, analog dönemin nadir ve hatırası yüksek koleksiyon parçaları.',
  },
};

/**
 * Normalizes any free-form condition string to one of the 4 standard condition keys.
 */
export function resolveConditionKey(conditionStr?: string): ConditionKey {
  if (!conditionStr) return 'az_kullanilmis';
  const c = conditionStr.toLowerCase();
  if (c.includes('kusursuz') || c.includes('sıfır') || c.includes('yeni gibi') || c.includes('etiketsiz')) {
    return 'yeni_gibi';
  }
  if (c.includes('çok iyi') || c.includes('az kullanılmış')) {
    return 'az_kullanilmis';
  }
  if (c.includes('çok kullanılmış') || c.includes('yaşanmış') || c.includes('patina') || c.includes('karakterli') || c.includes('iyi (temiz')) {
    return 'cok_kullanilmis';
  }
  if (c.includes('vintage') || c.includes('koleksiyon') || c.includes('antika')) {
    return 'vintage';
  }
  return 'az_kullanilmis';
}
