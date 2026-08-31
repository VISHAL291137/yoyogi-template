import { doc, getDoc, setDoc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { db } from './firebase';
import { ModelInfo, ModelAgencyInfo, PortfolioItem } from '../types';
import { INITIAL_MODEL_INFO, INITIAL_AGENCY_INFO, PORTFOLIO_ITEMS } from '../data/modelData';
import { setIndexedDbItem, getIndexedDbItem } from './indexedDbStorage';
import { optimizeImageDataUrl } from './imageUtils';

export const PROFILE_DOC_ID = 'primary_model';
export const AGENCY_DOC_ID = 'primary_agency';
export const PORTFOLIO_DOC_ID = 'primary_portfolio';

export const STORAGE_KEYS = {
  PROFILE: 'model_portfolio_profile_data_v2',
  AGENCY: 'model_portfolio_agency_data_v2',
  PORTFOLIO: 'model_portfolio_items_data_v2',
};

// Check if an error is a Quota/Resource Exhausted error
export function isQuotaExhaustedError(err: any): boolean {
  if (!err) return false;
  const msg = typeof err === 'string' ? err : err.message || '';
  const code = err.code || '';
  return (
    code === 'resource-exhausted' ||
    msg.includes('Quota limit exceeded') ||
    msg.includes('resource-exhausted') ||
    msg.includes('Free daily write units per project')
  );
}

// Synchronous fast local storage reader
export function getLocalCachedData(): {
  profile: ModelInfo;
  agency: ModelAgencyInfo;
  portfolio: PortfolioItem[];
} {
  try {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const savedAgency = localStorage.getItem(STORAGE_KEYS.AGENCY);
    const savedPortfolio = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);

    return {
      profile: savedProfile ? JSON.parse(savedProfile) : INITIAL_MODEL_INFO,
      agency: savedAgency ? JSON.parse(savedAgency) : INITIAL_AGENCY_INFO,
      portfolio: savedPortfolio ? JSON.parse(savedPortfolio) : PORTFOLIO_ITEMS,
    };
  } catch {
    return {
      profile: INITIAL_MODEL_INFO,
      agency: INITIAL_AGENCY_INFO,
      portfolio: PORTFOLIO_ITEMS,
    };
  }
}

// Read from both IndexedDB and localStorage (asynchronous deep cache)
export async function getPersistentCachedData(): Promise<{
  profile: ModelInfo;
  agency: ModelAgencyInfo;
  portfolio: PortfolioItem[];
}> {
  const syncCache = getLocalCachedData();
  try {
    const idbProfile = await getIndexedDbItem<ModelInfo>(STORAGE_KEYS.PROFILE);
    const idbAgency = await getIndexedDbItem<ModelAgencyInfo>(STORAGE_KEYS.AGENCY);
    const idbPortfolio = await getIndexedDbItem<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO);

    return {
      profile: idbProfile || syncCache.profile,
      agency: idbAgency || syncCache.agency,
      portfolio: idbPortfolio || syncCache.portfolio,
    };
  } catch {
    return syncCache;
  }
}

// Save to both IndexedDB and LocalStorage safely
export async function saveLocalCachedData(
  profile?: ModelInfo,
  agency?: ModelAgencyInfo,
  portfolio?: PortfolioItem[]
) {
  try {
    if (profile) {
      await setIndexedDbItem(STORAGE_KEYS.PROFILE, profile);
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      } catch (lsErr) {
        console.warn('LocalStorage quota warning for profile (saved safely to IndexedDB):', lsErr);
      }
    }

    if (agency) {
      await setIndexedDbItem(STORAGE_KEYS.AGENCY, agency);
      try {
        localStorage.setItem(STORAGE_KEYS.AGENCY, JSON.stringify(agency));
      } catch (lsErr) {
        console.warn('LocalStorage quota warning for agency (saved safely to IndexedDB):', lsErr);
      }
    }

    if (portfolio) {
      await setIndexedDbItem(STORAGE_KEYS.PORTFOLIO, portfolio);
      try {
        localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
      } catch (lsErr) {
        console.warn('LocalStorage quota warning for portfolio (saved safely to IndexedDB):', lsErr);
      }
    }
  } catch (e) {
    console.warn('Persistence save warning:', e);
  }
}

// Helper to normalize ModelInfo so custom values (even empty) are preserved without resetting to defaults
export function normalizeModelInfo(data: any): ModelInfo {
  if (!data || typeof data !== 'object') return INITIAL_MODEL_INFO;
  return {
    name: data.name !== undefined ? data.name : INITIAL_MODEL_INFO.name,
    agency: data.agency !== undefined ? data.agency : INITIAL_MODEL_INFO.agency,
    locations: data.locations !== undefined ? data.locations : INITIAL_MODEL_INFO.locations,
    categories: Array.isArray(data.categories) ? data.categories : INITIAL_MODEL_INFO.categories,
    bio: data.bio !== undefined ? data.bio : INITIAL_MODEL_INFO.bio,
    heroImage: data.heroImage || INITIAL_MODEL_INFO.heroImage,
    height: data.height !== undefined ? data.height : INITIAL_MODEL_INFO.height,
    bust: data.bust !== undefined ? data.bust : INITIAL_MODEL_INFO.bust,
    waist: data.waist !== undefined ? data.waist : INITIAL_MODEL_INFO.waist,
    hips: data.hips !== undefined ? data.hips : INITIAL_MODEL_INFO.hips,
    shoes: data.shoes !== undefined ? data.shoes : INITIAL_MODEL_INFO.shoes,
    eyes: data.eyes !== undefined ? data.eyes : INITIAL_MODEL_INFO.eyes,
    hair: data.hair !== undefined ? data.hair : INITIAL_MODEL_INFO.hair,
    tags: Array.isArray(data.tags) ? data.tags : INITIAL_MODEL_INFO.tags,
  };
}

// Helper to normalize ModelAgencyInfo
export function normalizeAgencyInfo(data: any): ModelAgencyInfo {
  if (!data || typeof data !== 'object') return INITIAL_AGENCY_INFO;
  return {
    greeting: data.greeting !== undefined ? data.greeting : INITIAL_AGENCY_INFO.greeting,
    leadText: data.leadText !== undefined ? data.leadText : INITIAL_AGENCY_INFO.leadText,
    paragraphText: data.paragraphText !== undefined ? data.paragraphText : INITIAL_AGENCY_INFO.paragraphText,
    signatureRole: data.signatureRole !== undefined ? data.signatureRole : INITIAL_AGENCY_INFO.signatureRole,
    btnBecomeModelText: data.btnBecomeModelText !== undefined ? data.btnBecomeModelText : INITIAL_AGENCY_INFO.btnBecomeModelText,
    btnScheduleCastingText: data.btnScheduleCastingText !== undefined ? data.btnScheduleCastingText : INITIAL_AGENCY_INFO.btnScheduleCastingText,
    agencyImage: data.agencyImage || INITIAL_AGENCY_INFO.agencyImage,
  };
}

// Load live data from Firestore and seed if completely empty
export async function initDefaultDataIfEmpty(
  onLoaded?: (data: { profile?: ModelInfo; agency?: ModelAgencyInfo; portfolio?: PortfolioItem[] }) => void
) {
  try {
    // 1. First test connection and fetch latest documents directly
    const profileRef = doc(db, 'model_profiles', PROFILE_DOC_ID);
    const agencyRef = doc(db, 'agency_sections', AGENCY_DOC_ID);
    const portfolioRef = doc(db, 'portfolio_collections', PORTFOLIO_DOC_ID);

    const [profileSnap, agencySnap, portfolioSnap] = await Promise.all([
      getDoc(profileRef).catch(() => null),
      getDoc(agencyRef).catch(() => null),
      getDoc(portfolioRef).catch(() => null),
    ]);

    let loadedProfile: ModelInfo | undefined;
    let loadedAgency: ModelAgencyInfo | undefined;
    let loadedPortfolio: PortfolioItem[] | undefined;

    if (profileSnap && profileSnap.exists()) {
      loadedProfile = normalizeModelInfo(profileSnap.data());
      await saveLocalCachedData(loadedProfile);
    }

    if (agencySnap && agencySnap.exists()) {
      loadedAgency = normalizeAgencyInfo(agencySnap.data());
      await saveLocalCachedData(undefined, loadedAgency);
    }

    if (portfolioSnap && portfolioSnap.exists()) {
      const data = portfolioSnap.data();
      if (Array.isArray(data?.items)) {
        loadedPortfolio = data.items;
        await saveLocalCachedData(undefined, undefined, loadedPortfolio);
      }
    }

    if (onLoaded && (loadedProfile || loadedAgency || loadedPortfolio)) {
      onLoaded({
        profile: loadedProfile,
        agency: loadedAgency,
        portfolio: loadedPortfolio,
      });
    }
  } catch (error: any) {
    if (!isQuotaExhaustedError(error)) {
      console.warn('Database initialization note:', error);
    }
  }
}

export function subscribeToModelProfile(
  onUpdate: (data: ModelInfo) => void,
  onError?: (err: Error) => void
) {
  const profileRef = doc(db, 'model_profiles', PROFILE_DOC_ID);
  return onSnapshot(
    profileRef,
    (snap) => {
      if (snap.exists()) {
        const normalized = normalizeModelInfo(snap.data());
        saveLocalCachedData(normalized);
        onUpdate(normalized);
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export function subscribeToAgencySection(
  onUpdate: (data: ModelAgencyInfo) => void,
  onError?: (err: Error) => void
) {
  const agencyRef = doc(db, 'agency_sections', AGENCY_DOC_ID);
  return onSnapshot(
    agencyRef,
    (snap) => {
      if (snap.exists()) {
        const normalized = normalizeAgencyInfo(snap.data());
        saveLocalCachedData(undefined, normalized);
        onUpdate(normalized);
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export function subscribeToPortfolio(
  onUpdate: (items: PortfolioItem[]) => void,
  onError?: (err: Error) => void
) {
  const portfolioRef = doc(db, 'portfolio_collections', PORTFOLIO_DOC_ID);
  return onSnapshot(
    portfolioRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.items)) {
          saveLocalCachedData(undefined, undefined, data.items);
          onUpdate(data.items);
        }
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export async function saveLiveModelProfile(modelInfo: ModelInfo): Promise<{ success: boolean; error?: string }> {
  // 1. Optimize hero image if base64 to ensure under Firestore 1MB limits
  let optimizedHero = modelInfo.heroImage;
  if (optimizedHero && optimizedHero.startsWith('data:image')) {
    try {
      optimizedHero = await optimizeImageDataUrl(optimizedHero, 1600, 0.85);
    } catch {
      // ignore
    }
  }

  const payload: ModelInfo = {
    ...modelInfo,
    heroImage: optimizedHero,
  };

  // 2. Persist to local client storage (IndexedDB + localStorage) immediately
  await saveLocalCachedData(payload);

  // 3. Commit to Firestore
  try {
    const profileRef = doc(db, 'model_profiles', PROFILE_DOC_ID);
    await setDoc(
      profileRef,
      {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err: any) {
    console.error('Firestore saveLiveModelProfile error:', err);
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free quota limit reached. Saved locally in your browser.'
        : err.message,
    };
  }
}

export async function saveLiveAgencySection(agencyInfo: ModelAgencyInfo): Promise<{ success: boolean; error?: string }> {
  // 1. Optimize agency image if base64
  let optimizedImage = agencyInfo.agencyImage;
  if (optimizedImage && optimizedImage.startsWith('data:image')) {
    try {
      optimizedImage = await optimizeImageDataUrl(optimizedImage, 1600, 0.85);
    } catch {
      // ignore
    }
  }

  const payload: ModelAgencyInfo = {
    ...agencyInfo,
    agencyImage: optimizedImage,
  };

  // 2. Persist to local client storage (IndexedDB + localStorage) immediately
  await saveLocalCachedData(undefined, payload);

  // 3. Commit to Firestore
  try {
    const agencyRef = doc(db, 'agency_sections', AGENCY_DOC_ID);
    await setDoc(
      agencyRef,
      {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err: any) {
    console.error('Firestore saveLiveAgencySection error:', err);
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free quota limit reached. Saved locally in your browser.'
        : err.message,
    };
  }
}

export async function saveLivePortfolio(items: PortfolioItem[]): Promise<{ success: boolean; error?: string }> {
  // 1. Optimize portfolio images if base64
  const optimizedItems = await Promise.all(
    items.map(async (item) => {
      if (item.image && item.image.startsWith('data:image')) {
        try {
          const optimized = await optimizeImageDataUrl(item.image, 1600, 0.85);
          return { ...item, image: optimized };
        } catch {
          return item;
        }
      }
      return item;
    })
  );

  // 2. Persist to local client storage (IndexedDB + localStorage) immediately
  await saveLocalCachedData(undefined, undefined, optimizedItems);

  // 3. Commit to Firestore
  try {
    const portfolioRef = doc(db, 'portfolio_collections', PORTFOLIO_DOC_ID);
    await setDoc(
      portfolioRef,
      {
        items: optimizedItems,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err: any) {
    console.error('Firestore saveLivePortfolio error:', err);
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free quota limit reached. Saved locally in your browser.'
        : err.message,
    };
  }
}
