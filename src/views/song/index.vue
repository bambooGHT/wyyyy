<script setup lang="ts">
import index from "./songlist/index.vue";
import list from "@/components/list.vue";
import comment from "@/components/comment.vue";
import tab from "./songlist/tab.vue";
import { tabs } from '@/types/songlist';
import { ref } from 'vue';
import collector from '@/components/collector.vue';
import { songScroll } from '@/hooks/music';

let t = ref<tabs>(tabs.LIST);
const tabto = (value: tabs) => {
  t.value = value;
};
const { Song, route, heights } = songScroll();
</script>

<template>
  <div>
    <index />
    <tab @tabto="tabto" :comment="Song.songall?.commentCount" />
    <transition name="song" mode="out-in">
      <list v-if="t === 'LIST'">
        <template #not>
          <div v-if="route.query.value" class="order">&nbsp;</div>
        </template>
        <template #vip="vipProps">
          <span v-if="vipProps.sq" class="vip">SQ</span>
          <span v-if="vipProps.t === 1" class="vip">VIP</span>
          <span v-if="vipProps.hr" class="vip">Hi-Res</span>
        </template>
        <div v-if="route.query.value" class="order">🆕</div>
        <template #ing>
          <div v-if="Song.songall.tracks.length > 0 && Song.songall.tracks.length < Song.songall.trackCount"
            class="log">{{ heights ? '加載中...' : '下滑加載更多' }}
          </div>
        </template>
      </list>
      <comment v-else-if="t === 'COMMENT'" :songid="Song.songall.id" :index="2" />
      <collector v-else-if="t === 'COLLECTOR'" :songid="Song.songall.id" />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.order {
  order: 1;
  width: 2rem;
  height: 3.5rem;
  line-height: 3.5rem;
}

.song-enter-active,
.song-leave-active {
  transition: opacity 0.3s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

.log {
  text-align: center;
  font-size: 1.5rem;
  margin: 0.5rem auto;
}

@import '@/components/vip.scss';
</style>