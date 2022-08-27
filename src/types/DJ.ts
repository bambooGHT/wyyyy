export interface DJtype {
  id: number;
  name: string;
  dj: {
    avatarUrl: string;//头像
    nickname: string;//名字
    userId: number;//id
  };
  picUrl: string;
  desc: string;//电台简介
  subCount: number;//订阅
  category: string;
  createTime: number;
  programCount: number;//节目数
  feeInfo?: any;//是否判断
}
export interface param {
  rid: number;
  offset: number;
  asc?: boolean;
}
export interface DJlist {
  programs: {
    id: number;
    mainTrackId: number;//id
    name: string;
    likedCount: number;//点赞
    listenerCount: number;//播放
    coverUrl: string;
    createTime: number;//创建时间
    serialNum: number;//节目序号
    duration: number;//时长
    programFeeType: number;//是否付费
    mainSong: maindj;
    dj: {
      nickname: string;//名字
      userId: number;//id
    };
  }[];

  count: number;
}

export interface maindj {
  id: number;
  mainTrackId: number;//id
  name: string;
  likedCount: number;//点赞
  listenerCount: number;//播放
  coverUrl: string;
  createTime: number;//创建时间
  serialNum: number;//节目序号
  duration: number;//时长
  radio: {
    id: number;
    name: string;
  };
  mainSong: {
    id: number;
    name: string;
    coverUrl: string;
    duration: number;
  };
  dj: {
    nickname: string;//名字
    userId: number;//id
  };
  programFeeType: number;//是否付费
}