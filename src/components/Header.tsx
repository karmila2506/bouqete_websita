import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ShieldCheck, Flower2 } from 'lucide-react';

interface HeaderProps {
  currentView: 'storefront' | 'admin';
  onNavigate: (view: 'storefront' | 'admin') => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenAuthModal }) => {
  const { cartCount, setIsCartOpen, isAdminAuthenticated, is2FAVerified } = useApp();

  const handleAdminClick = () => {
    if (isAdminAuthenticated && is2FAVerified) {
      onNavigate('admin');
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#7B351B] text-[#FDFBF7] shadow-sm transition-colors border-b border-[#692C15]">
      {/* Top Bar Announcement */}
      <div className="bg-[#662812] text-[#F3D5C5] text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span>🌸 Same Day Delivery Pesanan sebelum pukul 13:00 WIB</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <span>Bunga Segar Garansi 100% Kepuasan</span>
      </div>

      {/* Main Navigation - Follows 3-zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('storefront')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#8C3E1E] flex items-center justify-center text-[#FAD7C0] border border-[#A6512C] shadow-inner group-hover:scale-105 transition-transform">
            <Flower2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-display text-2xl md:text-3xl font-bold tracking-tight text-[#FFF8F2] block leading-none">
              Hasfarm
            </span>
            <span className="text-[10px] tracking-widest text-[#E8A882] uppercase block font-medium mt-1">
              Florist & Atelier
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#F2D6C6]">
          <button
            onClick={() => {
              onNavigate('storefront');
              const el = document.getElementById('collection-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
          >
            Koleksi Bunga
          </button>
          <button
            onClick={() => {
              onNavigate('storefront');
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
          >
            Katalog Buket
          </button>
          <button
            onClick={() => {
              onNavigate('storefront');
              const el = document.getElementById('story-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
          >
            Filosofi Desain
          </button>
          <button
            onClick={() => {
              onNavigate('storefront');
              const el = document.getElementById('occasions-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8"
          >
            Momen & Acara
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Cluster */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-lg text-[#F2D6C6] hover:text-white hover:bg-[#8C3E1E] transition-colors focus:outline-none"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C76E46] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#7B351B] tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Management Hub Switcher */}
          {currentView === 'storefront' ? (
            <button
              onClick={handleAdminClick}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#EFE3D5] text-[#552310] hover:bg-white hover:shadow transition-all whitespace-nowrap shrink-0 border border-[#DAC4AF]"
            >
              <ShieldCheck className="w-4 h-4 text-[#8C3E1E]" />
              <span>Portal Manajemen & HPP</span>
              {isAdminAuthenticated && is2FAVerified && (
                <span className="text-[10px] bg-[#D4EDDA] text-[#155724] px-1.5 py-0.2 rounded font-mono">2FA Active</span>
              )}
            </button>
          ) : (
            <button
              onClick={() => onNavigate('storefront')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#EFE3D5] text-[#552310] hover:bg-white transition-all whitespace-nowrap shrink-0"
            >
              <Flower2 className="w-4 h-4 text-[#8C3E1E]" />
              <span>Kembali ke Toko</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
