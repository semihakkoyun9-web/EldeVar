import React, { useState } from 'react';
import { X, Feather, MapPin, Sparkles, BookOpen, Plus, Heart, Calendar, Check, Edit3 } from 'lucide-react';
import { KeepsakeItem } from '../types';

interface MemoryBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  keepsakes: KeepsakeItem[];
  onAddPersonalNote: (keepsakeId: string, note: string) => void;
}

export const MemoryBoxModal: React.FC<MemoryBoxModalProps> = ({
  isOpen,
  onClose,
  keepsakes,
  onAddPersonalNote,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'all' | 'stories'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [personalNoteInput, setPersonalNoteInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const handleStartEdit = (item: KeepsakeItem) => {
    setEditingId(item.id);
    setPersonalNoteInput(item.buyerPersonalNote || '');
  };

  const handleSaveNote = (id: string) => {
    onAddPersonalNote(id, personalNoteInput);
    setEditingId(null);
  };

  const filteredKeepsakes = keepsakes.filter((item) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      (item.originCity && item.originCity.toLowerCase().includes(q)) ||
      (item.eraOrYear && item.eraOrYear.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF6EF] w-full max-w-4xl rounded-3xl shadow-2xl border-2 border-[#D8CABE] overflow-hidden my-auto max-h-[94vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* VINTAGE TOP HEADER */}
        <div className="bg-[#2A231F] text-[#FAF5ED] px-5 sm:px-8 py-4 flex items-center justify-between border-b border-[#3D332D] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9E4424] text-white flex items-center justify-center shadow-inner">
              <span className="text-xl">🧳</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#FAF5ED] tracking-tight">
                  Eşya Hatıra Kutusu & Emanet Sandığı
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {keepsakes.length} Hatıra Parçası
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-sans">
                Edindiğiniz eşyaların eski sahiplerinden kalan veda notları ve yolculuk günlüğü
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB-HEADER / VINTAGE FILTER BAR */}
        <div className="bg-[#F3ECE1] border-b border-[#E2D6C7] px-5 sm:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-stone-600 font-serif italic text-xs">
              "Eşyaların fiyatı unutulur, ardında bıraktığı hikaye kalır."
            </span>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Hatıralarda ara (marka, şehir, dönem)..."
              className="w-full text-xs px-3 py-1.5 bg-white border border-[#D9CABE] rounded-xl focus:outline-none focus:border-[#9E4424] text-stone-800"
            />
          </div>
        </div>

        {/* KEEPSAKE ITEMS GRID */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-7 space-y-6">
          {filteredKeepsakes.length === 0 ? (
            <div className="text-center py-16 bg-white/70 rounded-3xl border border-dashed border-[#D8CABE] p-8 space-y-3">
              <span className="text-4xl block">📦</span>
              <h4 className="font-serif font-bold text-base text-stone-800">
                Henüz Hatıra Kutusunda Eşya Yok
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Satın aldığınız veya gardırobunuza kattığınız hafıza pasaportlu eşyaların hikayeleri, eski sahiplerinin notları burada birikir. Fiyatlar gizlenir, sadece anılar yaşatılır.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredKeepsakes.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-3xl border border-[#DECFC0] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col relative group"
                  >
                    {/* Top Wax Seal / Badge Bar */}
                    <div className="bg-[#FAF5ED] px-4 py-2.5 border-b border-[#EFE5D8] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">📜</span>
                        <span className="text-[11px] font-mono font-bold text-stone-700">
                          {item.passportCode || `EV-${item.productId.slice(0, 6)}`}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#8C3F23] bg-[#FAF0E6] px-2 py-0.5 rounded-full border border-[#EACBB0] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#9E4424]" />
                        <span>Emanet: {item.acquiredDate}</span>
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                      
                      {/* Visual & Metadata Stage (NO PRICES SHOWN) */}
                      <div className="flex gap-4 items-start">
                        {/* Polaroid Framed Image */}
                        <div className="w-24 h-28 sm:w-28 sm:h-32 bg-[#FAF8F5] p-1.5 rounded-xl border border-stone-200 shadow-xs shrink-0 flex flex-col items-center">
                          <div className="w-full h-20 sm:h-24 rounded-lg overflow-hidden bg-stone-100">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <span className="text-[9px] font-mono text-stone-400 mt-1 truncate max-w-full">
                            {item.brand}
                          </span>
                        </div>

                        {/* Story Details */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-stone-500">
                            <span className="font-bold text-[#9E4424] uppercase tracking-wide text-[10px]">
                              {item.categoryLabel}
                            </span>
                            {item.originCity && (
                              <span className="flex items-center gap-0.5 text-[10px] text-stone-500">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                <span>{item.originCity}</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-snug line-clamp-2">
                            {item.title}
                          </h4>

                          {item.travelBadge && (
                            <div className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                              <Feather className="w-2.5 h-2.5 text-[#9E4424]" />
                              <span>{item.travelBadge}</span>
                            </div>
                          )}

                          <div className="text-[11px] text-stone-500 font-sans">
                            Eski Sahibi: <strong className="text-stone-800">{item.sellerName}</strong>
                            {item.eraOrYear && ` • ${item.eraOrYear}`}
                          </div>
                        </div>
                      </div>

                      {/* SELLER FAREWELL NOTE (Satıcının Veda Notu) */}
                      {item.sellerFarewell && (
                        <div className="p-3 rounded-2xl bg-[#FAF5EE] border-l-3 border-[#9E4424] text-xs text-stone-800 italic relative">
                          <span className="text-[10px] font-bold text-[#9E4424] not-italic block mb-0.5 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>Eski Sahibinin Veda Notu:</span>
                          </span>
                          "{item.sellerFarewell}"
                        </div>
                      )}

                      {/* BUYER PERSONAL MEMORY NOTE (Benim Yeni Hatıram) */}
                      <div className="pt-2 border-t border-stone-100">
                        {isEditing ? (
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-stone-800 block">
                              Bu Eşyaya Kendi Yeni Hatıranı Ekle:
                            </label>
                            <textarea
                              rows={2}
                              value={personalNoteInput}
                              onChange={(e) => setPersonalNoteInput(e.target.value)}
                              placeholder="Örn: Bu ceketi ilk kez sonbahar tatilimde giydim, rüzgarı hiç geçirmedi..."
                              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] text-stone-800"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800"
                              >
                                İptal
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveNote(item.id)}
                                className="px-3 py-1 bg-[#9E4424] text-white rounded-lg text-xs font-bold hover:bg-[#85361A] flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Kaydet</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2 group/note">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">
                                Sizin Eklediğiniz Hatıra:
                              </span>
                              {item.buyerPersonalNote ? (
                                <p className="text-xs text-stone-700 italic mt-0.5">
                                  "{item.buyerPersonalNote}"
                                </p>
                              ) : (
                                <p className="text-[11px] text-stone-400 italic mt-0.5">
                                  Henüz bir kişisel not eklenmedi. Eşyayla yaşadığınız bir anıyı buraya kaydedin.
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              className="p-1 text-stone-400 hover:text-[#9E4424] rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Hatıra Notunu Düzenle"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM PHILOSOPHY FOOTER */}
        <div className="bg-[#FAF5ED] px-5 sm:px-8 py-3 border-t border-[#E8DEC8] flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-1.5 text-stone-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px]">
              EldeVar Hatıra Kutusu: İkinci el eşyaların hafızasını yaşatan dijital emanet sandığı.
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#2A231F] hover:bg-[#9E4424] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Kutuyu Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
