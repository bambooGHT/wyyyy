<script setup lang="ts">
import type { artxtype } from '@/types/Artist';
defineProps<{ data: artxtype; }>();
</script>

<template>
  <div v-if="data.briefDesc">
    <div class="info">
      <div class="ti">簡介</div>
      <div class="text">{{ data.briefDesc }}</div>
      <template v-for="p in data.introduction">
        <div class="ti">{{ p.ti }}</div>
        <div class="text">{{ p.txt }}</div>
      </template>
    </div>
  </div>
  <div v-else style="text-align: center;">
    暫無介紹
  </div>
</template>

<style lang="scss" scoped>
.ti {
  display: block;
  font-weight: bold;
}

.text {
  margin: 1rem 0 2rem 2rem;
}

.info {
  margin-left: 1rem;
  white-space: pre-wrap;
  font-size: clamp(1.4rem, 1.2vw, 1.8rem);
}
</style>