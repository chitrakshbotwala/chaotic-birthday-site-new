import axios from 'axios';

// Types for our image sources
export interface ImageItem {
  id: string;
  url: string;
  caption?: string;
  isHacked?: boolean;
  isJumpScare?: boolean;
  altUrl?: string[] | string;
  type?: 'friend' | 'meme' | 'birthday' | 'polar' | 'jumpscare';
}

// Define interfaces for API responses to avoid using 'any'
interface UnsplashImageResponse {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
}

interface MemeApiResponse {
  memes: Array<{
    postLink: string;
    url: string;
  }>;
}

// Unsplash API key - replace with your own in a real production app
// In production, this should be in an environment variable
const UNSPLASH_ACCESS_KEY = 'SPyOTsHJWRQbxDNITqz-T4Gb8o2sJdEgpj89yVqiJFg'; 

// Function to get random polar bear images from Unsplash
export const getPolarBearImages = async (count: number = 5): Promise<ImageItem[]> => {
  try {
    // Make API call with valid Unsplash API key
    const response = await axios.get<UnsplashImageResponse[]>(
      `https://api.unsplash.com/photos/random?query=polar+bear&count=${count}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );
    
    return response.data.map((item) => ({
      id: item.id,
      url: item.urls.regular,
      type: 'polar' as const,
      caption: getRandomCaption('polar'),
    }));
  } catch (error) {
    console.error('Using fallback polar bear images:', error);
    // Fallback images if API fails
    return Array(count).fill(null).map((_, i) => ({
      id: `fallback-polar-${i}`,
      url: `https://placebear.com/800/${600 + i * 10}`,
      type: 'polar' as const,
      caption: getRandomCaption('polar'),
    }));
  }
};

// Function to get random meme images from an API or fallback
export const getMemeImages = async (count: number = 5): Promise<ImageItem[]> => {
  try {
    // Using meme-api.com (formerly reddit API)
    const response = await axios.get<MemeApiResponse>('https://meme-api.com/gimme/5');
    
    return response.data.memes.map((meme) => ({
      id: meme.postLink,
      url: meme.url,
      type: 'meme' as const,
      caption: getRandomCaption('meme'),
    }));
  } catch (error) {
    console.error('Using fallback meme images:', error);
    // Fallback to placeholder images
    return Array(count).fill(null).map((_, i) => ({
      id: `fallback-meme-${i}`,
      url: `https://picsum.photos/800/600?random=${i}`,
      type: 'meme' as const,
      caption: getRandomCaption('meme'),
    }));
  }
};

// Function to get jump scare images - use your own images or APIs
export const getJumpScareImages = async (count: number = 3): Promise<ImageItem[]> => {
  // In production, you might fetch these from your own API
  const jumpScareImages = [
    'https://i.imgur.com/3dCWCdK.jpeg', // Example scary image
    'https://i.imgur.com/LJOQ3j6.jpeg',
    'https://i.imgur.com/7f3PiBP.jpeg',
    'https://i.imgur.com/XqmQOKT.jpeg',
    'https://i.imgur.com/NWKCxIY.jpeg',
  ];
  
  return jumpScareImages.slice(0, count).map((url, i) => ({
    id: `jumpscare-${i}`,
    url,
    type: 'jumpscare' as const,
    isJumpScare: true,
    caption: getRandomCaption('jumpscare'),
  }));
};

// Function to load friend images from the public directory
export const getFriendImages = (): ImageItem[] => {
  // These images are already in the public/assets/friends folder
  const friendImageNames = [
    'WhatsApp Image 2025-04-17 at 21.13.17.jpeg',
    '490993165_971498205145690_3973737728791714648_n.jpg',
    '490999759_594971516924010_4038665297892369293_n.jpg',
    '490999724_1196946995137421_312833589488004222_n.jpg',
    '491265828_567172875855594_8049461109935226635_n.jpg',
    '490998487_1900418730795180_5841791047581423173_n.jpg',
    '489597187_1045401847436749_1568631832410866161_n.jpg',
    '462563540_2032968243781693_1392186097089990730_n.jpg',
    '490115685_1019198980164768_3324982561951610250_n.jpg',
    '491021815_1016079820449457_9210822692966543261_n.jpg',
    '490100510_1198168481987244_6504611300275513859_n.jpg'
  ];

  // Define multiple path options to try - for production, only use paths that work on the server
  const pathOptions = [
    // Static paths that work in production
    '/assets/friends',
    '/assets/friends/',
    // For Next.js static asset serving
    '/_next/static/media/friends',
    '/friends',
    // Add fallback
    ''
  ];
  
  console.log('Attempting to load friend images from multiple locations:');
  pathOptions.forEach(path => console.log(`- ${path}`));
  console.log('Available friend image filenames:', friendImageNames);
  
  // Custom captions for each friend image for more personalized roasting
  const customCaptions = [
    "SYSTEM COMPROMISED: This user has been hacked",
    "SECURITY ALERT: Facial recognition failed spectacularly",
    "WARNING: This image contains dangerous levels of cringe",
    "THREAT DETECTED: Fashion sense critical failure",
    "SYSTEM WARNING: Subject appears to be experiencing technical difficulties",
    "ERROR 404: Personality not found",
    "CRITICAL ERROR: Rizz.exe has stopped working",
    "SYSTEM ALERT: Polar bear obsession detected",
    "WARNING: Excessive levels of chaotic energy detected",
    "SYSTEM NOTICE: Main character syndrome in progress",
    "ALERT: Birthday virus installation complete"
  ];
  
  // If all the normal methods fail, use this as a last resort
  const hardcodedFallbackImages = [
    { id: 'fallback-0', url: '/assets/glitch.svg', type: 'friend' as const, caption: "Image loading failed, but AAND PAV KHAYEGA?" },
    { id: 'fallback-1', url: '/assets/glitch.svg', type: 'friend' as const, caption: "Can't find images but AAND PAV KHAYEGA?" },
    { id: 'fallback-2', url: '/assets/glitch.svg', type: 'friend' as const, caption: "404 Not Found but AAND PAV KHAYEGA?" },
    { id: 'fallback-3', url: '/assets/glitch.svg', type: 'friend' as const, caption: "AAND PAV KHAYEGA? (Even without images)" },
    { id: 'fallback-4', url: '/assets/glitch.svg', type: 'friend' as const, caption: "Images are gone but AAND PAV KHAYEGA?" },
    { id: 'fallback-5', url: '/assets/glitch.svg', type: 'friend' as const, caption: "AAND PAV KHAYEGA?" },
  ];
  
  // Create multiple versions of image paths to try
  const images = friendImageNames.flatMap((filename, i) => {
    // Ensure filename is valid
    if (!filename) {
      console.warn(`Skipping invalid filename at index ${i}`);
      return [];
    }
    
    const paths = pathOptions.map(basePath => 
      basePath ? `${basePath}/${filename}` : filename
    );
    console.log(`Image ${i} (${filename}) paths to try:`, paths);
    
    return {
      id: `friend-${i}`,
      url: paths[0], // Default to first path
      altUrl: paths.slice(1), // Keep other paths as alternatives
      type: 'friend' as const,
      caption: customCaptions[i] || getRandomCaption('friend'),
      isHacked: Math.random() > 0.7, // 30% chance this image will appear "hacked"
    };
  });
  
  return images.length > 0 ? images : hardcodedFallbackImages;
};

// Function to mix all images and randomize them
export const mixAndRandomizeImages = (
  friendImages: ImageItem[], 
  memeImages: ImageItem[], 
  polarBearImages: ImageItem[],
  jumpScareImages: ImageItem[]
): ImageItem[] => {
  const allImages = [...friendImages, ...memeImages, ...polarBearImages];
  
  // Randomly shuffle the array
  for (let i = allImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
  }
  
  // Insert jump scare images randomly (but not at the very beginning)
  jumpScareImages.forEach(jumpScareImg => {
    const position = Math.floor(Math.random() * (allImages.length - 2)) + 2; 
    allImages.splice(position, 0, jumpScareImg);
  });
  
  return allImages;
};

// Gen Z meme captions
const memeCaptions = {
  friend: [
    "looking like a default character that nobody picked",
    "when your face becomes a meme but not in a good way",
    "the face you make when you realize you've peaked in middle school",
    "POV: you thought this was your good side",
    "giving 'I still use Internet Explorer' energy",
    "looking like you accidentally opened the front camera",
    "when your personality is just 'liking polar bears'",
    "your fashion sense has left the chat",
    "caught in 144p looking crusty",
    "main character but in a Disney Channel original movie about homework",
    "rizz level: -9000",
    "caught in 4k 📸",
    "no cap fr fr",
    "it's giving main character energy",
    "vibe check: failed",
    "CEO of cringe",
    "bestie wildin'",
    "not the emotional damage 💀",
    "living rent free in my head",
    "POV: you have zero drip"
  ],
  meme: [
    "based",
    "sending me fr",
    "this is camp",
    "understander has entered the chat",
    "not me acting up",
    "iykyk",
    "brain rot activated",
    "literally me",
    "mother is mothering",
    "screaming crying throwing up"
  ],
  polar: [
    "sigma bear grindset",
    "bear: *exists* | me: slay",
    "the bear stays ON during...",
    "polar bearsona unlocked",
    "core memory created",
    "friend-shaped but deadly",
    "gen z bear doesn't exi-",
    "father bear is fathering",
    "unbearable behavior",
    "tell me you're a bear without telling me"
  ],
  jumpscare: [
    "POV: YOUR VIBE CHECK",
    "JUMPSCARE WARNING BESTIE",
    "NOT THE JUMPSCARE",
    "SCREAM = SKILL ISSUE",
    "SLAY PANIC SLAY"
  ]
};

export const getRandomCaption = (type: 'friend' | 'meme' | 'polar' | 'jumpscare'): string => {
  const captions = memeCaptions[type];
  return captions[Math.floor(Math.random() * captions.length)];
};

// Function to apply meme text overlay effect to image URLs
// We're not using the parameters in this implementation, but they're kept for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const applyMemeTextToImageUrl = (imageUrl: string, _topText?: string, _bottomText?: string): string => {
  // In a real app, you'd use a real meme generator API or server-side processing
  // This is a simplified example
  return imageUrl;
};

/**
 * Converts a file path to a safe URL format for next/image
 */
export function getSafeImageUrl(url: string | undefined): string {
  // If url is undefined or empty, return a placeholder
  if (!url) {
    return '/assets/image-placeholder.svg';
  }
  
  // If already a URL or data URL, return as is
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }
  
  // If it's a public folder path, return as is
  if (url.startsWith('/')) {
    return url;
  }
  
  // For file system paths, especially C:/path style Windows paths,
  // we can't directly use them in next/image, so return a placeholder
  if (url.includes(':') || url.includes('\\')) {
    console.warn('Using local file system path that Next.js Image cannot handle:', url);
    return '/assets/image-placeholder.svg';
  }
  
  // Otherwise assume it's a relative path and add a leading slash
  return `/${url}`;
}

/**
 * Returns a placeholder image path when an image fails to load
 */
export function getErrorImagePath(): string {
  return '/assets/image-error.svg';
} 