import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MessageCircle,
  ExternalLink,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    resendWhatsAppNotification,
    setActivePaymentModalOrder,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.orderStatus === statusFilter;
  });

  const getStatusBadge = (order: Order) => {
    if (order.paymentStatus !== 'paid') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
          <Clock className="w-3 h-3" />
          <span>Menunggu Bayar</span>
        </span>
      );
    }

    switch (order.orderStatus) {
      case 'crafting':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
            <Package className="w-3 h-3" />
            <span>Sedang Dirangkai</span>
          </span>
        );
      case 'delivering':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
            <Truck className="w-3 h-3" />
            <span>Dalam Pengiriman</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai Diterima</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Lunas</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Filter Tabs */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-2xl font-bold text-[#3E180A]">
            Kelola Pesanan & Status Pengiriman
          </h3>
          <p className="text-xs text-[#7A4B38] mt-1">
            Pantau status pesanan, verifikasi gateway, proses perakitan buket, dan pengiriman kurir.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Semua Pesanan' },
            { id: 'unpaid', label: 'Belum Lunas' },
            { id: 'crafting', label: 'Dirangkai' },
            { id: 'delivering', label: 'Dikirim' },
            { id: 'completed', label: 'Selesai' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#7B351B] text-white shadow-xs'
                  : 'bg-[#FAF6F2] text-[#552310] border border-[#E0D0BF] hover:bg-[#F2E8DC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#EDE1D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3E180A]">
            <thead>
              <tr className="border-b border-[#EDE1D5] bg-[#FAF6F2] text-[11px] font-bold uppercase tracking-wider text-[#8C3E1E]">
                <th className="py-3.5 px-4">No. Pesanan</th>
                <th className="py-3.5 px-4">Waktu Buat</th>
                <th className="py-3.5 px-4">Pemesan</th>
                <th className="py-3.5 px-4">Penerima & Jadwal</th>
                <th className="py-3.5 px-4 text-center">Status Transaksi</th>
                <th className="py-3.5 px-4 text-right">Total Bayar</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE4]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A4B38]">
                    Tidak ada pesanan dengan filter status ini.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF6F2] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#7B351B]">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-[#7A4B38] whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#3E180A]">{order.customer.name}</p>
                      <p className="text-[11px] text-[#7A4B38]">{order.customer.phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#3E180A]">{order.recipient.name}</p>
                      <p className="text-[11px] text-[#7A4B38]">
                        {order.recipient.deliveryDate} ({order.recipient.deliverySlot})
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(order)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#3E180A] tabular-nums">
                      {formatRupiah(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setDetailOrder(order)}
                          className="px-2.5 py-1 rounded bg-[#F2E8DC] hover:bg-[#E2D0BE] text-[#552310] font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Detail</span>
                        </button>

                        <button
                          onClick={() => resendWhatsAppNotification(order.id)}
                          className="p-1.5 rounded bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-colors"
                          title="Kirim Pesan WhatsApp ke Admin"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-[#FAF6F2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#EADCCF] flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#7B351B] text-white flex items-center justify-between">
              <h4 className="font-serif-display text-lg font-bold">
                Detail Pesanan #{detailOrder.orderNumber}
              </h4>
              <button
                onClick={() => setDetailOrder(null)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#3E180A]">
              {/* Delivery Status Progression Controls */}
              <div className="p-4 rounded-xl bg-white border border-[#EBDCCF] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B351B] block">
                  Ubah Status Tahapan Pesanan:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['unpaid', 'crafting', 'delivering', 'completed'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateOrderStatus(detailOrder.id, st);
                        setDetailOrder({ ...detailOrder, orderStatus: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        detailOrder.orderStatus === st
                          ? 'bg-[#7B351B] text-white'
                          : 'bg-[#FAF6F2] border border-[#DAC4AF] text-[#552310] hover:bg-[#F2E8DC]'
                      }`}
                    >
                      {st === 'crafting' ? 'Sedang Dirangkai' : st === 'delivering' ? 'Dalam Pengiriman' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Recipient Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-white border border-[#EBDCCF] space-y-1">
                  <p className="font-bold text-[#7B351B] uppercase text-[10px]">Data Pemesan:</p>
                  <p className="font-bold text-sm">{detailOrder.customer.name}</p>
                  <p className="text-[#7A4B38]">{detailOrder.customer.phone}</p>
                  <p className="text-[#7A4B38]">{detailOrder.customer.email}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#EBDCCF] space-y-1">
                  <p className="font-bold text-[#7B351B] uppercase text-[10px]">Tujuan Pengiriman:</p>
                  <p className="font-bold text-sm">{detailOrder.recipient.name} ({detailOrder.recipient.phone})</p>
                  <p className="text-[#7A4B38]">{detailOrder.recipient.address}, {detailOrder.recipient.city}</p>
                  <p className="text-[#7B351B] font-semibold">
                    Jadwal: {detailOrder.recipient.deliveryDate} ({detailOrder.recipient.deliverySlot})
                  </p>
                  {detailOrder.recipient.specialNotes && (
                    <p className="text-[11px] italic text-[#8C5D49]">Note: {detailOrder.recipient.specialNotes}</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 rounded-xl bg-white border border-[#EBDCCF] space-y-3">
                <p className="font-bold text-[#7B351B] uppercase text-[10px]">Daftar Buket & Kustomisasi:</p>
                {detailOrder.items.map((item, idx) => (
                  <div key={idx} className="pb-3 border-b border-[#F5ECE4] last:border-none last:pb-0">
                    <div className="flex justify-between font-bold">
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span className="font-mono">{formatRupiah(item.itemTotal)}</span>
                    </div>
                    <p className="text-[#7A4B38] mt-0.5">
                      Wrapping: <span className="font-medium text-[#4A1F10]">{item.customization.wrappingColor}</span> · Pita: <span className="font-medium text-[#4A1F10]">{item.customization.ribbonColor}</span>
                    </p>
                    {item.customization.cardMessage.message && (
                      <div className="p-2 bg-[#FFF8F2] rounded border border-[#FAD7C0] mt-1.5 text-[11px]">
                        <p className="font-bold text-[#7B351B]">Kartu Ucapan:</p>
                        <p className="italic">&quot;{item.customization.cardMessage.message}&quot;</p>
                        <p className="text-[10px] text-[#A68879]">To: {item.customization.cardMessage.to} | From: {item.customization.cardMessage.from}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="p-4 rounded-xl bg-white border border-[#EBDCCF] space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal Buket</span>
                  <span className="font-mono font-medium">{formatRupiah(detailOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim Same Day</span>
                  <span className="font-mono font-medium">{formatRupiah(detailOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#7B351B] pt-1.5 border-t border-[#F5ECE4]">
                  <span>Total Transaksi</span>
                  <span className="font-mono">{formatRupiah(detailOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[#7A4B38] pt-1">
                  <span>Estimasi Total HPP Bahan:</span>
                  <span className="font-mono">{formatRupiah(detailOrder.totalHpp)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Estimasi Laba Kotor:</span>
                  <span className="font-mono">{formatRupiah(detailOrder.grossProfit)}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActivePaymentModalOrder(detailOrder);
                    setDetailOrder(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#7B351B] text-white font-semibold hover:bg-[#602712] transition-colors"
                >
                  Buka Gateway Pembayaran
                </button>
                <button
                  onClick={() => resendWhatsAppNotification(detailOrder.id)}
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BA59] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Ulang WA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
