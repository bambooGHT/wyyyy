import { defineStore } from 'pinia';
import { playmusic } from "@/store";
import { getsonglist, getsongurlv1, spnglistALL } from '@/server/songlist';
import type { playlist, privilegestype, allsong, recentlist } from '@/types/songlist';
import type { songs } from '@/types/user';
import Message from '@/message';
import audio from '@/hooks/audio';
import { usersongs, userresource, userplaylist, useralbum } from '@/server/user';
import { usersonglist } from '@/server/user';
import { songsurl } from '@/server/search';

const songlist = defineStore('songlist', {
  state: () => ({
    //歌单信息
    songall: { tracks: [] as playlist[] } as allsong,
    //歌曲信息
    privilege: [] as privilegestype[],
    //每日推荐
    music: [],
    //个性推荐歌单
    resource: [] as allsong[],
    //最近播放的歌单
    recentsonglist: [] as recentlist[],
    //最近播放的专辑
    recentalbum: [] as recentlist[],
    //創建的歌單
    userSong: [] as allsong[],
    //收藏的歌單
    userSongSub: [] as allsong[],
  }),

  actions: {
    //刪除/添加 喜歡
    async songlike(num: number, boo: boolean) {
      if (!boo) {
        this.songall.tracks.splice(this.songall.tracks.findIndex(p => p.id == num), 1);
        --this.songall.trackCount;
        this.privilege.splice(this.songall.tracks.findIndex(p => p.id == num), 1);
        return;
      }
      const result = await songsurl(num);
      this.songall.tracks.unshift(...result.songs);
      ++this.songall.trackCount;
      this.privilege.unshift(...result.privileges);
    },
    async song(num: number) {
      this.songall = {} as any;
      this.privilege = [];
      const result = await getsonglist(num);
      if (!result.privileges) {
        Message({ type: 'warning', message: '一首都沒有捏' });
        return false;
      }
      //已經做了判斷 應該沒問題 ./playmusicx下的del_add
      // if (Number(localStorage.getItem('USERSUKIID')) == num) {
      //   JSON.stringify(result.playlist.trackIds.map((p: { id: number; }) => p.id)) !=
      //     localStorage.getItem('USERSUKILIST') &&
      //     localStorage.setItem('USERSUKILIST',
      //       JSON.stringify(result.playlist.trackIds.map((p: { id: number; }) => p.id))
      //     );
      // }
      delete result.playlist.trackIds;
      //如果是自己的歌单
      if (result.playlist.creator.userId == localStorage.getItem('USERID')) {
        if (result.playlist.trackCount <= 250) {
          this.songall = result.playlist;
          this.privilege = result.privileges;
          return;
        }
        result.playlist.tracks = [];
        this.songall = result.playlist;
        this.songlistall({ id: num, offset: 0 });
        return;
      }
      //非自己的,判断返回的曲数是否相等
      if (result.playlist.trackCount === result.playlist.tracks.length) {
        this.songall = result.playlist;
        this.privilege = result.privileges;
        return;
      }
      result.playlist.tracks = [];
      this.songall = result.playlist;
      this.songlistall({ id: num, offset: 0 });
      // if (result.playlist.trackCount) {
      //   this.privilege = result.privileges;
      //   return;
      // }
      // this.privilege = result.privileges;

      // playlist.tracks.forEach((tiem: playlist, index: number) => {
      //   index++;
      //   this.playlist.push({
      //     id: tiem.id,
      //     name: tiem.name,
      //     fee: tiem.fee,
      //     ar: tiem.ar,
      //     al: {
      //       id: tiem.al.id,
      //       name: tiem.al.name,
      //       picUrl: tiem.al.picUrl,
      //       tns: tiem.al.tns
      //     },
      //     dt: tiem.dt,
      //     tns: tiem.tns,
      //     alia: [
      //       tiem.alia[0]
      //     ]
      //   });
      // });

      // result.privileges.forEach((tiem: privilegestype) => {
      //   this.privilege.push({
      //     id: tiem.id,
      //     cp: tiem.cp
      //   });
      // });

      // this.songall = {
      //   creator: {
      //     nickname: playlist.creator.nickname,
      //     avatarUrl: playlist.creator.avatarUrl
      //   },
      //   id: playlist.id,
      //   name: playlist.name,
      //   playCount: playlist.playCount,
      //   createTime: playlist.createTime,
      //   trackCount: playlist.trackCount,
      //   coverImgUrl: playlist.coverImgUrl,
      //   description: playlist.description,
      //   trackNumberUpdateTime: playlist.trackNumberUpdateTime,
      //   tags: playlist.tags
      // };
    },
    //获取歌曲列表
    async songlistall(params: { id: number, offset: number; }) {
      params.offset = params.offset * 250;
      const result = await spnglistALL(params);
      this.songall.tracks.push(...result.songs);
      this.privilege.push(...result.privileges);
    },
    //判断版权
    Copyright(id: number): boolean {
      const privilege = this.privilege.find(item => item.id === id);
      if (privilege?.cp === 0) return true;
      return false;
    },

    // 添加到列表
    musicplay(data: playlist): boolean | undefined {
      const { palymusiclist } = this.music;
      if (this.Copyright(data.id)) {
        Message({ type: 'error', message: '該曲沒有版權捏' });
        return true;
      }
      let index: number = -1;
      palymusiclist.map((p, i) => {
        if (p.id === data.id) index = i;
      });
      if (index !== -1 && this.music.Player.index === index) {
        Message({ type: 'warning', message: '已經添加到播放列表' });
        return true;
      }
      if (this.songall.tracks) {
        const info = this.songall.tracks.find(item => item.id === data.id);
        if (localStorage.getItem('USERVIP') == '0') {
          info?.fee === 1 && Message({ type: 'warning', message: '會員歌曲,返回試聽片段!' });
        }
      }
      index === -1 && this.music.palymusiclist.push({ ...data as any });
      // index === -1 && palymusiclist.push({
      //   id: data.id,
      //   name: data.name,
      //   fee: data.fee,
      //   ar: data.ar,
      //   al: {
      //     id: data.al.id,
      //     name: data.al.name,
      //     picUrl: data.al.picUrl,
      //     tns: data.al.tns
      //   },
      //   dt: data.dt,
      //   tns: data.tns,
      //   alia: [
      //     data.alia[0]
      //   ]
      // });
      this.music.currentmusicinfo = data;
    },
    //双击播放
    async play(data: playlist) {
      const { musicplay } = this;
      const ids = musicplay(data);
      if (ids) return;
      const result = await getsongurlv1(data.id);
      audio.src = result.data[0].url;
      this.music.audioloadplay();
      this.music.Player.playorder === 1 && await this.music.musicShuffle(data.id);
    },
    Copy1(data: songs) {
      if (data.privileges[0].cp === 0) {
        Message({ type: 'error', message: '該曲沒有版權捏' });
        return true;
      }
      let index = -1;
      this.music.palymusiclist.map((p, i) => {
        if (p.id === data.songs[0].id) index = i;
      });
      if (index !== -1 && this.music.Player.index === index) {
        Message({ type: 'warning', message: '已經添加到播放列表' });
        return true;
      }
      if (localStorage.getItem('USERVIP') == '0') {
        data.songs[0].fee === 1 && Message({ type: 'warning', message: '會員歌曲,返回試聽片段!' });
      }
      index === -1 && this.music.palymusiclist.push(data.songs[0] as any);
      this.music.currentmusicinfo = data.songs[0];
    },
    async splay1(ids: number) {
      const result = await songsurl(ids);
      const copy = this.Copy1(result);
      if (copy) return;
      const result1 = await getsongurlv1(result.songs[0].id);
      audio.src = result1.data[0].url;
      this.music.audioloadplay();
      this.music.Player.playorder === 1 && await this.music.musicShuffle(result.songs[0].id);
    },
    //音质切换
    async levelplay(ids: number) {
      const result = await getsongurlv1(ids);
      audio.src = result.data[0].url;
      this.music.audioloadplay();
      this.music.PLAY = true;
      this.music.valueindex = -1;
    },
    //播放全部
    playlistreplace() {
      //过滤无版权
      let newdata: playlist[] = this.songall.tracks.filter(p => !this.Copyright(p.id));
      if (newdata.length < 1) {
        Message({ type: 'warning', message: '没有可以播放的歌曲捏' });
        return;
      }
      if (localStorage.getItem('USERVIP') == '0') {
        newdata = newdata.filter(p => p.fee !== 1);
        Message({ type: 'warning', message: '已過濾會員歌曲' });
      }
      this.music.palymusiclist = newdata as any;
      getsongurlv1(this.music.palymusiclist[0].id).then(
        res => {
          audio.src = res.data[0].url;
          this.music.Player.index = 0;
          this.music.audioloadplay();
          this.music.currentmusicinfo = this.music.palymusiclist[0];
          this.music.Player.playorder === 1 && this.music.musicShuffle(this.music.palymusiclist[0].id);
        }
      );
    },
    //全部添加到列表
    playlistpush() {
      //过滤无版权
      let newdata: playlist[] = this.songall.tracks.filter(p => !this.Copyright(p.id));
      if (newdata.length < 1) {
        Message({ type: 'warning', message: '没有可以添加的歌曲捏' });
        return;
      }
      if (localStorage.getItem('USERVIP') == '0') {
        newdata = newdata.filter(p => p.fee !== 1);
        Message({ type: 'warning', message: '已過濾會員歌曲' });
      }
      //如果列表为空
      if (this.music.palymusiclist.length < 1) {
        this.music.palymusiclist = newdata as any;
        return;
      }
      newdata.forEach(p => {
        const index = this.music.palymusiclist.findIndex(f => f.id === p.id);
        if (index === -1) {
          this.music.palymusiclist.push(p as any);
        }
      });
    },
    //推荐歌单
    songresource() {
      this.recentsonglist = [];
      this.recentalbum = [];
      userresource().then((res: any) => {
        this.resource = res.recommend;
        userplaylist().then((res: any) => {
          this.recentsonglist = res.data.list;
          useralbum().then((res: any) => {
            this.recentalbum = res.data.list;
          });
        });
      });
      // result1.data.list.forEach((p: recentlisttype) => {
      //   this.recentsonglist.push({
      //     playTime: p.playTime,
      //     picUrl: p.data.coverImgUrl,
      //     id: p.data.id,
      //     name: p.data.name,
      //     lastSong: p.data.lastSong,
      //   });
      // });
      // result2.data.list.forEach((p: recentlisttype) => {
      //   this.recentalbum.push({
      //     playTime: p.playTime,
      //     picUrl: p.data.picUrl,
      //     id: p.data.id,
      //     name: p.data.name,
      //     lastSong: p.data.lastSong,
      //     size: p.data.size
      //   });
      // });
    },
    //个性推荐歌曲
    async usersong() {
      const result = await usersongs();
      this.songall.tracks = result.data.dailySongs;
    },
    //用户歌单=创建
    async usersongarr(data: { uid: number, offset: number; }) {
      const result = await usersonglist(data);
      this.userSong = result.playlist.filter((s: any) => s.creator.userId === data.uid);
    },
    //用户歌单-收藏
    async usersongarr1(data: { uid: number, offset: number; }) {
      const result = await usersonglist(data);
      this.userSongSub = result.playlist.filter((s: any) => s.creator.userId !== data.uid);
    },
  },
  getters: {
    music() {
      return playmusic();
    },
    sukiarr(): number[] {
      return this.music.sukiarr;
    },
    deadd(): Function {
      return this.music.del_add;
    },
  }
});

export default songlist;