import React from 'react';
import { ArrowRight, Flower } from 'lucide-react';

export const StoryBanner: React.FC = () => {
  return (
    <section id="story-section" className="py-10 px-4 sm:px-6 lg:px-8 bg-[#FBF8F5]">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden bg-[#7B351B] text-[#FFF8F2] grid grid-cols-1 md:grid-cols-12 shadow-xl border border-[#682B14]">
          {/* Left Text Box */}
          <div className="md:col-span-5 p-8 sm:p-12 flex flex-col justify-center bg-[#E5A882] text-[#4A1F10]">
            <div className="w-8 h-8 rounded-full bg-[#D69269] flex items-center justify-center text-[#4A1F10] mb-4">
              <Flower className="w-4 h-4" />
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-[#3E180A] uppercase leading-snug mb-3">
              FLOWERS THAT TELL BEAUTIFUL STORIES
            </h2>
            <p className="text-xs sm:text-sm text-[#542816] leading-relaxed mb-6 font-light">
              Kami mengurasi bunga segar berstandar internasional dan merancangnya dengan dedikasi penuh untuk menghadirkan keindahan, kehangatan, serta makna mendalam pada setiap perayaan hidup Anda.
            </p>
            <div>
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A1F10] text-[#FFF8F2] text-xs font-semibold hover:bg-[#331408] transition-colors"
              >
                <span>CERITA HASFARM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Workshop Image */}
          <div className="md:col-span-7 relative min-h-[260px] md:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1558350315-8aa00e8e4590?auto=format&fit=crop&w=1200&q=80"
              alt="Hasfarm Florist arranging luxury bouquets in atelier"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
