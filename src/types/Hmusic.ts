import type { songlist } from '@/types/album';
export interface banner {
  pic: string;//图片
  url: string;//url
  targetType: number;//资源类型
  targetId: number;//id
  typeTitle: string;//注释
  song: songlist;
}
//1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户
//1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
// 2000:声音,3000:外链

export interface NEWsong {
  id: number;
  name: string;
  picUrl: string;
  song: {
    artists: {
      id: number;
      name: string;
    }[];
  };
}

export interface MV {
  id: number;
  name: string;
  copywriter: string;
  picUrl: string;
  artists: {
    id: number;
    name: string;
  }[];
}
//电台
export interface REdio {
  id: number;
  type: number;
  name: string;
  copywriter: string;
  picUrl: string;
  program: {
    radio: {
      id: number;
    };
  };
}
interface privilegestype {
  id: number;
  cp: number;
}

interface album {
  picUrl: string;
  id: number;
  name: string;
  alias: string[];
}
//最新yy
export interface newsongtype {
  album: album;
  id: number;
  name: string;
  alias: string[];
  artists: {
    id: number;
    name: string;
  }[];
  privilege: privilegestype;//版权判断
  duration: number;//时长
}
//分类
export interface songlistype {
  tags: {
    id: number;
    name: string;
    category: number;
  }[];
}
export interface songlistalltype {
  all: {
    name: string;
    category: number;
    resourceCount: number;
  };
  sub: {
    name: string;
    category: number;
    resourceCount: number;
    hot: boolean;
  }[];
  categories: {
    [value: number]: string;
  };
}

export interface listparatype {
  cat: string;
  limit?: number;
  offset: number;
}
export interface high {
  cat: string;
  before?: number;
}

interface creators {
  userId: number;
  nickname: string;
}
//歌单列表
export interface playlistype {
  playlists: {
    id: number;
    name: string;
    coverImgUrl: string;
    trackCount: number;//曲数
    playCount: number;//播放数
    creator: creators;
  }[];
  total: number;
  cat: string;
}
//精品歌單列表
export interface highlist {
  playlists: {
    id: number;
    name: string;
    coverImgUrl: string;
    tag: string;//標簽
    trackCount: number;//曲數
    copywriter: string;//歌單copy
    playCount: number;//播放計數
    creator: {
      userId: number;
      nickname: string;
    };
  }[];
  total: number;
  lasttime: number;
}

export interface DJhottype {
  id: number;
  name: string;
  dj: {
    nickname: string;//名字
    userId: number;//id
  };
  picUrl: string;
  rcmdtext: string;//电台简介
  subCount: number;//订阅数
  category: string;//分类
  createTime: number;
  programCount: number;//节目数
}

export interface leadtype {
  updateFrequency: string;//更新时间
  coverImgUrl: string;
  id: number;
  name: string;
  playCount: number;//播放数
}