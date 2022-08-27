import { songsurl, cloudsearch } from "@/server/search";
import { defineStore } from "pinia";
import type { songs } from '@/types/user';
import playmusic from './playmusic';
import Message from "@/message";
import audio from '@/hooks/audio';
import { getsongurlv1 } from "@/server/songlist";
import { searchdata, data } from '@/types/search';

const search = defineStore('search', {
  state: () => ({
    cloudsearch: {} as searchdata,
    Count: 0 as Number,
    Counts: false
  }),
  actions: {
    Copy(data: songs) {
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

    async songsplay(ids: number) {
      const result = await songsurl(ids);
      const copy = this.Copy(result);
      if (copy) return;
      let result1 = await getsongurlv1(result.songs[0].id);
      audio.src = result1.data[0].url;
      this.music.audioloadplay();
      this.music.Player.playorder === 1 && await this.music.musicShuffle(result.songs[0].id);
    },
    async sdata(data: data) {
      const result = await cloudsearch(data);
      this.cloudsearch = result.result;
      const exp = /Count$/;
      Object.keys(result.result).forEach((p, index) => {
        exp.test(p) && (this.Count = result.result[p]);
      });
      this.Counts = true;
    },
  },
  getters: {
    music() {
      return playmusic();
    },
  }
});

export default search;