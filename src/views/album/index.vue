<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import { album } from '@/store';
import comment from "@/components/comment.vue";
import { useRoute } from "vue-router";
const list = defineAsyncComponent(() =>
  import("@/components/list1.vue")
);

const info = defineAsyncComponent(() =>
  import("./info.vue")
);

const route = useRoute();
const Album = album();
onMounted(async () => {
  await Album.albums(Number(route.params.id));
});
let t = ref(true);
</script>

<template>
  <div class="album" v-if="Album.albumlist.album">
    <info />
    <div class="tag">
      <div class="tag-list">
        <div @click="t = true">歌曲列表</div>
        <div @click="t = false">評論({{ Album.albumlist.album.info.commentCount }})</div>
      </div>
    </div>
    <hr />
    <transition name="song" mode="out-in">
      <list v-if="t" :indexs="0">
        <template #vip="vipProps">
          <span v-if="vipProps.sq" class="vip">SQ</span>
          <span v-if="vipProps.t === 1" class="vip">VIP</span>
          <span v-if="vipProps.hr" class="vip">Hi-Res</span>
        </template>
      </list>
      <comment v-else :songid="Album.albumlist.album.id" :index="3" />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.tag {
  font-size: 1.6rem;
  color: $ThemeC3;

  &-list {
    display: flex;
    margin: 2rem 0 0rem 2rem;

    div {
      margin: 0 2rem;
      cursor: pointer;
      position: relative;

      &:hover {
        color: $ThemeC2;
      }

      &:hover::before {
        position: absolute;
        content: '';
        bottom: -4px;
        width: 100%;
        height: 3px;
        background-color: $ThemeC2;
      }
    }
  }
}

.song-enter-active,
.song-leave-active {
  transition: opacity 0.3s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

.album {
  width: 100%;
  height: auto;

  * {
    color: $ThemeC3;
  }

  hr {
    margin-top: 2rem;
    width: 80%;
  }
}

@import '@/components/vip.scss';
</style>