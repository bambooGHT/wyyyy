<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { search } from '@/store';
import { storeToRefs } from 'pinia';
import pagination from '@/components/pagination.vue';
import { onMounted } from 'vue';
import { currentlist } from '@/hooks/music';

const route = useRoute();
const router = useRouter();
const Search = search();

const { cloudsearch } = storeToRefs(Search);
const toartist = (id: number) => {
  router.push({
    path: `/user/${id}`
  });
};
const tosong= (id: number) => {
  router.push({
    path: `/song/${id}`
  });
  currentlist.value = true;
};
const numbers = (num: number): number | string => {
  if (num < 10000) {
    return num;
  }
  return `${String(num).replace(/\d{4}$/, '')}万`;
};
const regexp = (str: string) => {
  return str.replace(String(route.query.value), `<span style="color: var(--ThemeC22);">${String(route.query.value)}</span>`);
};
const pagin = async (index: number) => {
  await Search.sdata({
    keywords: String(route.query.value),
    offset: (index - 1) * 30,
    type: 1000
  });
};
onMounted(() => {
  pagin(route.query.off ? Number(route.query.off) : 1);
});
</script>

<template>
  <div>
    <ul>
      <li v-for="p of cloudsearch.playlists" @click="tosong(p.id)">
        <div>
          <img :src="`${p.coverImgUrl}?param=100y100`">
        </div>
        <div v-html="regexp(p.name)"></div>
        <div @click.stop="toartist(p.creator.userId)">by {{ p.creator.nickname }}</div>
        <div>曲数:<span>{{ p.trackCount }}</span></div>
        <div>播放:<span>{{ numbers(p.playCount) }}</span></div>
      </li>
    </ul>
    <pagination v-if="cloudsearch.playlistCount > 30" :pagin="pagin" :total="cloudsearch.playlistCount" :limit="30">
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
        width: clamp(5rem, 4.5vw, 8rem);

        img {
          display: block;
          width: clamp(4rem, 4vw, 6rem);
          height: clamp(4rem, 4vw, 6rem);
        }
      }

      &:nth-child(2) {
        flex: 2;
      }

      &:nth-child(3) {
        flex: 1;
      }

      &:nth-child(n+4) {
        width: 13rem;
      }
    }
  }
}
</style>