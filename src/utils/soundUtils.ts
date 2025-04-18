import { Howl } from 'howler';

// Types for our sounds
export interface SoundEffect {
  id: string;
  path: string;
  volume?: number;
}

// Determine the correct sound path - handle both possible locations
const soundBasePath = '/assets/sounds';
const altSoundBasePath = '/public/assets/sounds';
const backupSoundBasePath = '/chaotic-birthday-site-new/public/assets/sounds';
const directSoundBasePath = './sounds';
const relativeSoundBasePath = '../sounds';
const hardcodedPath = 'C:/code/atharv/chaotic-birthday-site-new/public/assets/sounds';

// Collection of Gen Z meme sounds for different occasions
export const sounds: Record<string, SoundEffect> = {
  jumpscare1: {
    id: 'jumpscare1',
    path: `${soundBasePath}/jumpscare1.mp3`,
    volume: 0.7, // Adjust volume as needed
  },
  jumpscare2: {
    id: 'jumpscare2',
    path: `${soundBasePath}/jumpscare2.mp3`,
    volume: 0.7,
  },
  vine_boom: {
    id: 'vine_boom',
    path: `${soundBasePath}/vine_boom.mp3`,
    volume: 0.5,
  },
  bruh: {
    id: 'bruh',
    path: `${soundBasePath}/bruh.mp3`,
    volume: 0.5,
  },
  windows_error: {
    id: 'windows_error',
    path: `${soundBasePath}/windows_error.mp3`,
    volume: 0.5,
  },
  oof: {
    id: 'oof',
    path: `${soundBasePath}/oof.mp3`,
    volume: 0.5,
  },
  amongus: {
    id: 'amongus',
    path: `${soundBasePath}/amongus.mp3`,
    volume: 0.5,
  },
  bonk: {
    id: 'bonk',
    path: `${soundBasePath}/bonk.mp3`,
    volume: 0.5,
  },
  rizz: {
    id: 'rizz',
    path: `${soundBasePath}/rizz.mp3`,
    volume: 0.5,
  },
  emotional_damage: {
    id: 'emotional_damage',
    path: `${soundBasePath}/emotional_damage.mp3`,
    volume: 0.5,
  },
  skibidi: {
    id: 'skibidi',
    path: `${soundBasePath}/skibidi.mp3`,
    volume: 0.5,
  },
  slay: {
    id: 'slay',
    path: `${soundBasePath}/slay.mp3`,
    volume: 0.4,
  },
  aand_pav: {
    id: 'aand_pav',
    path: `${soundBasePath}/aand_pav.mp3`,
    volume: 0.6,
  },
  // Background music options
  bg_music: {
    id: 'bg_music',
    path: `${soundBasePath}/bg_music.mp3`, 
    volume: 0.3,
  },
};

// Sound instances cache
const soundInstances: Record<string, Howl> = {};
const bgMusicInstance: Howl | null = null;

// Try alternative paths if the main one fails
const tryAlternativeSoundPath = (soundId: string): boolean => {
  if (!sounds[soundId]) return false;
  
  try {
    const sound = sounds[soundId];
    
    // Try first alternative path
    let altPath = sound.path.replace(soundBasePath, altSoundBasePath);
    const howl = new Howl({
      src: [altPath],
      volume: sound.volume || 0.5,
      onloaderror: () => {
        // Try second alternative path if first fails
        console.log(`Failed to load sound from first alternative path: ${altPath}`);
        altPath = sound.path.replace(soundBasePath, backupSoundBasePath);
        
        const backupHowl = new Howl({
          src: [altPath],
          volume: sound.volume || 0.5,
          onloaderror: () => {
            // Try third alternative path if second fails
            console.log(`Failed to load sound from second alternative path: ${altPath}`);
            altPath = sound.path.replace(soundBasePath, directSoundBasePath);
            
            const directHowl = new Howl({
              src: [altPath],
              volume: sound.volume || 0.5,
              onloaderror: () => {
                console.log(`Failed to load sound from all paths for ${soundId}`);
                return false;
              }
            });
            
            soundInstances[soundId] = directHowl;
            directHowl.play();
            return true;
          }
        });
        
        soundInstances[soundId] = backupHowl;
        backupHowl.play();
        return true;
      }
    });
    
    soundInstances[soundId] = howl;
    howl.play();
    return true;
  } catch (error) {
    console.log(`Error trying alternative sound paths for ${soundId}:`, error);
    return false;
  }
};

// Start playing background music - modified to be disabled since we use YouTube
export const startBackgroundMusic = (): void => {
  // Function intentionally disabled since we're using YouTube audio
  console.log('Background music function disabled - using YouTube audio instead');
  return;
  
  /*
  // Original function code left for reference but disabled
  if (isBgMusicPlaying) return;
  
  try {
    if (sounds.bg_music) {
      const sound = sounds.bg_music;
      
      // Try all possible paths
      const paths = [
        sound.path,
        sound.path.replace(soundBasePath, altSoundBasePath),
        sound.path.replace(soundBasePath, backupSoundBasePath),
        sound.path.replace(soundBasePath, directSoundBasePath),
        `${hardcodedPath}/${sound.id}.mp3` // Direct hardcoded path
      ];
      
      console.log('Trying to play background music from paths:', paths);
      
      bgMusicInstance = new Howl({
        src: paths,
        volume: sound.volume || 0.3,
        loop: true,
        autoplay: true,
        onloaderror: () => {
          console.log(`Failed to load background music`);
          // Try a different sound as background music
          const fallbackMusic = 'skibidi';
          if (sounds[fallbackMusic]) {
            const fallbackSound = sounds[fallbackMusic];
            const fallbackPaths = [
              fallbackSound.path,
              fallbackSound.path.replace(soundBasePath, altSoundBasePath),
              fallbackSound.path.replace(soundBasePath, backupSoundBasePath),
              fallbackSound.path.replace(soundBasePath, directSoundBasePath),
              `${hardcodedPath}/${fallbackSound.id}.mp3` // Direct hardcoded path
            ];
            
            console.log('Trying to play fallback music from paths:', fallbackPaths);
            
            bgMusicInstance = new Howl({
              src: fallbackPaths,
              volume: 0.2,
              loop: true,
              autoplay: true
            });
          }
        },
        onload: () => {
          console.log('Background music loaded successfully');
        },
        onplay: () => {
          console.log('Background music started playing');
        }
      });
    }
  } catch (error) {
    console.log('Error starting background music:', error);
  }
  */
};

// Stop background music
export const stopBackgroundMusic = (): void => {
  // Function intentionally disabled since we're using YouTube audio
  console.log('stopBackgroundMusic disabled - using YouTube audio instead');
  
  // For type safety, keep the original check but don't use it
  if (bgMusicInstance) {
    // bgMusicInstance.stop();
  }
};

// Preload all sounds
export const preloadSounds = (): void => {
  try {
    // Log the paths we're checking for debugging
    console.log('Looking for sounds in these paths:');
    console.log('- ' + soundBasePath);
    console.log('- ' + altSoundBasePath);
    console.log('- ' + backupSoundBasePath);
    console.log('- ' + directSoundBasePath);
    console.log('- ' + relativeSoundBasePath);
    console.log('- ' + hardcodedPath);
    
    Object.values(sounds).forEach((sound) => {
      // Try all possible paths for each sound
      const paths = [
        sound.path,
        sound.path.replace(soundBasePath, altSoundBasePath),
        sound.path.replace(soundBasePath, backupSoundBasePath),
        sound.path.replace(soundBasePath, directSoundBasePath),
        sound.path.replace(soundBasePath, relativeSoundBasePath),
        `${hardcodedPath}/${sound.id}.mp3`, // Direct hardcoded path as last resort
        `/sounds/${sound.id}.mp3` // Simple path as final fallback
      ];
      
      console.log(`Trying to load sound ${sound.id} from paths:`, paths);
      
      soundInstances[sound.id] = new Howl({
        src: paths,
        volume: sound.volume || 0.5,
        preload: true,
        onloaderror: () => {
          console.log(`Failed to preload sound: ${sound.id} from all paths`);
        },
        onload: () => {
          console.log(`Successfully loaded sound: ${sound.id}`);
        }
      });
    });
    
    // Start background music after preloading
    startBackgroundMusic();
  } catch (error) {
    console.log('Error preloading sounds:', error);
  }
};

// Play a sound by ID
export const playSound = (soundId: string | string[]): void => {
  // Handle arrays (randomly choose one from the array)
  if (Array.isArray(soundId)) {
    const randomIndex = Math.floor(Math.random() * soundId.length);
    soundId = soundId[randomIndex];
  }
  
  try {
    // Check if the sound exists in our collection
    if (!sounds[soundId]) {
      console.warn(`Sound ${soundId} not found in collection`);
      return;
    }
    
    // If we already have a cached instance, use it
    if (soundInstances[soundId]) {
      soundInstances[soundId].play();
      return;
    }
    
    // Get the sound details
    const sound = sounds[soundId];
    
    // Create new sound instance
    const howl = new Howl({
      src: [sound.path],
      volume: sound.volume || 0.5,
      onloaderror: () => {
        console.warn(`Failed to load sound: ${soundId} from ${sound.path}`);
        // Try alternative paths if main one fails
        tryAlternativeSoundPath(soundId);
      },
      onplayerror: () => {
        console.warn(`Error playing sound: ${soundId}`);
        // If play fails, try to recreate the instance and play again
        try {
          soundInstances[soundId] = new Howl({
            src: [sound.path],
            volume: sound.volume || 0.5,
            html5: true, // Try with HTML5 Audio as fallback
          });
          soundInstances[soundId].play();
        } catch (e) {
          console.error(`Failed to recover from play error for sound ${soundId}:`, e);
        }
      }
    });
    
    // Cache the instance
    soundInstances[soundId] = howl;
    
    // Play the sound
    howl.play();
  } catch (error) {
    // Fail silently on audio issues to avoid breaking the site
    console.error(`Error playing sound ${soundId}:`, error);
  }
};

// Stop a sound by its ID
export const stopSound = (soundId: string): void => {
  if (soundInstances[soundId]) {
    soundInstances[soundId].stop();
  }
};

// Play a random sound from the collection
export const playRandomSound = (exclude: string[] = []): string => {
  const availableSounds = Object.keys(sounds).filter(
    (id) => !exclude.includes(id)
  );
  if (availableSounds.length === 0) return '';
  
  const randomIndex = Math.floor(Math.random() * availableSounds.length);
  const soundId = availableSounds[randomIndex];
  
  playSound(soundId);
  return soundId;
};

// Play a random jumpscare sound
export const playJumpscareSound = (): string => {
  const jumpScareSounds = ['jumpscare1', 'jumpscare2', 'vine_boom'];
  const randomIndex = Math.floor(Math.random() * jumpScareSounds.length);
  const soundId = jumpScareSounds[randomIndex];
  
  playSound(soundId);
  return soundId;
};

// Get a random meme sound that's not a jumpscare
export const getRandomMemeSoundId = (): string => {
  const memeSounds = Object.keys(sounds).filter(
    (id) => !['jumpscare1', 'jumpscare2'].includes(id)
  );
  const randomIndex = Math.floor(Math.random() * memeSounds.length);
  return memeSounds[randomIndex];
}; 