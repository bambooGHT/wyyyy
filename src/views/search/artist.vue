<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { search } from '@/store';
import { storeToRefs } from 'pinia';
import pagination from '@/components/pagination.vue';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const Search = search();
const { cloudsearch } = storeToRefs(Search);

//跳轉 歌手
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
};
const regexp = (str: string) => {
  return str.replace(String(route.query.value), `<span style="color: var(--ThemeC22);">${String(route.query.value)}</span>`);
};
const pagin = async (index: number) => {
  await Search.sdata({
    keywords: String(route.query.value),
    offset: (index - 1) * 30,
    type: 100
  });
};
onMounted(() => {
  pagin(route.query.off ? Number(route.query.off) : 1);
});
</script>

<template>
  <div>
    <ul>
      <li v-for="p in cloudsearch.artists" @click="toartist(p.id)">
        <div>
          <img :src="`${p.img1v1Url}?param=100y100`">
        </div>
        <div>
          <nav v-html="regexp(p.name)"></nav>
          <nav class="cpy" v-html="p.alias[0] ? `(${p.alias[0]})` : p.trans ? `(${regexp(p.trans)})` : ''"></nav>
        </div>
        <div>专辑:{{ p.albumSize }}</div>
      </li>
    </ul>
    <pagination v-if="cloudsearch.artistCount > 30" :pagin="pagin" :total="cloudsearch.artistCount" :limit="30">
    </pagination>
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