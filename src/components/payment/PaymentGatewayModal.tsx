import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { generateWhatsAppMessage, createWhatsAppDirectUrl } from '../../utils/whatsapp';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Loader2,
  Printer,
} from 'lucide-react';

export const PaymentGatewayModal: React.FC = () => {
  const {
    activePaymentModalOrder,
    setActivePaymentModalOrder,
    processPayment,
    adminWhatsAppNumber,
    showToast,
  } = useApp();

  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(899); // ~15 mins
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!activePaymentModalOrder || activePaymentModalOrder.paymentStatus === 'paid') return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [activePaymentModalOrder]);

  if (!activePaymentModalOrder) return null;

  const isPaid = activePaymentModalOrder.paymentStatus === 'paid';

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      processPayment(activePaymentModalOrder.id, activePaymentModalOrder.paymentMethod);
      setIsVerifying(false);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Tersalin!', 'Nomor pembayaran telah disalin ke clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const waMessage = generateWhatsAppMessage(activePaymentModalOrder);
  const waUrl = createWhatsAppDirectUrl(adminWhatsAppNumber, waMessage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF6F2] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#EADCCF] flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#7B351B] text-white flex items-center justify-between border-b border-[#692C15]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E8A882]" />
            <div>
              <h3 className="font-serif-display text-lg font-bold tracking-tight">
                Hasfarm Instant Payment Gateway
              </h3>
              <p className="text-[11px] text-[#E8C5B0]">Verifikasi Otomatis 256-bit Enkripsi</p>
            </div>
          </div>
          <button
            onClick={() => setActivePaymentModalOrder(null)}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[#3E180A]">
          {/* Order Snapshot & Status */}
          <div className="p-4 rounded-2xl bg-white border border-[#EBDCCF] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C3E1E] tracking-wider block">
                Nomor Pesanan
              </span>
              <span className="font-mono font-bold text-sm text-[#3E180A]">
                #{activePaymentModalOrder.orderNumber}
              </span>
              <p className="text-[11px] text-[#7A4B38] mt-0.5">
                {activePaymentModalOrder.items.length} Rangkaian Bunga · {activePaymentModalOrder.recipient.name}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#8C3E1E] tracking-wider block">
                Total Tagihan
              </span>
              <span className="font-mono font-bold text-lg text-[#7B351B] tabular-nums">
                {formatRupiah(activePaymentModalOrder.totalAmount)}
              </span>
            </div>
          </div>

          {/* Conditional: Paid Success vs Pending Payment */}
          {isPaid ? (
            /* PAID SUCCESS STATE */
            <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-serif-display text-2xl font-bold text-emerald-950">
                  Pembayaran Berhasil Terverifikasi!
                </h4>
                <p className="text-xs text-emerald-800 mt-1 max-w-sm mx-auto">
                  Sistem gateway telah memvalidasi dana secara otomatis pada{' '}
                  <span className="font-mono font-bold">{formatDate(activePaymentModalOrder.paidAt || activePaymentModalOrder.createdAt)}</span>.
                </p>
              </div>

              {/* Stock auto deduction notice */}
              <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-left text-xs text-emerald-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Stok Otomatis Dipotong Real-Time:</span>
                </p>
                <p className="text-[11px] text-emerald-700">
                  Komponen bahan baku bunga & packaging untuk pesanan ini telah otomatis dipotong dari inventaris Hasfarm.
                </p>
              </div>

              {/* WhatsApp Notification Dispatch Status */}
              <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-left text-xs text-emerald-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-800">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Notifikasi WhatsApp Admin Terkirim</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                    SENT
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Rincian pesanan telah diteruskan ke nomor admin (
                  <span className="font-mono font-semibold">+{adminWhatsAppNumber}</span>).
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white font-semibold rounded-lg text-xs hover:bg-[#20BD5A] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Chat di WhatsApp (wa.me)</span>
                </a>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl border border-[#DAC4AF] bg-white text-xs font-semibold text-[#552918] hover:bg-[#FAF4EE] flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Faktur</span>
                </button>
                <button
                  onClick={() => setActivePaymentModalOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#7B351B] text-white text-xs font-semibold hover:bg-[#5E2611]"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            /* PENDING PAYMENT STATE */
            <div className="space-y-5">
              {/* Expiry Timer Countdown */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF6EF] border border-[#FAD7C0] text-xs">
                <div className="flex items-center gap-2 text-[#8C3E1E]">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="font-medium">Selesaikan pembayaran dalam:</span>
                </div>
                <span className="font-mono text-sm font-bold text-[#7B351B] tabular-nums">
                  {formatCountdown(secondsRemaining)}
                </span>
              </div>

              {/* Payment Details based on Method */}
              {activePaymentModalOrder.paymentMethod === 'qris' ? (
                /* QRIS INTERFACE */
                <div className="text-center p-5 bg-white rounded-2xl border border-[#EBDCCF] space-y-4">
                  <div className="inline-block p-1 bg-red-600 text-white text-[10px] font-black tracking-widest rounded px-2 mb-1">
                    QRIS
                  </div>
                  <h4 className="font-serif-display text-lg font-bold text-[#3E180A]">
                    Scan QRIS dengan Bank / E-Wallet Anda
                  </h4>
                  <p className="text-xs text-[#7A4B38]">
                    Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay & LinkAja
                  </p>

                  {/* QRIS SVG Visual */}
                  <div className="relative mx-auto w-52 h-52 p-3 bg-white rounded-xl border-2 border-black/15 shadow-sm flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                      {/* Stylized QR Code matrix representation */}
                      <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="4" y="4" width="22" height="22" fill="white" />
                      <rect x="8" y="8" width="14" height="14" fill="currentColor" />

                      <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                      <rect x="74" y="4" width="22" height="22" fill="white" />
                      <rect x="78" y="8" width="14" height="14" fill="currentColor" />

                      <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                      <rect x="4" y="74" width="22" height="22" fill="white" />
                      <rect x="8" y="78" width="14" height="14" fill="currentColor" />

                      <rect x="40" y="10" width="8" height="8" fill="currentColor" />
                      <rect x="52" y="10" width="8" height="8" fill="currentColor" />
                      <rect x="36" y="24" width="6" height="6" fill="currentColor" />
                      <rect x="48" y="24" width="10" height="6" fill="currentColor" />
                      <rect x="10" y="40" width="8" height="12" fill="currentColor" />
                      <rect x="24" y="44" width="8" height="6" fill="currentColor" />
                      <rect x="38" y="38" width="24" height="24" fill="#7B351B" />
                      <rect x="42" y="42" width="16" height="16" fill="white" />
                      <text x="50" y="52" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#7B351B">
                        HASFARM
                      </text>
                      <rect x="68" y="40" width="10" height="8" fill="currentColor" />
                      <rect x="84" y="40" width="6" height="12" fill="currentColor" />
                      <rect x="38" y="70" width="12" height="12" fill="currentColor" />
                      <rect x="56" y="74" width="14" height="6" fill="currentColor" />
                      <rect x="74" y="74" width="20" height="10" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="text-[11px] text-[#7A4B38] space-y-0.5">
                    <p className="font-semibold text-[#4A1F10]">NMID: ID1020261028941</p>
                    <p>Merchant: HASFARM FLORIST ATELIER</p>
                  </div>

                  {/* Simulator Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isVerifying}
                      className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA59] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Memverifikasi Pembayaran Otomatis...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Simulasi Bayar QRIS (Customer Scan & Bayar)</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-[#8C5D49] mt-1.5">
                      Klik tombol simulasi di atas untuk menguji proses verifikasi otomatis payment gateway dan auto-deduct stok.
                    </p>
                  </div>
                </div>
              ) : (
                /* VIRTUAL ACCOUNT / OTHER METHOD INTERFACE */
                <div className="p-5 bg-white rounded-2xl border border-[#EBDCCF] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#7A4B38]">
                        Metode: {activePaymentModalOrder.paymentMethod.toUpperCase().replace('_', ' ')}
                      </p>
                      <p className="font-bold text-sm text-[#4A1F10]">Nomor Virtual Account</p>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold">
                      Online 24 Jam
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F6EFE8] border border-[#E3D3C3]">
                    <span className="font-mono text-lg font-bold text-[#3E180A] tracking-wider">
                      {activePaymentModalOrder.paymentReference}
                    </span>
                    <button
                      onClick={() => copyToClipboard(activePaymentModalOrder.paymentReference)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF4EE] border border-[#DAC4AF] text-xs font-semibold rounded-lg text-[#552310] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>

                  <div className="text-xs text-[#7A4B38] space-y-1.5">
                    <p className="font-semibold text-[#4A1F10]">Cara Pembayaran:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                      <li>Buka aplikasi Mobile Banking atau ATM bank Anda.</li>
                      <li>Pilih menu <strong>Transfer / Bayar</strong> &rarr; <strong>Virtual Account</strong>.</li>
                      <li>Masukkan kode VA di atas dan periksa nama penerima: <strong>Hasfarm Florist</strong>.</li>
                      <li>Total pembayaran akan otomatis terverifikasi tanpa perlu upload bukti transfer.</li>
                    </ol>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isVerifying}
                      className="w-full py-3 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menunggu Callback Webhook Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-[#E8A882]" />
                          <span>Simulasi Transfer Berhasil (Instant Webhook)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
