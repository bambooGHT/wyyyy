/**
 * nickname 创建者名
 * avatarUrl 创建着头像
 */
interface creator {
  nickname: string;
  avatarUrl: string;
  userId: number;
}
/**
 * 歌单详情
 *id           id
 *name         名字
 *playCount    播放次数
 *createTime   创建时间
 *trackCount   曲数
 *coverImgUrl  图片
 *description  描述
 *trackNumberUpdateTime 更新时间
 *tags         标签
 *subscribed   是否收藏
 */

export interface allsong {
  creator: creator;
  id: number;
  name: string;
  playCount: number;
  playcount: number;
  picUrl?: string;
  subscribed: boolean;
  commentCount: number;
  createTime: number;
  trackCount: number;
  coverImgUrl: string;
  description: string | null;
  trackNumberUpdateTime: number;
  tags: string[];
  tracks: playlist[];
}

interface list {
  id: number;
  name: string;
  alia: string[];
}
interface listalbum extends list {
  picUrl: string;
  tns: string[];
  alia: string[];
}
/**
 * 歌单歌曲列表
 * id:歌曲id name:歌曲名
 * ar:歌手id 名
 * al:专辑名 id 专辑图片
 * tns       別名
 */

export interface playlist {
  sq: {};
  hr: {};
  t: number;
  id: number;
  name: string;
  fee: number;
  ar: list[];
  al: listalbum;
  dt: number;
  alia: string[];
  tns: string[];
}

//歌曲信息
export interface privilegestype {
  id: number;
  cp: number;
}

//歌词
export interface lyric {
  time: number;
  lyric: string;
}

//播放历史
export interface Historys extends playlist {
  playTime: number;
}
export interface Historytype {
  playTime: number;
  data: playlist;
}

export enum tabs {
  LIST = 'LIST',
  COMMENT = 'COMMENT',
  COLLECTOR = 'COLLECTOR'
}

//最近播放歌单列表
export interface recentlist {
  playTime: number; //播放时间
  data: {
    picUrl?: string;
    coverImgUrl?: string;
    id: number;
    name: string;
    lastSong: playlist;
    size?: number;
  };
}
export interface recentlisttype {
  playTime: number; //播放时间
  data: {
    coverImgUrl: string;
    picUrl: string;
    id: number;
    name: string;
    lastSong: playlist;
    size: number;
  };
}
//用户歌单收藏/创建
export enum usertab {
  PLAYLIST = 'PLAYLIST',
  SONG = 'SONG',
  COLLECTSONG = 'COLLECTSONG',
  RADIO = 'RADIO',
  COLLECTRADIO = 'COLLECTRADIO',
  ARTIST = 'ARTIST',
}