import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductItem, ProductCategory, OccasionType } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { Search, Star, SlidersHorizontal, ArrowUpRight } from 'lucide-react';

interface ProductCatalogProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  selectedOccasion: OccasionType | 'all';
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedOccasion,
}) => {
  const { products, setActiveCustomizeProduct } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'bouquets', label: 'Buket Bunga' },
    { id: 'hat_boxes', label: 'Hat Boxes' },
    { id: 'plants', label: 'Tanaman Hidup' },
    { id: 'gift_hampers', label: 'Gift Hampers' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Occasion filter
        if (selectedOccasion !== 'all' && !p.occasions.includes(selectedOccasion)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.reviewCount || 0) - (a.reviewCount || 0); // popular
      });
  }, [products, selectedCategory, selectedOccasion, searchQuery, sortBy]);

  return (
    <section id="catalog-section" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#FBF8F5]">
      <div className="max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#EDE1D5]">
          <div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#4A1F10] tracking-tight">
              KATALOG BUKET & RANGKAIAN
            </h2>
            <p className="text-xs sm:text-sm text-[#7D5240] mt-1">
              Bunga segar premium dirangkai berdasarkan pesanan dengan kustomisasi lengkap
            </p>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-[#8C3E1E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari buket, mawar, tulip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#D9C7B6] text-xs text-[#2D1E18] focus:outline-none focus:border-[#7B351B] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-[#D9C7B6] text-xs text-[#5D4037]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C3E1E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutkan Produk"
                className="bg-transparent text-xs text-[#4A1F10] font-medium focus:outline-none cursor-pointer"
              >
                <option value="popular">Terpopuler</option>
                <option value="price_asc">Harga: Terendah</option>
                <option value="price_desc">Harga: Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#7B351B] text-white shadow-sm'
                  : 'bg-[#F2E8DC] text-[#552918] hover:bg-[#E7D7C5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid - 3 cols on desktop */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE1D5]">
            <p className="text-base font-serif-display text-[#4A1F10]">Tidak ada buket yang cocok dengan filter</p>
            <p className="text-xs text-[#7D5240] mt-1">Coba gunakan kata kunci pencarian yang lain atau reset filter kategori.</p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#7B351B] text-white text-xs font-semibold rounded-lg hover:bg-[#5E2511]"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCustomize={() => setActiveCustomizeProduct(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

interface ProductCardProps {
  product: ProductItem;
  onCustomize: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCustomize }) => {
  return (
    <div className="group bg-white rounded-2xl border border-[#EDE1D5] overflow-hidden hover:border-[#8C3E1E] transition-all duration-300 hover:shadow-xl flex flex-col justify-between">
      <div>
        {/* Product Image (65-75% height) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6EFE9]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {product.isBestseller && (
            <span className="absolute top-3 left-3 bg-[#8C3E1E] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
              Signature Bestseller
            </span>
          )}

          {product.isNew && (
            <span className="absolute top-3 left-3 bg-[#4A6B53] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
              Koleksi Baru
            </span>
          )}
        </div>

        {/* Content Box */}
        <div className="p-5">
          {/* Unboxed clean metadata with subtle bullet separator */}
          <div className="flex items-center gap-2 text-xs text-[#8C3E1E] font-medium mb-1.5 uppercase tracking-wider">
            <span>{product.category.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-[#784E3D]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="tabular-nums font-semibold">{product.rating}</span>
              <span className="text-[11px] text-[#A68879]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif-display text-xl font-bold text-[#3B190D] group-hover:text-[#8C3E1E] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-[#6F4E40] line-clamp-2 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="px-5 pb-5 pt-3 border-t border-[#F5EDE6] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#8C3E1E] uppercase font-semibold block tracking-wider">
            Harga Bunga
          </span>
          <span className="font-mono tabular-nums text-lg font-bold text-[#3E180A]">
            {formatRupiah(product.price)}
          </span>
        </div>

        <button
          onClick={onCustomize}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F4E9DF] text-[#552310] group-hover:bg-[#7B351B] group-hover:text-white transition-all text-xs font-semibold shadow-sm"
        >
          <span>Pesan & Rangkai</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
