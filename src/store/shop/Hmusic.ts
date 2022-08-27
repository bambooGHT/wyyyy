import { banners, newsongall, playlist, peradio, rarecom, personalize } from "@/server/hmusic";
import { songsurl } from "@/server/search";
import { defineStore } from "pinia";
import type { ar } from '@/types/Artist';
import type { songs } from '@/types/user';
import type { songlist } from '@/types/album';
import type { banner, newsongtype, playlistype, listparatype, highlist, DJhottype } from '@/types/Hmusic';
import Message from "@/message";
import { getsongurlv1 } from '@/server/songlist';
import playmusic from './playmusic';
import audio from '@/hooks/audio';
type hogh = {
  name: string;
};
const Hmusic = defineStore('Hmusic', {
  state: () => ({
    banner: [] as banner[],
    NEWsong: [] as newsongtype[],
    songlist: {} as playlistype,
    datahove: false,
    toptags: [] as hogh[],
    higharr: { playlists: [], total: 0, lasttime: 0 } as highlist,
    dj: [] as DJhottype[],
    ar: [] as ar[]
  }),
  actions: {
    Copy(data: songlist) {
      const { palymusiclist } = this.music;
      if (data.privilege.cp === 0) {
        Message({ type: 'error', message: '該曲沒有版權捏' });
        return true;
      }
      let index = -1;
      palymusiclist.map((p, i) => {
        if (p.id === data.id) index = i;
      });
      if (index !== -1 && this.music.Player.index === index) {
        Message({ type: 'warning', message: '已經添加到播放列表' });
        return true;
      }
      if (localStorage.getItem('USERVIP') == '0') {
          data.fee === 1 && Message({ type: 'warning', message: '會員歌曲,返回試聽片段!' });
      }
      index === -1 && palymusiclist.push(data as any);
      this.music.currentmusicinfo = data;
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
    //播放
    async play(data: songlist) {
      const copy = this.Copy(data);
      if (copy) return;
      const result = await getsongurlv1(data.id);
      audio.src = result.data[0].url;
      this.music.audioloadplay();
      this.music.Player.playorder === 1 && await this.music.musicShuffle(data.id);
    },
    //bof1
    async songsplay(ids: number) {
      const result = await songsurl(ids);
      const copy = this.Copy1(result);
      if (copy) return;
      const result1 = await getsongurlv1(result.songs[0].id);
      audio.src = result1.data[0].url;
      this.music.audioloadplay();
      this.music.Player.playorder === 1 && await this.music.musicShuffle(result.songs[0].id);
    },
    async ban() {
      const result = await banners();
      this.banner = result.banners;
    },
    async newmusic(type: string) {
      const result = await newsongall(type);
      this.NEWsong = result.data;
    },
    //获取分类列表
    async songs(data: listparatype) {
      const result = await playlist(data);
      this.songlist = result;
      this.datahove = true;
    },
    //电台主页推荐等列表
    async rarecoms(num: number) {
      if (num === -1) {
        const res = await peradio();
        return res.result;
      }
      if (num === -2) {
        const res = await personalize();
        return res.data;
      }
      const res_1 = await rarecom(num);
      return res_1.djRadios;
    }
  },
  getters: {
    music() {
      const music = playmusic();
      return music;
    },
  }
});

export default Hmusic;