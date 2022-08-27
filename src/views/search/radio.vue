<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { search } from '@/store';
import { storeToRefs } from 'pinia';
import pagination from '@/components/pagination.vue';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const Search = search();
const { cloudsearch } = storeToRefs(Search);

//跳轉 用户
const touser = (id: number) => {
  router.push({
    path: `/user/${id}`
  });
};
//跳轉 电台
const toreadio = (id: number) => {
  router.push({
    path: `/radio/${id}`
  });
};
const pagin = async (index: number) => {
  await Search.sdata({
    keywords: String(route.query.value),
    offset: (index - 1) * 30,
    type: 1009
  });
};
onMounted(() => {
  pagin(route.query.off ? Number(route.query.off) : 1);
});
const regexp = (str: string) => {
  return str.replace(String(route.query.value), `<span style="color: var(--ThemeC22);">${String(route.query.value)}</span>`);
};
const recommend = defineAsyncComponent(() =>
  import('../userrecommend/recommend.vue')
);
</script>

<template>
  <div>
    <recommend>
      <li v-for="p  of cloudsearch.djRadios" :key="p.id" @click="toreadio(p.id)">
        <img :src="`${p.picUrl}?param=200y200`">
        <div class="lastSong">
          <div class="name">节目数:<span>{{ p.programCount }}</span></div>
          <div class="name">分类:<span>{{ p.category }}</span></div>
        </div>
        <span class="topath" v-html="regexp(p.name)"></span>
        <span class="topath topath1" style="color: var(--ThemeC10);" @click.stop="touser(p.dj.userId)">
          by {{ p.dj.nickname }}</span>
      </li>
    </recommend>
    <pagination v-if="cloudsearch.djRadiosCount > 30" :pagin="pagin" :total="cloudsearch.djRadiosCount" :limit="30">
    </pagination>
  </div>
</template>

<style lang="scss" scoped>
@import '../userrecommend/index.scss';

li {
  max-width: 17rem;

  img {
    max-width: 17rem;
    max-height: 17rem;
  }

  .topath1 {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>