import { Tag, ArrowDown, Sparkles } from 'lucide-react';
import { ModelInfo } from '../types';

interface ModelHeroProps {
  modelInfo: ModelInfo;
  onOpenTagModal: () => void;
}

export default function ModelHero({ modelInfo, onOpenTagModal }: ModelHeroProps) {
  return (
    <section
      id="profile"
      className="w-full min-h-screen flex flex-col lg:flex-row pt-0 border-b border-[#ECE5D8]"
    >
      {/* Left Column: Large Model Photograph as Main Visual Focus */}
      <div
        id="model-hero-photo-column"
        className="relative w-full lg:w-1/2 min-h-[60vh] sm:min-h-[70vh] lg:min-h-screen overflow-hidden bg-[#181818] flex items-center justify-center"
      >
        <img
          id="model-primary-portrait"
          src={modelInfo.heroImage}
          alt={`${modelInfo.name} - High Fashion Model Portfolio`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Luxury Corner Label Overlay */}
        <div className="absolute bottom-6 left-6 z-10 bg-black/40 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-[10px] tracking-[0.25em] uppercase text-[#FAF7F2] font-mono">
          DIGITAL PORTFOLIO · 2026
        </div>
      </div>

      {/* Right Column: Editorial Model Information */}
      <div
        id="model-hero-content-column"
        className="w-full lg:w-1/2 flex flex-col justify-between bg-[#FAF7F2] px-8 sm:px-14 md:px-18 lg:px-20 py-20 sm:py-24 lg:py-28"
      >
        {/* Top Segment: Agency & Representation */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECE5D8] pb-5">
            <div
              id="model-agency"
              className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#786F62] font-sans"
            >
              {modelInfo.agency}
            </div>
            <div
              id="model-locations"
              className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#CD7F63] font-sans"
            >
              {modelInfo.locations}
            </div>
          </div>

          {/* Model Categories */}
          <div className="flex items-center gap-2">
            <span
              id="model-categories"
              className="inline-flex items-center gap-1.5 bg-[#FAF4EC] border border-[#E8DFC8] px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1A1A1A]"
            >
              <Sparkles className="w-3 h-3 text-[#CD7F63]" />
              {modelInfo.categories.join(' · ')}
            </span>
          </div>

          {/* Large Model Name with Cormorant Garamond */}
          <div>
            <h1
              id="model-name"
              className="font-editorial-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
            >
              {modelInfo.name}
            </h1>
            <p className="text-xs tracking-[0.3em] uppercase text-[#786F62] mt-2 font-mono">
              DIRECT BOOKING & EDITORIAL ROSTER
            </p>
          </div>

          {/* Short Professional Profile Description */}
          <p
            id="model-bio"
            className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#595246] font-normal max-w-lg font-sans"
          >
            {modelInfo.bio}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Simple TAG action button */}
            <button
              id="tag-action-btn"
              type="button"
              onClick={onOpenTagModal}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#FAF7F2] hover:bg-[#333] px-7 sm:px-8 py-3 rounded-full text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-200 shadow-sm"
            >
              <Tag className="w-3.5 h-3.5 text-[#CD7F63]" />
              <span>TAG</span>
            </button>

            {/* Quick Link to Portfolio */}
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF7F2] px-7 sm:px-8 py-3 rounded-full text-xs font-semibold tracking-[0.22em] uppercase transition-all duration-200"
            >
              <span>VIEW WORKS</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Segment: Quick Key Measurements Banner */}
        <div className="mt-12 pt-8 border-t border-[#ECE5D8]">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
            <div className="border-r border-[#ECE5D8] last:border-0 pr-2">
              <div className="text-[10px] text-[#786F62] uppercase tracking-widest">HEIGHT</div>
              <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{modelInfo.height}</div>
            </div>
            <div className="border-r border-[#ECE5D8] last:border-0 pr-2">
              <div className="text-[10px] text-[#786F62] uppercase tracking-widest">BUST</div>
              <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{modelInfo.bust}</div>
            </div>
            <div className="border-r border-[#ECE5D8] last:border-0 pr-2">
              <div className="text-[10px] text-[#786F62] uppercase tracking-widest">WAIST</div>
              <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{modelInfo.waist}</div>
            </div>
            <div className="border-r border-[#ECE5D8] last:border-0 pr-2">
              <div className="text-[10px] text-[#786F62] uppercase tracking-widest">HIPS</div>
              <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{modelInfo.hips}</div>
            </div>
            <div className="border-r border-[#ECE5D8] last:border-0 pr-2">
              <div className="text-[10px] text-[#786F62] uppercase tracking-widest">SHOES</div>
              <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{modelInfo.shoes}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#786F62] uppercase tracking-widest">EYES</div>
              <div className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{modelInfo.eyes}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
