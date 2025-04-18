import { ImageItem } from './imageUtils';
import { playJumpscareSound } from './soundUtils';

// Interface for jump scare configuration
export interface JumpScareConfig {
  minDelay: number; // Minimum delay in ms before jump scare can occur
  maxDelay: number; // Maximum delay in ms before jump scare can occur
  chance: number; // Chance of jump scare triggering (0-1)
  duration: number; // How long the jump scare appears on screen
  enabled: boolean; // Whether jump scares are enabled
}

// Default configuration
export const defaultJumpScareConfig: JumpScareConfig = {
  minDelay: 15000, // Minimum 15 seconds
  maxDelay: 120000, // Maximum 2 minutes
  chance: 0.4, // 40% chance when the timer triggers
  duration: 2000, // 2 seconds on screen
  enabled: true,
};

// Class to manage jump scare timing and logic
export class JumpScareManager {
  private config: JumpScareConfig;
  private timerId: NodeJS.Timeout | null = null;
  private jumpScareImages: ImageItem[] = [];
  private onJumpScare: (image: ImageItem) => void;
  private isTimerRunning = false;
  private lastJumpScareTime = 0;
  private clickCounter = 0;
  private readonly CLICK_THRESHOLD = 5; // Number of clicks to potentially trigger a jump scare
  private readonly CLICK_RESET_TIMEOUT = 7000; // Reset click counter after 7 seconds of inactivity
  private clickResetTimer: NodeJS.Timeout | null = null;
  private jumpScareShown: boolean = false;
  private cooldownPeriod: number = 30000; // 30 seconds cooldown
  private clickTimeWindow: number = 3000; // Clicks must happen within 3 seconds

  constructor(
    jumpScareImages: ImageItem[],
    onJumpScare: (image: ImageItem) => void,
    config: Partial<JumpScareConfig> = {}
  ) {
    this.jumpScareImages = jumpScareImages;
    this.onJumpScare = onJumpScare;
    this.config = { ...defaultJumpScareConfig, ...config };
    
    if (this.config.enabled) {
      this.startRandomTimer();
    }
  }

  // Start a timer with random delay
  public startRandomTimer(): void {
    if (this.isTimerRunning || !this.config.enabled) return;
    
    // Random delay between min and max
    const delay = Math.floor(
      Math.random() * (this.config.maxDelay - this.config.minDelay) + this.config.minDelay
    );
    
    this.isTimerRunning = true;
    
    this.timerId = setTimeout(() => {
      this.checkAndTriggerJumpScare();
      this.isTimerRunning = false;
      // Start a new timer after this one finishes
      this.startRandomTimer();
    }, delay);
  }

  // Increases unpredictability by checking chance
  private checkAndTriggerJumpScare(): void {
    const currentTime = Date.now();
    // Don't allow jump scares too close together
    if (currentTime - this.lastJumpScareTime < this.config.minDelay) {
      return;
    }
    
    // Check if jump scare should trigger based on chance
    if (Math.random() <= this.config.chance) {
      this.triggerJumpScare();
    }
  }

  // Actually trigger the jump scare
  public triggerJumpScare(): void {
    if (this.jumpScareImages.length === 0) return;

    // Choose a random jump scare image
    const randomIndex = Math.floor(Math.random() * this.jumpScareImages.length);
    const jumpScareImage = this.jumpScareImages[randomIndex];
    
    // Play the jump scare sound
    playJumpscareSound();
    
    // Call the callback with the selected image
    this.onJumpScare(jumpScareImage);
    
    // Update the last jump scare time
    this.lastJumpScareTime = Date.now();
  }

  // Handle click events that could trigger a jump scare
  public handleClick(): void {
    const currentTime = Date.now();
    
    // Reset click count if clicked after the time window
    if (currentTime - this.lastJumpScareTime > this.clickTimeWindow) {
      this.clickCounter = 0;
    }
    
    // Update click tracking
    this.clickCounter++;
    this.lastJumpScareTime = currentTime;
    
    // Check if we should show a jump scare
    if (this.shouldShowJumpScare()) {
      this.triggerJumpScare();
    }
  }

  // Clean up timers
  public cleanup(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    
    if (this.clickResetTimer) {
      clearTimeout(this.clickResetTimer);
    }
  }

  // Enable/disable jump scares
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    
    if (enabled && !this.isTimerRunning) {
      this.startRandomTimer();
    } else if (!enabled && this.timerId) {
      clearTimeout(this.timerId);
      this.isTimerRunning = false;
    }
  }

  // Update configuration
  public updateConfig(newConfig: Partial<JumpScareConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart timer if necessary
    if (this.config.enabled && this.timerId) {
      clearTimeout(this.timerId);
      this.isTimerRunning = false;
      this.startRandomTimer();
    }
  }

  // Determine if we should show a jump scare based on user interaction
  private shouldShowJumpScare(): boolean {
    // Don't show if one was recently shown and we're in cooldown
    if (this.jumpScareShown && (Date.now() - this.lastJumpScareTime) < this.cooldownPeriod) {
      return false;
    }
    
    // User clicked rapidly
    if (this.clickCounter >= this.CLICK_THRESHOLD) {
      // 15% chance to trigger a jumpscare when clicking rapidly
      return Math.random() < 0.15;
    }
    
    // Random chance (1%) for random jumpscare on any click
    return Math.random() < 0.01;
  }
} 