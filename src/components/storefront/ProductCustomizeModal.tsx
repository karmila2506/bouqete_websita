import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { WRAPPING_OPTIONS, RIBBON_OPTIONS, AVAILABLE_ADDONS } from '../../data/mockData';
import { X, Check, Plus, Minus, Heart, Calendar, Clock, Sparkles } from 'lucide-react';

export const ProductCustomizeModal: React.FC = () => {
  const { activeCustomizeProduct, setActiveCustomizeProduct, addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedWrapping, setSelectedWrapping] = useState(WRAPPING_OPTIONS[0].name);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBON_OPTIONS[0].name);
  const [cardTo, setCardTo] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [cardFrom, setCardFrom] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number }[]>([]);

  if (!activeCustomizeProduct) return null;

  const toggleAddon = (addon: { id: string; name: string; price: number }) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = activeCustomizeProduct.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(activeCustomizeProduct, quantity, {
      wrappingColor: selectedWrapping,
      ribbonColor: selectedRibbon,
      cardMessage: {
        to: cardTo,
        message: cardMessage,
        from: cardFrom,
      },
      addOns: selectedAddons,
    });
    setActiveCustomizeProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF6F2] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EADCCF] flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#7B351B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E8A882]" />
            <h3 className="font-serif-display text-xl font-bold tracking-tight">
              Kustomisasi Buket & Kartu Ucapan
            </h3>
          </div>
          <button
            onClick={() => setActiveCustomizeProduct(null)}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#3E180A]">
          {/* Product Snapshot */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#EBDCCF]">
            <img
              src={activeCustomizeProduct.image}
              alt={activeCustomizeProduct.name}
              className="w-24 h-24 object-cover rounded-xl bg-[#F4EBE3] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#8C3E1E] tracking-wider">
                {activeCustomizeProduct.category.replace('_', ' ')}
              </span>
              <h4 className="font-serif-display text-xl font-bold text-[#3B190D] truncate">
                {activeCustomizeProduct.name}
              </h4>
              <p className="text-xs text-[#784E3D] mt-1 line-clamp-2">
                {activeCustomizeProduct.description}
              </p>
              <p className="text-sm font-mono font-bold text-[#8C3E1E] mt-2 tabular-nums">
                {formatRupiah(activeCustomizeProduct.price)} / buket
              </p>
            </div>
          </div>

          {/* 1. Wrapping Paper Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A3F29] block mb-2.5">
              1. Pilih Warna Wrapping Paper (Kertas Pembungkus)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {WRAPPING_OPTIONS.map((wrap) => {
                const isSelected = selectedWrapping === wrap.name;
                return (
                  <button
                    key={wrap.id}
                    onClick={() => setSelectedWrapping(wrap.name)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'border-[#7B351B] bg-white ring-2 ring-[#7B351B]/20 shadow-sm font-semibold'
                        : 'border-[#EADCCF] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: wrap.hex }}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white drop-shadow" />}
                    </span>
                    <span className="truncate">{wrap.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Ribbon Color */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A3F29] block mb-2.5">
              2. Pilih Warna Pita Satin (Ribbon)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {RIBBON_OPTIONS.map((ribbon) => {
                const isSelected = selectedRibbon === ribbon.name;
                return (
                  <button
                    key={ribbon.id}
                    onClick={() => setSelectedRibbon(ribbon.name)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'border-[#7B351B] bg-white ring-2 ring-[#7B351B]/20 shadow-sm font-semibold'
                        : 'border-[#EADCCF] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: ribbon.hex }}
                    />
                    <span className="truncate">{ribbon.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Greeting Card Personalization */}
          <div className="p-4 rounded-2xl bg-white border border-[#EBDCCF] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A3F29] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#8C3E1E]" />
                <span>3. Kartu Ucapan Eksklusif (Free Letterpress)</span>
              </label>
              <span className="text-[11px] text-[#A68879]">Opsional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-[#784E3D] font-medium block mb-1">Kepada (To):</span>
                <input
                  type="text"
                  placeholder="Contoh: Clarissa Sayang"
                  value={cardTo}
                  onChange={(e) => setCardTo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#784E3D] font-medium block mb-1">Dari (From):</span>
                <input
                  type="text"
                  placeholder="Contoh: Aditya"
                  value={cardFrom}
                  onChange={(e) => setCardFrom(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[#784E3D] font-medium block mb-1">Isi Pesan Ucapan:</span>
              <textarea
                rows={3}
                placeholder="Tuliskan ucapan penuh makna untuk si penerima buket..."
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B] resize-none"
              />
            </div>
          </div>

          {/* 4. Luxury Add-ons */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A3F29] block mb-2.5">
              4. Tambahkan Hadiah Tambahan (Add-ons)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_ADDONS.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#7B351B] bg-[#FFF8F2] ring-1 ring-[#7B351B]'
                        : 'border-[#EADCCF] bg-white hover:bg-[#FAF4EE]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-[#7B351B] border-[#7B351B] text-white' : 'border-[#C8B3A0]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate font-medium">{addon.name}</span>
                    </div>
                    <span className="font-mono text-[#8C3E1E] font-semibold tabular-nums whitespace-nowrap">
                      +{formatRupiah(addon.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer with Stepper & Add to Cart */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#EBDCCF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-[#DAC4AF] rounded-xl overflow-hidden bg-[#FAF6F2]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-[#EADCCF] text-[#552310] transition-colors"
                aria-label="Kurangi Jumlah"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 font-mono font-bold text-sm text-[#3E180A] tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 hover:bg-[#EADCCF] text-[#552310] transition-colors"
                aria-label="Tambah Jumlah"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C3E1E] tracking-wider block">
                Total Estimasi
              </span>
              <span className="font-mono tabular-nums text-xl font-bold text-[#3E180A]">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setActiveCustomizeProduct(null)}
              className="px-4 py-3 rounded-xl border border-[#DAC4AF] text-xs font-semibold text-[#663A28] hover:bg-[#FAF6F2] transition-colors w-1/3 sm:w-auto text-center"
            >
              Batal
            </button>
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold shadow-lg transition-all flex-1 sm:flex-none text-center"
            >
              Masukkan ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
