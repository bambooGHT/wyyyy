<script setup lang="ts">
import { Hmusic } from '@/store';
import daytime from '@/utils/day-prce';
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const music = Hmusic();
const indexs = ref(-1);
//點擊高亮
const libackg = (i: number) => {
  indexs.value = i;
};

//跳轉 專輯
const toalbum = (id: number) => {
  router.push({
    path: `/album/${id}`,
  });
};
//跳轉 歌手
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
};
await music.newmusic(route.query.t ? String(route.query.t) : '0');
watch(() => route.query.t, async () => {
  music.NEWsong = [];
  if (!route.query.t) {
    await music.newmusic('0');
    return;
  }
  await music.newmusic(String(route.query.t));
});
</script>

<template>
  <ul class="list" v-if="music.NEWsong?.length > 0">
    <li class="not">
      <div>#</div>
      <div></div>
      <div>標題</div>
      <div>歌手</div>
      <div>專輯</div>
      <div>時長</div>
    </li>
    <hr />
    <li v-for="(item, index) in music.NEWsong" :key="index"
      :class="{ liback: indexs === index, 'no-copyright': item.privilege.cp === 0 }" @click="libackg(index)"
      @dblclick="music.songsplay(item.id)">
      <div>{{ 1 + index }}</div>
      <div>
        <img :src="`${item.album.picUrl}?param=80y80`" alt="">
      </div>
      <div :title="item.name + `${item.alias.length > 0 ? `(${item.alias[0]})` : ''}`">
        <nav>{{ item.name }}</nav><span class="tns" v-if="item.alias.length > 0 ">({{item.alias[0]}})</span>
      </div>
      <div>
        <span v-for="(p, index) in item.artists" :title="item.artists.map((ar: any) => ar.name).join('/')">
          <nav @click="toartist(p.id)">{{ p.name }}</nav>{{ item.artists.length > index + 1 ? '/' : '' }}
        </span>
      </div>
      <div :title="item.album.name + `${item.album.alias.length > 0 ? `(${item.album.alias[0]})` : ''}`">
        <span @click="toalbum(item.album.id)">{{ item.album.name }}<span class="tns" v-if="item.album.alias.length > 0">
            ({{item.album.alias[0]}})</span></span>
      </div>
      <div>{{ daytime.formatime(new Date(item.duration)) }}</div>
    </li>
  </ul>
  <div v-else style="text-align: center;">加载中...</div>
</template>

<style lang="scss" scoped>
@import '@/components/list.scss';

.list {
  li:nth-child(n+2) {
    align-items: center;
    height: 5rem;
  }
}

li {
  div:nth-child(2) {
    width: 5rem !important;
  }

  img {
    width: 4rem;
    height: 4rem;
  }
}
</style>