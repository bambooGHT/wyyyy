import { defineStore } from 'pinia';
import type { DJtype, DJlist, param, maindj } from '@/types/DJ';
import { reinfo, relist } from '@/server/radio';
import playmusic from './playmusic';
import { getsongurlv1 } from '@/server/songlist';
import audio from '@/hooks/audio';
import Message from '@/message';
const radio = defineStore('redio', {
  state: () => ({
    //电台信息
    readioinfo: {} as DJtype,
    //电台列表
    readiolist: {} as DJlist,
    ask: false,
  }),
  actions: {
    async reinfos(rid: number) {
      const result = await reinfo(rid);
      this.readioinfo = result.data;
    },
    async relists(data: param) {
      const result = await relist(data);
      this.readiolist = result;
      this.ask = true;
    },
    Copy(data: maindj) {
      const { palymusiclist } = this.music;
      let index = -1;
      palymusiclist.map((p, i) => {
        if (p.id === data.mainSong.id) index = i;
      });
      if (index !== -1 && this.music.Player.index === index) {
        Message({ type: 'warning', message: '已經添加到播放列表' });
        return true;
      }
      index === -1 && palymusiclist.push(data as any);
      data.id = data.mainTrackId;
      this.music.currentmusicinfo = data;
    },
    //播放
    async play(data: maindj) {
      if (data.programFeeType === 10) {
        Message({ type: 'warning', message: '该节目为付费' });
        return;
      }
      const copy = this.Copy(data);
      if (copy) return;
      const result = await getsongurlv1(data.mainSong.id);
      audio.src = result.data[0].url;
      this.music.audioloadplay();
      this.music.Player.playorder === 1 && await this.music.musicShuffle(data.mainSong.id);
    },
    //播放全部
    playall() {
      const newdata: any[] = this.readiolist.programs.filter(p => {
        p.id = p.mainTrackId;
        return p.programFeeType !== 10;
      });
      if (newdata.length < 1) {
        Message({ type: 'warning', message: '没有可以播放的歌曲捏' });
        return;
      }
      if (newdata.length > 1 && newdata.length !== this.readiolist.programs.length) {
        Message({ type: 'info', message: '已过滤付费节目' });
      }
      newdata.sort((p, s) => p.serialNum - s.serialNum);
      this.music.palymusiclist = newdata;
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
    //添加到列表
    playpush() {
      const newdata: any[] = this.readiolist.programs.filter(p => {
        p.id = p.mainTrackId;
        return p.programFeeType !== 10;
      });
      if (newdata.length < 1) {
        Message({ type: 'warning', message: '没有可以添加的歌曲捏' });
        return;
      }
      //如果列表为空
      if (this.music.palymusiclist.length < 1) {
        this.music.palymusiclist = newdata;
        return;
      }
      newdata.forEach(p => {
        const index = this.music.palymusiclist.findIndex(f => f.id === p.id);
        if (index === -1) {
          this.music.palymusiclist.push(p);
        }
      });
    },
  },
  getters: {
    music() {
      const music = playmusic();
      return music;
    },
  }
});
export default radio;