<script setup lang="ts">
import { ref, watch } from 'vue';
import schedule from './bottomaudio/schedule.vue';
import volume from './bottomaudio/volume.vue';
import bottomaudio from './bottomaudio/bottomaudio.vue';
import daytime from '@/utils/day-prce';
import comment from "./comment.vue";
import { playmusic } from '@/store';
import { storeToRefs } from 'pinia';
import JPG from '@/assets/as.jpg';
import { useRouter } from 'vue-router';

const acoustics = ['HI-RES', '~1411kb/s', '320kbps', '192kbps', '128kbps'];
let img = ref(JPG);
const play = playmusic();
const router = useRouter();
const { lyricdiv, Lyric, Lyricdom, erlyric } = storeToRefs(play);
//监听歌曲变化
watch(() => play.currentmusicinfo, (newvalue) => {
  if (!play.currentmusicinfo.id) {
    img.value = JPG;
    return;
  }
  img.value = JPG;
  play.valueindex = -1;
  play.Lyric = [];
  lyricdiv.value.scrollTo(0, 0);
  play.lyricObtain(newvalue.id);
  if (newvalue.al) {
    img.value = `${newvalue.al.picUrl}?param=800y800`;
  } else {
    img.value = `${newvalue.coverUrl}?param=800y800`;
  }
  //改变音质
  if (newvalue.dt) {
    const arr = [
      newvalue.hr,
      newvalue.sq,
      newvalue.h,
      newvalue.m,
      newvalue.l,
    ];
    const levelindex = arr[acoustics.indexOf(play.levels)];
    if (levelindex == undefined || levelindex == null) {
      play.level = acoustics[arr.findIndex(p => p !== null && p !== undefined)];
    } else {
      play.level = play.levels;
    }
  }
});
const emit = defineEmits(['lyricshow']);

//关闭
const lyricshows = () => {
  emit('lyricshow');
  play.comment = false;
  play.islyric = false;
  play.lyricdiv.removeEventListener('wheel', play.lyscrollTop);
};

//路由專輯
const toalbum = (id: number) => {
  router.push({
    path: `/album/${id}`,
  });
  lyricshows();
};
//跳转歌手
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
  lyricshows();
};

//按住滾動
const drag = (e: { y: number; }) => {
  const top: number = play.lyricdiv.scrollTop;
  document.onmousemove = (el) => {
    play.lyricdiv.scrollTo({ left: 0, top: top + (e.y - el.y) });
    play.lyscrollTop();
  };
  document.onmouseup = () => {
    document.onmousemove = null;
    document.onmouseup = null;
  };
};
</script>

<template>
  <div class="songbox">
    <div class="songinfo" @click.stop>
      <div class="songinfo-x" @click="lyricshows">关闭</div>
      <div v-if="play.currentmusicinfo.name" class="songinfo-all">
        <div class="songinfo-top" @click="">
          {{ play.currentmusicinfo.name }}
          <span v-if="play.currentmusicinfo.tns">({{ play.currentmusicinfo.tns[0] }})</span>
        </div>
        <div class="songinfo-top" v-if="play.currentmusicinfo.ar">
          <div>
            歌手:
            <span v-for="(p, index) in play.currentmusicinfo.ar"
              :title="play.currentmusicinfo.ar.map((ar: any) => ar.name).join('/')">
              <nav class="click" @click="toartist(p.id)">{{ p.name }}</nav>{{ play.currentmusicinfo.ar.length > index +
                  1 ? '/' : ''
              }}
            </span>
          </div>
          <div :title="play.currentmusicinfo.al.name">
            专辑: <span class="click" @click="toalbum(play.currentmusicinfo.al.id)">
              {{ play.currentmusicinfo.al.name }}
              <span class="tns" v-if="play.currentmusicinfo.al.alia">
                ({{ play.currentmusicinfo.al.alia[0] }})</span>
            </span>
          </div>
        </div>
        <div v-else class="songinfo-top">
          <div>主播: <span class="click">{{ play.currentmusicinfo.dj.nickname }}</span></div>
        </div>
      </div>
      <div class="img" :style="{ 'backgroundImage': `url('${img}')` }"></div>
      <div class="songinfo-left">
        <div class="songimg">
          <img :src="img" alt="">
        </div>
        <div class="songplay" v-if="play.comment">
          <div class="songplay-1">
            <div class="time">{{ daytime.time(play.Player.currentTime) }}</div>
            <div class="input">
              <transition name="song" mode="out-in">
                <div v-show="!play.current" class="inputime">{{ daytime.time(play.RangeTime) }}</div>
              </transition>
              <schedule />
            </div>
            <div class="time">{{ play.Player.duration }}</div>
            <volume />
          </div>
          <div class="songplay-2">
            <bottomaudio />
          </div>
        </div>
      </div>
      <div class="songinfo-right" ref="lyricdiv" @mousedown="drag">
        <transition name="song" mode="out-in">
          <div class="lyrictime" v-show="play.Lyricscoll && erlyric">
            <hr />
            {{ daytime.time(play.Lyrictime.time) }}<div class="ltricindexplay iconfont icon-bofang"
              @click="play.lyricplay"></div>
          </div>
        </transition>
        <div v-for="(p, index) in Lyric" :key="p.time" v-if="erlyric">
          <span :ref="el => { if (el) Lyricdom[index] = el; }" class="lyric">{{ p.lyric }}&nbsp;</span>
        </div>
        <div v-else>
          <span class="lyric">無歌詞捏</span>
        </div>
      </div>
    </div>
    <div class="comment1">
      <comment v-if="play.currentmusicinfo.id && play.comment" v-model:songid="play.currentmusicinfo.id"
        :fn="lyricshows" :index="play.currentmusicinfo.dj ? 4 : 0" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './lyric.scss';

.song-enter-active,
.song-leave-active {
  transition: opacity 0.5s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

.lyrictime {
  width: 5rem;
  position: absolute;
  color: rgb(255, 255, 255);
  font-size: clamp(1.5rem, 1.3vw, 1.8rem);

  hr {
    width: 23rem;

    @media screen and (min-width:1750px) {
      width: 40rem;

    }
  }

  .ltricindexplay {
    font-size: 3rem;

    &:hover {
      cursor: pointer;
      color: $ThemeC22;
    }
  }
}

.input {
  max-width: 75rem;
  flex-grow: 1;
  position: relative;

  &ime {
    text-align: center;
    width: 100%;
    position: absolute;
    top: -1rem;
    font-size: 1.3rem;
    z-index: 10;
  }
}
</style>