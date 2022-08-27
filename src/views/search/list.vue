<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { search, songlist } from '@/store';
import daytime from '@/utils/day-prce';
import { useRouter, useRoute } from 'vue-router';
import pagination from '@/components/pagination.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { throttle } from '@/utils/throttle';

const props = defineProps<{ type: number; }>();
const router = useRouter();
const route = useRoute();
const Search = search();
const list = songlist();
const { cloudsearch } = storeToRefs(Search);
let inputarr = ref<any[]>([]);
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
const text = (text: string[]) => {
  return text.join().replace(/,/g, '\n').replace(/<b>/g, '<b style="color: var(--ThemeC22)">');
};
const regexp = (str: string) => {
  return str.replace(String(route.query.value), `<span style="color: var(--ThemeC22);">${String(route.query.value)}</span>`);
};
const pagin = async (index: number) => {
  await Search.sdata({
    keywords: String(route.query.value),
    offset: (index - 1) * 30,
    type: props.type
  });
  if (inputarr.value.length > 1) {
    for (let i = 0; i < inputarr.value.length; i++) {
      if (!inputarr.value[i]) return;
      inputarr.value[i].checked = false;
    }
  }
};
onMounted(() => {
  pagin(route.query.off ? Number(route.query.off) : 1);
});
onUnmounted(() => {
  inputarr.value = [];
});
const sikus = (id: number) => {
  throttle(() => {
    const boo = list.deadd(id);
    //是否處於喜歡列表
    if (localStorage.getItem('USERSUKIID') === route.params.id && boo !== -1) {
      list.songlike(id, !!boo);
    }
  }, 1200);
};
</script>

<template>
  <div>
    <ul class="album-list">
      <li class="D">
        <div>#</div>
        <div>喜欢</div>
        <div>曲名</div>
        <div>歌手</div>
        <div>专辑</div>
        <div>时间</div>
        <div>热度</div>
      </li>
    </ul>
    <ul class="album-list">
      <li v-for="(p, index) of cloudsearch.songs" @dblclick="Search.songsplay(p.id)"
        :class="{ 'copy': p.privilege.cp === 0 }">
        <div>{{ 1 + index < 10 ? '0' + (1 + index) : 1 + index }}</div>
            <div style="cursor: pointer;" :class="{ 'liked': list.sukiarr.indexOf(p.id) != -1 }" @click="sikus(p.id)">喜欢</div>
            <div :title="`${p.name}${p.alia[0] ? `(${p.alia[0]})` : ''}`">
              <article>
                <span class="click" v-html="regexp(p.name)"></span>
                <span class="copy" v-if="p.alia[0]">({{ p.alia[0] }})</span>
              </article>
              <article>
                <slot name="vip" :t="p.fee" :sq="p.sq" :hr="p.hr"></slot>
              </article>
            </div>
            <div :title="p.ar.map((ar: any) => ar.name).join('/')">
              <nav v-for="(s, index) of p.ar">
                <span class="click" @click="toartist(s.id)" v-html="regexp(s.name)"></span>
                <span class="copy">{{ p.ar.length > index + 1 ? '/' : '' }}</span>
              </nav>
            </div>
            <div :title="`${p.al.name}${p.al.alia ? `(${p.al.alia[0]})` : ''}`">
              <span class="click" @click="toalbum(p.al.id)" v-html="regexp(p.al.name)"></span>
              <span class="copy" v-if="p.al.alia">({{ p.al.alia[0] }})</span>
            </div>
            <div>{{ daytime.formatime(new Date(p.dt)) }}</div>
            <div class="top" :title="`${p.pop}热度`">
              <span :style="{ 'background-size': `${daytime.percentage(p.pop, 100)}` }"></span>
            </div>
            <template v-if="p.lyrics">
              <div class="lyric">
                <label :for="p.name" class="label">展开歌词</label>
                <input :ref="el => inputarr[index] = el" type="checkbox" name="checkbox" :id="p.name">
                <section class="lyric-txt" style="white-space:pre-wrap" v-html="text(p.lyrics)">
                </section>
              </div>
            </template>
      </li>
    </ul>
    <pagination v-if="cloudsearch.songCount > 30" :pagin="pagin" :total="cloudsearch.songCount" :limit="30">
    </pagination>
  </div>
</template>

<style lang="scss" scoped>
@import '@/components/list1.scss';
</style>