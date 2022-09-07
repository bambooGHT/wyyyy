import { defineStore } from 'pinia';
import { albuminfo, artistinfo, aralbum, aritxt } from '@/server/album-Artist';
import type { albumtypes, albumtype, songlist } from '@/types/album';
import type { artist, artxtype } from '@/types/Artist';
import playmusic from './playmusic';
import Message from '@/message';
import { getsongurlv1 } from '@/server/songlist';
import audio from '@/hooks/audio';
import type { Commentype } from '@/types/comsub';
import { songsurl } from '@/server/search';
const album = defineStore('album', {
  state: () => ({
    albumlist: {} as albumtypes & artist,
    songs: [] as any,
    aralbum: [] as albumtype[],
    arinfo: {} as artxtype,
  }),
  actions: {
    //获取专辑内容
    async albums(id: number) {
      const result = await albuminfo(id);
      if (result.code !== 200) {
        Message({ type: 'error', message: '獲取專輯失敗' });
        return;
      }
      this.albumlist.songs = result.songs;
      this.albumlist.album = result.album;
      this.songsall();
    },
    //獲取歌手信息
    async artist(id: number) {
      const result = await artistinfo(id);
      this.albumlist.artist = result.artist;
      this.albumlist.hotSongs = result.hotSongs;
    },
    //獲取歌手專輯
    async artistalbum(data: Commentype) {
      const result = await aralbum(data);
      if (result.code !== 200) {
        Message({ type: 'error', message: '獲取歌手專輯失敗' });
        return;
      }
      this.aralbum = result.hotAlbums;
    },
    //筛选
    songsall() {
      this.songs = [];
      let a = 0;
      let b = 0;
      this.albumlist.songs.forEach((element, indexs) => {
        if (element.cd !== this.albumlist.songs[indexs - 1]?.cd) {
          b = 0;
          this.songs.push(`DISC ${a += 1}`);
        }
        this.songs.push({
          ...element,
          index: b += 1
        });
      });
    },
    Copy(data: any) {
      const { palymusiclist } = this.music;
      if (data.privileges[0].cp === 0) {
        Message({ type: 'error', message: '該曲沒有版權捏' });
        return true;
      }
      let index = -1;
      palymusiclist.map((p, i) => {
        if (p.id === data.songs[0].id) index = i;
      });
      if (index !== -1 && this.music.Player.index === index) {
        Message({ type: 'warning', message: '已經添加到播放列表' });
        return true;
      }
      if (localStorage.getItem('USERVIP') == '0') {
        data.fee === 1 && Message({ type: 'warning', message: '會員歌曲,返回試聽片段!' });
      }
      index === -1 && palymusiclist.push(data.songs[0] as any);
      this.music.currentmusicinfo = data.songs[0];
    },
    //播放
    async play(id: number) {
      const result = await songsurl(id);
      console.log(result);
      
      const copy = this.Copy(result);
      if (copy) return;
      const result1 = await getsongurlv1(result.songs[0].id);
      audio.src = result1.data[0].url;
      this.music.audioloadplay();
      this.music.Player.playorder === 1 && await this.music.musicShuffle(result.songs[0].id);
    },
    //播放全部
    async playall() {
      let data = this.albumlist.songs.filter(p => p.privilege.cp !== 0);
      if (data.length < 1) {
        Message({ type: 'warning', message: '没有可以播放的歌曲捏' });
        return;
      }
      if (localStorage.getItem('USERVIP') == '0') {
        data = data.filter(p => p.fee !== 1);
        Message({ type: 'warning', message: '已過濾會員歌曲' });
      }
      this.music.palymusiclist = data as any;
      this.music.Player.index = 0;
      const result = await getsongurlv1(this.albumlist.songs[0].id);
      audio.src = result.data[0].url;
      this.music.currentmusicinfo = this.albumlist.songs[0];
      this.music.audioloadplay();
      this.music.Player.playorder === 1 && await this.music.musicShuffle(this.albumlist.songs[0].id);
    },
    //添加到列表
    async playpush() {
      let data = this.albumlist.songs.filter(p => p.privilege.cp !== 0);
      if (data.length < 1) {
        Message({ type: 'warning', message: '没有可以添加的歌曲捏' });
        return;
      }
      if (localStorage.getItem('USERVIP') == '0') {
        data = data.filter(p => p.fee !== 1);
        Message({ type: 'warning', message: '已過濾會員歌曲' });
      }
      if (this.music.palymusiclist.length < 1) {
        this.music.palymusiclist = data as any;
        return;
      }
      data.forEach(p => {
        const index = this.music.palymusiclist.findIndex(f => f.id === p.id);
        if (index === -1) {
          this.music.palymusiclist.push(p as any);
        }
      });
    },
    //歌手简介
    async ARinfo(id: number) {
      this.arinfo = {} as any;
      const result = await aritxt(id);
      if (result.code !== 200) {
        Message({ type: 'error', message: '請求失敗' });
        return;
      }
      this.arinfo.briefDesc = result.briefDesc;
      this.arinfo.introduction = result.introduction;
    },
  },
  getters: {
    music() {
      const music = playmusic();
      return music;
    },
    sukiarr(): number[] {
      return this.music.sukiarr;
    },
    deadd(): Function {
      return this.music.del_add;
    }
  }
});

export default album;