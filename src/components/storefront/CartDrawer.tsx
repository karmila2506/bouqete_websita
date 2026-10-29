import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'HASFARM10' || promoCode.trim().toUpperCase() === 'FIRSTORDER') {
      setDiscountPercent(10);
      setPromoMessage('Promo 10% diskon berhasil dipasang!');
    } else {
      setPromoMessage('Kode promo tidak valid (Gunakan: HASFARM10)');
    }
  };

  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalSubtotal = cartTotal - discountAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF6F2] h-full flex flex-col shadow-2xl border-l border-[#EADCCF]">
        {/* Drawer Header */}
        <div className="p-5 bg-[#7B351B] text-[#FFF8F2] flex items-center justify-between border-b border-[#692C15]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E8A882]" />
            <h3 className="font-serif-display text-xl font-bold tracking-tight">
              Keranjang Belanja ({cartCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery banner */}
        <div className="bg-[#662812] text-[#E8C5B0] text-xs px-5 py-2 flex items-center justify-between">
          <span>✨ Pengiriman Cepat & Kemasan Khusus Florist</span>
          <span className="font-mono text-white text-[11px]">Same Day Available</span>
        </div>

        {/* Cart Item List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#EFE3D5] flex items-center justify-center mx-auto text-[#8C3E1E] mb-4">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="font-serif-display text-lg font-bold text-[#4A1F10]">Keranjang Masih Kosong</p>
              <p className="text-xs text-[#784E3D] mt-1 max-w-xs mx-auto">
                Silakan pilih rangkaian bunga favorit Anda dari katalog untuk memulai pemesanan.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#7B351B] text-white text-xs font-semibold hover:bg-[#602712]"
              >
                Mulai Berbelanja
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-4 rounded-2xl bg-white border border-[#EBDCCF] shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F5ECE4] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold font-serif-display text-[#3E180A] line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#7A4B38] mt-0.5">
                      Wrapping: <span className="font-medium text-[#4A1F10]">{item.customization.wrappingColor}</span>
                    </p>
                    <p className="text-[11px] text-[#7A4B38]">
                      Pita: <span className="font-medium text-[#4A1F10]">{item.customization.ribbonColor}</span>
                    </p>

                    {item.customization.cardMessage.message && (
                      <p className="text-[11px] text-[#8C3E1E] italic mt-1 line-clamp-1">
                        💌 To: {item.customization.cardMessage.to || 'Spesial'} &quot;{item.customization.cardMessage.message}&quot;
                      </p>
                    )}

                    {item.customization.addOns.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.customization.addOns.map((addon) => (
                          <span
                            key={addon.id}
                            className="text-[10px] bg-[#FAF2EB] text-[#78402A] px-1.5 py-0.5 rounded border border-[#EADCCF]"
                          >
                            +{addon.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-1 text-[#A87965] hover:text-red-600 transition-colors"
                    aria-label="Hapus Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F5ECE4]">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#DAC4AF] rounded-lg overflow-hidden bg-[#FAF6F2]">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1.5 hover:bg-[#EADCCF] text-[#552310] transition-colors"
                      aria-label="Kurang"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-mono text-xs font-bold text-[#3E180A] tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1.5 hover:bg-[#EADCCF] text-[#552310] transition-colors"
                      aria-label="Tambah"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono tabular-nums text-sm font-bold text-[#3E180A]">
                    {formatRupiah(item.itemTotal)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#EBDCCF] space-y-4">
            {/* Promo Code Input */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#8C3E1E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Kode Promo (e.g. HASFARM10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#DAC4AF] uppercase focus:outline-none focus:border-[#7B351B]"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 bg-[#F2E8DC] hover:bg-[#E7D7C5] text-[#552918] text-xs font-semibold rounded-lg transition-colors"
                >
                  Gunakan
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] ${discountPercent > 0 ? 'text-emerald-700 font-medium' : 'text-amber-700'}`}>
                  {promoMessage}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#5D3727] pt-2 border-t border-[#F5ECE4]">
              <div className="flex justify-between">
                <span>Subtotal Rangkaian Bunga</span>
                <span className="font-mono tabular-nums text-[#3E180A] font-medium">{formatRupiah(cartTotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon Promo ({discountPercent}%)</span>
                  <span className="font-mono tabular-nums font-semibold">-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimasi Biaya Kurir Instan</span>
                <span className="font-mono tabular-nums text-[#3E180A]">Dihitung di checkout</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#3E180A] pt-2 border-t border-[#F5ECE4]">
                <span>Total Belanja</span>
                <span className="font-mono tabular-nums text-lg text-[#7B351B]">{formatRupiah(finalSubtotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Lanjut ke Formulir Pengiriman & Pembayaran</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C5D49]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payment Gateway Terverifikasi Otomatis & Notifikasi WA Real-Time</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
