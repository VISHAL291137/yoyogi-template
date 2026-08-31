import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { PortfolioItem } from '../types';

interface ModelPortfolioProps {
  items: PortfolioItem[];
}

export default function ModelPortfolio({ items }: ModelPortfolioProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Editorial' | 'Runway' | 'Campaign' | 'Portrait'>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter((item) => item.category === activeFilter);

  return (
    <section
      id="portfolio"
      className="w-full bg-[#FAF7F2] text-[#1A1A1A] py-24 sm:py-32 lg:py-36 border-b border-[#ECE5D8]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-16 border-b border-[#ECE5D8] pb-8">
          <div>
            <div
              id="portfolio-label"
              className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#CD7F63] mb-3 font-sans"
            >
              SELECTED WORKS
            </div>
            <h2
              id="portfolio-heading"
              className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
            >
              Editorial Portfolio
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {(['All', 'Editorial', 'Runway', 'Campaign', 'Portrait'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-[#1A1A1A] text-[#FAF7F2] shadow-sm'
                    : 'bg-white/60 text-[#595246] hover:bg-[#1A1A1A] hover:text-[#FAF7F2] border border-[#EAE3D6]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Dynamic Editorial Grid with Mix of Portrait and Landscape */}
        <div
          id="portfolio-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start"
        >
          {filteredItems.map((item) => {
            const isLandscape = item.aspect === 'landscape';
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group cursor-pointer flex flex-col ${
                  isLandscape ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                }`}
              >
                {/* Image Container with Editorial Frame */}
                <div className={`relative overflow-hidden rounded-xl bg-[#EAE3D6] border border-[#EAE3D6] shadow-sm group-hover:shadow-md transition-all duration-300 ${
                  isLandscape ? 'aspect-[16/10]' : 'aspect-[3/4]'
                }`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Dark Vignette & Hover Indicator */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-[#FAF7F2]/90 backdrop-blur-md p-3 rounded-full text-[#1A1A1A] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[9px] tracking-[0.2em] uppercase text-white font-mono">
                    {item.category}
                  </div>
                </div>

                {/* Caption / Meta */}
                <div className="mt-4 flex items-baseline justify-between gap-4 px-1">
                  <h3
                    className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#1A1A1A] group-hover:text-[#CD7F63] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
                  >
                    {item.title}
                  </h3>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#786F62] font-mono">
                    {item.season}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          id="portfolio-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
            />

            <div className="mt-4 text-center text-[#FAF7F2]">
              <div className="text-sm font-semibold tracking-widest uppercase text-[#CD7F63]">
                {selectedItem.category} · {selectedItem.season}
              </div>
              <h4
                className="font-editorial-serif text-2xl sm:text-3xl mt-1"
                style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
              >
                {selectedItem.title}
              </h4>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
