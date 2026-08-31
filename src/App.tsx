import { useState, useEffect } from 'react';
import ModelHeader from './components/ModelHeader';
import ModelHero from './components/ModelHero';
import ModelPortfolio from './components/ModelPortfolio';
import ModelStats from './components/ModelStats';
import ModelAgencyAboutSection from './components/ModelAgencyAboutSection';
import FullPageEditor from './components/FullPageEditor';
import TagModal from './components/TagModal';
import BookingModal from './components/BookingModal';
import ModelFooter from './components/ModelFooter';
import { ModelInfo, ModelAgencyInfo, PortfolioItem } from './types';
import {
  initDefaultDataIfEmpty,
  subscribeToModelProfile,
  subscribeToAgencySection,
  subscribeToPortfolio,
  saveLiveModelProfile,
  saveLiveAgencySection,
  saveLivePortfolio,
  getLocalCachedData,
  getPersistentCachedData,
  isQuotaExhaustedError
} from './lib/databaseService';
import { Info, X } from 'lucide-react';

export default function App() {
  const cached = getLocalCachedData();
  const [modelInfo, setModelInfo] = useState<ModelInfo>(cached.profile);
  const [agencyInfo, setAgencyInfo] = useState<ModelAgencyInfo>(cached.agency);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(cached.portfolio);
  const [isEditing, setIsEditing] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [dbNotice, setDbNotice] = useState<string | null>(null);

  // Initialize and subscribe to Live Database with graceful error handling
  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubAgency: (() => void) | undefined;
    let unsubPortfolio: (() => void) | undefined;

    const connectDb = async () => {
      // 1. Immediately hydrate from persistent IndexedDB store if available
      try {
        const persistent = await getPersistentCachedData();
        if (persistent) {
          if (persistent.profile) setModelInfo(persistent.profile);
          if (persistent.agency) setAgencyInfo(persistent.agency);
          if (persistent.portfolio) setPortfolioItems(persistent.portfolio);
        }
      } catch (err) {
        console.warn('Persistent cache hydration:', err);
      }

      // 2. Fetch live data from Cloud Firestore database
      try {
        await initDefaultDataIfEmpty((loaded) => {
          if (loaded.profile) setModelInfo(loaded.profile);
          if (loaded.agency) setAgencyInfo(loaded.agency);
          if (loaded.portfolio) setPortfolioItems(loaded.portfolio);
        });

        unsubProfile = subscribeToModelProfile(
          (data) => setModelInfo(data),
          (err) => {
            if (!isQuotaExhaustedError(err)) {
              setDbNotice(err.message);
            }
          }
        );

        unsubAgency = subscribeToAgencySection(
          (data) => setAgencyInfo(data),
          (err) => {
            if (!isQuotaExhaustedError(err)) {
              setDbNotice(err.message);
            }
          }
        );

        unsubPortfolio = subscribeToPortfolio(
          (items) => setPortfolioItems(items),
          (err) => {
            if (!isQuotaExhaustedError(err)) {
              setDbNotice(err.message);
            }
          }
        );
      } catch (err: any) {
        if (!isQuotaExhaustedError(err)) {
          setDbNotice(err?.message || 'Database connection notice');
        }
      }
    };

    connectDb();

    return () => {
      if (unsubProfile) unsubProfile();
      if (unsubAgency) unsubAgency();
      if (unsubPortfolio) unsubPortfolio();
    };
  }, []);

  // Track active section for navigation numbers (1, 2, 3, 4, 5)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['profile', 'portfolio', 'stats', 'representation', 'about-model-agency'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddTag = async (newTag: string) => {
    if (!modelInfo.tags.includes(newTag)) {
      const updated = {
        ...modelInfo,
        tags: [...modelInfo.tags, newTag]
      };
      setModelInfo(updated);
      await saveLiveModelProfile(updated);
    }
  };

  const handleSaveModelInfo = async (updated: ModelInfo) => {
    setModelInfo(updated);
    await saveLiveModelProfile(updated);
  };

  const handleSaveAgencyInfo = async (updated: ModelAgencyInfo) => {
    setAgencyInfo(updated);
    await saveLiveAgencySection(updated);
  };

  const handleSavePortfolioItems = async (updated: PortfolioItem[]) => {
    setPortfolioItems(updated);
    await saveLivePortfolio(updated);
  };

  // Render Full-Page Editor Mode (Not a Popup)
  if (isEditing) {
    return (
      <FullPageEditor
        modelInfo={modelInfo}
        onSaveModelInfo={handleSaveModelInfo}
        agencyInfo={agencyInfo}
        onSaveAgencyInfo={handleSaveAgencyInfo}
        portfolioItems={portfolioItems}
        onSavePortfolioItems={handleSavePortfolioItems}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans antialiased overflow-x-hidden">
      {/* Non-intrusive notification if unexpected notice */}
      {dbNotice && (
        <div className="bg-neutral-900 text-neutral-200 px-6 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#CD7F63] flex-shrink-0" />
            <span>{dbNotice}</span>
          </div>
          <button
            onClick={() => setDbNotice(null)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header: Logo, Navigation Numbers, Edit Button */}
      <ModelHeader
        onEditProfile={() => setIsEditing(true)}
        activeSection={activeSection}
      />

      {/* Main Single-Page Content */}
      <main className="w-full">
        {/* 1. Profile Hero Section */}
        <ModelHero
          modelInfo={modelInfo}
          onOpenTagModal={() => setTagModalOpen(true)}
        />

        {/* 2. Portfolio Grid Section */}
        <ModelPortfolio items={portfolioItems} />

        {/* 3 & 4. Physical Measurements, Polaroids & Representation */}
        <ModelStats
          modelInfo={modelInfo}
          onOpenBooking={() => setBookingModalOpen(true)}
        />

        {/* 5. Model Agency About Section (Appended Down Side) */}
        <ModelAgencyAboutSection agencyInfo={agencyInfo} />
      </main>

      {/* Agency Footer */}
      <ModelFooter modelInfo={modelInfo} />

      <TagModal
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        tags={modelInfo.tags}
        onAddTag={handleAddTag}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        modelInfo={modelInfo}
      />
    </div>
  );
}
