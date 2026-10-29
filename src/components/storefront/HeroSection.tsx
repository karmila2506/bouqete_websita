import React from 'react';
import { ArrowRight, Truck, Sparkles, Award, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection: React.FC = () => {
  const { products, setActiveCustomizeProduct } = useApp();
  const signatureProduct = products[0];

  const handleShopClick = () => {
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#7B351B] text-[#FFF8F2] pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#632913]">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-12">
          {/* Left Column: Bold Editorial Typography */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E8A882] bg-[#662812] px-3.5 py-1.5 rounded-full border border-[#8C3E1E]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A882]" />
              <span>Koleksi Eksklusif Hasfarm 2026</span>
            </div>

            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFF8F2] leading-[1.05]">
              BIGGER.<br />
              BRIGHTER.<br />
              BETTER.
            </h1>

            <p className="text-base sm:text-lg text-[#E3BFAC] leading-relaxed max-w-xl font-light">
              Rangkaian buket bunga segar dan hadiah kurasi artistik untuk merayakan cinta, kehangatan hidup, dan setiap momen berharga Anda. Dikerjakan langsung oleh master florist bersertifikat.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleShopClick}
                className="inline-flex items-center gap-3 px-7 py-3.5 text-sm font-semibold text-[#54220F] bg-[#E8A882] hover:bg-[#F3C4A8] rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>LIHAT KATALOG BUKET</span>
                <ArrowRight className="w-4 h-4 text-[#54220F]" />
              </button>

              {signatureProduct && (
                <button
                  onClick={() => setActiveCustomizeProduct(signatureProduct)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-[#FFF8F2] bg-[#8C3E1E]/80 hover:bg-[#8C3E1E] rounded-xl border border-[#A6512C] transition-colors"
                >
                  <span>Kustomisasi Signature Box</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/4] rounded-3xl overflow-hidden bg-gradient-to-b from-[#8C3E1E] to-[#602712] p-3 shadow-2xl border border-[#9A4723]">
              <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                <img
                  src="/assets/aistudio/image_2e8d68a1.png"
                  alt="Hasfarm Luxury Bouquet in Signature Box"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback to high quality floral fallback if attachment path is different
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      parent.classList.add('bg-[#6E2E16]', 'flex', 'items-center', 'justify-center', 'p-8', 'text-center');
                    }
                  }}
                />
                
                {/* Floating pill badge on image */}
                <div className="absolute bottom-5 left-5 right-5 bg-[#54220F]/90 backdrop-blur-md rounded-xl p-3.5 border border-[#8C3E1E] flex items-center justify-between text-xs text-[#FFF8F2]">
                  <div>
                    <p className="font-semibold text-sm">Autumn Sunset Grand Box</p>
                    <p className="text-[#E8A882] text-xs">Mawar Peach, Anthurium Burgundy & Anggrek</p>
                  </div>
                  <button
                    onClick={() => signatureProduct && setActiveCustomizeProduct(signatureProduct)}
                    className="px-3 py-1.5 bg-[#E8A882] text-[#54220F] rounded-lg font-bold hover:bg-[#F3C4A8] transition-colors"
                  >
                    Pesan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Value Proposition Banner (Exact reference styling) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 bg-[#682B14] rounded-2xl border border-[#8C3E1E] shadow-inner text-[#F4DDD0]">
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-[#7B351B] flex items-center justify-center text-[#E8A882] border border-[#8C3E1E] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">SAME DAY DELIVERY</p>
              <p className="text-[11px] text-[#D8B4A2]">Pesan sebelum jam 13:00 WIB</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-[#7B351B] flex items-center justify-center text-[#E8A882] border border-[#8C3E1E] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">FRESH FROM OUR FARMS</p>
              <p className="text-[11px] text-[#D8B4A2]">Dipetik harian dari kebun mitra</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-[#7B351B] flex items-center justify-center text-[#E8A882] border border-[#8C3E1E] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">EXPERT FLORISTS</p>
              <p className="text-[11px] text-[#D8B4A2]">Dirangkai terampil & presisi</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-[#7B351B] flex items-center justify-center text-[#E8A882] border border-[#8C3E1E] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">HAPPINESS GUARANTEED</p>
              <p className="text-[11px] text-[#D8B4A2]">Garansi kepuasan & kesegaran</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
