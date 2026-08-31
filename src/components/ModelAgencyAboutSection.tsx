import { ModelAgencyInfo } from '../types';

interface ModelAgencyAboutSectionProps {
  agencyInfo: ModelAgencyInfo;
}

export default function ModelAgencyAboutSection({ agencyInfo }: ModelAgencyAboutSectionProps) {
  return (
    <section
      id="about-model-agency"
      className="w-full min-h-screen bg-[#0C0C0E] text-[#FAF7F2] flex flex-col lg:flex-row items-stretch border-b border-neutral-800"
    >
      {/* LEFT COLUMN: Large Model Photograph (approx 40% width) */}
      <div
        id="model-image-column"
        className="w-full lg:w-[40%] xl:w-[42%] relative min-h-[520px] sm:min-h-[640px] lg:min-h-full flex items-stretch overflow-hidden bg-[#121214]"
      >
        <img
          id="model-agency-featured-photo"
          src={agencyInfo.agencyImage}
          alt="Modelia Agency Model Portrait"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center lg:object-top"
        />
      </div>

      {/* RIGHT COLUMN: Text and Content Area (approx 60% width) */}
      <div
        id="model-content-column"
        className="w-full lg:w-[60%] xl:w-[58%] flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-24 py-16 sm:py-24 lg:py-28 bg-[#0C0C0E]"
      >
        <div className="max-w-3xl">
          {/* Large Bold Serif Heading in Bright Pink */}
          <h1
            id="agency-greeting-heading"
            className="font-editorial-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[#FF2A7A] mb-6 sm:mb-8 leading-none"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif" }}
          >
            {agencyInfo.greeting}
          </h1>

          {/* Large White/Cream Introductory Text */}
          <p
            id="agency-primary-lead-text"
            className="text-xl sm:text-2xl md:text-[28px] lg:text-[32px] font-normal leading-snug sm:leading-tight text-[#F5F3EF] mb-6 sm:mb-8"
            style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
          >
            {agencyInfo.leadText}
          </p>

          {/* Additional Paragraph Text in Clean Light-Gray Typography */}
          <p
            id="agency-secondary-paragraph-text"
            className="text-sm sm:text-base text-[#9E9B96] leading-relaxed font-light mb-10 max-w-2xl font-sans"
          >
            {agencyInfo.paragraphText}
          </p>

          {/* Signature-Style Graphic */}
          <div id="agency-signature-wrapper" className="mb-10 sm:mb-12">
            <svg
              id="agency-signature-graphic"
              className="w-56 sm:w-64 h-16 text-[#F5F3EF]"
              viewBox="0 0 260 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Modelia Signature"
            >
              <path
                d="M12 48 C28 18, 38 14, 48 44 C53 58, 58 60, 66 32 C72 10, 80 12, 84 36 C88 52, 98 50, 112 34 C122 22, 132 40, 142 30 C152 20, 162 42, 178 32 C194 22, 206 48, 242 26"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 60 C75 54, 150 50, 228 52"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <text
                x="145"
                y="67"
                fill="#9E9B96"
                fontSize="9"
                letterSpacing="0.25em"
                fontFamily="sans-serif"
                textAnchor="start"
              >
                {agencyInfo.signatureRole}
              </text>
            </svg>
          </div>

          {/* Two CTA Buttons Side-by-Side */}
          <div
            id="agency-cta-buttons-container"
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
          >
            {/* 1. OUTLINED pink button */}
            <button
              id="become-a-model-btn"
              type="button"
              className="border-2 border-[#FF2A7A] text-[#FF2A7A] hover:bg-[#FF2A7A] hover:text-white px-8 py-3.5 rounded-none font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase transition-colors duration-200 text-center whitespace-nowrap"
            >
              {agencyInfo.btnBecomeModelText}
            </button>

            {/* 2. SOLID pink button */}
            <button
              id="schedule-casting-btn"
              type="button"
              className="bg-[#FF2A7A] text-white hover:bg-[#E01865] border-2 border-[#FF2A7A] px-8 py-3.5 rounded-none font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase transition-colors duration-200 text-center whitespace-nowrap shadow-sm"
            >
              {agencyInfo.btnScheduleCastingText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
