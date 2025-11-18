import { Howl } from 'howler';
import { BehaviorSubject, first, firstValueFrom } from 'rxjs';

const SOUND_NAMES = [
  'ambiance', 'bump1', 'bump2', 'menuSelect', 'roll', 'crush',
  'cheerfull', 'bottlePop1', 'bottlePop2', 'fruitGroundBounce',
  'groundBump', 'volumeUp', 'mute', 'open', 'close', 'ioBump', 'ping', 'jumpSoft', 'jump'
] as const;
export type SoundName = typeof SOUND_NAMES[number];
export type LoadingHashMap = Record<SoundName, BehaviorSubject<boolean>>;
export type SoundsHashMap = Record<SoundName, Howl>;

export class SoundLibraryService {
  private static _instance: SoundLibraryService;
  private _sounds: SoundsHashMap = <SoundsHashMap>{};
  private _loaded: Array<SoundName> = [];
  private _loading: LoadingHashMap = <LoadingHashMap>{};

  private constructor() {
    for (const soundName of SOUND_NAMES) {
      this._sounds[soundName] = new Howl({
        src: [
          `./assets/sounds/${soundName}.webm`,
          `./assets/sounds/${soundName}.mp3`,
        ],
        preload: false,
      });
    }
  }

  public static instance(): SoundLibraryService {
    if (!SoundLibraryService._instance) {
      SoundLibraryService._instance = new SoundLibraryService();
    }
    return SoundLibraryService._instance;
  }

  public preload = (list: SoundName[]) => {
    const promises: Array<Promise<boolean>> = [];

    for (const name of list) {
      if (!this._loading[name]) {
        this._loading[name] = new BehaviorSubject<boolean>(false);
      }
      promises.push(firstValueFrom(this._loading[name].pipe(first(v => v === true))));

      if (!this._loaded.includes(name)) {
        this._sounds[name].once('load', () => {
          this._loading[name].next(true);
          this._loaded.push(name);
        });
        this._sounds[name].once('loaderror', () => {
          this._loading[name].next(true); // the show must go on! it  will retry on play
          this._loaded.push(name);
        });
        this._sounds[name].load();
      }
    }

    return Promise.allSettled(promises);
  };

  public get sounds() {
    return this._sounds;
  }


}
