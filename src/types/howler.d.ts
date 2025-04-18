declare module 'howler' {
  interface HowlOptions {
    src: string[];
    volume?: number;
    loop?: boolean;
    autoplay?: boolean;
    html5?: boolean;
    preload?: boolean;
    onload?: () => void;
    onloaderror?: (soundId: number, error: Error) => void;
    onplay?: (soundId: number) => void;
    onplayerror?: (soundId: number, error: Error) => void;
    onend?: (soundId: number) => void;
    onpause?: (soundId: number) => void;
    onstop?: (soundId: number) => void;
    onmute?: (soundId: number) => void;
    onvolume?: (soundId: number) => void;
    onrate?: (soundId: number) => void;
    onseek?: (soundId: number) => void;
    onfade?: (soundId: number) => void;
  }

  export class Howl {
    constructor(options: HowlOptions);
    play(): number;
    pause(id?: number): this;
    stop(id?: number): this;
    playing(id?: number): boolean;
    volume(vol?: number, id?: number): this | number;
    fade(from: number, to: number, duration: number, id?: number): this;
    mute(muted?: boolean, id?: number): this | boolean;
    loop(loop?: boolean, id?: number): this | boolean;
    state(): 'unloaded' | 'loading' | 'loaded';
    on(event: string, listener: (soundId: number, ...args: unknown[]) => void, id?: number): this;
    once(event: string, listener: (soundId: number, ...args: unknown[]) => void, id?: number): this;
    off(event?: string, listener?: (soundId: number, ...args: unknown[]) => void, id?: number): this;
  }
  
  export class Howler {
    static volume(volume?: number): number;
    static mute(muted?: boolean): boolean;
    static codecs(ext: string): boolean;
    static unload(): void;
    static usingWebAudio: boolean;
    static noAudio: boolean;
    static masterGain: GainNode;
    static ctx: AudioContext;
  }
} 