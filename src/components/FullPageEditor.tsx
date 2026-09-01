import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import {
  ArrowLeft,
  Check,
  Upload,
  Trash2,
  Plus,
  Sliders,
  Sparkles,
  Layers,
  FileText,
  Activity,
  Eye,
  Camera,
  X,
  Compass,
  User,
  HeartHandshake,
  Loader2
} from 'lucide-react';
import { ModelInfo, ModelAgencyInfo, PortfolioItem } from '../types';
import { optimizeImageFile } from '../lib/imageUtils';

interface FullPageEditorProps {
  modelInfo: ModelInfo;
  onSaveModelInfo: (updated: ModelInfo) => Promise<void> | void;
  agencyInfo: ModelAgencyInfo;
  onSaveAgencyInfo: (updated: ModelAgencyInfo) => Promise<void> | void;
  portfolioItems: PortfolioItem[];
  onSavePortfolioItems: (updated: PortfolioItem[]) => Promise<void> | void;
  onClose: () => void;
}

export default function FullPageEditor({
  modelInfo,
  onSaveModelInfo,
  agencyInfo,
  onSaveAgencyInfo,
  portfolioItems,
  onSavePortfolioItems,
  onClose,
}: FullPageEditorProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'profile' | 'agency' | 'portfolio' | 'stats'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  // Working state copies
  const [modelForm, setModelForm] = useState<ModelInfo>({ ...modelInfo });
  const [agencyForm, setAgencyForm] = useState<ModelAgencyInfo>({ ...agencyInfo });
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([...portfolioItems]);

  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  // Refs for file uploads
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const agencyImageInputRef = useRef<HTMLInputElement>(null);
  const portfolioImageInputRef = useRef<HTMLInputElement>(null);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);

  const handleSaveAndExit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      await Promise.all([
        Promise.resolve(onSaveModelInfo(modelForm)),
        Promise.resolve(onSaveAgencyInfo(agencyForm)),
        Promise.resolve(onSavePortfolioItems(portfolioList)),
      ]);
    } catch (err) {
      console.warn('Save notice:', err);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const handleHeroImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingSection('hero');
      try {
        const optimized = await optimizeImageFile(file, 1200, 0.78);
        setModelForm((prev) => ({ ...prev, heroImage: optimized }));
      } catch (err) {
        console.error('Error reading hero image:', err);
      } finally {
        setUploadingSection(null);
      }
    }
  };

  const handleAgencyImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingSection('agency');
      try {
        const optimized = await optimizeImageFile(file, 1200, 0.78);
        setAgencyForm((prev) => ({ ...prev, agencyImage: optimized }));
      } catch (err) {
        console.error('Error reading agency image:', err);
      } finally {
        setUploadingSection(null);
      }
    }
  };

  const handlePortfolioImageUpload = async (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingSection(id);
      try {
        const optimized = await optimizeImageFile(file, 1100, 0.75);
        setPortfolioList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, image: optimized } : item))
        );
      } catch (err) {
        console.error('Error reading portfolio image:', err);
      } finally {
        setUploadingSection(null);
      }
    }
  };

  const handleAddPortfolioItem = () => {
    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: 'New Editorial Spread',
      category: 'Editorial',
      season: 'Campaign 2026',
      aspect: 'portrait',
      image: modelForm.heroImage,
    };
    setPortfolioList([...portfolioList, newItem]);
  };

  const handleDeletePortfolioItem = (id: string) => {
    setPortfolioList(portfolioList.filter((item) => item.id !== id));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !modelForm.tags.includes(tagInput.trim())) {
      setModelForm({
        ...modelForm,
        tags: [...modelForm.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setModelForm({
      ...modelForm,
      tags: modelForm.tags.filter((t) => t !== tag),
    });
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !modelForm.categories.includes(categoryInput.trim().toUpperCase())) {
      setModelForm({
        ...modelForm,
        categories: [...modelForm.categories, categoryInput.trim().toUpperCase()],
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setModelForm({
      ...modelForm,
      categories: modelForm.categories.filter((c) => c !== cat),
    });
  };

  return (
    <div id="full-page-site-editor" className="w-full min-h-screen bg-[#F4EFE6] text-[#1A1A1A] font-sans antialiased pb-28">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={heroImageInputRef}
        onChange={handleHeroImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={agencyImageInputRef}
        onChange={handleAgencyImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={portfolioImageInputRef}
        onChange={(e) => {
          if (editingPortfolioId) {
            handlePortfolioImageUpload(e, editingPortfolioId);
          }
        }}
        accept="image/*"
        className="hidden"
      />

      {/* Top Sticky Bar */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E0D8CA] px-6 sm:px-10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#786F62] hover:text-[#1A1A1A] transition-colors bg-white/70 border border-[#EAE3D6] px-4 py-2 rounded-full shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Website</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-[#CD7F63]/15 text-[#CD7F63]">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Full Page Editorial Studio
                </h1>
                <p className="text-[10px] text-[#786F62] font-mono">
                  Direct edit mode for images, copy, and layout metadata
                </p>
              </div>
            </div>
          </div>

          {/* Quick Save Header Button */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAndExit}
            className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333] active:scale-95 text-[#FAF7F2] px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md cursor-pointer disabled:opacity-75"
          >
            <Check className="w-4 h-4 text-[#CD7F63]" />
            <span>{isSaving ? 'Saving...' : 'Save & Exit'}</span>
          </button>
        </div>
      </header>

      {/* Main Two-Column Layout with Left Sidebar Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ================= LEFT SIDE: SECTION NAVIGATION & CONTROLS ================= */}
        <aside id="editor-left-sidebar" className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 space-y-6">
          <div className="bg-[#FAF7F2] border border-[#E0D8CA] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD7F63] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Page Sections</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">4 Modules</span>
            </div>

            {/* Vertical Section Navigation Buttons */}
            <nav className="space-y-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all text-left ${
                  activeTab === 'all'
                    ? 'bg-[#1A1A1A] text-[#FAF7F2] shadow-sm'
                    : 'bg-white/70 text-[#786F62] hover:bg-white hover:text-black border border-[#EAE3D6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#CD7F63]" />
                  <span>All Sections</span>
                </div>
                <span className="text-[10px] opacity-70">View All</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all text-left ${
                  activeTab === 'profile'
                    ? 'bg-[#1A1A1A] text-[#FAF7F2] shadow-sm'
                    : 'bg-white/70 text-[#786F62] hover:bg-white hover:text-black border border-[#EAE3D6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#CD7F63]" />
                  <span>1. Hero & Portrait</span>
                </div>
                <span className="text-[10px] opacity-70">Hero</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('agency')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all text-left ${
                  activeTab === 'agency'
                    ? 'bg-[#FF2A7A] text-white shadow-sm'
                    : 'bg-white/70 text-[#786F62] hover:bg-white hover:text-black border border-[#EAE3D6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-pink-300" />
                  <span>2. Modelia Section</span>
                </div>
                <span className="text-[10px] opacity-70">Agency</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('portfolio')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all text-left ${
                  activeTab === 'portfolio'
                    ? 'bg-[#1A1A1A] text-[#FAF7F2] shadow-sm'
                    : 'bg-white/70 text-[#786F62] hover:bg-white hover:text-black border border-[#EAE3D6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Camera className="w-4 h-4 text-[#CD7F63]" />
                  <span>3. Portfolio Grid</span>
                </div>
                <span className="text-[10px] opacity-70">{portfolioList.length} Spreads</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all text-left ${
                  activeTab === 'stats'
                    ? 'bg-[#1A1A1A] text-[#FAF7F2] shadow-sm'
                    : 'bg-white/70 text-[#786F62] hover:bg-white hover:text-black border border-[#EAE3D6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#CD7F63]" />
                  <span>4. Stats & Specs</span>
                </div>
                <span className="text-[10px] opacity-70">Comp-Card</span>
              </button>
            </nav>

            {/* Model Preview Summary Mini Card */}
            <div className="pt-3 border-t border-[#EAE3D6] space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={modelForm.heroImage}
                  alt={modelForm.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-[#CD7F63]"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#1A1A1A] truncate">{modelForm.name}</h4>
                  <p className="text-[10px] text-[#786F62] truncate">{modelForm.agency}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#786F62] font-mono bg-white/60 p-2.5 rounded-lg border border-[#EAE3D6]">
                <div>Height: <span className="font-bold text-[#1A1A1A]">{modelForm.height}</span></div>
                <div>Waist: <span className="font-bold text-[#1A1A1A]">{modelForm.waist}</span></div>
                <div>Hips: <span className="font-bold text-[#1A1A1A]">{modelForm.hips}</span></div>
                <div>Shoes: <span className="font-bold text-[#1A1A1A]">{modelForm.shoes}</span></div>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= RIGHT SIDE: MAIN CONTENT FORMS ================= */}
        <main className="flex-1 w-full space-y-10 min-w-0">

          {/* ================= SECTION 1: HERO & PROFILE ================= */}
          {(activeTab === 'all' || activeTab === 'profile') && (
            <section id="edit-section-profile" className="bg-[#FAF7F2] border border-[#E0D8CA] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#FAF7F2] flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl font-normal text-[#1A1A1A]"
                      style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
                    >
                      Hero Section & Primary Model Portrait
                    </h2>
                    <p className="text-xs text-[#786F62]">
                      Edit the main model hero photo, headlines, bio, and roster category pills.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Hero Image Management (Left 4 cols) */}
                <div className="lg:col-span-4 bg-white border border-[#EAE3D6] rounded-xl p-5 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#CD7F63] flex items-center justify-between">
                    <span>Hero Model Portrait</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Full-bleed</span>
                  </div>

                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-neutral-900 border border-[#EAE3D6] shadow-xs group">
                    <img
                      src={modelForm.heroImage}
                      alt="Hero Portrait"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => heroImageInputRef.current?.click()}
                        className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => heroImageInputRef.current?.click()}
                    className="w-full bg-[#1A1A1A] text-white hover:bg-[#333] py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Portrait</span>
                  </button>
                  <p className="text-[11px] text-[#786F62] leading-tight text-center">
                    Supports JPG, PNG, WEBP. Displays seamlessly on desktop and mobile viewports.
                  </p>
                </div>

                {/* Hero Text Fields (Right 8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#786F62] mb-2">
                        Model Display Name
                      </label>
                      <input
                        type="text"
                        value={modelForm.name}
                        onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                        className="w-full bg-white border border-[#EAE3D6] rounded-xl px-4 py-3 text-base font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#CD7F63]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#786F62] mb-2">
                        Agency Line / Subheading
                      </label>
                      <input
                        type="text"
                        value={modelForm.agency}
                        onChange={(e) => setModelForm({ ...modelForm, agency: e.target.value })}
                        className="w-full bg-white border border-[#EAE3D6] rounded-xl px-4 py-3 text-base font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#CD7F63]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#786F62] mb-2">
                      Market Placements & Cities
                    </label>
                    <input
                      type="text"
                      value={modelForm.locations}
                      onChange={(e) => setModelForm({ ...modelForm, locations: e.target.value })}
                      className="w-full bg-white border border-[#EAE3D6] rounded-xl px-4 py-3 text-sm font-medium text-[#1A1A1A] focus:outline-none focus:border-[#CD7F63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#786F62] mb-2">
                      Editorial Biography (Main Narrative)
                    </label>
                    <textarea
                      rows={4}
                      value={modelForm.bio}
                      onChange={(e) => setModelForm({ ...modelForm, bio: e.target.value })}
                      className="w-full bg-white border border-[#EAE3D6] rounded-xl p-4 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#CD7F63] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#786F62] mb-2">
                      Roster Categories
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {modelForm.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-2 bg-white border border-[#EAE3D6] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1A1A1A]"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(cat)}
                            className="text-neutral-400 hover:text-red-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="e.g. HAUTE COUTURE"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        className="flex-1 bg-white border border-[#EAE3D6] rounded-lg px-3.5 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-[#1A1A1A] text-white px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= SECTION 2: MODELIA AGENCY ABOUT SECTION ================= */}
          {(activeTab === 'all' || activeTab === 'agency') && (
            <section id="edit-section-agency" className="bg-[#0C0C0E] text-[#FAF7F2] rounded-2xl p-6 sm:p-8 shadow-lg space-y-8 border border-neutral-800">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#FF2A7A] text-white flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl font-normal text-white"
                      style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
                    >
                      Modelia Agency Section (Appended Down-Page)
                    </h2>
                    <p className="text-xs text-[#9E9B96]">
                      Customise the 40/60 split section: left-side portrait image, pink typography, lead text, paragraphs, signature, and dual CTA buttons.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Agency Image Column (Left 4 cols) */}
                <div className="lg:col-span-4 bg-[#16161A] border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#FF2A7A] flex items-center justify-between">
                    <span>Left Column Photograph</span>
                    <span className="text-[10px] text-neutral-500 font-mono">40% Width</span>
                  </div>

                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-neutral-950 border border-neutral-700 shadow-sm group">
                    <img
                      src={agencyForm.agencyImage}
                      alt="Agency Model"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => agencyImageInputRef.current?.click()}
                        className="bg-[#FF2A7A] text-white px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Change Image</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => agencyImageInputRef.current?.click()}
                    className="w-full bg-[#FF2A7A] hover:bg-[#E01865] text-white py-2.5 rounded-none text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Agency Photo</span>
                  </button>
                  <p className="text-[11px] text-[#9E9B96] leading-tight text-center">
                    Retains full vertical height on desktop with sharp sunglasses & editorial styling.
                  </p>
                </div>

                {/* Agency Text & Buttons (Right 8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#FF2A7A] mb-2">
                      Large Pink Serif Greeting
                    </label>
                    <input
                      type="text"
                      value={agencyForm.greeting}
                      onChange={(e) => setAgencyForm({ ...agencyForm, greeting: e.target.value })}
                      className="w-full bg-[#16161A] border border-neutral-700 rounded-xl px-4 py-3 text-3xl font-bold text-[#FF2A7A] focus:outline-none focus:border-[#FF2A7A]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      Lead Statement (Large Cream Typography)
                    </label>
                    <textarea
                      rows={3}
                      value={agencyForm.leadText}
                      onChange={(e) => setAgencyForm({ ...agencyForm, leadText: e.target.value })}
                      className="w-full bg-[#16161A] border border-neutral-700 rounded-xl p-4 text-base text-[#F5F3EF] focus:outline-none focus:border-[#FF2A7A] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#9E9B96] mb-2">
                      Body Paragraph Text (Light-Gray Clean Copy)
                    </label>
                    <textarea
                      rows={4}
                      value={agencyForm.paragraphText}
                      onChange={(e) => setAgencyForm({ ...agencyForm, paragraphText: e.target.value })}
                      className="w-full bg-[#16161A] border border-neutral-700 rounded-xl p-4 text-sm text-[#9E9B96] focus:outline-none focus:border-[#FF2A7A] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                        Signature Subtitle
                      </label>
                      <input
                        type="text"
                        value={agencyForm.signatureRole}
                        onChange={(e) => setAgencyForm({ ...agencyForm, signatureRole: e.target.value })}
                        className="w-full bg-[#16161A] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FF2A7A] mb-1.5">
                        Button 1 (Outlined Pink)
                      </label>
                      <input
                        type="text"
                        value={agencyForm.btnBecomeModelText}
                        onChange={(e) => setAgencyForm({ ...agencyForm, btnBecomeModelText: e.target.value })}
                        className="w-full bg-[#16161A] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FF2A7A] mb-1.5">
                        Button 2 (Solid Pink)
                      </label>
                      <input
                        type="text"
                        value={agencyForm.btnScheduleCastingText}
                        onChange={(e) => setAgencyForm({ ...agencyForm, btnScheduleCastingText: e.target.value })}
                        className="w-full bg-[#16161A] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= SECTION 3: PORTFOLIO WORKS & IMAGES ================= */}
          {(activeTab === 'all' || activeTab === 'portfolio') && (
            <section id="edit-section-portfolio" className="bg-[#FAF7F2] border border-[#E0D8CA] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE3D6] pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#FAF7F2] flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl font-normal text-[#1A1A1A]"
                      style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
                    >
                      Editorial Portfolio & Photography Works
                    </h2>
                    <p className="text-xs text-[#786F62]">
                      Add, remove, replace photos, and adjust aspect ratios (3:4 vertical or 16:10 wide).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddPortfolioItem}
                  className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333] text-[#FAF7F2] px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4 text-[#CD7F63]" />
                  <span>Add Portfolio Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolioList.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#EAE3D6] rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-start shadow-xs relative"
                  >
                    <div className="relative w-full sm:w-36 h-48 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 group">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPortfolioId(item.id);
                            portfolioImageInputRef.current?.click();
                          }}
                          className="bg-white text-black px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#CD7F63] font-bold">
                          SPREAD #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeletePortfolioItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1">
                          Spread Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPortfolioList(
                              portfolioList.map((p) => (p.id === item.id ? { ...p, title: val } : p))
                            );
                          }}
                          className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1">
                            Category
                          </label>
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setPortfolioList(
                                portfolioList.map((p) => (p.id === item.id ? { ...p, category: val } : p))
                              );
                            }}
                            className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-2.5 py-1.5 text-xs"
                          >
                            <option value="Editorial">Editorial</option>
                            <option value="Runway">Runway</option>
                            <option value="Campaign">Campaign</option>
                            <option value="Portrait">Portrait</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1">
                            Layout Aspect
                          </label>
                          <select
                            value={item.aspect}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setPortfolioList(
                                portfolioList.map((p) => (p.id === item.id ? { ...p, aspect: val } : p))
                              );
                            }}
                            className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-2.5 py-1.5 text-xs"
                          >
                            <option value="portrait">Vertical (3:4)</option>
                            <option value="landscape">Wide (16:10)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1">
                          Season / Credit Line
                        </label>
                        <input
                          type="text"
                          value={item.season}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPortfolioList(
                              portfolioList.map((p) => (p.id === item.id ? { ...p, season: val } : p))
                            );
                          }}
                          className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= SECTION 4: MEASUREMENTS & COMP-CARD STATS ================= */}
          {(activeTab === 'all' || activeTab === 'stats') && (
            <section id="edit-section-stats" className="bg-[#FAF7F2] border border-[#E0D8CA] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#FAF7F2] flex items-center justify-center font-bold text-sm">
                    4
                  </span>
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl font-normal text-[#1A1A1A]"
                      style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
                    >
                      Physical Measurements & Agency Index Tags
                    </h2>
                    <p className="text-xs text-[#786F62]">
                      Update standard comp-card parameters and model search tags.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#EAE3D6] rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div>
                    <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1.5">
                      Height
                    </label>
                    <input
                      type="text"
                      value={modelForm.height}
                      onChange={(e) => setModelForm({ ...modelForm, height: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1.5">
                      Bust
                    </label>
                    <input
                      type="text"
                      value={modelForm.bust}
                      onChange={(e) => setModelForm({ ...modelForm, bust: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1.5">
                      Waist
                    </label>
                    <input
                      type="text"
                      value={modelForm.waist}
                      onChange={(e) => setModelForm({ ...modelForm, waist: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1.5">
                      Hips
                    </label>
                    <input
                      type="text"
                      value={modelForm.hips}
                      onChange={(e) => setModelForm({ ...modelForm, hips: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1.5">
                      Shoes
                    </label>
                    <input
                      type="text"
                      value={modelForm.shoes}
                      onChange={(e) => setModelForm({ ...modelForm, shoes: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1.5">
                      Eyes
                    </label>
                    <input
                      type="text"
                      value={modelForm.eyes}
                      onChange={(e) => setModelForm({ ...modelForm, eyes: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#786F62] uppercase font-bold mb-1.5">
                      Hair
                    </label>
                    <input
                      type="text"
                      value={modelForm.hair}
                      onChange={(e) => setModelForm({ ...modelForm, hair: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Agency Tags */}
                <div className="pt-4 border-t border-[#EAE3D6]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#786F62] mb-2">
                    Agency Index Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {modelForm.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#EAE3D6] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1A1A1A]"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      placeholder="e.g. MilanRunway26"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="flex-1 bg-white border border-[#EAE3D6] rounded-lg px-3.5 py-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-[#1A1A1A] text-white px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E0D8CA] py-4 px-6 sm:px-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#786F62] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Editor Active — Changes sync seamlessly upon save</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#1A1A1A] text-[#1A1A1A] hover:bg-neutral-200/60 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
            >
              Cancel & Discard
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAndExit}
              className="bg-[#1A1A1A] hover:bg-[#333] active:scale-95 text-[#FAF7F2] px-8 py-2.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <Check className="w-4 h-4 text-[#CD7F63]" />
              <span>{isSaving ? 'Saving...' : 'Save & View Website'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
