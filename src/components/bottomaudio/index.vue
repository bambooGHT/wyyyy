<script setup lang="ts">
import bottomaudio from './bottomaudio.vue';
import schedule from './schedule.vue';
import daytime from '@/utils/day-prce';
import List from './List.vue';
import volume from './volume.vue';
import { playmusic, songlist } from '@/store';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { levels } from '@/server/songlist';
import { throttle } from '@/utils/throttle';
import Message from '@/message';

const play = playmusic();
const song = songlist();
const route = useRoute();

let playorder = ['顺序播放', '随机播放', '单曲循环'];
let a = ref(0);
let playorders = () => {
  if (a.value === 2) {
    a.value = 0;
    play.Player.playorder = a.value;
    localStorage.setItem('PLAY', String(a.value));
    return;
  }
  a.value++;
  localStorage.setItem('PLAY', String(a.value));
  play.Player.playorder = a.value;
};
const emit = defineEmits<{ (e: 'lyricshow'): void; }>();
//展开歌词
const lyrics = () => {
  emit('lyricshow');
  const set = setTimeout(() => {
    play.islyric = true;
    play.comment = true;
    play.lyricScroll(play.valueindex);
    play.lyricsize(play.valueindex, 1);
    clearTimeout(set);
  }, 120);
  play.lyricdiv.addEventListener('wheel', play.lyscrollTop);
};
onMounted(() => {
  if (localStorage.getItem('PLAY')) {
    a.value = Number(localStorage.getItem('PLAY'));
  }
  play.Player.playorder = a.value;
});
//计算是否喜欢
const _suki = computed(() => {
  if (!play.currentmusicinfo.id) return false;
  return play.sukiarr.find(p => p == play.currentmusicinfo.id);
});

const sikus = () => {
  throttle(() => {
    const boo = play.del_add(play.currentmusicinfo.id);
    //是否處於喜歡列表
    if (localStorage.getItem('USERSUKIID') === route.params.id && boo !== -1) {
      song.songlike(play.currentmusicinfo.id, !!boo);
    }
  }, 1200);
};
//音质
const acoustics = [
  { kbps: '128kbps', level: 'standard' },
  { kbps: '192kbps', level: 'higher' },
  { kbps: '320kbps', level: 'exhigh' },
  { kbps: '~1411kb/s', level: 'lossless' },
  { kbps: 'HI-RES', level: 'hires' },
];

const relevel = (p: { kbps: string, level: string; }) => {
  if (levels.value === p.level) return;
  if (localStorage.getItem('USERVIP') == '0') {
    if (p.level == 'lossless' || p.level == 'hires') {
      Message({ type: 'error', message: '不是vip捏' });
      return;
    }
  }
  play.level = p.kbps;
  play.levels = p.kbps;
  levels.value = p.level;
  localStorage.setItem('LEVEL', JSON.stringify({ kbps: p.kbps, level: p.level }));
  //当前存在歌曲
  if (play.currentmusicinfo.id) {
    song.levelplay(play.currentmusicinfo.id);
  }
};
if (!localStorage.getItem('LEVEL')) {
  localStorage.setItem('LEVEL', JSON.stringify({ kbps: acoustics[2].kbps, level: acoustics[2].level }));
  play.levels = acoustics[2].kbps;
  play.level = acoustics[2].kbps;
  levels.value = acoustics[2].level;
} else {
  if (localStorage.getItem('USERVIP') == '0') {
    localStorage.setItem('LEVEL', JSON.stringify({ kbps: acoustics[2].kbps, level: acoustics[2].level }));
  }
  play.levels = JSON.parse(localStorage.getItem('LEVEL')!).kbps;
  play.level = JSON.parse(localStorage.getItem('LEVEL')!).kbps;
  levels.value = JSON.parse(localStorage.getItem('LEVEL')!).level;
}
</script>

<template>
  <div class="audio border">
    <div class="audio-img" @click="lyrics">
      <span>展开</span>
      <img v-if="JSON.stringify(play.currentmusicinfo) != '{}'"
        :src="`${play.currentmusicinfo.al ? play.currentmusicinfo.al.picUrl : play.currentmusicinfo.coverUrl}?param=200y200`"
        alt="">
      <img v-else src="@/assets/as.jpg">
    </div>
    <bottomaudio />
    <div class="tack" v-if="play.currentmusicinfo.dt" @click="sikus" :class="{ 'red': _suki }">喜歡</div>
    <div class="tack male" v-if="play.currentmusicinfo.dt">
      {{ play.level }}
      <div class="level">
        <p @click="relevel(acoustics[4])" v-if="play.currentmusicinfo.hr">HI-RES</p>
        <p @click="relevel(acoustics[3])" v-if="play.currentmusicinfo.sq">~1411kb/s</p>
        <p @click="relevel(acoustics[2])" v-if="play.currentmusicinfo.h">320kbps</p>
        <p @click="relevel(acoustics[1])" v-if="play.currentmusicinfo.m">192kbps</p>
        <p @click="relevel(acoustics[0])">128kbps</p>
      </div>
    </div>
    <div class="time">{{ daytime.time(play.Player.currentTime) }}</div>
    <div class="input">
      <div class="songinfo">
        {{ play.currentmusicinfo.name }}-{{ play.currentmusicinfo.ar?.map((ar: any) => ar.name).join('/') }}
      </div>
      <transition name="song" mode="out-in">
        <div v-show="!play.current" class="inputime">{{ daytime.time(play.RangeTime) }}</div>
      </transition>
      <schedule />
    </div>
    <div class="time">{{ play.Player.duration }}</div>
    <volume />
    <div class="order" @click="playorders">{{ playorder[a] }}</div>
    <List>
      <template #vip="vipProps">
        <span v-if="vipProps.sq" class="vip">SQ</span>
        <span v-if="vipProps.t === 1" class="vip">VIP</span>
        <span v-if="vipProps.hr" class="vip">Hi-Res</span>
      </template>
    </List>
  </div>
</template>

<style lang="scss" scoped>
.song-enter-active {
  transition: opacity 0.3s ease;
}

.song-leave-active {
  transition: opacity 0.5s ease 0.5s;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

.border {
  box-shadow: 0 -5px 5px 0 $ThemeC8;
}

.audio {
  position: sticky;
  bottom: 0;
  display: flex;
  height: 5rem;
  background-color: $ThemeC1;
  margin-top: auto;
  z-index: 10;

  * {
    position: relative;
    margin: auto 0;
    color: $ThemeC3;
  }

  .male {
    margin-left: 0.3rem;

    &:hover .level {
      visibility: visible;
      opacity: 1;
    }

    .level {
      position: absolute;
      left: 0rem;
      bottom: 2.2rem;
      box-shadow: 0 0 5px 0 black;
      text-align: center;
      margin-left: -0.3rem;
      width: 7.5rem;
      background-color: #fff;
      visibility: hidden;
      opacity: 0;
      transition: 0.3s;

      p {
        cursor: pointer;
        height: 1.8rem;
        line-height: 1.8rem;

        &:hover {
          background-color: $ThemeC9;
        }
      }
    }
  }

  .tack {
    cursor: pointer;
    box-sizing: content-box;
    border: 1px solid $ThemeC3;
    border-radius: 2px;
    font-size: 1.3rem;
    height: 1.5rem;
    line-height: 1.5rem;
    padding: 0 0.2rem;
  }

  .red {
    border: 1px solid $ThemeC22;
    color: $ThemeC22;
  }

  .input {
    max-width: 75rem;
    flex-grow: 1;

    &ime {
      text-align: center;
      width: 100%;
      position: absolute;
      top: 1.5rem;
      font-size: 1.3rem;
    }

    .songinfo {
      position: absolute;
      bottom: 1.4rem;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 1.4rem;
    }
  }

  .time {
    position: relative;
    margin: auto 0.8rem;
  }

  .order {
    font-size: 1.5rem;
    cursor: pointer;
    margin: auto 1rem;
    user-select: none;
  }


  &-img {
    width: 5rem;
    height: 5rem;
    margin: 0rem 1rem;
    position: relative;
    z-index: 1;
    overflow: hidden;

    &:hover::before {
      content: '';
      position: absolute;
      width: 100%;
      z-index: 1;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: .5);
    }

    &:hover {
      span {
        display: block;
        cursor: pointer;
      }
    }

    span {
      width: 5rem;
      height: auto;
      position: absolute;
      font-size: 1.5rem;
      color: #fff;
      text-align: center;
      z-index: 2;
      top: 1.5rem;
      display: none;
    }

    img {
      display: block;
      width: 5rem;
      height: 5rem;
    }
  }
}

@import '../vip.scss';
</style>