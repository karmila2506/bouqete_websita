import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CollectionShowcaseProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export const CollectionShowcase: React.FC<CollectionShowcaseProps> = ({ onSelectCategory }) => {
  const collections = [
    {
      id: 'bouquets' as ProductCategory,
      title: 'BOUQUETS',
      subtitle: 'Mulai dari Rp 450rb',
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'hat_boxes' as ProductCategory,
      title: 'HAT BOXES',
      subtitle: 'Mulai dari Rp 545rb',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'plants' as ProductCategory,
      title: 'PLANTS',
      subtitle: 'Mulai dari Rp 325rb',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'gift_hampers' as ProductCategory,
      title: 'GIFT HAMPERS',
      subtitle: 'Mulai dari Rp 795rb',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="collection-section" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#FBF8F5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#4A1F10] tracking-tight">
              SHOP OUR COLLECTIONS
            </h2>
            <p className="text-xs sm:text-sm text-[#7D5240] mt-1">
              Jelajahi karya floral terbaik sesuai selera estetika dan kebutuhan momen Anda
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C3E1E] hover:text-[#5B220E] transition-colors"
          >
            <span>LIHAT SEMUA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#F2E8DC] border border-[#E0D0BF] hover:border-[#8C3E1E] transition-all duration-300 hover:shadow-lg flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#E7D7C5]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 bg-[#EADCCF] group-hover:bg-[#E3D1C1] transition-colors flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#4A1F10] font-serif-display">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#784E3D] font-mono tabular-nums">{item.subtitle}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#DDC7B3] group-hover:bg-[#8C3E1E] group-hover:text-white flex items-center justify-center text-[#552918] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
