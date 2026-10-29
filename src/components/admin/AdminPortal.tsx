import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { InventoryManagement } from './InventoryManagement';
import { CogsPricingCalculator } from './CogsPricingCalculator';
import { OrdersManager } from './OrdersManager';
import { ProfitLossReport } from './ProfitLossReport';
import { WhatsAppGatewayPanel } from './WhatsAppGatewayPanel';
import { TwoFactorSecurityPanel } from './TwoFactorSecurityPanel';
import {
  LayoutDashboard,
  Package,
  Calculator,
  ShoppingBag,
  FileText,
  MessageCircle,
  ShieldCheck,
  LogOut,
  Flower2,
  Lock,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'inventory'
  | 'cogs_pricing'
  | 'orders'
  | 'profit_loss'
  | 'whatsapp'
  | 'security_2fa';

export const AdminPortal: React.FC<{ onBackToStore: () => void }> = ({ onBackToStore }) => {
  const { adminLogout, twoFactorConfig } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Dashboard Analitik', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'inventory' as AdminTab, label: 'Manajemen Stok & Bahan', icon: <Package className="w-4 h-4" /> },
    { id: 'cogs_pricing' as AdminTab, label: 'Kalkulator HPP & Harga', icon: <Calculator className="w-4 h-4" /> },
    { id: 'orders' as AdminTab, label: 'Pesanan & Pengiriman', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'profit_loss' as AdminTab, label: 'Laba Rugi Bulanan', icon: <FileText className="w-4 h-4" /> },
    { id: 'whatsapp' as AdminTab, label: 'Notifikasi WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'security_2fa' as AdminTab, label: 'Keamanan 2FA', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F5] text-[#2D1E18]">
      {/* Admin Top Navigation Bar */}
      <div className="bg-[#7B351B] text-white border-b border-[#682B14] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8C3E1E] flex items-center justify-center text-[#FAD7C0] border border-[#A6512C]">
              <Flower2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-display text-lg font-bold text-white">Hasfarm Management Hub</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded font-bold">
                  2FA Protected
                </span>
              </div>
              <p className="text-[10px] text-[#E8C5B0]">Real-time Inventory, COGS Calculator & Automated Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              Lihat Toko Publik
            </button>
            <button
              onClick={adminLogout}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/80 hover:text-white transition-colors"
              title="Kunci Sesi / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none flex gap-1 border-t border-white/10 pt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-[#E8A882] text-white bg-white/10 rounded-t-lg'
                    : 'border-transparent text-[#E8C5B0] hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <AdminDashboardOverview
            onNavigateTab={(tab) => {
              if (tab === 'inventory') setActiveTab('inventory');
              if (tab === 'cogs_pricing') setActiveTab('cogs_pricing');
              if (tab === 'orders') setActiveTab('orders');
              if (tab === 'whatsapp') setActiveTab('whatsapp');
              if (tab === 'profit_loss') setActiveTab('profit_loss');
            }}
          />
        )}
        {activeTab === 'inventory' && <InventoryManagement />}
        {activeTab === 'cogs_pricing' && <CogsPricingCalculator />}
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'profit_loss' && <ProfitLossReport />}
        {activeTab === 'whatsapp' && <WhatsAppGatewayPanel />}
        {activeTab === 'security_2fa' && <TwoFactorSecurityPanel />}
      </main>
    </div>
  );
};
