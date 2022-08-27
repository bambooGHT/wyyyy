<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
defineProps<{ t?: boolean; }>();
let topath = () => {
  router.push({
    path: `/daymusic`,
  });
};
</script>

<template>
  <div>
    <ul>
      <li v-if="t">
        <div class="t" @click="topath">
          <span>{{ new Date().toLocaleString('zh-cn', { weekday: "long" }) }}</span>
          <br />
          <span>{{ new Date().getDate() }}</span>
          <span></span>
        </div>
        <span class="to" @click="topath">每日歌曲推荐</span>
      </li>
      <slot></slot>
    </ul>
    <slot name="pag"></slot>
  </div>
</template>

<style lang="scss" scoped>
@import './recom.scss';
</style>