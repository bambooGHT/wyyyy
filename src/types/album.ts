interface list {
  id: number;
  name: string;
  alia: string[];
}

interface listalbum extends list {
  picUrl: string;
}

interface privilegestype {
  id: number;
  cp: number;
}

export interface songlist {
  ar: list[]; //歌手信息
  al: listalbum; //专辑信息
  cd: string;//曲目位置
  dt: number;//时间
  pop: number;//热度
  fee: number;
  id: number;//曲目id
  alia: string[];//别名
  
  name: string;//曲名
  privilege: privilegestype;//判断版权用
  privileges: privilegestype;//判断版权用
}
export interface albumtype {
  artists: {//专辑歌手
    id: number;
    name: string;
  }[];
  picUrl: string;//专辑图片
  subType: string;//专辑录音
  description: string;//专辑简介
  name: string;//专辑名字
  id: number;
  size: number;//曲数
  alias: string[];//专辑别名
  publishTime: string;//发布时间
  info: {
    liked: boolean;//是否喜欢
    commentCount: number;//评论数
  };
}

export interface albumtypes {
  songs: songlist[];//曲目列表
  album: albumtype;//专辑信息
}