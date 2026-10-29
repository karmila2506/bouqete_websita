import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { PaymentMethod } from '../../types';
import { X, ShieldCheck, QrCode, Building2, Wallet, Calendar, Clock, MapPin, User, Phone, Mail, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, createOrder } = useApp();

  // Customer Form
  const [customerName, setCustomerName] = useState('Nadia Salsabila');
  const [customerPhone, setCustomerPhone] = useState('081288991234');
  const [customerEmail, setCustomerEmail] = useState('nadia.salsabila@gmail.com');

  // Recipient Form
  const [recipientName, setRecipientName] = useState('dr. Farhan Malik');
  const [recipientPhone, setRecipientPhone] = useState('081122334455');
  const [recipientAddress, setRecipientAddress] = useState('Jl. Senopati No. 42, Kebayoran Baru');
  const [recipientCity, setRecipientCity] = useState('Jakarta Selatan');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [specialNotes, setSpecialNotes] = useState('Bunga kejutan untuk ulang tahun. Harap jangan sebutkan isi paket sebelum diserahkan.');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');

  if (!isOpen || cart.length === 0) return null;

  const shippingFee = 25000;
  const discount = 0;
  const grandTotal = cartTotal + shippingFee - discount;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !recipientName || !recipientAddress) {
      alert('Mohon lengkapi data pemesan dan alamat pengiriman');
      return;
    }

    createOrder({
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      },
      recipient: {
        name: recipientName,
        phone: recipientPhone,
        address: recipientAddress,
        city: recipientCity,
        deliveryDate,
        deliverySlot,
        specialNotes,
      },
      items: cart,
      subtotal: cartTotal,
      shippingFee,
      discount,
      totalAmount: grandTotal,
      paymentMethod,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF6F2] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#EADCCF] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#7B351B] text-white flex items-center justify-between border-b border-[#692C15]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E8A882]" />
            <h3 className="font-serif-display text-xl font-bold tracking-tight">
              Checkout & Pengiriman Bunga
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto flex-1 space-y-6 text-[#3E180A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Customer & Recipient Address */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1. Customer Information */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBDCCF] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B351B] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>1. Data Pemesan (Untuk Notifikasi WA & Invoice)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">Nama Lengkap:</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">No. WhatsApp Pemesan:</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">Email Pemesan:</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                  />
                </div>
              </div>

              {/* 2. Recipient & Delivery */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBDCCF] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B351B] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>2. Tujuan & Jadwal Pengiriman Buket</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">Nama Penerima:</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">No. Telepon Penerima:</label>
                    <input
                      type="tel"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">Alamat Lengkap Pengiriman:</label>
                  <textarea
                    rows={2}
                    required
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah/kantor, patokan..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">Kota / Wilayah:</label>
                    <select
                      value={recipientCity}
                      onChange={(e) => setRecipientCity(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                    >
                      <option value="Jakarta Selatan">Jakarta Selatan</option>
                      <option value="Jakarta Pusat">Jakarta Pusat</option>
                      <option value="Jakarta Barat">Jakarta Barat</option>
                      <option value="Jakarta Timur">Jakarta Timur</option>
                      <option value="Jakarta Utara">Jakarta Utara</option>
                      <option value="Tangerang Selatan">Tangerang Selatan</option>
                      <option value="Depok">Depok</option>
                      <option value="Bekasi">Bekasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">Tanggal Antar:</label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">Slot Waktu:</label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value as any)}
                      className="w-full px-2 py-2 text-xs rounded-lg border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                    >
                      <option value="morning">Pagi (09:00 - 12:00)</option>
                      <option value="afternoon">Siang (13:00 - 16:00)</option>
                      <option value="evening">Sore (17:00 - 20:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#7A4B38] block mb-1">Instruksi Khusus Kurir (Opsional):</label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Contoh: Titipkan di resepsionis / bel pintu 2x"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DAC4AF] focus:outline-none focus:border-[#7B351B]"
                  />
                </div>
              </div>
            </div>

            {/* Right 5 cols: Payment Method & Order Summary */}
            <div className="lg:col-span-5 space-y-5">
              {/* Payment Gateway Options */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBDCCF] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B351B] flex items-center justify-between">
                  <span>3. Metode Payment Gateway</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    Auto-Verified
                  </span>
                </h4>

                <div className="space-y-2">
                  {/* QRIS */}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-[#7B351B] bg-[#FFF8F2] ring-1 ring-[#7B351B]'
                        : 'border-[#EADCCF] hover:bg-[#FAF4EE]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qris"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="text-[#7B351B]"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#F2E4D8] flex items-center justify-center text-[#7B351B] shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#3E180A]">QRIS Dinamis (Semua E-Wallet / Mobile Bank)</p>
                      <p className="text-[11px] text-[#7A4B38]">BCA, Mandiri, BRI, GoPay, OVO, ShopeePay</p>
                    </div>
                  </label>

                  {/* Virtual Account BCA */}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'va_bca'
                        ? 'border-[#7B351B] bg-[#FFF8F2] ring-1 ring-[#7B351B]'
                        : 'border-[#EADCCF] hover:bg-[#FAF4EE]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="va_bca"
                      checked={paymentMethod === 'va_bca'}
                      onChange={() => setPaymentMethod('va_bca')}
                      className="text-[#7B351B]"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#E1EDF7] flex items-center justify-center text-[#0060AF] font-bold text-xs shrink-0">
                      BCA
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#3E180A]">BCA Virtual Account</p>
                      <p className="text-[11px] text-[#7A4B38]">Verifikasi otomatis 24 jam</p>
                    </div>
                  </label>

                  {/* Virtual Account Mandiri */}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'va_mandiri'
                        ? 'border-[#7B351B] bg-[#FFF8F2] ring-1 ring-[#7B351B]'
                        : 'border-[#EADCCF] hover:bg-[#FAF4EE]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="va_mandiri"
                      checked={paymentMethod === 'va_mandiri'}
                      onChange={() => setPaymentMethod('va_mandiri')}
                      className="text-[#7B351B]"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#F7F2DF] flex items-center justify-center text-[#B27D00] font-bold text-xs shrink-0">
                      MDR
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#3E180A]">Mandiri Virtual Account</p>
                      <p className="text-[11px] text-[#7A4B38]">Livin by Mandiri & ATM</p>
                    </div>
                  </label>

                  {/* GoPay */}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'gopay'
                        ? 'border-[#7B351B] bg-[#FFF8F2] ring-1 ring-[#7B351B]'
                        : 'border-[#EADCCF] hover:bg-[#FAF4EE]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gopay"
                      checked={paymentMethod === 'gopay'}
                      onChange={() => setPaymentMethod('gopay')}
                      className="text-[#7B351B]"
                    />
                    <div className="w-8 h-8 rounded-lg bg-[#E0F3EA] flex items-center justify-center text-[#008A44] font-bold text-xs shrink-0">
                      GP
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#3E180A]">GoPay / GoPay Later</p>
                      <p className="text-[11px] text-[#7A4B38]">Direct app authorization</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBDCCF] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B351B]">
                  Ringkasan Transaksi
                </h4>
                <div className="space-y-1.5 text-xs text-[#5D3727]">
                  <div className="flex justify-between">
                    <span>Subtotal Buket ({cart.length} item)</span>
                    <span className="font-mono tabular-nums text-[#3E180A] font-medium">{formatRupiah(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim Same Day</span>
                    <span className="font-mono tabular-nums text-[#3E180A] font-medium">{formatRupiah(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#3E180A] pt-2 border-t border-[#F5ECE4]">
                    <span>Total Pembayaran</span>
                    <span className="font-mono tabular-nums text-lg text-[#7B351B]">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2 group mt-3"
                >
                  <span>Bayar Sekarang via Payment Gateway</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
