<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { d } from '@/hooks/nav';
const arr = [
  { name: '推荐', type: '/' },
  { name: '歌单', type: 'h-songlist', type1: '/h-high' },
  { name: '主播电台', type: 'h-radio', type1: '/h-radios' },
  { name: '排行榜', type: 'h-Leaderboard' },
  { name: '歌手', type: 'h-Artist' },
  { name: '最新音乐', type: 'h-new' },
];

const router = useRouter();
const route = useRoute();
let i = ref('/');
if (route.path.length > 1) {
  i.value = String(route.path).replace('/', '');
}
const clicks = (type: string) => {
  if (type === 'h-songlist') {
    router.push({
      path: type,
      query: {
        value: '全部歌单'
      }
    });
    return;
  }
  if (type === 'h-Artist') {
    router.push({
      path: type,
      query: {
        type: '-1',
        area: '-1',
        initial: '-1',
        off: '1'
      }
    });
    d.value = true;
    return;
  }
  if (type === 'h-new') {
    router.push({
      path: type,
      query: {
        type: 0
      }
    });
    return;
  }
  router.push({
    path: type,
  });
};
watch(() => route.path, (newvalue) => {
  if (newvalue === '/') {
    i.value = '/';
    return;
  }
  i.value = String(newvalue).replace('/', '');

});
</script>

<template>
  <div>
    <ul class="nav">
      <li v-for="(p) in arr" @click="clicks(p.type)" :class="{ 'click': i === p.type || route.path === p.type1 }">
        {{ p.name }}</li>
    </ul>
    <hr />
    <router-view v-slot="{ Component }">
      <transition name="song" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
hr {
  margin-top: 0.55rem;
  margin-bottom: 2rem;
}

.song-enter-active,
.song-leave-active {
  transition: opacity 0.2s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

.nav {
  display: flex;
  margin-top: 0.5rem;
  justify-content: center;

  .click {
    &::before {
      content: '';
      position: absolute;
      right: 0;
      left: 0;
      bottom: -0.7rem;
      width: 100%;
      height: 0.2rem;
      background-color: $ThemeC22;
    }
  }

  li {
    margin: 0 1rem;
    padding: 0 1rem;
    font-size: clamp(1.5rem, 1.3vw, 1.7rem);
    position: relative;
    cursor: pointer;
  }
}
</style>