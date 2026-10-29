import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RawMaterial } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Package,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  X,
  Sparkles,
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const { rawMaterials, restockMaterial, addNewMaterial } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'fresh_flower' | 'wrapping_paper' | 'ribbon' | 'foam_base' | 'packaging'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [restockModalMat, setRestockModalMat] = useState<RawMaterial | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(20);
  const [restockCost, setRestockCost] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMatName, setNewMatName] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<RawMaterial['category']>('fresh_flower');
  const [newMatUnit, setNewMatUnit] = useState<RawMaterial['unit']>('tangkai');
  const [newMatUnitCost, setNewMatUnitCost] = useState(10000);
  const [newMatStock, setNewMatStock] = useState(50);
  const [newMatMinAlert, setNewMatMinAlert] = useState(15);
  const [newMatSupplier, setNewMatSupplier] = useState('');

  const filteredMaterials = rawMaterials.filter((m) => {
    if (activeTab !== 'all' && m.category !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.supplier.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenRestock = (mat: RawMaterial) => {
    setRestockModalMat(mat);
    setRestockQuantity(25);
    setRestockCost(mat.unitCost);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalMat) return;
    restockMaterial(restockModalMat.id, Number(restockQuantity), Number(restockCost));
    setRestockModalMat(null);
  };

  const handleCreateNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim()) return;

    addNewMaterial({
      name: newMatName.trim(),
      category: newMatCategory,
      unit: newMatUnit,
      unitCost: Number(newMatUnitCost),
      currentStock: Number(newMatStock),
      minStockAlert: Number(newMatMinAlert),
      supplier: newMatSupplier || 'Mitra Supplier Lokal',
    });

    setIsAddModalOpen(false);
    setNewMatName('');
    setNewMatSupplier('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#EDE1D5] shadow-xs">
        <div>
          <h3 className="font-serif-display text-2xl font-bold text-[#3E180A]">
            Manajemen Stok & Bahan Baku Bunga
          </h3>
          <p className="text-xs text-[#7A4B38] mt-1">
            Terhubung otomatis dengan transaksi kasir. Setiap pesanan buket yang lunas langsung memotong stok komponen bahan baku secara real-time.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bahan Baku Baru</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Categories Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Semua Bahan' },
            { id: 'fresh_flower', label: 'Bunga Segar' },
            { id: 'wrapping_paper', label: 'Kertas Wrapping' },
            { id: 'ribbon', label: 'Pita Satin' },
            { id: 'foam_base', label: 'Floral Foam' },
            { id: 'packaging', label: 'Box & Keranjang' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#7B351B] text-white shadow-xs'
                  : 'bg-white text-[#552310] border border-[#E0D0BF] hover:bg-[#FAF4EE]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#8C3E1E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari bahan baku / supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#D9C7B6] text-xs text-[#2D1E18] focus:outline-none focus:border-[#7B351B]"
          />
        </div>
      </div>

      {/* Raw Materials Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#EDE1D5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3E180A]">
            <thead>
              <tr className="border-b border-[#EDE1D5] bg-[#FAF6F2] text-[11px] font-bold uppercase tracking-wider text-[#8C3E1E]">
                <th className="py-3.5 px-4">Nama Bahan Baku</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4 text-right">Biaya/Unit (HPP)</th>
                <th className="py-3.5 px-4 text-center">Stok Tersedia</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5ECE4]">
              {filteredMaterials.map((mat) => {
                const isOutOfStock = mat.currentStock <= 0;
                const isLowStock = mat.currentStock > 0 && mat.currentStock <= mat.minStockAlert;

                return (
                  <tr key={mat.id} className="hover:bg-[#FAF6F2] transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#3E180A]">{mat.name}</p>
                      <p className="text-[10px] text-[#8C5D49]">ID: {mat.id}</p>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[#7A4B38]">
                      {mat.category.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-[#7A4B38]">
                      {mat.supplier}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#4A1F10] tabular-nums">
                      {formatRupiah(mat.unitCost)} / {mat.unit}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold tabular-nums">
                      <span className={`text-sm ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-emerald-700'}`}>
                        {mat.currentStock} {mat.unit}
                      </span>
                      <span className="block text-[10px] text-[#A68879]">Min alert: {mat.minStockAlert}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span>Habis</span>
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Menipis</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aman</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenRestock(mat)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F2E8DC] hover:bg-[#7B351B] hover:text-white text-[#552310] font-semibold text-[11px] transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockModalMat && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF6F2] rounded-3xl max-w-md w-full overflow-hidden shadow-xl border border-[#EADCCF]">
            <div className="px-6 py-4 bg-[#7B351B] text-white flex items-center justify-between">
              <h4 className="font-serif-display text-lg font-bold">
                Restock: {restockModalMat.name}
              </h4>
              <button
                onClick={() => setRestockModalMat(null)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="p-6 space-y-4 text-xs text-[#3E180A]">
              <div className="p-3 bg-white rounded-xl border border-[#EBDCCF]">
                <p className="text-[11px] text-[#7A4B38]">Stok Saat Ini:</p>
                <p className="font-mono text-base font-bold text-[#7B351B] tabular-nums">
                  {restockModalMat.currentStock} {restockModalMat.unit}
                </p>
                <p className="text-[10px] text-[#A68879] mt-0.5">Supplier: {restockModalMat.supplier}</p>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Jumlah Penambahan ({restockModalMat.unit}):
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white font-mono font-bold text-sm focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Harga Beli Terkini per {restockModalMat.unit} (IDR):
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={restockCost}
                  onChange={(e) => setRestockCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white font-mono font-bold text-sm focus:outline-none focus:border-[#7B351B]"
                />
                <p className="text-[10px] text-[#8C5D49] mt-1">
                  Biaya beli ini akan digunakan otomatis dalam perhitungan HPP buket yang menggunakan bahan ini.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalMat(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-[#DAC4AF] bg-white font-semibold text-[#552310] hover:bg-[#FAF4EE]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white font-semibold shadow-sm transition-all"
                >
                  Konfirmasi Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF6F2] rounded-3xl max-w-lg w-full overflow-hidden shadow-xl border border-[#EADCCF]">
            <div className="px-6 py-4 bg-[#7B351B] text-white flex items-center justify-between">
              <h4 className="font-serif-display text-lg font-bold">
                Tambah Bahan Baku Baru ke Inventaris
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewMaterial} className="p-6 space-y-4 text-xs text-[#3E180A]">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Nama Bahan Baku:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mawar Pink Sweet Avalanche"
                  value={newMatName}
                  onChange={(e) => setNewMatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                    Kategori:
                  </label>
                  <select
                    value={newMatCategory}
                    onChange={(e) => setNewMatCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                  >
                    <option value="fresh_flower">Bunga Segar</option>
                    <option value="wrapping_paper">Kertas Wrapping</option>
                    <option value="ribbon">Pita Satin</option>
                    <option value="foam_base">Floral Foam Base</option>
                    <option value="packaging">Box / Keranjang</option>
                    <option value="accessory">Aksesoris / Kartu</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                    Satuan Unit:
                  </label>
                  <select
                    value={newMatUnit}
                    onChange={(e) => setNewMatUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                  >
                    <option value="tangkai">Tangkai</option>
                    <option value="lembar">Lembar</option>
                    <option value="meter">Meter</option>
                    <option value="pcs">Pcs</option>
                    <option value="box">Box</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                    Biaya Beli (HPP):
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newMatUnitCost}
                    onChange={(e) => setNewMatUnitCost(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#DAC4AF] bg-white font-mono font-bold focus:outline-none focus:border-[#7B351B]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                    Stok Awal:
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newMatStock}
                    onChange={(e) => setNewMatStock(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#DAC4AF] bg-white font-mono font-bold focus:outline-none focus:border-[#7B351B]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                    Min Alert:
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newMatMinAlert}
                    onChange={(e) => setNewMatMinAlert(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#DAC4AF] bg-white font-mono font-bold focus:outline-none focus:border-[#7B351B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A4B38] block mb-1">
                  Nama Supplier / Mitra Kebun:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bandung Highland Flora"
                  value={newMatSupplier}
                  onChange={(e) => setNewMatSupplier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DAC4AF] bg-white focus:outline-none focus:border-[#7B351B]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-[#DAC4AF] bg-white font-semibold text-[#552310] hover:bg-[#FAF4EE]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#7B351B] hover:bg-[#602712] text-white font-semibold shadow-sm transition-all"
                >
                  Simpan Bahan Baku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
