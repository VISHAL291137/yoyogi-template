import heroModelImage from '../assets/images/fashion_portrait_1788164500769.jpg';
import runwayImage from '../assets/images/editorial_runway_1_1788167164650.jpg';
import campaignImage from '../assets/images/editorial_campaign_2_1788167187232.jpg';
import portraitImage from '../assets/images/editorial_portrait_3_1788167204660.jpg';
import yogaArchImage from '../assets/images/yoga_arch_portrait_1788164838899.jpg';
import yogaImage from '../assets/images/yoga_calm_portrait_1788164733479.jpg';
import { ModelInfo, ModelAgencyInfo, PortfolioItem, Album } from '../types';

export const INITIAL_MODEL_INFO: ModelInfo = {
  name: 'Yogi',
  agency: 'ELITE / SILHOUETTE MANAGEMENT',
  locations: 'PARIS · MILAN · NEW YORK',
  categories: ['EDITORIAL', 'RUNWAY', 'CAMPAIGN'],
  bio: 'International high-fashion model represented across Paris, Milan, and New York. Renowned for sculptural poise, emotive stillness, and seamless adaptability across avant-garde haute couture, major brand campaigns, and minimalist studio portraiture.',
  heroImage: heroModelImage,
  height: `5'11" / 180 cm`,
  bust: `32" / 81 cm`,
  waist: `24" / 61 cm`,
  hips: `35" / 89 cm`,
  shoes: `9 US / 40 EU`,
  eyes: 'Dark Brown',
  hair: 'Espresso',
  tags: ['High Fashion', 'Vogue Italia', 'Couture 2026', 'Paris Fashion Week', 'Milan Runway', 'Minimalist Campaign']
};

export const INITIAL_AGENCY_INFO: ModelAgencyInfo = {
  greeting: 'Hello!',
  leadText: `Modelia, established in 1990, is one of the world's top model agencies, representing some of the fashion industry's most successful faces.`,
  paragraphText: `We discover, nurture, and elevate extraordinary talent across global runways, high-fashion editorials, and iconic brand campaigns in Paris, Milan, New York, and London. Our dedicated team of agents and creatives is committed to cultivating enduring careers at the vanguard of the fashion landscape.`,
  signatureRole: 'MODELIA FOUNDER',
  btnBecomeModelText: 'BECOME A MODEL',
  btnScheduleCastingText: 'SCHEDULE CASTING',
  agencyImage: heroModelImage
};

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'album-editorial',
    title: 'High Fashion Editorial',
    description: 'Sculptural silhouettes, motion studies, and high-contrast studio portraiture.',
    category: 'Editorial',
    season: 'Autumn / Winter 2026',
    coverImage: heroModelImage,
    order: 0,
  },
  {
    id: 'album-runway',
    title: 'Paris & Milan Runway',
    description: 'Haute couture showcases and ready-to-wear runway collections in Paris and Milan.',
    category: 'Runway',
    season: 'Autumn / Winter 2026',
    coverImage: runwayImage,
    order: 1,
  },
  {
    id: 'album-campaign',
    title: 'Global Campaigns & Lookbook',
    description: 'Architectural, brutalist, and modern commercial campaigns.',
    category: 'Campaign',
    season: 'Global Campaign 2026',
    coverImage: campaignImage,
    order: 2,
  },
  {
    id: 'album-portrait',
    title: 'Studio & Natural Light Portraits',
    description: 'Intimate monochrome gaze, soft shadows, and clean agency polaroid series.',
    category: 'Portrait',
    season: 'Editorial Series',
    coverImage: portraitImage,
    order: 3,
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    albumId: 'album-runway',
    title: 'Parisian Haute Couture',
    category: 'Runway',
    season: 'Autumn / Winter 2026',
    aspect: 'portrait',
    image: runwayImage,
    order: 0,
  },
  {
    id: 'port-2',
    albumId: 'album-campaign',
    title: 'Brutalist Concrete & Sunlight',
    category: 'Campaign',
    season: 'Global Campaign 2026',
    aspect: 'landscape',
    image: campaignImage,
    order: 1,
  },
  {
    id: 'port-3',
    albumId: 'album-portrait',
    title: 'Monochrome Gaze & Shadow',
    category: 'Portrait',
    season: 'Editorial Series',
    aspect: 'portrait',
    image: portraitImage,
    order: 2,
  },
  {
    id: 'port-4',
    albumId: 'album-editorial',
    title: 'Sculptural Poise in Linen',
    category: 'Editorial',
    season: 'Studio Collection',
    aspect: 'portrait',
    image: heroModelImage,
    order: 3,
  },
  {
    id: 'port-5',
    albumId: 'album-editorial',
    title: 'Arch & Silhouette Form',
    category: 'Editorial',
    season: 'Movement Study',
    aspect: 'portrait',
    image: yogaArchImage,
    order: 4,
  },
  {
    id: 'port-6',
    albumId: 'album-campaign',
    title: 'Stillness & Earth Tones',
    category: 'Campaign',
    season: 'Resort 2026',
    aspect: 'portrait',
    image: yogaImage,
    order: 5,
  }
];

