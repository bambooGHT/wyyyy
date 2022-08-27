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
    path: `/user/${id}`
  });
};
const regexp = (str: string) => {
  return str.replace(String(route.query.value), `<span style="color: var(--ThemeC22);">${String(route.query.value)}</span>`);
};
const pagin = async (index: number) => {
  await Search.sdata({
    keywords: String(route.query.value),
    offset: (index - 1) * 30,
    type: 1002
  });
};
onMounted(() => {
  pagin(route.query.off ? Number(route.query.off) : 1);
});
</script>

<template>
  <div>
    <ul>
      <li v-for="p of cloudsearch.userprofiles" @click="toartist(p.userId)">
        <div>
          <img :src="`${p.avatarUrl}?param=100y100`">
        </div>
        <div>
          <nav v-html="regexp(p.nickname)"></nav>
          <img v-if="p.avatarDetail" :src="`${p.avatarDetail.identityIconUrl}?param=50y50`" alt="">
        </div>
        <div>歌单:<span>{{ p.playlistCount }}</span></div>
        <div><span :title="p.description ? p.description : p.avatarDetail ? '网抑云音乐人' : ''">
            {{ p.description ? p.description : p.avatarDetail ? '网抑云音乐人' : '' }}
          </span></div>
      </li>
    </ul>
    <pagination v-if="cloudsearch.userprofileCount > 30" :pagin="pagin" :total="cloudsearch.userprofileCount"
      :limit="30">
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
        flex: 1;

        img {
          height: 2rem;
          vertical-align: sub;
        }
      }

      &:nth-child(n+3) {
        width: 13rem;
      }
    }
  }
}
</style>