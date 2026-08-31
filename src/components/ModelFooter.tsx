import { ModelInfo } from '../types';

interface ModelFooterProps {
  modelInfo: ModelInfo;
}

export default function ModelFooter({ modelInfo }: ModelFooterProps) {
  return (
    <footer
      id="site-footer"
      className="w-full bg-[#141414] text-[#FAF7F2] border-t border-neutral-800 py-16 sm:py-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-16 mb-14">
          {/* Column 1: Model & Agency */}
          <div className="md:col-span-2 space-y-4">
            <div className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-[#FAF7F2]">
              {modelInfo.name}
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed font-light">
              High-fashion international model represented across Paris, Milan, and New York. Available for runway, editorial spreads, and brand campaigns.
            </p>
            <div className="inline-block border border-[#CD7F63] px-3.5 py-1 rounded-full text-[10px] text-[#CD7F63] tracking-[0.25em] uppercase font-medium">
              {modelInfo.agency}
            </div>
          </div>

          {/* Column 2: Placements */}
          <div className="space-y-3 text-xs tracking-wider">
            <div className="font-semibold uppercase text-neutral-200 tracking-[0.25em] text-[11px] mb-4">
              Agencies & Offices
            </div>
            <ul className="space-y-2 text-neutral-400 text-xs">
              <li>Paris — Avenue Montaigne</li>
              <li>Milan — Via Montenapoleone</li>
              <li>New York — Soho Studio</li>
              <li>London — Mayfair Office</li>
            </ul>
          </div>

          {/* Column 3: Direct Contacts */}
          <div className="space-y-3 text-xs tracking-wider">
            <div className="font-semibold uppercase text-neutral-200 tracking-[0.25em] text-[11px] mb-4">
              Direct Inquiries
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs">
              booking@silhouette-models.com
              <br />
              press@yogi-model.com
              <br />
              +33 (0)1 42 68 55 00
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} {modelInfo.name} · All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="cursor-default hover:text-neutral-400 transition-colors">Digital Comp Card</span>
            <span className="cursor-default hover:text-neutral-400 transition-colors">Privacy & Likeness Rights</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
