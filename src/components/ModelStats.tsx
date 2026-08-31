import { CheckCircle2, Award, Globe, Mail } from 'lucide-react';
import { ModelInfo } from '../types';

interface ModelStatsProps {
  modelInfo: ModelInfo;
  onOpenBooking: () => void;
}

export default function ModelStats({ modelInfo, onOpenBooking }: ModelStatsProps) {
  const statsList = [
    { label: 'HEIGHT', value: modelInfo.height },
    { label: 'BUST', value: modelInfo.bust },
    { label: 'WAIST', value: modelInfo.waist },
    { label: 'HIPS', value: modelInfo.hips },
    { label: 'SHOES', value: modelInfo.shoes },
    { label: 'EYES', value: modelInfo.eyes },
    { label: 'HAIR', value: modelInfo.hair },
    { label: 'ETHNICITY / LOOK', value: 'Global Contemporary' },
  ];

  return (
    <section
      id="stats"
      className="w-full bg-[#FAF7F2] text-[#1A1A1A] py-24 sm:py-32 lg:py-36 border-b border-[#ECE5D8]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Measurements & Spec Card */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div
                id="stats-label"
                className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#CD7F63] mb-3 font-sans"
              >
                SPECIFICATION & METRICS
              </div>
              <h2
                id="stats-heading"
                className="font-editorial-serif text-4xl sm:text-5xl font-normal leading-[1.14] tracking-tight text-[#1A1A1A]"
                style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
              >
                Physical Statistics & Polaroids
              </h2>
              <p className="text-xs sm:text-sm text-[#595246] mt-3 max-w-lg">
                Official comp-card measurement specs verified for international runway casting, digital lookbooks, and global campaign bookings.
              </p>
            </div>

            {/* Measurements Table Card */}
            <div className="bg-white/80 border border-[#EAE3D6] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {statsList.map((stat) => (
                  <div key={stat.label} className="border-b border-[#F0EAE0] pb-4">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-[#786F62] font-semibold">
                      {stat.label}
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-[#1A1A1A] mt-1 font-mono">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags Cloud */}
              <div className="mt-8 pt-6 border-t border-[#ECE5D8]">
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#786F62] font-semibold mb-3">
                  AGENCY ATTRIBUTES & TAGS
                </div>
                <div className="flex flex-wrap gap-2">
                  {modelInfo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#FAF4EC] border border-[#E8DFC8] px-3.5 py-1 rounded-full text-xs text-[#595246]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Representation & Direct Booking Inquiries */}
          <div
            id="representation"
            className="lg:col-span-5 bg-[#FAF4EC] border border-[#E8DFC8] rounded-2xl p-8 sm:p-10 space-y-6 shadow-sm"
          >
            <div className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#CD7F63] font-sans">
              GLOBAL REPRESENTATION
            </div>

            <h3
              className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#1A1A1A]"
              style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
            >
              Direct Agency Booking
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#595246]">
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#CD7F63] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-xs">
                    Primary Placements
                  </div>
                  <div>Paris · Milan · New York · London · Tokyo</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-[#CD7F63] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-xs">
                    Direct Management
                  </div>
                  <div>Elite Model Management / Silhouette Worldwide</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#CD7F63] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-xs">
                    Availability
                  </div>
                  <div>Worldwide Fashion Weeks & Editorial Travel</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full bg-[#1A1A1A] text-[#FAF7F2] hover:bg-[#333] py-3.5 rounded-full text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#CD7F63]" />
                <span>REQUEST COMP-CARD & RATES</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
