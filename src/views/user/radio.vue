<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import {  useRouter } from 'vue-router';
import { user } from '@/store';

const router = useRouter();
const User = user();

//跳轉 用户
const touser = (id: number) => {
  router.push({
    path: `/user/${id}`
  });
};
//跳轉 电台
const toreadio = (id: number) => {
  router.push({
    path: `/radio/${id}`
  });
};
await User.userdjlists();
const recommend = defineAsyncComponent(() =>
  import('../userrecommend/recommend.vue')
);
</script>

<template>
  <div>
    <recommend>
      <li v-for="p  of User.userDJlist.djRadios" :key="p.id" @click="toreadio(p.id)">
        <img :src="`${p.picUrl}?param=200y200`">
        <div class="lastSong">
          <div class="name">节目数:<span>{{ p.programCount }}</span></div>
          <div class="name">分类:<span>{{ p.category }}</span></div>
        </div>
        <span class="topath">{{ p.name }}</span>
        <span class="topath topath1" style="color: var(--ThemeC10);" @click.stop="touser(p.dj.userId)">
          by {{ p.dj.nickname }}</span>
      </li>
    </recommend>
  </div>
</template>

<style lang="scss" scoped>
@import '../userrecommend/index.scss';

li {
  max-width: 17rem;

  img {
    max-width: 17rem;
    max-height: 17rem;
  }

  .topath1 {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>