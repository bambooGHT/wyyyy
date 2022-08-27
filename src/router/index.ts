import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import disover from '@/views/discover.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    // component: disover,
    children: [
      {
        path: '',
        component: () => import('@/views/home/recommend/index.vue')
      },
      {
        path: 'h-radio',
        component: () => import('@/views/home/radio/index.vue')
      },
      {
        path: 'h-radios',
        component: () => import('@/views/home/radio/radios.vue')
      },
      {
        path: 'h-Leaderboard',
        component: () => import('@/views/home/Leaderboard/index.vue')
      },
      {
        path: 'h-Artist',
        component: () => import('@/views/home/Artist/index.vue')
      },
      {
        path: 'h-high',
        component: () => import('@/views/home/songlist/high.vue')
      },
      {
        path: 'h-new',
        component: () => import('@/views/home/newsong/index.vue')
      },
      {
        path: 'h-songlist',
        name: 'h-songlist',
        component: () => import('@/views/home/songlist/index.vue')
      },
    ]
  },
  {
    path: '/song/:id',
    name: 'song',
    component: () => import('@/views/song/index.vue'),
  },
  {
    path: '/userrecommend/',
    name: 'userrecommend',
    component: () => import('@/views/userrecommend/index.vue'),
  },
  {
    path: '/daymusic/',
    name: 'daymusic',
    component: () => import('@/views/userrecommend/daymusic.vue')
  },
  {
    path: '/album/:id',
    name: 'album',
    component: () => import('@/views/album/index.vue')
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: () => import('@/views/Artist/index.vue')
  },
  {
    path: '/radio/:id',
    name: 'radio',
    component: () => import('@/views/radio/index.vue')
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('@/views/user/index.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue'),
    children: [
      {
        path: 'songs',
        component: () => import('@/views/search/songs.vue'),
      },
      {
        path: 'album',
        component: () => import('@/views/search/album.vue'),
      },
      {
        path: 'artist',
        component: () => import('@/views/search/artist.vue'),
      },
      {
        path: 'lyric',
        component: () => import('@/views/search/lyric.vue'),
      },
      {
        path: 'songlist',
        component: () => import('@/views/search/songlist.vue'),
      },
      {
        path: 'radio',
        component: () => import('@/views/search/radio.vue'),
      },
      {
        path: 'user',
        component: () => import('@/views/search/user.vue'),
      }
    ]
  },
];
const reuter = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default reuter;