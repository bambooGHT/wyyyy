<script setup lang="ts">
import recommend from '@/views/userrecommend/recommend.vue';
import { arlist } from '@/server/hmusic';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Scroll, d } from '@/hooks/nav';
import { Hmusic } from '@/store';
import pagination from '@/components/pagination.vue';

const arr = [
  [
    { name: '语种' },
    { name: '全部', type: '-1' },
    { name: '华语', type: '7' },
    { name: '欧美', type: '96' },
    { name: '日本', type: '8' },
    { name: '韩国', type: '16' },
    { name: '其他', type: '0' },
  ],
  [
    { name: '分类' },
    { name: '全部', type: '-1' },
    { name: '男歌手', type: '1' },
    { name: '女歌手', type: '2' },
    { name: '乐队组合', type: '3' },
  ],
  [
    { name: '筛选' },
    { name: '热门', type: '-1' },
  ]
];
for (var i = 0; i < 26; i++) {
  arr[2].push({ name: String.fromCharCode((65 + i)), type: String.fromCharCode((65 + i)) });
}
arr[2].push({ name: '#', type: '0' });

const music = Hmusic();
const route = useRoute();
const router = useRouter();
let a = ref(true);

const pagin = (type: number) => {
  a.value = false;
  const time = setTimeout(() => {
    music.ar = [];
    arlist({ ...Object(route.query), off: undefined, offset: (type - 1) * 50 }).then((res: any) => {
      music.ar = res.artists;
      a.value = true;
    });
    clearTimeout(time);
  }, 200);
};
watch(() => route.query, (newvalue, oldvalue) => {
  if (oldvalue?.off && newvalue.off === oldvalue.off) {
    pagin(1);
    return;
  }

  if (!d.value && music.ar.length > 1) return;
  a.value = false;
  const time = setTimeout(() => {
    music.ar = [];
    arlist({ ...Object(route.query), offset: newvalue.off ? (Number(newvalue.off) - 1) * 50 : 0, off: undefined }).then((res: any) => {
      music.ar = res.artists;
      a.value = true;
    });
    clearTimeout(time);
  }, 200);


}, {
  immediate: true
});
Scroll();
//跳轉 歌手
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
};
const inclick = ref(['-1', '-1', '-1']);
inclick.value[0] = String(route.query.area);
inclick.value[1] = String(route.query.type);
inclick.value[2] = String(route.query.initial);
const toque = (type: number, id: string) => {
  if (type === 1) {
    router.replace({
      query: Object.assign({}, route.query, { area: id })
    });
    inclick.value[0] = id;
  }
  if (type === 2) {
    router.replace({
      query: Object.assign({}, route.query, { type: id })
    });
    inclick.value[1] = id;
  }
  if (type === 3) {
    router.replace({
      query: Object.assign({}, route.query, { initial: id })
    });
    inclick.value[2] = id;
  }
};
</script>

<template>
  <div class="ne">
    <div class="Artist">
      <div>{{ arr[0][0].name }}:</div>
      <div v-for="(s, index) in arr[0].slice(1)">
        <p @click="toque(1, s.type!)" :class="{ 'click': inclick[0] == s.type }">
          {{ s.name }}</p>
        <span>{{ arr[0].length > index + 2 ? '|' : '' }}</span>
      </div>
    </div>
    <div class="Artist">
      <div>{{ arr[1][0].name }}:</div>
      <div v-for="(s, index) in arr[1].slice(1)">
        <p @click="toque(2, s.type!)" :class="{ 'click': inclick[1] == s.type }">
          {{ s.name }}</p>
        <span>{{ arr[1].length > index + 2 ? '|' : '' }}</span>
      </div>
    </div>
    <div class="Artist">
      <div>{{ arr[2][0].name }}:</div>
      <div v-for="(s, index) in arr[2].slice(1)">
        <p @click="toque(3, s.type!)" :class="{ 'click': inclick[2] == s.type }">
          {{ s.name }}</p>
        <span>{{ arr[2].length > index + 2 ? '|' : '' }}</span>
      </div>
    </div>
    <transition name="song" mode="out-in">
      <recommend v-if="a">
        <li v-for="p of music.ar" :key="p.id" @click="toartist(p.id)">
          <div>
            <div class="w">粉丝:
              {{ p.fansCount > 9999 ? `${String(p.fansCount).replace(/\d{4}$/, '')}万` : p.fansCount }}
            </div>
          </div>
          <img :src="`${p.img1v1Url}?param=300y300`" alt="">
          <div class="lastSong">
            <div class="name">专辑数:<span>{{ p.albumSize }}</span></div>
            <div class="name">歌曲数:<span>{{ p.musicSize }}</span></div>
          </div>
          <span class="topath">{{ p.name }}
            <span style=" color: var(--ThemeC10);" v-if="p.alias.length > 0">
              ({{ p.alias[0] }})</span>
          </span>
        </li>
        <template #pag>
          <pagination :pagin="pagin" :total="10000" :limit="50" />
        </template>
      </recommend>
      <div v-else>加载中...</div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import '@/views/userrecommend/index.scss';

.song-enter-active,
.song-leave-active {
  transition: opacity 0.2s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

.Artist {
  display: flex;
  font-size: 1.6rem;
  flex-wrap: wrap;
  margin: 0 1.5rem;

  .click {
    background-color: aqua;
    border-radius: 0.5rem;
  }

  div {
    text-align: center;
    margin-bottom: 1rem;
    height: 2.5rem;
    line-height: 2.5rem;

    p {
      display: inline-block;
      width: auto;
      padding: 0 0.5rem;
      cursor: pointer;
    }

    span {
      padding: 0 1rem;
      color: $ThemeC10;
    }
  }
}
</style>