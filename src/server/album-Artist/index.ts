import request from '../request';

//获取专辑
export const albuminfo = (id: number) => {
  return request({
    url: `/album?id=${id}`,
    method: 'GET',
  });
};

//获取歌手前50热门
export const artistinfo = (id: number) => {
  return request({
    url: `/artists?id=${id}`,
    method: 'GET',
  });
};

//获取歌手专辑
export const aralbum = (params: any) => {
  return request({
    url: `/artist/album`,
    method: 'GET',
    params
  });
};

//获取歌手信息
export const aritxt = (id: number) => {
  return request({
    url: `/artist/desc?id=${id}`,
    method: 'GET',
  });
};