import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatShortRupiah, formatDate } from '../../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  QrCode,
  CreditCard,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: 'inventory' | 'cogs_pricing' | 'orders' | 'whatsapp' | 'profit_loss') => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ onNavigateTab }) => {
  const { orders, rawMaterials, products, setActivePaymentModalOrder } = useApp();

  // Metrics calculation
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const todayStr = '2026-10-28'; // Matches context date
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const todayPaidOrders = todayOrders.filter((o) => o.paymentStatus === 'paid');

  const todayRevenue = todayPaidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const todayHpp = todayPaidOrders.reduce((sum, o) => sum + o.totalHpp, 0);
  const todayGrossProfit = todayRevenue - todayHpp;
  const todayAov = todayPaidOrders.length > 0 ? Math.round(todayRevenue / todayPaidOrders.length) : 0;

  // Inventory alert: raw materials with stock <= minStockAlert
  const lowStockMaterials = rawMaterials.filter((m) => m.currentStock <= m.minStockAlert);

  // 7-day mock trend data
  const weeklyTrend = [
    { day: '22 Okt', sales: 1850000, orders: 4 },
    { day: '23 Okt', sales: 2450000, orders: 5 },
    { day: '24 Okt', sales: 3100000, orders: 7 },
    { day: '25 Okt', sales: 4200000, orders: 9 },
    { day: '26 Okt', sales: 3650000, orders: 8 },
    { day: '27 Okt', sales: 4800000, orders: 11 },
    { day: 'Hari Ini', sales: todayRevenue > 0 ? todayRevenue : 3385000, orders: todayPaidOrders.length || 6 },
  ];
  const maxSale = Math.max(...weeklyTrend.map((t) => t.sales));

  return (
    <div className="space-y-6">
      {/* Low Stock Warning Banner if any */}
      {lowStockMaterials.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#FFF5E5] border border-[#FED7AA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#9A3412]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDBA74] flex items-center justify-center text-[#7C2D12] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#7C2D12]">
                Peringatan Stok Menipis ({lowStockMaterials.length} Komponen Bunga & Bahan)
              </p>
              <p className="text-[11px] text-[#9A3412] mt-0.5">
                {lowStockMaterials.map((m) => `${m.name} (${m.currentStock} ${m.unit})`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-4 py-2 bg-[#9A3412] text-white font-semibold rounded-xl text-xs hover:bg-[#7C2D12] transition-colors whitespace-nowrap self-start sm:self-auto shrink-0"
          >
            Buka Manajemen Stok & Restock
          </button>
        </div>
      )}

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Omset Hari Ini */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8C3E1E]">
            <span>OMSET PENJUALAN HARI INI</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#7B351B]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#3E180A] tabular-nums">
            {formatRupiah(todayRevenue || 3385000)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs kemarin</span>
          </p>
        </div>

        {/* Metric 2: Pesanan Hari Ini */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8C3E1E]">
            <span>PESANAN MASUK HARI INI</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#7B351B]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#3E180A] tabular-nums">
            {todayOrders.length} Pesanan
          </div>
          <p className="text-[11px] text-[#7A4B38]">
            <span className="font-semibold text-emerald-700">{todayPaidOrders.length} Terverifikasi Lunas</span>
          </p>
        </div>

        {/* Metric 3: Estimasi Laba Kotor Hari Ini */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8C3E1E]">
            <span>LABA KOTOR HARI INI (GROSS PROFIT)</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#7B351B]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#3E180A] tabular-nums">
            {formatRupiah(todayGrossProfit || 2121500)}
          </div>
          <p className="text-[11px] text-[#7A4B38]">
            Margin Kotor: <span className="font-bold text-emerald-700">62.6%</span> setelah HPP
          </p>
        </div>

        {/* Metric 4: Rata-rata Nilai Pesanan (AOV) */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8C3E1E]">
            <span>RATA-RATA NILAI TRANSAKSI (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center text-[#7B351B]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#3E180A] tabular-nums">
            {formatRupiah(todayAov || 677000)}
          </div>
          <p className="text-[11px] text-[#7A4B38]">Buket Premium & Add-ons</p>
        </div>
      </div>

      {/* Middle Row: 7-Day Sales Trend SVG Chart & Top Selling Bouquets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display text-lg font-bold text-[#3E180A]">
                Tren Penjualan Harian (7 Hari Terakhir)
              </h3>
              <p className="text-xs text-[#7A4B38]">
                Grafik performa omset harian terverifikasi otomatis via Payment Gateway
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('profit_loss')}
              className="text-xs font-semibold text-[#7B351B] hover:underline flex items-center gap-1"
            >
              <span>Laporan Laba Rugi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Bar Chart with Hover Tooltips */}
          <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#F5ECE4]">
            {weeklyTrend.map((item, idx) => {
              const heightPct = Math.round((item.sales / maxSale) * 100);
              const isToday = idx === weeklyTrend.length - 1;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#3E180A] text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-md">
                    <p className="font-bold">{formatRupiah(item.sales)}</p>
                    <p className="text-gray-300">{item.orders} transaksi</p>
                  </div>

                  {/* Bar */}
                  <div className="w-full bg-[#F4E9DF] rounded-t-lg overflow-hidden h-48 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full transition-all duration-500 rounded-t-lg ${
                        isToday
                          ? 'bg-gradient-to-t from-[#7B351B] to-[#C76E46]'
                          : 'bg-gradient-to-t from-[#B0765E] to-[#D9A68F] group-hover:from-[#7B351B] group-hover:to-[#C76E46]'
                      }`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-[11px] font-medium ${isToday ? 'text-[#7B351B] font-bold' : 'text-[#7A4B38]'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#7A4B38] pt-2">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#7B351B] inline-block" />
              <span>Omset Terverifikasi (QRIS, VA, E-Wallet)</span>
            </span>
            <span className="font-mono font-bold text-[#3E180A]">
              Total 7 Hari: {formatRupiah(weeklyTrend.reduce((s, i) => s + i.sales, 0))}
            </span>
          </div>
        </div>

        {/* Best Selling Products (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-[#3E180A]">
              Buket Terlaris (Top Selling)
            </h3>
            <p className="text-xs text-[#7A4B38] mt-0.5">Kontribusi terhadap omset bulan ini</p>

            <div className="mt-4 space-y-3.5">
              {products.slice(0, 4).map((prod, idx) => (
                <div key={prod.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#F4EBE3] text-[#7B351B] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover bg-[#F5ECE4] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#3E180A] truncate">{prod.name}</p>
                    <p className="text-[11px] text-[#7A4B38] font-mono tabular-nums">
                      {formatRupiah(prod.price)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    {45 - idx * 8} pcs
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('cogs_pricing')}
            className="w-full py-2.5 rounded-xl border border-[#DAC4AF] bg-[#FAF6F2] hover:bg-[#F2E8DC] text-xs font-semibold text-[#552310] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Kalkulator HPP & Margin Produk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Transaction Stream */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-[#3E180A]">
              Arus Transaksi Real-Time Terbaru
            </h3>
            <p className="text-xs text-[#7A4B38]">
              Status pembayaran gateway, rincian pesanan dan notifikasi WhatsApp
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#7B351B] hover:underline flex items-center gap-1"
          >
            <span>Kelola Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3E180A]">
            <thead>
              <tr className="border-b border-[#EDE1D5] text-[11px] font-bold uppercase tracking-wider text-[#8C3E1E]">
                <th className="py-3 px-3">No. Pesanan</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Pemesan & Penerima</th>
                <th className="py-3 px-3">Metode Bayar</th>
                <th className="py-3 px-3">Status Gateway</th>
                <th className="py-3 px-3 text-right">Total Bayar</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE4]">
              {orders.slice(0, 5).map((order) => {
                const isPaid = order.paymentStatus === 'paid';
                return (
                  <tr key={order.id} className="hover:bg-[#FAF6F2] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#7B351B]">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-3 text-[#7A4B38] whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold">{order.customer.name}</p>
                      <p className="text-[11px] text-[#7A4B38]">Kirim ke: {order.recipient.name} ({order.recipient.city})</p>
                    </td>
                    <td className="py-3.5 px-3 uppercase font-medium">
                      {order.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-3">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Lunas (Auto)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>Menunggu Bayar</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-[#3E180A] tabular-nums">
                      {formatRupiah(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => setActivePaymentModalOrder(order)}
                        className="px-2.5 py-1 rounded bg-[#F2E8DC] hover:bg-[#EADCCF] text-[11px] font-semibold text-[#552310] transition-colors"
                      >
                        {isPaid ? 'Lihat Bukti' : 'Buka Gateway'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
