<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineAsyncComponent } from 'vue';
const arr = [
  { name: '全部', t: '', t1: '' },
  { name: '华语', t: '7', t1: 'ZH' },
  { name: '欧美', t: '96', t1: 'EA' },
  { name: '韩国', t: '16', t1: 'KR' },
  { name: '日本', t: '8', t1: 'JP' },
];

const newsong = defineAsyncComponent(() =>
  import('./newsong.vue')
);
const newalrec = defineAsyncComponent(() =>
  import('./newalrec.vue')
);
const router = useRouter();
const route = useRoute();
let i = ref(route.query.t ?? '');
let a = ref(0);
let news = ref(Number(route.query.type) ?? 0);
const tab = (type: number, t?: string) => {
  router.replace({
    query: {
      type: type,
      t: t ? t : undefined
    }
  });
};
watch(() => route.query, (newvalue) => {
  i.value = route.query.t ? String(route.query.t) : '';
  news.value = Number(route.query.type);
}, {
  immediate: true,
  deep: true
});
</script>

<template>
  <div>
    <div class="tab">
      <span @click="tab(0)" :class="{ clicks: !news }">新歌速递</span>
      <span @click="tab(1)" :class="{ clicks: news }">新碟上架</span>
    </div>
    <div class="tab1">
      <div v-for="p in arr" :class="{ click: i === p.t || i === p.t1 }" @click="tab(news, news ? p.t1 : p.t)">
        {{ p.name }}
      </div>
      <div class="tab2" v-if="news">
        <span @click="a = 0">推荐</span>
        <span @click="a = 1">全部</span>
      </div>
    </div>
    <hr />
    <transition name="song" mode="out-in">
      <Suspense>
        <newsong v-if="!news" />
        <newalrec v-else-if="news && !a" />
        <div v-else-if="news && a">222</div>
        <template #fallback>
          <div>加载中...</div>
        </template>
      </Suspense>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.tab {
  text-align: center;
  margin-bottom: 2rem;

  span {
    display: inline-block;
    width: 8rem;
    border: 1px solid $ThemeC10;
    font-size: 1.5rem;

    &:hover {
      cursor: pointer;
      background-color: $ThemeC8;
    }
  }

  .clicks {
    cursor: pointer;
    color: $ThemeC7  !important;
    background-color: $ThemeC10  !important;
  }
}

hr {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.click::before {
  position: absolute;
  content: '';
  width: 100%;
  bottom: -0.7rem;
  height: 0.3rem;
  background-color: $ThemeC22;
}

.tab1 {
  display: flex;
  font-size: 1.6rem;

  div,
  span {
    cursor: pointer;
    margin: 0 1rem;
    position: relative;
  }

  .tab2 {
    margin-left: auto;

  }
}

.song-enter-active,
.song-leave-active {
  transition: opacity 0.2s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}
</style>