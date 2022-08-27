<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { arlike } from '@/server/user';

type ar = {
  id: number;
  name: string;
  alias: string[];
  albumSize: number;
  picUrl: string;
}[];
const arr = ref<ar>([]);
const router = useRouter();

//跳轉 歌手
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
};
const arrs = await arlike();
arr.value = arrs.data;

</script>

<template>
  <div>
    <ul>
      <li v-for="p in arr" @click="toartist(p.id)">
        <div>
          <img :src="`${p.picUrl}?param=100y100`">
        </div>
        <div>
          <nav>{{ p.name }}</nav>
          <nav class="cpy" v-html="p.alias.length > 0 ? `(${p.alias[0]})` : ''"></nav>
        </div>
        <div>专辑:{{ p.albumSize }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul {
  margin: 0 1rem;
  font-size: clamp(1.3rem, 1.25vw, 1.6rem);

  li {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0.5rem 0;

    &:nth-child(even) {
      background-color: $ThemeC7;
    }

    &:hover {
      background-color: $ThemeC8;
    }

    div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      nav {
        display: inline;
      }

      .cpy {
        color: $ThemeC10;
      }

      &:nth-child(1) {
        width: clamp(5rem, 4.5vw, 8rem);

        img {
          display: block;
          width: clamp(4rem, 4vw, 6rem);
          height: clamp(4rem, 4vw, 6rem);
        }
      }

      &:nth-child(2),
      &:nth-child(3) {
        flex: 1;
      }
    }
  }
}
</style>