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
import { ModelInfo, ModelAgencyInfo, PortfolioItem, Album } from './types';
import { INITIAL_MODEL_INFO, INITIAL_AGENCY_INFO, PORTFOLIO_ITEMS, INITIAL_ALBUMS } from './data/modelData';
import {
  fetchCloudData,
  subscribeToModelProfile,
  subscribeToAgencySection,
  subscribeToPortfolio,
  subscribeToAlbums,
  saveLiveModelProfile,
  saveLiveAgencySection,
  saveLivePortfolio,
  saveLiveAlbums,
  clearAllDatabaseData,
  isQuotaExhaustedError
} from './lib/databaseService';
import { Info, X } from 'lucide-react';

const CACHE_KEYS = {
  PROFILE: 'model_portfolio_cache_profile',
  AGENCY: 'model_portfolio_cache_agency',
  PORTFOLIO: 'model_portfolio_cache_portfolio',
  ALBUMS: 'model_portfolio_cache_albums',
};

function getCached<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setCached<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota/privacy errors
  }
}

export default function App() {
  const [modelInfo, setModelInfoState] = useState<ModelInfo>(() =>
    getCached<ModelInfo>(CACHE_KEYS.PROFILE, INITIAL_MODEL_INFO)
  );
  const [agencyInfo, setAgencyInfoState] = useState<ModelAgencyInfo>(() =>
    getCached<ModelAgencyInfo>(CACHE_KEYS.AGENCY, INITIAL_AGENCY_INFO)
  );
  const [portfolioItems, setPortfolioItemsState] = useState<PortfolioItem[]>(() =>
    getCached<PortfolioItem[]>(CACHE_KEYS.PORTFOLIO, PORTFOLIO_ITEMS)
  );
  const [albums, setAlbumsState] = useState<Album[]>(() =>
    getCached<Album[]>(CACHE_KEYS.ALBUMS, INITIAL_ALBUMS)
  );

  const setModelInfo = (data: ModelInfo) => {
    setModelInfoState(data);
    setCached(CACHE_KEYS.PROFILE, data);
  };

  const setAgencyInfo = (data: ModelAgencyInfo) => {
    setAgencyInfoState(data);
    setCached(CACHE_KEYS.AGENCY, data);
  };

  const setPortfolioItems = (data: PortfolioItem[]) => {
    setPortfolioItemsState(data);
    setCached(CACHE_KEYS.PORTFOLIO, data);
  };

  const setAlbums = (data: Album[]) => {
    setAlbumsState(data);
    setCached(CACHE_KEYS.ALBUMS, data);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [dbNotice, setDbNotice] = useState<string | null>(null);

  // Initialize and subscribe to Live Cloud Firestore Database exclusively
  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubAgency: (() => void) | undefined;
    let unsubPortfolio: (() => void) | undefined;
    let unsubAlbums: (() => void) | undefined;

    const connectDb = async () => {
      try {
        await fetchCloudData((loaded) => {
          if (loaded.profile) setModelInfo(loaded.profile);
          if (loaded.agency) setAgencyInfo(loaded.agency);
          if (loaded.portfolio) setPortfolioItems(loaded.portfolio);
          if (loaded.albums && loaded.albums.length > 0) setAlbums(loaded.albums);
          setIsSyncing(false);
        });

        unsubProfile = subscribeToModelProfile(
          (data) => {
            setModelInfo(data);
            setIsSyncing(false);
          },
          (err) => {
            if (!isQuotaExhaustedError(err)) {
              setDbNotice(err.message);
            }
          }
        );

        unsubAgency = subscribeToAgencySection(
          (data) => {
            setAgencyInfo(data);
            setIsSyncing(false);
          },
          (err) => {
            if (!isQuotaExhaustedError(err)) {
              setDbNotice(err.message);
            }
          }
        );

        unsubPortfolio = subscribeToPortfolio(
          (items) => {
            setPortfolioItems(items);
            setIsSyncing(false);
          },
          (err) => {
            if (!isQuotaExhaustedError(err)) {
              setDbNotice(err.message);
            }
          }
        );

        unsubAlbums = subscribeToAlbums(
          (albumList) => {
            setAlbums(albumList);
            setIsSyncing(false);
          },
          (err) => {
            if (!isQuotaExhaustedError(err)) {
              setDbNotice(err.message);
            }
          }
        );
      } catch (err: any) {
        setIsSyncing(false);
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
      if (unsubAlbums) unsubAlbums();
    };
  }, []);

  // Track active section for navigation numbers (1, 2, 3, 4, 5)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['profile', 'album', 'portfolio', 'stats', 'representation', 'about-model-agency'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId === 'portfolio' ? 'album' : sectionId);
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

  const handleSaveAlbums = async (updated: Album[]) => {
    setAlbums(updated);
    await saveLiveAlbums(updated);
  };

  const handleResetToDefaults = async () => {
    // 1. Clear local cache
    try {
      localStorage.removeItem(CACHE_KEYS.PROFILE);
      localStorage.removeItem(CACHE_KEYS.AGENCY);
      localStorage.removeItem(CACHE_KEYS.PORTFOLIO);
      localStorage.removeItem(CACHE_KEYS.ALBUMS);
    } catch {
      // ignore
    }

    // 2. Reset local state immediately to initial defaults
    setModelInfo(INITIAL_MODEL_INFO);
    setAgencyInfo(INITIAL_AGENCY_INFO);
    setPortfolioItems(PORTFOLIO_ITEMS);
    setAlbums(INITIAL_ALBUMS);

    // 3. Clear all documents in Firestore
    await clearAllDatabaseData();
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
        albums={albums}
        onSaveAlbums={handleSaveAlbums}
        onResetToDefaults={handleResetToDefaults}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans antialiased overflow-x-hidden">
      {/* Subtle sync progress line */}
      {isSyncing && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-gradient-to-r from-transparent via-[#CD7F63] to-transparent animate-pulse" />
      )}

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

        {/* 2. Portfolio Grid & Albums Section */}
        <ModelPortfolio items={portfolioItems} albums={albums} />

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

