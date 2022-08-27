
interface user {
  userId: number; //评论者id
  avatarUrl: string;//图片
  nickname: string;//名字

}
export interface all {
  user: user;
  beReplied: {
    content: string;
    user: user;
  }[];
  commentId: number;//评论id
  content: string; //评论信息
  time: number; //时间日期2
  timeStr: string; //时间日期1
  likedCount: number;//suki
  liked: boolean;//i suki?
}
//最新评论
export interface Commentnew {
  total: number;//总评论
  comments: all[];
}

export interface Commentype {
  id: number;
  limit?: number;
  offset?: number;
  before?: number;//超过5000要用
}
//热门评论
export interface CommenHOT {
  total: number;//总评论
  hotComments: all[];
}
export type data = { id: number, type: number; };

//收藏者
interface sub {
  avatarUrl: string;
  nickname: string;
  userId: number;
}

export interface subscribertype {
  total: number;
  subscribers: sub[];
}

//评论点赞
export interface Liked {
  id: number;
  cid: number;  //评论 id
  t: number; //是否点赞 , 1 为点赞 ,0 为取消点赞
  type: number; //对应资源类型
}