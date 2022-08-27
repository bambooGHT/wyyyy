<script setup lang="ts">
import banner from './banner.vue';
import sort from './sort.vue';
import radio from '../recommend/radio.vue';
import radios1 from './radios1.vue';
</script>

<template>
  <div class="ne">
    <banner />
    <sort />
    <radios1></radios1>
    <radio :num="-2" :name="'个性推荐电台'" />
    <radio :num="3" :name="'情感'" />
    <radio :num="2001" :name="'创作翻唱'" />
    <radio :num="2" :name="'音乐推荐'" />
    <radio :num="8" :name="'脱口秀'" />
  </div>
</template>

<style lang="scss" scoped>
</style>