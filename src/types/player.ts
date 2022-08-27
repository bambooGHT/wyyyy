import { InjectionKey } from 'vue';

export interface Paly {
  duration: string;
  currentTime: number;
  initialDuration: number;
  volume: number;
  index: number;
  lrctime?: number;
  audiotime?: number;
  playorder:number;
}
type lyric = { lyric: string; };
//歌词
export interface lyricALL {
  lrc: lyric;
  klyric: lyric;
  tlyric: lyric;
  romalrc: lyric;
}

export const musickey: InjectionKey<number> = Symbol('');
