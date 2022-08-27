<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { rahot, feeradio } from '@/server/hmusic';
import { Scroll, d } from '@/hooks/nav';
import { Hmusic } from '@/store';

const music = Hmusic();
const route = useRoute();
const router = useRouter();
let is = ref(true);
const toradio = (id: number) => {
  router.push({
    path: `/radio/${id}`,
  });
};
const touser = (id: number) => {
  router.push({
    path: `/user/${id}`,
  });
};
watch(() => route.query.type, (newvalue) => {
  if (!d.value && music.dj.length > 1) return;
  music.dj = [];
  if (Number(route.query.type) === -1) {
    feeradio({ limit: 111 }).then(res => {
      music.dj = res.data.list;
    });
    return;
  }
  rahot({ cateId: Number(route.query.type) }).then((res: any) => {
    if (res.djRadios.length < 1) is.value = false;
    music.dj = res.djRadios;
  });
}, {
  immediate: true
});
Scroll();
</script>

<template>
  <div>
    <div class="names">{{ route.query.name }}</div>
    <div v-if="music.dj.length < 1&&is">加载中...</div>
    <div v-else-if="!is">暂无电台</div>
    <ul class="a">
      <li @click="toradio(p.id)" v-for="p in  music.dj">
        <div>
          <div class="w" v-if="Number(route.query.type) !== -1">订阅数:
            {{ p.subCount > 9999 ? `${String(p.subCount).replace(/\d{4}$/, '')}万` : p.subCount }}
          </div>
          <div class="w" v-else>原价:
            {{ (p as any).originalPrice / 100 }}
          </div>
        </div>
        <img :src="`${p.picUrl}?param=200y200`" alt="">
        <div class="lastSong">
          <div class="name">节目数:<span>{{ p.programCount }}</span></div>
        </div>
        <div class="txt">
          <span class="topath">{{ p.name }}</span><br />
          <span class="topath">{{ Number(route.query.type) === -1 ? (p as any).rcmdText : p.rcmdtext }}</span><br />
          <span v-if="Number(route.query.type) !== -1" class="topath" @click.stop="touser(p.dj.userId)">
            BY {{ p.dj.nickname }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '../songlist/index.scss';
@import '../songlist/high.scss';

.names {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.a {
  li {
    .topath:nth-child(1) {
      font-size: 1.6rem;
    }

    .topath:nth-child(3) {
      cursor: default;
    }

    .topath:nth-child(5) {
      color: $ThemeC10 ;
      cursor: pointer;
    }
  }
}
</style>