export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="w-full bg-[#181C17] text-[#FAF7F2] border-t border-neutral-800 py-16 sm:py-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-16 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-[#FAF7F2]">
              YOGI
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed font-light">
              An editorial sanctuary for mindful movement, conscious breathwork, and transformative home practice.
            </p>
            <div className="inline-block border border-[#CD7F63] px-3.5 py-1 rounded-full text-[10px] text-[#CD7F63] tracking-[0.25em] uppercase font-medium">
              EST. 2026 · SANCTUARY
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs tracking-wider">
            <div className="font-semibold uppercase text-neutral-200 tracking-[0.25em] text-[11px] mb-4">
              Navigation
            </div>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Home Practice
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Our Space
                </a>
              </li>
              <li>
                <a href="#instructors" className="hover:text-white transition-colors">
                  Faculty & Staff
                </a>
              </li>
            </ul>
          </div>

          {/* Practice Hours / Studio */}
          <div className="space-y-3 text-xs tracking-wider">
            <div className="font-semibold uppercase text-neutral-200 tracking-[0.25em] text-[11px] mb-4">
              Sanctuary
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs">
              Daily Live Sessions
              <br />
              6:00 AM – 8:30 PM EST
              <br />
              Global Virtual Streaming
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Yogi Yoga Studio. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="cursor-default hover:text-neutral-400 transition-colors">Privacy Policy</span>
            <span className="cursor-default hover:text-neutral-400 transition-colors">Terms of Practice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
