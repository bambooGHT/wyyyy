import request from '../request';
import type { Commentype, data, Liked } from '@/types/comsub';

//获取歌单评论
export const Comment = (params: Commentype) => {
  return request({
    url: `/comment/playlist`,
    method: 'GET',
    params
  });
};
//获取歌曲评论
export const Commentmusic = (params: Commentype) => {
  return request({
    url: `/comment/music`,
    method: 'GET',
    params
  });
};
//获取专辑评论
export const Commentalbum = (params: Commentype) => {
  return request({
    url: `/comment/album`,
    method: 'GET',
    params
  });
};
//获取电台节目评论
export const CommentDJ = (params: Commentype) => {
  return request({
    url: `/comment/dj`,
    method: 'GET',
    params
  });
};
//获取精彩评论
export const Commenthot = (params: data) => {
  return request({
    url: `/comment/hot`,
    method: 'GET',
    params
  });
};
//歌单收藏者
export const subscribers = (params: Commentype) => {
  return request({
    url: `/playlist/subscribers`,
    method: 'GET',
    params
  });
};
//电台订阅者
// export const subradio = (params: { id: number, limit: number, time: number; }) => {
//   return request({
//     url: `/dj/subscriber`,
//     method: 'GET',
//     params
//   });
// };
//评论点赞
export const commentLiked = (params: Liked) => {
  return request({
    url: `/comment/like`,
    method: 'GET',
    params
  });
};