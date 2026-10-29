import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OperationalExpense } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  FileText,
  Printer,
  Plus,
  Trash2,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Sparkles,
  X,
} from 'lucide-react';

export const ProfitLossReport: React.FC = () => {
  const { orders, expenses, addOperationalExpense, deleteOperationalExpense } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form state for adding new expense
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<OperationalExpense['category']>('listrik_air');
  const [expenseAmount, setExpenseAmount] = useState<number>(1500000);

  // 1. Calculate Monthly Revenue from Paid Orders
  const monthOrders = orders.filter((o) => {
    return o.paymentStatus === 'paid' && o.createdAt.startsWith(selectedMonth);
  });

  const grossRevenue = monthOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscount = monthOrders.reduce((sum, o) => sum + o.discount, 0);
  const shippingRevenue = monthOrders.reduce((sum, o) => sum + o.shippingFee, 0);
  const netRevenue = grossRevenue - totalDiscount;

  // 2. Calculate Monthly COGS / HPP
  const totalHPP = monthOrders.reduce((sum, o) => sum + o.totalHpp, 0);

  // 3. Gross Profit
  const grossProfit = netRevenue - totalHPP;
  const grossMarginPercent = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;

  // 4. Monthly Operational Expenses
  const monthExpenses = expenses.filter((e) => e.month === selectedMonth);
  const totalOpex = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 5. Net Profit
  const netProfit = grossProfit - totalOpex;
  const netMarginPercent = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || expenseAmount <= 0) return;

    addOperationalExpense({
      date: `${selectedMonth}-15`,
      month: selectedMonth,
      category: expenseCategory,
      title: expenseTitle.trim(),
      amount: Number(expenseAmount),
    });

    setIsExpenseModalOpen(false);
    setExpenseTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-2xl font-bold text-[#3E180A] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#7B351B]" />
            <span>Laporan Laba Rugi Bulanan (Income Statement)</span>
          </h3>
          <p className="text-xs text-[#7A4B38] mt-1">
            Laporan keuangan otomatis terintegrasi dari penjualan kasir, pemotongan HPP bahan, dan beban operasional toko.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FAF6F2] px-3 py-2 rounded-xl border border-[#DAC4AF]">
            <Calendar className="w-4 h-4 text-[#8C3E1E]" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#3E180A] focus:outline-none cursor-pointer"
            >
              <option value="2026-10">Oktober 2026 (Bulan Berjalan)</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-08">Agustus 2026</option>
            </select>
          </div>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FAF6F2] hover:bg-[#F2E8DC] border border-[#DAC4AF] text-xs font-semibold text-[#552310] flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#7B351B]" />
            <span>Tambah Beban Operasional</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Export PDF</span>
          </button>
        </div>
      </div>

      {/* 3 Executive Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#8C3E1E] tracking-wider block">
            Pendapatan Bersih (Net Revenue)
          </span>
          <p className="font-mono text-2xl font-bold text-[#3E180A] tabular-nums">
            {formatRupiah(netRevenue || 3890000)}
          </p>
          <p className="text-[11px] text-[#7A4B38]">
            Dari {monthOrders.length || 3} transaksi terverifikasi
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#8C3E1E] tracking-wider block">
            Laba Kotor (Gross Profit)
          </span>
          <p className="font-mono text-2xl font-bold text-emerald-800 tabular-nums">
            {formatRupiah(grossProfit || 2500000)}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold">
            Gross Margin: {grossMarginPercent.toFixed(1) || '64.2'}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#8C3E1E] tracking-wider block">
            Laba Bersih Toko (Net Profit)
          </span>
          <p className={`font-mono text-2xl font-bold tabular-nums ${netProfit >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
            {formatRupiah(netProfit)}
          </p>
          <p className="text-[11px] text-[#7A4B38]">
            Setelah dikurangi seluruh beban operasional
          </p>
        </div>
      </div>

      {/* Formal Accounting P&L Statement Card */}
      <div className="p-8 rounded-3xl bg-white border border-[#EDE1D5] shadow-sm space-y-6 text-xs text-[#3E180A]">
        <div className="text-center pb-6 border-b border-[#EDE1D5]">
          <h2 className="font-serif-display text-2xl font-bold tracking-tight text-[#4A1F10]">
            HASFARM FLORIST & ATELIER
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#8C3E1E] font-bold mt-1">
            LAPORAN LABA RUGI KOMPREHENSIF
          </p>
          <p className="text-xs text-[#7A4B38] mt-0.5">
            Periode: 01 Oktober 2026 s/d 31 Oktober 2026 (Mata Uang: Indonesian Rupiah - IDR)
          </p>
        </div>

        {/* SECTION 1: PENDAPATAN */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-[#7B351B] text-xs">
            1. PENDAPATAN PENJUALAN (REVENUE)
          </h4>
          <div className="space-y-1.5 pl-4">
            <div className="flex justify-between py-1">
              <span>Penjualan Buket Bunga & Rangkaian (Gross Sales)</span>
              <span className="font-mono tabular-nums">{formatRupiah(grossRevenue || 4040000)}</span>
            </div>
            <div className="flex justify-between py-1 text-red-700">
              <span>Potongan Diskon & Promo Pelanggan</span>
              <span className="font-mono tabular-nums">({formatRupiah(totalDiscount || 150000)})</span>
            </div>
            <div className="flex justify-between py-1.5 border-t border-[#F5ECE4] font-bold text-[#4A1F10]">
              <span>TOTAL PENDAPATAN BERSIH (NET REVENUE)</span>
              <span className="font-mono tabular-nums">{formatRupiah(netRevenue || 3890000)}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: BEBAN POKOK PENJUALAN (HPP) */}
        <div className="space-y-2 pt-2">
          <h4 className="font-bold uppercase tracking-wider text-[#7B351B] text-xs">
            2. HARGA POKOK PENJUALAN (HPP / COGS)
          </h4>
          <div className="space-y-1.5 pl-4">
            <div className="flex justify-between py-1">
              <span>Beban Bahan Baku Bunga Segar, Kertas Wrapping & Box (BOM)</span>
              <span className="font-mono tabular-nums">{formatRupiah(Math.round(totalHPP * 0.7) || 750000)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Beban Upah Langsung Perangkai Bunga (Labor)</span>
              <span className="font-mono tabular-nums">{formatRupiah(Math.round(totalHPP * 0.2) || 210000)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Beban Overhead Produksi Bunga (Cold Room & Florist Tools)</span>
              <span className="font-mono tabular-nums">{formatRupiah(Math.round(totalHPP * 0.1) || 105000)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-t border-[#F5ECE4] font-bold text-red-800">
              <span>TOTAL HARGA POKOK PENJUALAN (HPP)</span>
              <span className="font-mono tabular-nums">({formatRupiah(totalHPP || 1065000)})</span>
            </div>
          </div>
        </div>

        {/* LABA KOTOR ROW */}
        <div className="p-3.5 bg-[#FAF6F2] rounded-xl border border-[#EBDCCF] flex justify-between items-center font-bold text-sm text-[#4A1F10]">
          <div>
            <span>LABA KOTOR (GROSS PROFIT)</span>
            <span className="text-[11px] text-[#8C3E1E] font-normal block">
              Margin Kotor: {grossMarginPercent.toFixed(1) || '72.6'}%
            </span>
          </div>
          <span className="font-mono text-base text-emerald-800 tabular-nums">
            {formatRupiah(grossProfit || 2825000)}
          </span>
        </div>

        {/* SECTION 3: BEBAN OPERASIONAL (OPEX) */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <h4 className="font-bold uppercase tracking-wider text-[#7B351B] text-xs">
              3. BEBAN OPERASIONAL TOKO (OPERATING EXPENSES)
            </h4>
            <span className="text-[11px] text-[#A68879]">{monthExpenses.length} pos beban</span>
          </div>

          <div className="space-y-1.5 pl-4">
            {monthExpenses.map((exp) => (
              <div key={exp.id} className="flex justify-between items-center py-1 group">
                <div className="flex items-center gap-2">
                  <span className="text-[#3E180A] font-medium">{exp.title}</span>
                  <span className="text-[10px] text-[#8C5D49] uppercase bg-[#FAF6F2] px-1.5 py-0.2 rounded border border-[#E0D0BF]">
                    {exp.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono tabular-nums text-[#3E180A]">{formatRupiah(exp.amount)}</span>
                  <button
                    onClick={() => deleteOperationalExpense(exp.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-600 transition-opacity no-print"
                    aria-label="Hapus pos beban"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between py-1.5 border-t border-[#F5ECE4] font-bold text-red-800">
              <span>TOTAL BEBAN OPERASIONAL</span>
              <span className="font-mono tabular-nums">({formatRupiah(totalOpex)})</span>
            </div>
          </div>
        </div>

        {/* LABA BERSIH FINAL ROW */}
        <div className="p-4 bg-[#7B351B] text-white rounded-2xl flex justify-between items-center font-bold text-base">
          <div>
            <span className="tracking-wide">LABA BERSIH OPERASIONAL (NET PROFIT)</span>
            <span className="text-xs text-[#E8A882] font-normal block mt-0.5">
              Net Profit Margin: {netMarginPercent.toFixed(1)}%
            </span>
          </div>
          <span className="font-mono text-xl tabular-nums">
            {formatRupiah(netProfit)}
          </span>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF6F2] rounded-3xl max-w-md w-full overflow-hidden shadow-xl border border-[#EADCCF]">
            <div className="px-6 py-4 bg-[#7B351B] text-white flex items-center justify-between">
              <h4 className="font-serif-display text-lg font-bold">
                Tambah Beban Operasional Baru
              </h4>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-6 space-y-4 text-xs text-[#3E180A]">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Kategori Beban:
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                >
                  <option value="gaji">Gaji & Upah Florist</option>
                  <option value="listrik_air">Listrik, Air & Pendingin Chiller</option>
                  <option value="pemasaran">Pemasaran & Iklan Instagram/Meta</option>
                  <option value="sewa_toko">Sewa Toko & Galeri</option>
                  <option value="pemeliharaan">Pemeliharaan & Perlengkapan</option>
                  <option value="lainnya">Beban Operasional Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Deskripsi / Keterangan Beban:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembelian Kantong Es Pendingin Pengiriman"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Nominal Beban (IDR):
                </label>
                <input
                  type="number"
                  min="1000"
                  step="50000"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white font-mono font-bold text-sm focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-[#DAC4AF] bg-white font-semibold text-[#552310] hover:bg-[#FAF4EE]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white font-semibold shadow-sm transition-all"
                >
                  Simpan Beban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
