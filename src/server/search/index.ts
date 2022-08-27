import request from "../request";
import type {data} from '@/types/search'
//获取搜索建议
export const searchof = (value: string) => {
  return request({
    url: `/search/suggest?keywords=${value}`,
    method: 'GET',
  });
};

//获取歌曲详情
export const songsurl = (ids: number) => {
  return request({
    url: `/song/detail?ids=${ids}`,
    method: 'GET',
  });
};
//搜索内容
export const cloudsearch = (params: data) => {
  return request({
    url: `/cloudsearch`,
    method: 'GET',
    params
  });
};