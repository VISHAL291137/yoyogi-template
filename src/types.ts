export interface ModelInfo {
  name: string;
  agency: string;
  locations: string;
  categories: string[];
  bio: string;
  heroImage: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoes: string;
  eyes: string;
  hair: string;
  tags: string[];
}

export interface ModelAgencyInfo {
  greeting: string;
  leadText: string;
  paragraphText: string;
  signatureRole: string;
  btnBecomeModelText: string;
  btnScheduleCastingText: string;
  agencyImage: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Editorial' | 'Runway' | 'Campaign' | 'Portrait';
  season: string;
  aspect: 'portrait' | 'landscape' | 'square';
  image: string;
}
