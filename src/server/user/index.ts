import request from '../request';
import type { users } from '@/types/user';
/**
 * @param data account账号 password密码
 */

//手机登录
export const userinfo = (data: users) => request({
  url: `/login/cellphone`,
  method: 'POST',
  data: {
    phone: data.account,
    password: data.password

  }
});
//邮箱登录
export const userphome = (data: users) => request({
  url: `/login`,
  method: 'POST',
  data: {
    phone: data.account,
    password: data.password
  }
});
//uid登录 / 获取用户信息
export const useruid = (uid: string) => request({
  url: `/user/detail?uid=${uid}`,
  method: 'POST',
});
//退出登录
export const logout = () => request({
  url: `/logout`,
  method: 'GET',
});

//用户歌单
export const usersonglist = (params: { uid: number, offset: number; }) => request({
  url: `/user/playlist`,
  method: 'GET',
  params
});

//用户喜歡音樂列表
export const ids = (uid: number) => request({
  url: `/likelist?uid=${uid}`,
  method: 'GET'
});
//喜歡&取消喜歡
export const like = (params: { id: number, like: boolean; }) => request({
  url: `/like`,
  method: 'GET',
  params
});

/**
 * @param params id:歌單id  t:1:收藏,2:取消收藏
 */
//收藏&取消收藏歌單
export const subscribe = (params: { id: number, t: 1 | 2; }) => request({
  url: `/playlist/subscribe`,
  method: 'GET',
  params
});

//vip信息
export const uservip = () => request({
  url: `/vip/info`,
  method: 'GET'
});

//播放历史
export const playHistory = () => request({
  url: `/record/recent/song`,
  method: 'GET'
});

//个性推荐歌曲
export const usersongs = () => request({
  url: `/recommend/songs`,
  method: 'GET'
});

//个性推荐歌单
export const userresource = () => request({
  url: `/recommend/resource`,
  method: 'GET'
});

//最近播放歌单
export const userplaylist = () => request({
  url: `/record/recent/playlist`,
  method: 'GET'
});

//最近播放专辑
export const useralbum = () => request({
  url: `/record/recent/album`,
  method: 'GET'
});

//用户播放记录
export const userrecord = (data: { uid: number, type: number; }) => request({
  url: `/user/record`,
  method: 'POST',
  data
});
//用户创建电台
export const userdj = (id: number) => request({
  url: `/user/audio?uid=${id}`,
  method: 'GET',
});
//用户订阅电台
export const userdjlist = () => request({
  url: `/dj/sublist`,
  method: 'GET',
});
//用户收藏的歌手
export const arlike = () => request({
  url: `/artist/sublist`,
  method: 'GET',
});
/**
 * 
 * @param params id:歌手id  t:1收藏 2取消收藏
 * @returns 
 */
//收藏/取消收藏 歌手
export const arlikes = (params: { id: number, t: 1 | 2; }) => request({
  url: `/artist/sub`,
  method: 'GET',
  params
});