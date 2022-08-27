//type : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV,
// 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音(搜索声音返回字段格式会不一样)

export type data = {
  keywords: string;
  type: number;
  offset?: number;
};


interface ar {
  id: number;
  name: string;
  alia: string[];
}
interface al extends ar {
  picUrl: string;
  tns: string;
}

interface privilegestype {
  id: number;
  cp: number;
}

interface SONGS {
  sq: {},
  hr: {},
  ar: ar[]; //歌手信息
  al: al; //专辑信息
  cd: string;//曲目位置
  dt: number;//时间
  pop: number;//热度
  fee: number;
  id: number;//曲目id
  alia: string[];//别名
  name: string;//曲名
  privilege: privilegestype;//判断版权用
  lyrics: string[];
}
interface ARTIST {
  name: string;
  id: number;
  alias: string[];
  img1v1Url: string;
  trans: string;
  albumSize: number;
}
interface ALBUMS {
  name: string;
  id: number;
  size: number;
  picUrl: string;
  artist: ARTIST;
}
interface PLAYLISTS {
  id: number;
  name: string;
  coverImgUrl: string;
  creator: {
    nickname: string;
    userId: number;
  };
  trackCount: number;
  playCount: number;
}
interface USER {
  nickname: string;
  avatarUrl: string;
  userId: number;
  description: string;
  avatarDetail: {
    identityIconUrl: string;
  };
  playlistCount: number;
}
interface DJ {
  name: string;
  id: number;
  dj: {
    nickname: string;//名字
    userId: number;//id
  };
  picUrl: string;//图片
  category: string;//类型
  programCount: number;//曲数
}
export interface searchdata {
  songs: SONGS[];//单曲
  songCount: number; //歌曲数
  albums: ALBUMS[];//专辑
  albumCount: number;//专辑数
  artists: ARTIST[];
  artistCount: number;//歌手数
  playlists: PLAYLISTS[];
  playlistCount: number;//歌单数
  userprofiles: USER[];
  userprofileCount: number;//用户数
  djRadios: DJ[];
  djRadiosCount: number;//电台数

}