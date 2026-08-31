import { useState, useEffect } from 'react';

interface ModelHeaderProps {
  onEditProfile: () => void;
  activeSection: string;
}

export default function ModelHeader({ onEditProfile, activeSection }: ModelHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { num: '1', label: 'PROFILE', href: '#profile' },
    { num: '2', label: 'PORTFOLIO', href: '#portfolio' },
    { num: '3', label: 'STATS', href: '#stats' },
    { num: '4', label: 'REPRESENTATION', href: '#representation' },
    { num: '5', label: 'AGENCY', href: '#about-model-agency' },
  ];

  return (
    <header
      id="main-model-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#EAE3D6] py-3 sm:py-4'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between">
        {/* Top-Left Logo */}
        <a
          href="#profile"
          id="model-logo"
          className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-[#1A1A1A] hover:opacity-80 transition-opacity"
        >
          YOGI
        </a>

        {/* Center: Navigation Numbers "1  2  3  4" */}
        <nav
          id="model-nav-numbers"
          aria-label="Model Profile Navigation"
          className="flex items-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#1A1A1A]"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.num}
                href={item.href}
                className={`transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#CD7F63] font-bold border-b border-[#CD7F63] pb-0.5'
                    : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
              >
                <span>{item.num}</span>
                <span className="hidden md:inline text-[10px] tracking-[0.2em] font-normal text-[#786F62]">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Top-Right EDIT button */}
        <div className="flex items-center gap-3">
          <button
            id="edit-profile-btn"
            type="button"
            onClick={onEditProfile}
            className="border border-[#1A1A1A] text-[#1A1A1A] bg-white/50 hover:bg-[#1A1A1A] hover:text-[#FAF7F2] px-5 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-[0.22em] uppercase transition-all duration-200 shadow-sm"
          >
            EDIT
          </button>
        </div>
      </div>
    </header>
  );
}
