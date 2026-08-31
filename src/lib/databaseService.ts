import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { ModelInfo, ModelAgencyInfo, PortfolioItem } from '../types';
import { INITIAL_MODEL_INFO, INITIAL_AGENCY_INFO, PORTFOLIO_ITEMS } from '../data/modelData';
import { optimizeImageDataUrl } from './imageUtils';

export const PROFILE_DOC_ID = 'primary_model';
export const AGENCY_DOC_ID = 'primary_agency';
export const PORTFOLIO_DOC_ID = 'primary_portfolio';

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

export async function fetchCloudData(
  onLoaded: (data: { profile: ModelInfo; agency: ModelAgencyInfo; portfolio: PortfolioItem[] }) => void
) {
  try {
    const profileRef = doc(db, 'model_profiles', PROFILE_DOC_ID);
    const agencyRef = doc(db, 'agency_sections', AGENCY_DOC_ID);
    const portfolioRef = doc(db, 'portfolio_collections', PORTFOLIO_DOC_ID);

    const [profileSnap, agencySnap, portfolioSnap] = await Promise.all([
      getDoc(profileRef).catch(() => null),
      getDoc(agencyRef).catch(() => null),
      getDoc(portfolioRef).catch(() => null),
    ]);

    let profile = INITIAL_MODEL_INFO;
    let agency = INITIAL_AGENCY_INFO;
    let portfolio = PORTFOLIO_ITEMS;

    if (profileSnap && profileSnap.exists()) {
      profile = normalizeModelInfo(profileSnap.data());
    }

    if (agencySnap && agencySnap.exists()) {
      agency = normalizeAgencyInfo(agencySnap.data());
    }

    if (portfolioSnap && portfolioSnap.exists()) {
      const data = portfolioSnap.data();
      if (Array.isArray(data?.items)) {
        portfolio = data.items;
      }
    }

    onLoaded({ profile, agency, portfolio });
  } catch (error: any) {
    if (!isQuotaExhaustedError(error)) {
      console.warn('Cloud data fetch error:', error);
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
    if (!isQuotaExhaustedError(err)) {
      console.error('Firestore saveLiveModelProfile error:', err);
    }
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free tier daily write quota reached. Please try again tomorrow.'
        : err.message,
    };
  }
}

export async function saveLiveAgencySection(agencyInfo: ModelAgencyInfo): Promise<{ success: boolean; error?: string }> {
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
    if (!isQuotaExhaustedError(err)) {
      console.error('Firestore saveLiveAgencySection error:', err);
    }
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free tier daily write quota reached. Please try again tomorrow.'
        : err.message,
    };
  }
}

export async function saveLivePortfolio(items: PortfolioItem[]): Promise<{ success: boolean; error?: string }> {
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
    if (!isQuotaExhaustedError(err)) {
      console.error('Firestore saveLivePortfolio error:', err);
    }
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free tier daily write quota reached. Please try again tomorrow.'
        : err.message,
    };
  }
}
