<script setup lang="ts">
import { user } from '@/store';
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const User = user();

await User.userdjs(Number(route.params.id));
const toradio = (id: number) => {
  router.push({
    path: `/radio/${id}`
  });
};
</script>

<template>
  <div class="list">
    <ul>
      <li v-for="(p, index) in User.userDJ" @click="toradio(p.id)">
        <div>{{ 1 + index }}</div>
        <div>
          <img :src="`${p.picUrl}?param=100y100`">
        </div>
        <div>{{ p.name }} <span class="ing" @click.stop="">{{ p.category }}</span></div>
        <div>节目:{{ p.programCount }}</div>
        <div>点赞:{{ p.subCount >= 10000 ? `${String(p.subCount).replace(/\d{4}/, '')}万` : p.subCount }}</div>
      </li>
    </ul>
    <div v-if="User.userDJ.length===0">没有捏</div>
  </div>
</template>

<style lang="scss" scoped>
@import '../radio/list.scss'
</style>