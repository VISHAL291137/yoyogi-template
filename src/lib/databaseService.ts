import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { ModelInfo, ModelAgencyInfo, PortfolioItem, Album } from '../types';
import { INITIAL_MODEL_INFO, INITIAL_AGENCY_INFO, PORTFOLIO_ITEMS, INITIAL_ALBUMS } from '../data/modelData';
import { optimizeImageDataUrl } from './imageUtils';

export const PROFILE_DOC_ID = 'primary_model';
export const AGENCY_DOC_ID = 'primary_agency';
export const PORTFOLIO_DOC_ID = 'primary_portfolio';
export const ALBUMS_COL_ID = 'albums';
export const PORTFOLIO_ITEMS_COL_ID = 'portfolio_items';

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

export function normalizePortfolioItem(data: any, defaultId: string): PortfolioItem {
  return {
    id: data?.id || defaultId,
    title: data?.title || 'Editorial Look',
    category: data?.category || 'Editorial',
    season: data?.season || '2026',
    aspect: data?.aspect || 'portrait',
    image: data?.image || '',
    albumId: data?.albumId || undefined,
    order: typeof data?.order === 'number' ? data.order : undefined,
  };
}

export function normalizeAlbum(data: any, defaultId: string): Album {
  return {
    id: data?.id || defaultId,
    title: data?.title || 'Editorial Collection',
    description: data?.description || '',
    coverImage: data?.coverImage || '',
    category: data?.category || 'Editorial',
    season: data?.season || '2026',
    order: typeof data?.order === 'number' ? data.order : 0,
    updatedAt: data?.updatedAt || undefined,
  };
}

export async function fetchCloudData(
  onLoaded: (data: {
    profile: ModelInfo;
    agency: ModelAgencyInfo;
    portfolio: PortfolioItem[];
    albums: Album[];
  }) => void
) {
  try {
    const profileRef = doc(db, 'model_profiles', PROFILE_DOC_ID);
    const agencyRef = doc(db, 'agency_sections', AGENCY_DOC_ID);
    const portfolioColRef = collection(db, PORTFOLIO_ITEMS_COL_ID);
    const albumsColRef = collection(db, ALBUMS_COL_ID);
    const legacyPortfolioRef = doc(db, 'portfolio_collections', PORTFOLIO_DOC_ID);

    const [profileSnap, agencySnap, portfolioColSnap, albumsColSnap, legacyPortfolioSnap] = await Promise.all([
      getDoc(profileRef).catch(() => null),
      getDoc(agencyRef).catch(() => null),
      getDocs(portfolioColRef).catch(() => null),
      getDocs(albumsColRef).catch(() => null),
      getDoc(legacyPortfolioRef).catch(() => null),
    ]);

    let profile = INITIAL_MODEL_INFO;
    let agency = INITIAL_AGENCY_INFO;
    let portfolio = PORTFOLIO_ITEMS;
    let albums = INITIAL_ALBUMS;

    if (profileSnap && profileSnap.exists()) {
      profile = normalizeModelInfo(profileSnap.data());
    }

    if (agencySnap && agencySnap.exists()) {
      agency = normalizeAgencyInfo(agencySnap.data());
    }

    if (albumsColSnap && !albumsColSnap.empty) {
      const items = albumsColSnap.docs.map((d, index) => {
        const itemData = d.data();
        return {
          ...normalizeAlbum(itemData, d.id),
          order: typeof itemData.order === 'number' ? itemData.order : index,
        };
      });
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      albums = items;
    }

    if (portfolioColSnap && !portfolioColSnap.empty) {
      const items = portfolioColSnap.docs.map((d, index) => {
        const itemData = d.data();
        return {
          ...normalizePortfolioItem(itemData, d.id),
          order: typeof itemData.order === 'number' ? itemData.order : index,
        };
      });
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      portfolio = items.map(({ order, ...item }) => ({ ...item, order }));
    } else if (legacyPortfolioSnap && legacyPortfolioSnap.exists()) {
      const data = legacyPortfolioSnap.data();
      if (Array.isArray(data?.items) && data.items.length > 0) {
        portfolio = data.items.map((item: any, idx: number) =>
          normalizePortfolioItem(item, `port-${idx}`)
        );
      }
    }

    onLoaded({ profile, agency, portfolio, albums });
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

export function subscribeToAlbums(
  onUpdate: (albums: Album[]) => void,
  onError?: (err: Error) => void
) {
  const albumsColRef = collection(db, ALBUMS_COL_ID);
  return onSnapshot(
    albumsColRef,
    (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d, index) => {
          const itemData = d.data();
          return {
            ...normalizeAlbum(itemData, d.id),
            order: typeof itemData.order === 'number' ? itemData.order : index,
          };
        });
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(items);
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
  const portfolioColRef = collection(db, PORTFOLIO_ITEMS_COL_ID);
  const legacyPortfolioRef = doc(db, 'portfolio_collections', PORTFOLIO_DOC_ID);

  let hasCollectionItems = false;

  const unsubCol = onSnapshot(
    portfolioColRef,
    (snap) => {
      if (!snap.empty) {
        hasCollectionItems = true;
        const items = snap.docs.map((d, index) => {
          const itemData = d.data();
          return {
            ...normalizePortfolioItem(itemData, d.id),
            order: typeof itemData.order === 'number' ? itemData.order : index,
          };
        });
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(items.map(({ order, ...item }) => ({ ...item, order })));
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );

  const unsubLegacy = onSnapshot(
    legacyPortfolioRef,
    (snap) => {
      if (!hasCollectionItems && snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.items) && data.items.length > 0) {
          const items = data.items.map((item: any, idx: number) =>
            normalizePortfolioItem(item, `port-${idx}`)
          );
          onUpdate(items);
        }
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );

  return () => {
    unsubCol();
    unsubLegacy();
  };
}

export async function saveLiveModelProfile(modelInfo: ModelInfo): Promise<{ success: boolean; error?: string }> {
  let optimizedHero = modelInfo.heroImage;
  if (optimizedHero && optimizedHero.startsWith('data:image')) {
    try {
      optimizedHero = await optimizeImageDataUrl(optimizedHero, 1200, 0.78);
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
      optimizedImage = await optimizeImageDataUrl(optimizedImage, 1200, 0.78);
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

export async function saveLiveAlbum(album: Album): Promise<{ success: boolean; error?: string }> {
  try {
    let optimizedCover = album.coverImage;
    if (optimizedCover && optimizedCover.startsWith('data:image')) {
      try {
        optimizedCover = await optimizeImageDataUrl(optimizedCover, 1000, 0.75);
      } catch {
        // ignore
      }
    }

    const albumRef = doc(db, ALBUMS_COL_ID, album.id);
    await setDoc(
      albumRef,
      {
        ...album,
        coverImage: optimizedCover,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err: any) {
    if (!isQuotaExhaustedError(err)) {
      console.error('Firestore saveLiveAlbum error:', err);
    }
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free tier daily write quota reached.'
        : err.message,
    };
  }
}

export async function deleteLiveAlbum(albumId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const albumRef = doc(db, ALBUMS_COL_ID, albumId);
    await deleteDoc(albumRef);
    return { success: true };
  } catch (err: any) {
    if (!isQuotaExhaustedError(err)) {
      console.error('Firestore deleteLiveAlbum error:', err);
    }
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free tier daily write quota reached.'
        : err.message,
    };
  }
}

export async function saveLiveAlbums(albums: Album[]): Promise<{ success: boolean; error?: string }> {
  try {
    const optimizedAlbums = await Promise.all(
      albums.map(async (album, index) => {
        let cover = album.coverImage;
        if (cover && cover.startsWith('data:image')) {
          try {
            cover = await optimizeImageDataUrl(cover, 1000, 0.75);
          } catch {
            // ignore
          }
        }
        return {
          ...album,
          coverImage: cover,
          order: typeof album.order === 'number' ? album.order : index,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const albumsColRef = collection(db, ALBUMS_COL_ID);
    const existingSnap = await getDocs(albumsColRef).catch(() => null);
    const existingIds = new Set<string>(existingSnap ? existingSnap.docs.map((d) => d.id) : []);
    const currentIds = new Set<string>(optimizedAlbums.map((a) => a.id));

    const deletePromises: Promise<void>[] = [];
    existingIds.forEach((oldId: string) => {
      if (!currentIds.has(oldId)) {
        deletePromises.push(deleteDoc(doc(db, ALBUMS_COL_ID, oldId)).catch(() => {}));
      }
    });

    const writePromises = optimizedAlbums.map((album) => {
      const albumRef = doc(db, ALBUMS_COL_ID, album.id);
      return setDoc(albumRef, album, { merge: true });
    });

    await Promise.all([...deletePromises, ...writePromises]);
    return { success: true };
  } catch (err: any) {
    if (!isQuotaExhaustedError(err)) {
      console.error('Firestore saveLiveAlbums error:', err);
    }
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free tier daily write quota reached.'
        : err.message,
    };
  }
}

export async function saveLivePortfolioItem(item: PortfolioItem): Promise<{ success: boolean; error?: string }> {
  try {
    let img = item.image;
    if (img && img.startsWith('data:image')) {
      try {
        img = await optimizeImageDataUrl(img, 1000, 0.72);
      } catch {
        // ignore
      }
    }

    const itemRef = doc(db, PORTFOLIO_ITEMS_COL_ID, item.id);
    await setDoc(
      itemRef,
      {
        ...item,
        image: img,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err: any) {
    if (!isQuotaExhaustedError(err)) {
      console.error('Firestore saveLivePortfolioItem error:', err);
    }
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free tier daily write quota reached.'
        : err.message,
    };
  }
}

export async function deleteLivePortfolioItem(itemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const itemRef = doc(db, PORTFOLIO_ITEMS_COL_ID, itemId);
    await deleteDoc(itemRef);
    return { success: true };
  } catch (err: any) {
    if (!isQuotaExhaustedError(err)) {
      console.error('Firestore deleteLivePortfolioItem error:', err);
    }
    return {
      success: false,
      error: isQuotaExhaustedError(err)
        ? 'Firebase free tier daily write quota reached.'
        : err.message,
    };
  }
}

export async function saveLivePortfolio(items: PortfolioItem[]): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Optimize images individually to keep per-document sizes compact (~30-50KB)
    const optimizedItems = await Promise.all(
      items.map(async (item, index) => {
        if (item.image && item.image.startsWith('data:image')) {
          try {
            const optimized = await optimizeImageDataUrl(item.image, 1000, 0.72);
            return {
              ...item,
              image: optimized,
              order: typeof item.order === 'number' ? item.order : index,
            };
          } catch {
            return {
              ...item,
              order: typeof item.order === 'number' ? item.order : index,
            };
          }
        }
        return {
          ...item,
          order: typeof item.order === 'number' ? item.order : index,
        };
      })
    );

    // 2. Fetch existing portfolio_items document IDs to clean up deleted items
    const portfolioColRef = collection(db, PORTFOLIO_ITEMS_COL_ID);
    const existingSnap = await getDocs(portfolioColRef).catch(() => null);
    const existingIds = new Set<string>(existingSnap ? existingSnap.docs.map((d) => d.id) : []);
    const currentIds = new Set<string>(optimizedItems.map((item) => item.id));

    // Delete items that no longer exist in the updated list
    const deletePromises: Promise<void>[] = [];
    existingIds.forEach((oldId: string) => {
      if (!currentIds.has(oldId)) {
        deletePromises.push(deleteDoc(doc(db, PORTFOLIO_ITEMS_COL_ID, oldId)).catch(() => {}));
      }
    });

    // 3. Save each item as its own document in portfolio_items collection
    // This strictly prevents ever exceeding the 1,048,576 byte (1MB) per document limit!
    const writePromises = optimizedItems.map((item, index) => {
      const itemRef = doc(db, PORTFOLIO_ITEMS_COL_ID, item.id);
      return setDoc(
        itemRef,
        {
          ...item,
          order: index,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    });

    await Promise.all([...deletePromises, ...writePromises]);

    // 4. Update legacy summary document with lightweight metadata
    const legacyRef = doc(db, 'portfolio_collections', PORTFOLIO_DOC_ID);
    setDoc(
      legacyRef,
      {
        itemCount: optimizedItems.length,
        itemIds: optimizedItems.map((i) => i.id),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch(() => {});

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

/**
 * Clear all collections and documents from Firestore database (Full Database Purge & Reset)
 */
export async function clearAllDatabaseData(): Promise<{ success: boolean; error?: string }> {
  try {
    const profileRef = doc(db, 'model_profiles', PROFILE_DOC_ID);
    const agencyRef = doc(db, 'agency_sections', AGENCY_DOC_ID);
    const legacyRef = doc(db, 'portfolio_collections', PORTFOLIO_DOC_ID);

    const deleteCorePromises = [
      deleteDoc(profileRef).catch(() => {}),
      deleteDoc(agencyRef).catch(() => {}),
      deleteDoc(legacyRef).catch(() => {}),
    ];

    // Delete all documents in portfolio_items collection
    const portCol = collection(db, PORTFOLIO_ITEMS_COL_ID);
    const portSnap = await getDocs(portCol).catch(() => null);
    const portDeletePromises = portSnap
      ? portSnap.docs.map((d) => deleteDoc(doc(db, PORTFOLIO_ITEMS_COL_ID, d.id)).catch(() => {}))
      : [];

    // Delete all documents in albums collection
    const albumsCol = collection(db, ALBUMS_COL_ID);
    const albumsSnap = await getDocs(albumsCol).catch(() => null);
    const albumsDeletePromises = albumsSnap
      ? albumsSnap.docs.map((d) => deleteDoc(doc(db, ALBUMS_COL_ID, d.id)).catch(() => {}))
      : [];

    await Promise.all([...deleteCorePromises, ...portDeletePromises, ...albumsDeletePromises]);
    return { success: true };
  } catch (err: any) {
    console.error('Error clearing database:', err);
    return {
      success: false,
      error: err?.message || 'Failed to clear database',
    };
  }
}
