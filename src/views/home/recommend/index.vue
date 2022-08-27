<script setup lang="ts">
import NEWsong from './NEWsong.vue';
import MV from './MV.vue';
import radio from './radio.vue';
import carousel from './carousel.vue';

</script>

<template>
  <div class="ne">
    <carousel />
    <NEWsong />
    <MV />
    <radio :num="-1" :name="'推荐电台'" />
  </div>
</template>

<style lang="scss" scoped>
</style>