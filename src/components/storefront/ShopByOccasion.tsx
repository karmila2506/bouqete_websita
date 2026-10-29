import React from 'react';
import { Cake, Heart, Award, HeartPulse, Sparkles, Baby, GraduationCap } from 'lucide-react';
import { OccasionType } from '../../types';

interface ShopByOccasionProps {
  selectedOccasion: OccasionType | 'all';
  onSelectOccasion: (occ: OccasionType | 'all') => void;
}

export const ShopByOccasion: React.FC<ShopByOccasionProps> = ({ selectedOccasion, onSelectOccasion }) => {
  const occasions = [
    { id: 'birthday' as OccasionType, label: 'BIRTHDAY', icon: <Cake className="w-5 h-5" /> },
    { id: 'anniversary' as OccasionType, label: 'ANNIVERSARY', icon: <Heart className="w-5 h-5" /> },
    { id: 'congratulations' as OccasionType, label: 'CONGRATULATIONS', icon: <Award className="w-5 h-5" /> },
    { id: 'graduation' as OccasionType, label: 'GRADUATION', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'thank_you' as OccasionType, label: 'THANK YOU', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'sympathy' as OccasionType, label: 'SYMPATHY', icon: <HeartPulse className="w-5 h-5" /> },
    { id: 'new_baby' as OccasionType, label: 'NEW BABY', icon: <Baby className="w-5 h-5" /> },
  ];

  return (
    <section id="occasions-section" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FBF8F5] border-t border-[#EDE1D5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#4A1F10] tracking-tight">
            SHOP BY OCCASION
          </h2>
          <p className="text-xs text-[#784E3D] mt-1">Pilih buket yang dirancang khusus untuk mewakili pesan perasaan Anda</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <button
            onClick={() => onSelectOccasion('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 ${
              selectedOccasion === 'all'
                ? 'bg-[#7B351B] text-white shadow'
                : 'bg-[#F2E8DC] text-[#552918] hover:bg-[#E7D7C5]'
            }`}
          >
            SEMUA MOMEN
          </button>

          {occasions.map((occ) => {
            const isActive = selectedOccasion === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => onSelectOccasion(occ.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#7B351B] text-white shadow'
                    : 'bg-[#F2E8DC] text-[#552918] hover:bg-[#E7D7C5]'
                }`}
              >
                <span className={isActive ? 'text-[#E8A882]' : 'text-[#8C3E1E]'}>{occ.icon}</span>
                <span>{occ.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
