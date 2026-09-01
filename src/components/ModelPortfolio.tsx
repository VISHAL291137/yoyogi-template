import { useState } from 'react';
import { Maximize2, X, FolderHeart, Sparkles } from 'lucide-react';
import { PortfolioItem, Album } from '../types';

interface ModelPortfolioProps {
  items: PortfolioItem[];
  albums?: Album[];
}

export default function ModelPortfolio({ items, albums = [] }: ModelPortfolioProps) {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Editorial' | 'Runway' | 'Campaign' | 'Portrait'>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Filter items by selected album (if any selected) AND category
  const filteredItems = items.filter((item) => {
    const matchesAlbum = selectedAlbumId === 'all' || item.albumId === selectedAlbumId;
    const matchesCategory = activeFilter === 'All' || item.category === activeFilter;
    return matchesAlbum && matchesCategory;
  });

  const currentAlbum = albums.find((a) => a.id === selectedAlbumId);

  return (
    <section
      id="album"
      className="w-full bg-[#FAF7F2] text-[#1A1A1A] py-24 sm:py-32 lg:py-36 border-b border-[#ECE5D8]"
    >
      <div id="portfolio" className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 sm:mb-12 border-b border-[#ECE5D8] pb-8">
          <div>
            <div
              id="portfolio-label"
              className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#CD7F63] mb-3 font-sans flex items-center gap-2"
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span>EDITORIAL ALBUMS & LOOKBOOKS</span>
            </div>
            <h2
              id="portfolio-heading"
              className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
            >
              {currentAlbum ? currentAlbum.title : 'Editorial Portfolio & Albums'}
            </h2>
            {currentAlbum?.description && (
              <p className="mt-3 text-sm sm:text-base text-[#786F62] max-w-2xl font-light">
                {currentAlbum.description}
              </p>
            )}
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

        {/* Distinct Albums Selector Tabs / Chips */}
        {albums.length > 0 && (
          <div className="mb-12 pb-6 border-b border-[#EAE3D6]/70">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#786F62] font-mono">
                Select Album Collection:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedAlbumId('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-2 ${
                  selectedAlbumId === 'all'
                    ? 'bg-[#1A1A1A] text-white shadow-md'
                    : 'bg-white border border-[#EAE3D6] text-[#595246] hover:border-[#1A1A1A]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CD7F63]" />
                <span>All Collections ({items.length})</span>
              </button>

              {albums.map((album) => {
                const count = items.filter((i) => i.albumId === album.id).length;
                const isSelected = selectedAlbumId === album.id;
                return (
                  <button
                    key={album.id}
                    type="button"
                    onClick={() => setSelectedAlbumId(album.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white shadow-md'
                        : 'bg-white border border-[#EAE3D6] text-[#595246] hover:border-[#1A1A1A]'
                    }`}
                  >
                    <span>{album.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state if album has no items */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 px-4 bg-white/50 border border-dashed border-[#E0D8CA] rounded-2xl">
            <p className="text-sm font-medium text-[#786F62]">
              No photographs found in this collection filter.
            </p>
          </div>
        )}

        {/* Portfolio Dynamic Editorial Grid with Mix of Portrait and Landscape */}
        <div
          id="portfolio-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start"
        >
          {filteredItems.map((item) => {
            const isLandscape = item.aspect === 'landscape';
            const matchedAlbum = albums.find((a) => a.id === item.albumId);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group cursor-pointer flex flex-col ${
                  isLandscape ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                }`}
              >
                {/* Image Container with Editorial Frame */}
                <div
                  className={`relative overflow-hidden rounded-xl bg-[#EAE3D6] border border-[#EAE3D6] shadow-sm group-hover:shadow-md transition-all duration-300 ${
                    isLandscape ? 'aspect-[16/10]' : 'aspect-[3/4]'
                  }`}
                >
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

                  {/* Corner Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1 items-start">
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[9px] tracking-[0.2em] uppercase text-white font-mono">
                      {item.category}
                    </span>
                    {matchedAlbum && (
                      <span className="bg-[#CD7F63]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase text-white font-mono">
                        {matchedAlbum.title}
                      </span>
                    )}
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
