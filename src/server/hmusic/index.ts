import request from "../request";
import { listparatype, high } from '@/types/Hmusic';
//轮播图
export const banners = () => {
  return request({
    url: `/banner?type=1`,
    method: 'GET',
  });
};

//最新音乐
export const newsong = () => {
  return request({
    url: `/personalized/newsong`,
    method: 'GET',
  });
};

//新歌速递
export const newsongall = (type: string) => {
  return request({
    url: `/top/song?type=${type}`,
    method: 'GET',
  });
};

//推荐 mv
export const pemv = () => {
  return request({
    url: `/personalized/mv`,
    method: 'GET',
  });
};

//推荐 电台
export const peradio = () => {
  return request({
    url: `/personalized/djprogram`,
    method: 'GET',
  });
};

//个性推荐 电台
export const personalize = () => {
  return request({
    url: `/dj/personalize/recommend`,
    method: 'GET',
  });
};

//优选电台
export const today = () => {
  return request({
    url: `/dj/today/perfered`,
    method: 'GET',
  });
};
//付费电台
export const feeradio = (params: { limit: number; }) => {
  return request({
    url: `/dj/paygift`,
    method: 'GET',
    params
  });
};

//歌单分类
export const alllist = () => {
  return request({
    url: `/playlist/catlist`,
    method: 'GET',
  });
};

//熱門歌单分类
export const hotlist = () => {
  return request({
    url: `/playlist/hot`,
    method: 'GET',
  });
};
//分类列表
export const playlist = (params: listparatype) => {
  return request({
    url: `/top/playlist`,
    method: 'GET',
    params
  });
};
//精品歌单分类
export const highquality = () => {
  return request({
    url: `/playlist/highquality/tags`,
    method: 'GET',
  });
};

export const highqualist = (params: high) => {
  return request({
    url: `/top/playlist/highquality`,
    method: 'GET',
    params
  });
};
//dj/banner
export const banner = () => {
  return request({
    url: `/dj/banner`,
    method: 'GET',
  });
};
//dj/节目详情
export const djplay = (id: number) => {
  return request({
    url: `/dj/program/detail?id=${id}`,
    method: 'GET',
  });
};
//dj分类
export const catelist = () => {
  return request({
    url: `/dj/catelist`,
    method: 'GET',
  });
};
//dj列表
export const rahot = (params: { cateId: number, offset?: number; }) => {
  return request({
    url: `/dj/radio/hot`,
    method: 'GET',
    params: {
      limit: 100,
      ...params
    }
  });
};
//dj列表
export const rarecom = (type: number) => request({
  url: `/dj/recommend/type?type=${type}`,
  method: 'GET',
});

//top排行榜
export const topload = () => request({
  url: `/toplist`,
  method: 'GET',
});

//歌手列表
export const arlist = (params: { type: string, area: string, initial: string; offset?: number; }) => request({
  url: `/artist/list`,
  method: 'GET',
  params: {
    ...params,
    limit: 50
  }
});