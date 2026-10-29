import React from 'react';
import { Flower2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#662812] text-[#E8C5B0] border-t border-[#54210D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#8C3E1E] flex items-center justify-center text-[#FAD7C0] border border-[#A6512C]">
                <Flower2 className="w-4 h-4" />
              </div>
              <span className="font-serif-display text-2xl font-bold tracking-tight text-white">
                Hasfarm Florist & Atelier
              </span>
            </div>
            <p className="text-xs text-[#D8B4A2] leading-relaxed max-w-sm">
              Studio bunga mewah berbasis di Jakarta, menghadirkan rangkaian bunga segar berkelas internasional, hat box eksklusif, dan gift hampers terkurasi untuk setiap momen berharga.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D8B4A2]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Payment Gateway Terverifikasi Otomatis & Enkripsi 2FA</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Layanan & Koleksi
            </h4>
            <ul className="space-y-2 text-xs text-[#D8B4A2]">
              <li>Buket Bunga Ulang Tahun</li>
              <li>Signature Hat Boxes Mewah</li>
              <li>Rangkaian Bunga Graduation & Wisuda</li>
              <li>Hantaran & Gift Hampers Eksklusif</li>
              <li>Same Day Delivery Wilayah Jabodetabek</li>
            </ul>
          </div>

          {/* Contact & Boutique Info (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Studio & Hubungi Kami
            </h4>
            <div className="space-y-2.5 text-xs text-[#D8B4A2]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8A882] shrink-0 mt-0.5" />
                <span>Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E8A882] shrink-0" />
                <span>WhatsApp Pemesanan: +62 812-3456-7890</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E8A882] shrink-0" />
                <span>concierge@hasfarm.co.id</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-[#E8A882] hover:text-white underline underline-offset-4 font-semibold"
              >
                Akses Portal Manajemen Florist & HPP &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-[#54210D] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#BF9C89] gap-4">
          <p>© 2026 Hasfarm Florist & Atelier. Hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan cinta untuk bunga segar</span>
            <Heart className="w-3 h-3 text-[#E8A882] fill-[#E8A882]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
