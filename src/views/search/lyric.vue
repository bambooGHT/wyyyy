<script setup lang="ts">
import list from './list.vue';
</script>

<template>
  <list :type="1006">
    <template #vip="vipProps">
      <span v-if="vipProps.sq" class="vip">SQ</span>
      <span v-if="vipProps.t === 1" class="vip">VIP</span>
      <span v-if="vipProps.hr" class="vip">Hi-Res</span>
    </template>
  </list>
</template>

<style lang="scss" scoped>
@import '@/components/vip.scss'
</style>