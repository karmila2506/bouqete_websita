/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSection } from './components/storefront/HeroSection';
import { CollectionShowcase } from './components/storefront/CollectionShowcase';
import { ProductCatalog } from './components/storefront/ProductCatalog';
import { StoryBanner } from './components/storefront/StoryBanner';
import { ShopByOccasion } from './components/storefront/ShopByOccasion';
import { ProductCustomizeModal } from './components/storefront/ProductCustomizeModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { PaymentGatewayModal } from './components/payment/PaymentGatewayModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ProductCategory, OccasionType } from './types';

function MainApp() {
  const { isAdminAuthenticated, is2FAVerified } = useApp();

  const [currentView, setCurrentView] = useState<'storefront' | 'admin'>('storefront');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Storefront filters
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType | 'all'>('all');

  const handleNavigate = (view: 'storefront' | 'admin') => {
    if (view === 'admin') {
      if (isAdminAuthenticated && is2FAVerified) {
        setCurrentView('admin');
      } else {
        setIsAuthModalOpen(true);
      }
    } else {
      setCurrentView('storefront');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F5] text-[#2D1E18]">
      {/* Universal Top Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Display */}
      {currentView === 'storefront' ? (
        <main className="flex-1">
          {/* Hero Section matching the user's reference image */}
          <HeroSection />

          {/* Collections Grid */}
          <CollectionShowcase
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Product Catalog with customizer */}
          <ProductCatalog
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedOccasion={selectedOccasion}
          />

          {/* Story & Craftsmanship Banner */}
          <StoryBanner />

          {/* Shop by Occasion Grid */}
          <ShopByOccasion
            selectedOccasion={selectedOccasion}
            onSelectOccasion={(occ) => {
              setSelectedOccasion(occ);
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Footer */}
          <Footer onOpenAdmin={() => handleNavigate('admin')} />
        </main>
      ) : (
        <div className="flex-1">
          <AdminPortal onBackToStore={() => setCurrentView('storefront')} />
        </div>
      )}

      {/* Global Modals & Drawers */}
      <ProductCustomizeModal />
      <CartDrawer onOpenCheckout={() => setIsCheckoutModalOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
      <PaymentGatewayModal />
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentView('admin');
        }}
      />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
