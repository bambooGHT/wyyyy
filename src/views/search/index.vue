<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { search } from '@/store';
import { watch } from 'vue';

const Search = search();
const router = useRouter();
const route = useRoute();
const arr = [
  { name: '单曲', to: `songs`, type: 1 },
  { name: '专辑', to: `album`, type: 10 },
  { name: '歌手', to: `artist`, type: 100 },
  { name: '歌词', to: `lyric`, type: 1006 },
  { name: '歌单', to: `songlist`, type: 1000 },
  { name: '电台', to: `radio`, type: 1009 },
  { name: '用户', to: `user`, type: 1004 },
];
const to = (url: string, type: number) => {
  router.push({
    path: url,
    query: {
      value: route.query.value,
      type: type
    }
  });
};
watch(() => route.query, () => {
  Search.Counts = false;
});
</script>

<template>
  <div>
    <div class="sea">
      <div v-for="p in arr" @click="to(p.to, p.type)" :class="{ 'click': Number(route.query.type) === p.type }">
        {{ p.name }}
      </div>
    </div>
    <div v-if="Search.Counts" class="all">共找到"<span>{{ Search.Count }}</span>"项</div>
    <div v-else class="all">加载中...</div>
    <router-view v-slot="{ Component, route }"  v-show="Search.Counts">
      <transition name="song" mode="out-in">
        <component :is="Component" :key="route.query.value" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.song-enter-active,
.song-leave-active {
  transition: opacity 0.2s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

.all {
  margin: 1rem 0;
  text-align: center;
  font-size: 1.5rem;

  span {
    color: $ThemeC22;
  }
}

.sea {
  width: 77rem;
  display: flex;
  margin: 0 auto;
  margin-top: 5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  background-color: antiquewhite;

  .click {
    border-bottom: 2px solid $ThemeC22;
  }

  div {
    width: 11rem;
    text-align: center;
    font-size: clamp(1.3rem, 1.2vw, 1.7rem);
    cursor: pointer;

    &:nth-child(n+2) {
      border-left: 1px solid #000;
    }
  }
}
</style>