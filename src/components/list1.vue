<script setup lang="ts">
import Message from '@/message';
import { album } from '@/store';
import daytime from '@/utils/day-prce';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineProps<{ indexs: number; }>();

const Album = album();
let index = ref(-1);
const router = useRouter();
const route = useRoute();

//點擊高亮
let libackg = (i: number) => {
  index.value = i;
};
//跳轉 歌手
const toartist = (id: number) => {
  if (id == Number(route.params.id)) {
    Message({ type: 'warning', message: '已在當前位置' });
    return;
  }
  router.push({
    path: `/artist/${id}`
  });
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
      <template v-if="indexs === 0" v-for="(p, indexs) of Album.songs">
        <li v-if="typeof Album.songs[indexs] === 'string'" class="D">
          <div class="DISC">{{ p }}</div>
        </li>
        <li v-else @click="libackg(indexs)" @dblclick="Album.play(p)"
          :class="{ 'copy': p.privilege.cp === 0, liback: indexs === index }">
          <div :title="p.index">{{ p.index < 10 ? '0' + p.index : p.index }}</div>
              <div class="liked">喜欢</div>
              <div :title="`${p.name}${p.tns ? `(${p.tns[0]})` : ''}`">
                <article>
                  <span class="click">{{ p.name }}</span>
                  <span class="copy" v-if="p.tns">({{ p.tns[0] }})</span>
                </article>
                <article>
                  <slot name="vip" :t="p.fee" :sq="p.sq" :hr="p.hr"></slot>
                </article>
              </div>
              <div :title="p.ar.map((ar: any) => ar.name).join('/')">
                <nav v-for="(s, index) of p.ar">
                  <span class="click" @click="toartist(s.id)">{{ s.name }}</span>
                  <span class="copy">{{ p.ar.length > index + 1 ? '/' : '' }}</span>
                </nav>
              </div>
              <div :title="`${p.al.name}${p.al.alia ? `(${p.al.alia[0]})` : ''}`">
                {{ p.al.name }}
                <span class="copy" v-if="p.al.alia">({{ p.al.alia[0] }})</span>
              </div>
              <div>{{ daytime.formatime(new Date(p.dt)) }}</div>
              <div class="top" :title="`${p.pop}热度`">
                <span :style="{ 'background-size': `${daytime.percentage(p.pop, 100)}` }"></span>
              </div>
        </li>
      </template>
      <template v-else v-for="(p, indexs) of Album.albumlist.hotSongs">
        <li @click="libackg(indexs)" @dblclick="Album.play(p.id)"
          :class="{ 'copy': p.privilege.cp === 0, liback: indexs === index }">
          <div>{{ indexs + 1 < 10 ? '0' + (indexs + 1) : indexs + 1 }}</div>
              <div class="liked">喜欢</div>
              <div :title="`${p.name}${p.alia[0] ? `(${p.alia[0]})` : ''}`">
                <article>
                  <span class="click">{{ p.name }}</span>
                  <span class="copy" v-if="p.alia[0]">({{ p.alia[0] }})</span>
                </article>
                <article>
                  <slot name="vip" :t="p.fee" :sq="p.sq" :hr="p.hr"></slot>
                </article>
              </div>
              <div :title="p.ar.map((ar: any) => ar.name).join('/')">
                <nav v-for="(s, index) of p.ar">
                  <span class="click" @click="toartist(s.id)">{{ s.name }}</span>
                  <span class="copy">{{ p.ar.length > index + 1 ? '/' : '' }}</span>
                </nav>
              </div>
              <div :title="`${p.al.name}${p.al.alia ? `(${p.al.alia[0]})` : ''}`">
                <span>{{ p.al.name }}</span>
                <span class="copy" v-if="p.al.alia">({{ p.al.alia[0] }})</span>
              </div>
              <div>{{ daytime.formatime(new Date(p.dt)) }}</div>
              <div class="top" :title="`${p.pop}热度`">
                <span :style="{ 'background-size': `${daytime.percentage(p.pop, 100)}` }"></span>
              </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss">
@import './list1.scss'
</style>