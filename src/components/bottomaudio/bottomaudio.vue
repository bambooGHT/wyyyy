<script setup lang="ts">
import { throttle } from '@/utils/throttle';
import { playmusic } from '@/store';
const play = playmusic();
</script>

<template>
  <div class="audio">
    <div class="audio-player">
      <div class="toggle" @click="throttle(play.musicprev, 1000)">上一首</div>
      <div class="iconfont" :class="{ 'icon-zanting1': play.PLAY, 'icon-bofang': !play.PLAY }"
        @click="throttle(play.musicplay, 200)"></div>
      <div class="toggle" @click="throttle(play.musicnext, 1000)">下一首</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.audio {
  margin: 0 auto;

  &-player {
    display: flex;
    width: auto;
    height: 4.5rem;
    align-items: center;
    div {
      margin: 0 0.3rem;
      margin-top: 0.5rem;
    }

    .toggle {
      font-size: 1.3rem;
      cursor: pointer;
    }

    .iconfont {
      font-weight: 100;
      font-size: 3.5rem;
      cursor: pointer;
      position: relative;
    }

    .iconfont:nth-last-child(1) {
      font-size: 3rem;
    }
  }
}
</style>