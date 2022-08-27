import type { playlist } from "./songlist";

interface privilegestype {
  id: number;
  cp: number;
}

interface hot extends playlist {
  cd: string;//曲目位置
  pop: number;//热度
  privilege: privilegestype;//判断版权用
}



export interface ar {
  img1v1Url: string;
  name: string;
  id: number; //歌手id
  transNames: string[];//别名
  alias: string[];//别名
  mvSize: number;//mv数量
  musicSize: number;//歌曲數量
  albumSize: number;//專輯數量
  fansCount: number;
  followed: boolean;//是否關注
}
export interface artist {
  artist: ar;
  hotSongs: hot[];
}
export enum tabartist {
  TOPMUSIC,
  ALBUM,
  MV,
  ARTISTINFO
}
//歌手簡介等信息
export interface artxtype {
  introduction: {
    ti: string;
    txt: string;
  }[];
  briefDesc: string;
}