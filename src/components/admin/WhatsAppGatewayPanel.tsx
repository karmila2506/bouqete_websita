import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import {
  MessageCircle,
  Phone,
  Send,
  ExternalLink,
  CheckCircle2,
  Settings,
  Sparkles,
  Copy,
  Clock,
} from 'lucide-react';

export const WhatsAppGatewayPanel: React.FC = () => {
  const {
    whatsAppLogs,
    adminWhatsAppNumber,
    setAdminWhatsAppNumber,
    orders,
    resendWhatsAppNotification,
    showToast,
  } = useApp();

  const [inputPhone, setInputPhone] = useState(adminWhatsAppNumber);
  const [selectedLogId, setSelectedLogId] = useState<string>(whatsAppLogs[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const activeLog = whatsAppLogs.find((l) => l.id === selectedLogId) || whatsAppLogs[0];

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputPhone.replace(/[^0-9]/g, '');
    if (clean.length < 9) {
      showToast('Nomor Tidak Valid', 'Masukkan nomor WhatsApp admin yang valid.', 'warning');
      return;
    }
    setAdminWhatsAppNumber(clean);
    showToast('Nomor WA Tersimpan', `Nomor WhatsApp admin berhasil diatur ke +${clean}`, 'success');
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Tersalin!', 'Pesan WhatsApp disalin ke clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Settings */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h3 className="font-serif-display text-2xl font-bold text-[#3E180A] flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#25D366]" />
            <span>Sistem Notifikasi Pesanan ke WhatsApp Admin Real-Time</span>
          </h3>
          <p className="text-xs text-[#7A4B38] mt-1">
            Setiap transaksi buket yang terverifikasi otomatis langsung mengirimkan pesan rincian lengkap ke nomor WhatsApp admin toko.
          </p>
        </div>

        {/* Admin Phone Setting Form */}
        <form onSubmit={handleSavePhone} className="flex items-center gap-2">
          <div className="relative">
            <Phone className="w-4 h-4 text-[#8C3E1E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
              placeholder="6281234567890"
              className="pl-9 pr-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#DAC4AF] bg-[#FAF6F2] text-[#3E180A] focus:outline-none focus:border-[#7B351B]"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            Simpan Nomor
          </button>
        </form>
      </div>

      {/* Main Grid: 5 cols Logs list + 7 cols Live Message Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Logs List (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif-display text-lg font-bold text-[#3E180A]">
              Riwayat Notifikasi Terkirim ({whatsAppLogs.length})
            </h4>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              Active Gateway
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {whatsAppLogs.length === 0 ? (
              <p className="text-xs text-[#7A4B38] py-8 text-center">Belum ada riwayat notifikasi WhatsApp.</p>
            ) : (
              whatsAppLogs.map((log) => {
                const isSelected = activeLog?.id === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#25D366] bg-[#F0FDF4] shadow-xs'
                        : 'border-[#EDE1D5] bg-[#FAF6F2] hover:bg-[#F4ECE3]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#7B351B]">
                        #{log.orderNumber}
                      </span>
                      <span className="text-[10px] text-[#8C5D49] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(log.sentAt)}</span>
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#3E180A] mt-1">
                      {log.customerName}
                    </p>
                    <p className="text-[11px] text-[#7A4B38] line-clamp-1 mt-0.5">
                      Penerima: {log.recipientPhone}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 text-[10px]">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Terkirim ke Admin</span>
                      </span>
                      <span className="font-mono text-[#7A4B38]">+{log.adminPhone}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Message Preview & Webhook Direct Dispatch (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeLog ? (
            <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDE1D5]">
                <div>
                  <h4 className="font-serif-display text-lg font-bold text-[#3E180A]">
                    Preview Format WhatsApp Pesanan #{activeLog.orderNumber}
                  </h4>
                  <p className="text-xs text-[#7A4B38]">
                    Format pesan terenkripsi yang diterima WhatsApp admin saat pesanan lunas
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyText(activeLog.messageText)}
                    className="p-2 rounded-lg border border-[#DAC4AF] bg-[#FAF6F2] hover:bg-[#F2E8DC] text-[#552310] transition-colors"
                    title="Salin Teks"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={activeLog.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka di WhatsApp (wa.me)</span>
                  </a>
                </div>
              </div>

              {/* Chat Bubble Interface */}
              <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-[#DDD5C8] font-sans">
                <div className="max-w-lg bg-[#DCF8C6] rounded-xl p-4 shadow-xs text-xs text-[#111B21] space-y-2 whitespace-pre-wrap font-mono leading-relaxed border border-[#C5E8AC]">
                  {activeLog.messageText}
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF6F2] rounded-xl border border-[#EBDCCF] text-xs text-[#7A4B38] flex items-center justify-between">
                <span>Status Pengiriman Gateway:</span>
                <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                  Delivered via WhatsApp API Engine
                </span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#EDE1D5] text-[#7A4B38]">
              Pilih salah satu log pesanan di sebelah kiri untuk melihat pesan WhatsApp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
