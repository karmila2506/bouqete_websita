import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductItem, BOMComponent } from '../../types';
import {
  formatRupiah,
  calculateBOMCost,
  calculateTotalHPP,
  calculateMarginPercent,
  calculateMarkupPercent,
  calculateSuggestedPrice,
} from '../../utils/formatters';
import {
  Calculator,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Sliders,
  DollarSign,
  Info,
} from 'lucide-react';

export const CogsPricingCalculator: React.FC = () => {
  const { products, rawMaterials, updateProductRecipeAndPricing, showToast } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Local state for recipe editing
  const [recipe, setRecipe] = useState<BOMComponent[]>(activeProduct ? activeProduct.recipe : []);
  const [laborCost, setLaborCost] = useState<number>(activeProduct ? activeProduct.laborCost : 40000);
  const [overheadCost, setOverheadCost] = useState<number>(activeProduct ? activeProduct.overheadCost : 18000);
  const [sellingPrice, setSellingPrice] = useState<number>(activeProduct ? activeProduct.price : 450000);
  const [targetMargin, setTargetMargin] = useState<number>(60); // 60% default target margin

  // Add material dropdown state
  const [selectedNewMatId, setSelectedNewMatId] = useState<string>('');
  const [newMatQty, setNewMatQty] = useState<number>(1);

  // Sync when selected product changes
  useEffect(() => {
    if (activeProduct) {
      setRecipe(activeProduct.recipe);
      setLaborCost(activeProduct.laborCost);
      setOverheadCost(activeProduct.overheadCost);
      setSellingPrice(activeProduct.price);
    }
  }, [selectedProductId]);

  if (!activeProduct) {
    return <div>Tidak ada produk yang dipilih.</div>;
  }

  // Calculations
  const rawMaterialTotalCost = calculateBOMCost(recipe);
  const totalHPP = calculateTotalHPP(recipe, laborCost, overheadCost);
  const suggestedPrice = calculateSuggestedPrice(totalHPP, targetMargin);
  const actualMarginPercent = calculateMarginPercent(sellingPrice, totalHPP);
  const actualMarkupPercent = calculateMarkupPercent(sellingPrice, totalHPP);
  const actualGrossProfit = sellingPrice - totalHPP;

  // Handlers
  const handleUpdateRecipeItemQty = (index: number, newQty: number) => {
    setRecipe((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantityNeeded: Math.max(0.5, newQty) } : item))
    );
  };

  const handleRemoveRecipeItem = (index: number) => {
    setRecipe((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddIngredient = () => {
    if (!selectedNewMatId) return;
    const material = rawMaterials.find((m) => m.id === selectedNewMatId);
    if (!material) return;

    // Check if already in recipe
    const existingIndex = recipe.findIndex((item) => item.rawMaterialId === material.id);
    if (existingIndex !== -1) {
      handleUpdateRecipeItemQty(existingIndex, recipe[existingIndex].quantityNeeded + newMatQty);
    } else {
      const newBOMItem: BOMComponent = {
        rawMaterialId: material.id,
        materialName: material.name,
        quantityNeeded: newMatQty,
        unit: material.unit,
        unitCost: material.unitCost,
      };
      setRecipe((prev) => [...prev, newBOMItem]);
    }

    setSelectedNewMatId('');
    setNewMatQty(1);
    showToast('Bahan Ditambahkan', `${material.name} dimasukkan ke resep buket.`, 'info');
  };

  const handleSaveToCatalog = () => {
    updateProductRecipeAndPricing(
      activeProduct.id,
      recipe,
      Number(laborCost),
      Number(overheadCost),
      Number(sellingPrice)
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Product Selector */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-2xl font-bold text-[#3E180A] flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#7B351B]" />
            <span>Kalkulator HPP & Penetapan Harga Jual Buket</span>
          </h3>
          <p className="text-xs text-[#7A4B38] mt-1">
            Hitung Harga Pokok Penjualan (COGS) berbasis Bill of Materials (BOM), biaya perangkai, dan overhead toko.
          </p>
        </div>

        {/* Product Dropdown Selector */}
        <div className="min-w-[260px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#8C3E1E] block mb-1">
            Pilih Buket / Rangkaian:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-[#FAF6F2] text-xs font-semibold text-[#3E180A] focus:outline-none focus:border-[#7B351B] cursor-pointer"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatRupiah(p.price)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: 7 cols Bill of Materials + 5 cols HPP & Margin Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: BOM Recipe Table (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif-display text-lg font-bold text-[#3E180A]">
                  Bill of Materials (BOM) Resep Buket
                </h4>
                <p className="text-xs text-[#7A4B38]">
                  Daftar bunga & aksesoris yang digunakan untuk merangkai 1 unit produk
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#7B351B] bg-[#FAF0E6] px-3 py-1 rounded-lg">
                {recipe.length} Komponen
              </span>
            </div>

            {/* Recipe Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#3E180A]">
                <thead>
                  <tr className="border-b border-[#EDE1D5] text-[11px] font-bold uppercase tracking-wider text-[#8C3E1E]">
                    <th className="py-2.5 px-2">Komponen Bahan</th>
                    <th className="py-2.5 px-2 text-center">Jumlah</th>
                    <th className="py-2.5 px-2 text-right">Biaya Satuan</th>
                    <th className="py-2.5 px-2 text-right">Subtotal HPP</th>
                    <th className="py-2.5 px-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5ECE4]">
                  {recipe.map((item, idx) => {
                    const itemSubtotal = item.quantityNeeded * item.unitCost;
                    return (
                      <tr key={`${item.rawMaterialId}_${idx}`} className="hover:bg-[#FAF6F2]">
                        <td className="py-2.5 px-2 font-medium">
                          {item.materialName}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            value={item.quantityNeeded}
                            onChange={(e) => handleUpdateRecipeItemQty(idx, Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-center font-mono font-bold text-xs rounded border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                          />
                          <span className="text-[10px] text-[#8C5D49] ml-1">{item.unit}</span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-[#7A4B38]">
                          {formatRupiah(item.unitCost)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-[#3E180A] tabular-nums">
                          {formatRupiah(itemSubtotal)}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => handleRemoveRecipeItem(idx)}
                            className="p-1 text-[#A87965] hover:text-red-600 transition-colors"
                            aria-label="Hapus dari resep"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Raw Material Cost */}
            <div className="flex justify-between items-center pt-3 border-t border-[#EDE1D5] text-xs font-bold text-[#3E180A]">
              <span>Subtotal Biaya Bahan Baku Bunga & Packaging:</span>
              <span className="font-mono text-base text-[#7B351B] tabular-nums">
                {formatRupiah(rawMaterialTotalCost)}
              </span>
            </div>

            {/* Add New Component to Recipe form */}
            <div className="p-3.5 bg-[#FAF6F2] rounded-xl border border-[#EBDCCF] space-y-2 pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B351B] block">
                + Tambah Bunga / Komponen Lain ke Resep:
              </span>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <select
                  value={selectedNewMatId}
                  onChange={(e) => setSelectedNewMatId(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                >
                  <option value="">-- Pilih dari Stok Bahan Baku --</option>
                  {rawMaterials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({formatRupiah(m.unitCost)}/{m.unit})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 w-24">
                  <input
                    type="number"
                    min="1"
                    value={newMatQty}
                    onChange={(e) => setNewMatQty(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs text-center font-mono rounded-lg border border-[#DAC4AF] bg-white"
                  />
                  <span className="text-[10px] text-[#7A4B38]">unit</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddIngredient}
                  disabled={!selectedNewMatId}
                  className="px-3.5 py-1.5 bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 shrink-0"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Labor, Overhead & Margin Pricing Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* HPP Formulation Box */}
          <div className="p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs space-y-4">
            <h4 className="font-serif-display text-lg font-bold text-[#3E180A]">
              Komponen Beban Pokok (HPP)
            </h4>

            <div className="space-y-3 text-xs text-[#3E180A]">
              {/* 1. Bahan Baku */}
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#FAF6F2]">
                <span className="font-medium">1. Biaya Bahan Baku (BOM)</span>
                <span className="font-mono font-bold tabular-nums">{formatRupiah(rawMaterialTotalCost)}</span>
              </div>

              {/* 2. Tenaga Kerja Perangkai */}
              <div>
                <label className="text-[11px] font-bold text-[#7A4B38] block mb-1">
                  2. Ongkos Tenaga Kerja Perangkai (Labor):
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={laborCost}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DAC4AF] font-mono font-bold text-xs bg-white focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              {/* 3. Overhead Toko */}
              <div>
                <label className="text-[11px] font-bold text-[#7A4B38] block mb-1">
                  3. Alokasi Listrik Chiller & Overhead Toko:
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={overheadCost}
                  onChange={(e) => setOverheadCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#DAC4AF] font-mono font-bold text-xs bg-white focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              {/* Total HPP Result */}
              <div className="p-3.5 rounded-xl bg-[#7B351B] text-white flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#E8A882] block">
                    TOTAL HPP PER BUKET (COGS)
                  </span>
                  <span className="font-mono text-xl font-bold tabular-nums">
                    {formatRupiah(totalHPP)}
                  </span>
                </div>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono">
                  100% Biaya Pokok
                </span>
              </div>
            </div>

            {/* Target Margin Slider */}
            <div className="pt-2 border-t border-[#EDE1D5] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#7A4B38]">Target Gross Margin:</span>
                <span className="font-mono font-bold text-[#7B351B] text-sm">{targetMargin}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="85"
                step="5"
                value={targetMargin}
                onChange={(e) => setTargetMargin(Number(e.target.value))}
                className="w-full accent-[#7B351B] cursor-pointer"
              />
              <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-700 block uppercase font-bold">
                    Rekomendasi Harga Jual Otomatis:
                  </span>
                  <span className="font-mono text-base font-bold tabular-nums text-emerald-900">
                    {formatRupiah(suggestedPrice)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSellingPrice(suggestedPrice)}
                  className="px-2.5 py-1 bg-emerald-700 text-white text-[11px] font-semibold rounded hover:bg-emerald-800 transition-colors"
                >
                  Terapkan
                </button>
              </div>
            </div>

            {/* Actual Selling Price Input & Live Profit Metric */}
            <div className="pt-2 border-t border-[#EDE1D5] space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#7A4B38] block mb-1">
                  Harga Jual Aktual di Katalog (IDR):
                </label>
                <input
                  type="number"
                  min={totalHPP}
                  step="5000"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DAC4AF] font-mono text-base font-bold text-[#3E180A] bg-white focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              {/* Profit & Margin Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF6F2] border border-[#EBDCCF]">
                  <span className="text-[10px] text-[#7A4B38] block">Margin Kotor Aktual:</span>
                  <span className="font-mono text-base font-bold text-[#7B351B]">
                    {actualMarginPercent.toFixed(1)}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF6F2] border border-[#EBDCCF]">
                  <span className="text-[10px] text-[#7A4B38] block">Laba Kotor per Buket:</span>
                  <span className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                    {formatRupiah(actualGrossProfit)}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveToCatalog}
                className="w-full py-3.5 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan HPP & Perbarui Harga Jual Katalog</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
