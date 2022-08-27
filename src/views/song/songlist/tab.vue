<script setup lang="ts">
import { tabs } from '@/types/songlist';
defineProps<{ comment: any; }>();
</script>

<template>
  <div class="tag">
    <div class="tag-list">
      <div @click="$emit('tabto', tabs.LIST)">歌曲列表</div>
      <div @click="$emit('tabto', tabs.COMMENT)">評論({{ comment }})</div>
      <div @click="$emit('tabto', tabs.COLLECTOR)">收藏者</div>
    </div>
    <p class="br"></p>
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
        color: $ThemeC22;
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

  .br {
    width: 100%;
    height: .2rem;
    background-color: $ThemeC1;
    margin: 1rem 0;
  }


}
</style>