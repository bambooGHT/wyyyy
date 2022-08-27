import request from '../request';
import { ref } from 'vue';
/**
 * 
 * @param uid id
 * timestamp 防止接口缓存
 */
//获取歌曲列表
export const getsonglist = (uid: number) => request({
  url: `/playlist/detail?id=${uid}`,
  method: 'GET'
});
// //获取url
// export const getsongurl = (id: number) => request({
//   url: `/song/url?id=${id}`,
//   method: 'GET'
// });

//获取url新版
export let levels = ref('hires');
export const getsongurlv1 = (id: number) => request({
  url: `/song/url/v1`,
  method: 'GET',
  params: {
    id: id,
    level: levels.value
  }
});


//获取歌词
export const lyricall = (id: number) => request({
  url: `/lyric?id=${id}`,
  method: 'GET'
});

export const spnglistALL = (params: { id: number, offset: number; }) => request({
  url: `/playlist/track/all`,
  method: 'GET',
  params: {
    ...params,
    limit: 250
  }
});