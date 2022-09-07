import { defineStore } from 'pinia';
import type { Paly } from "@/types/player";
import daytime from '@/utils/day-prce';
import { getsongurlv1, lyricall } from '@/server/songlist';
import type { playlist, Historys, Historytype, lyric } from '@/types/songlist';
import Message from '@/message';
import { playHistory, like } from '@/server/user';
import audio from '@/hooks/audio';
import LYRIC from '@/utils/Lyrics';
import type { maindj } from '@/types/DJ';
import { debounce1, lyricde } from '@/utils/throttle';

const playmusic = defineStore('playmusic', {
  state: () => ({
    Player: {
      duration: '00:00', //总时长
      currentTime: 0, //当前时长
      initialDuration: 0,//原本时长
      index: 0, //当前播放索引
      volume: 1,//音量
      // lrctime: -1,//歌词定时器
      audiotime: -1, //进度条定时器
      playorder: 0,//播放顺序
    } as Paly,
    //喜歡列表
    sukiarr: [] as number[],
    //控制定时器 是否处于正在播放
    PLAY: false,
    //音量样式
    backsize1: '100%',
    //播放进度样式
    backsize: '0%',
    WIDTH: '0%',
    //用户设置音质
    levels: '',
    //临时音质
    level: '',
    //滚动条控制
    current: true,
    //滚动条进度时间
    RangeTime: 0,
    //播放列表
    palymusiclist: [] as Array<playlist & maindj>,
    //当前播放的歌曲的信息
    currentmusicinfo: {} as any,
    //历史
    History: [] as Historys[],
    //随机播放
    fullmusiclist: [] as number[],
    //歌词部分
    lyricdiv: '' as any, //歌词外层容器
    Lyric: [] as lyric[], //歌词以及时间
    erlyric: true as boolean,//是否有歌词
    valueindex: -1 as number,//歌词索引
    Lyricdom: [] as any[],//歌词元素dom
    Lyricindex: -1 as number,//高亮
    comment: false as boolean,
    islyric: false as boolean,//是否在歌詞頁面
    Lyrictime: { time: 0, index: -1 }, //滾動時中間的歌詞進度
    Lyricscoll: false,
    Lyricscoll1: false
  }),
  actions: {
    //清空列表
    allempty() {
      this.$reset();
      this.PLAY = false;
      audio.src = '';
    },
    //audio初始化
    canplay() {
      audio.oncanplay = () => {
        const { Player } = this;
        Player.initialDuration = audio.duration;
        Player.currentTime = audio.currentTime;
        Player.duration = daytime.time(audio.duration);
      };
      // window.onblur = () => {
      //   clearTimeout(this.Player.audiotime);
      // };
      // window.onfocus = () => {
      //   this.set(0);
      // };
      window.addEventListener('visibilitychange', () => {
        if (document.hidden === true) {
          clearTimeout(this.Player.audiotime);
          this.Player.audiotime = -1;
          this.PLAY = false;
        } else {
          if (this.Lyric[this.Lyric.length - 2]?.time <= audio.currentTime) {
            this.Player.currentTime = audio.currentTime;
            this.valueindex = this.Lyric.length - 1;
            this.lyricScroll(this.valueindex);
            this.lyricsize(-1, 1);
            return;
          }
          for (let i = 0; i < this.Lyric.length; i++) {
            if (this.Lyric[i + 1]?.time > audio.currentTime && this.Lyric[i]?.time <= audio.currentTime) {
              this.Player.currentTime = audio.currentTime;
              this.valueindex = i;
              this.lyricScroll(i);
              this.lyricsize(i, 1);
              break;
            }
          }
          this.PLAY = true;
          !audio.paused && this.set(0);
        }
      });
      audio.onended = () => {
        //如果为顺序播放
        if (this.Player.playorder === 0) {
          if (this.Player.index === this.palymusiclist.length - 1) {
            this.PLAY = false;
            return;
          };
          this.musicnext();
          //如果为随机播放
        } else if (this.Player.playorder === 1) {
          if (this.palymusiclist.length > 1) {
            this.musicnext();
          } else {
            this.PLAY = false;
          }
          //如果为单曲循环
        } else {
          this.valueindex = -1;
          this.lyricdiv.scrollTo(0, 0);
          audio.play();
        }
      };
    },
    //歌词定时器
    //定時器
    set(time: number) {
      if (audio.paused) return;
      this.Player.audiotime = setTimeout(() => {
        this.Player.currentTime = audio.currentTime;
        this.current && (this.RangeTime = audio.currentTime);

        if (this.WIDTH !== '100%' && audio.buffered.length > 0) {
          this.WIDTH = daytime.percentage(audio.buffered.end(audio.buffered.length - 1), audio.duration);
        }
        if (this.valueindex < this.Lyric.length - 1 && audio.currentTime > this.Lyric[this.valueindex + 1].time) {
          this.valueindex++;
          this.lyricScroll(this.valueindex);
        }
        if (this.PLAY) {
          this.set(250);
        } else {
          clearTimeout(this.Player.audiotime);
          this.Player.audiotime = -1;
        }
      }, time);
    },
    //播放/暂停
    musicplay() {
      if (!audio.src) return;
      if (audio.paused) {
        if (audio.currentTime === audio.duration) {
          this.lyricdiv.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
          this.valueindex = -1;
        }
        audio.play();
        this.Player.audiotime === -1 && this.set(250);
        this.PLAY = true;
        this.lyricsize(this.valueindex, 1);
        return;
      }
      audio.pause();
      this.PLAY = false;
      this.lyricsize(this.valueindex, 2);
    },
    // //注冊按下移動
    // mosicsemove(e: any) {
    //   this.Player.currentTime = e.target.value;
    // },
    //進度條擡起
    musicseup(e: any) {
      //無音源
      if (!audio.src) return;
      // e.target.removeEventListener('mousemove', this.mosicsemove);
      audio.currentTime = Number(e.target.value);
      this.Player.audiotime === -1 && this.set(250);
      this.current = true;
      //改變進度為0的場合
      if (Number(e.target.value) === 0) {
        this.valueindex = -1;
        this.lyricScroll(0);
        this.lyricsize(-1, 1);
        return;
      }
      if (this.Lyric[this.Lyric.length - 2]?.time <= Number(e.target.value)) {
        this.valueindex = this.Lyric.length - 1;
        this.lyricScroll(this.valueindex);
        this.lyricsize(-1, 1);
        return;
      }
      for (let i = 0; i < this.Lyric.length; i++) {
        const itemTime = Math.floor(this.Lyric[i].time || 0);
        if (this.Lyric[i + 1]?.time > Number(e.target.value) && itemTime <= Number(e.target.value)) {
          this.valueindex = i;
          this.lyricScroll(this.valueindex);
          this.lyricsize(i, 1);
          break;
        }
      }
    },
    // //進度條按下
    // musicdown(e: any) {
    //   e.target.addEventListener('mousemove', this.mosicsemove);
    // },

    //随机播放
    musicShuffle(i?: number) {
      return new Promise(resolve => {
        const { palymusiclist } = this;
        //筛选数组
        if (palymusiclist.length === 1) {
          return this.fullmusiclist[0];
        }
        let indexarr = palymusiclist.filter(item => !this.fullmusiclist.includes(item.id));
        let index = indexarr[Math.floor((Math.random() * indexarr.length))].id;
        if (i) {
          index = i;
        }
        if (palymusiclist.length <= 5 && this.fullmusiclist.length === palymusiclist.length - 1) {
          this.fullmusiclist.splice(0, 1);
          this.fullmusiclist.push(index);
        }
        if (palymusiclist.length <= 5 && this.fullmusiclist.length < palymusiclist.length - 1) {
          this.fullmusiclist.push(index);
        }
        if (this.fullmusiclist.length > 5 && palymusiclist.length > 5) {
          this.fullmusiclist.splice(0, 1);
          this.fullmusiclist.push(index);
        }
        if (this.fullmusiclist.length <= 5 && palymusiclist.length > 5) {
          this.fullmusiclist.push(index);
        }
        resolve(this.fullmusiclist[this.fullmusiclist.length - 1]);
      });
    },
    async Shuffleindex() {
      const id = await this.musicShuffle();
      // this.Player.index = this.palymusiclist.findIndex(item => item.id === id);
      const musicItem = this.palymusiclist.find(item => item.id === id);
      if (musicItem) {
        this.currentmusicinfo = musicItem;
        const src = await getsongurlv1(musicItem.id);
        audio.src = src.data[0].url;
        this.audioloadplay();
      }
    },
    //上一首
    async musicprev() {
      if (this.palymusiclist.length < 1) return;
      if (this.Player.playorder === 1) {
        this.Shuffleindex();
        return;
      }
      this.Player.index === 0 ? this.Player.index = this.palymusiclist.length - 1 : this.Player.index--;
      const src = await getsongurlv1(this.palymusiclist[this.Player.index].id);
      audio.src = src.data[0].url;
      this.currentmusicinfo = this.palymusiclist[this.Player.index];
      this.audioloadplay();
    },
    //下一首
    async musicnext() {
      if (this.palymusiclist.length < 1) return;
      if (this.Player.playorder === 1) {
        this.Shuffleindex();
        return;
      }
      this.Player.index === this.palymusiclist.length - 1 ? this.Player.index = 0 : this.Player.index++;
      const src = await getsongurlv1(this.palymusiclist[this.Player.index].id);
      audio.src = src.data[0].url;
      this.currentmusicinfo = this.palymusiclist[this.Player.index];
      this.audioloadplay();
    },
    audioloadplay() {
      audio.load();
      audio.play();
      this.Player.audiotime === -1 && this.set(250);
    },
    //點擊播放
    async clickplay(data: playlist, index: number) {
      if (this.Player.index === index) {
        Message({ type: 'warning', message: '正在播放' });
        return;
      }
      this.currentmusicinfo = data;
      const src = await getsongurlv1(data.id);
      audio.src = src.data[0].url;
      this.audioloadplay();
    },

    async recentplay() {
      const result = await playHistory();
      if (result.code !== 200) {
        Message({ type: 'warning', message: result.message });
        return;
      }
      this.History = [];
      result.data.list.forEach((item: Historytype) => {
        this.History.push({
          ...item.data,
          playTime: item.playTime,

        });
      });
    },

    //获取歌词 | 初始化歌词
    lyricObtain(id: number) {
      //改變當前播放索引
      this.Player.index = this.palymusiclist.findIndex(p => p.id === id);
      this.PLAY = true;
      lyricall(id).then((res: any) => {
        if (res.code !== 200) {
          Message({ type: 'error', message: '获取歌詞失敗' });
          return;
        }
        if (!res.lrc) {
          this.erlyric = false;
          return;
        }
        this.erlyric = LYRIC(res.lrc.lyric, this.Lyric);
      });
      this.WIDTH = '0%';
    },
    //歌词滾動坐標
    funscroll(index: number) {
      const { Lyric, Lyricdom } = this;
      let first = 0;
      let curr = 0;
      if (index < Lyric.length) {
        first = Lyricdom[0].offsetTop;
        curr = Lyricdom[index].offsetTop;
        this.lyricdiv.scrollTo({ left: 0, top: curr - first, behavior: 'smooth' });
      }
    },
    //歌词滚动
    lyricScroll(index: number) {
      if (this.Lyricscoll) {
        this.lyricsize(index);
        return;
      }
      if (!this.islyric) return;
      if (index === -1) {
        this.lyricdiv.scrollTo(0, 0);
        return;
      }
      this.funscroll(index);
      !audio.paused && this.lyricsize(index);
    },
    //歌词样式过渡
    lyricsize(index: number, index2?: number) {
      let { Lyric, Lyricdom } = this;
      if (this.Lyricindex !== -1) {
        Lyricdom[this.Lyricindex].style.transition = '0s';
        Lyricdom[this.Lyricindex].style['background-size'] = '0';
      }
      this.Lyricindex = index;
      let time;
      if (index2) {
        if (index === -1) return;
        const times = ~~((audio.currentTime - Lyric[index]?.time + 0.1) / (Lyric[index + 1]?.time - Lyric[index]?.time) * 10000) / 100 + '%';
        //如果改变进度条
        if (index2 === 1) {
          //如果处于暂停
          if (audio.paused) {
            Lyricdom[index].style['background-size'] = times;
          } else {
            Lyricdom[index].style['background-size'] = times;
            Lyricdom[index].style.transition = `background-size ${Lyric[index + 1]?.time - audio.currentTime}s ease-out`;
            Lyricdom[index].style['background-size'] = '100%';
          }
        }
        //如果暂停时改变进度条
        if (index2 === 2) {
          Lyricdom[index].style['background-size'] = times;
          Lyricdom[index].style.transition = `all 0s ease-out`;
        }
        return;
      }
      time = Lyric[index + 1]?.time - Lyric[index]?.time;
      Lyricdom[index].style.transition = `background-size ${time}s ease-out`;
      Lyricdom[index].style['background-size'] = '100%';
    },
    //歌詞滾動獲取中間時間
    lyricwheel() {
      debounce1(() => {
        // 滾動距離 /dom元素高度
        const Index = ~~(this.lyricdiv.scrollTop / this.Lyricdom[0].offsetHeight);
        this.Lyrictime = {
          time: this.Lyric[Index].time,
          index: Index
        };
      });
    },
    //添加滾動事件
    lyscrollTop() {
      lyricde(() => {
        this.lyricdiv.removeEventListener('scroll', this.lyricwheel);
        this.Lyricscoll = false;
        this.lyricScroll(this.valueindex);
      });
      if (!this.Lyricscoll1) {
        this.Lyricscoll = true;
        this.lyricdiv.addEventListener('scroll', this.lyricwheel);
      }
    },
    //指定歌詞播放
    lyricplay() {
      audio.currentTime = this.Lyrictime.time;
      this.valueindex = this.Lyrictime.index;
      this.funscroll(this.valueindex);
      this.lyricsize(this.valueindex);
    },

    //喜歡
    //取消喜歡
    del_add(id: number): number | boolean {
      //如果沒登錄
      if (!localStorage.getItem('cookie')) {
        Message({ message: '尚未未登錄', type: 'error' });
        return -1;
      }
      const index = this.sukiarr.findIndex((p: number) => p == id);
      if (index !== -1) {
        like({ id: id, like: false });
        this.sukiarr.splice(index, 1);
        Message({ message: '刪除成功', type: 'success' });
        localStorage.setItem('USERSUKILIST', JSON.stringify(this.sukiarr));
        return false;
      } else {
        like({ id: id, like: true });
        this.sukiarr.unshift(id);
        Message({ message: '添加成功', type: 'success' });
        localStorage.setItem('USERSUKILIST', JSON.stringify(this.sukiarr));
        return true;
      }
    },
  },
});

export default playmusic;