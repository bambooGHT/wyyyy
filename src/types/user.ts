import type { playlist } from "./songlist";

export interface users {
  account: string;
  password: string;
};
interface profile {
  province: number;//省
  city: number;//市
  nickname: string;//名
  avatarUrl: string;//图
  signature: string; //介绍
  userId: number;//id
  eventCount: number;//动态
  followeds: number;//粉丝
  follows: number;//关注
  playlistCount: number;//歌单数量
  avatarDetail: {
    identityIconUrl: string;
  };
  mainAuthType: {
    desc: string;
  };
}
export interface USERINFO {
  profile: profile;
  bool?: boolean;
  listenSongs: number;//听歌次数
};

export enum usertab {
  phone = '手機',
  email = '郵箱',
  UID = 'UID'
};
export interface userdata {
  code: number;
  profile: profile;
  message: string;
  cookie: string;
}

interface privilegestype {
  id: number;
  cp: number;
}

export interface songlist extends playlist {
  cd: string;//曲目位置
  fee: number;
  pop: number;
  privilege: privilegestype;//判断版权用
}

export interface usermusictime {
  score: number;//热度
  playCount: number;
  song: songlist;
}
export interface songs {
  songs: songlist[];
  privileges: privilegestype[];
}
export interface userdjtyoe {
  category: string;
  programCount: number;
  picUrl: string;
  subCount: number;
  id: number;
  dj: {
    nickname: string;//名字
    userId: number;//id
  };
  name: string;
}