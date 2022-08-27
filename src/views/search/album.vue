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
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
};
const toalbum = (id: number) => {
  router.push({
    path: `/album/${id}`
  });
};
const regexp = (str: string) => {
  return str.replace(String(route.query.value), `<span style="color: var(--ThemeC22);">${String(route.query.value)}</span>`);
};
const pagin = async (index: number) => {
  await Search.sdata({
    keywords: String(route.query.value),
    offset: (index - 1) * 30,
    type: 10
  });
};
onMounted(() => {
  pagin(route.query.off ? Number(route.query.off) : 1);
});
</script>

<template>
  <div>
    <ul>
      <li v-for="p in cloudsearch.albums" @click="toalbum(p.id)">
        <div>
          <img :src="`${p.picUrl}?param=150y150`">
        </div>
        <div v-html="regexp(p.name)" :title="p.name"></div>
        <div @click.stop="toartist(p.artist.id)">{{ p.artist.name }}
          <span v-if="p.artist.alias[0]">({{ p.artist.alias[0] }})</span>
        </div>
        <div>曲数:{{ p.size }}</div>
      </li>
    </ul>
    <pagination v-if="cloudsearch.albumCount > 30" :pagin="pagin" :total="cloudsearch.albumCount" :limit="30">
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

      span {
        color: $ThemeC10;
      }

      &:nth-child(1) {
        width: clamp(6rem, 5vw, 9rem);

        img {
          display: block;
          width: clamp(5rem, 4.5vw, 7rem);
          height: clamp(5rem, 4.5vw, 7rem);
        }
      }

      &:nth-child(2) {
        flex: 3;
      }

      &:nth-child(3) {
        flex: 2;
      }

      &:nth-child(4) {
        flex: 1;
      }
    }
  }
}
</style>