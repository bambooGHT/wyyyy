<script setup lang="ts">
import { songlist } from '@/store';
import daytime from '@/utils/day-prce';
import { throttle } from '@/utils/throttle';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const list = songlist();
const { songall } = storeToRefs(list);
let click = ref<any>(0);
const indexs = (e: any) => {
  if (e.target.parentNode.dataset.id) {
    click.value && (click.value.classList.remove('liback'));
    e.target.parentNode.classList.add('liback');
    click.value = e.target.parentNode;
  }
};

//跳轉 專輯
const toalbum = (id: number) => {
  router.push({
    path: `/album/${id}`,
  });
};
//跳轉 歌手
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
};

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
  <ul class="list" v-if="songall.tracks?.length > 0" @click="indexs">
    <li class="not">
      <div>#</div>
      <div>操作</div>
      <div>標題</div>
      <div>歌手</div>
      <div>專輯</div>
      <div>時長</div>
      <slot name="not"></slot>
    </li>
    <hr />
    <li v-for="(item, index) in songall.tracks" :data-id="index" :class="{ 'no-copyright': list.Copyright(item.id) }"
      @dblclick="list.play(item)">
      <div>{{ 1 + index < 10 ? '0' + (1 + index) : 1 + index }}</div>
          <div class="suki" :class="{ 'red': list.sukiarr.indexOf(item.id) != -1 }" @click="sikus(item.id)">喜歡</div>
          <div :title="item.name + `${item.alia[0] ? `(${item.alia[0]})` : ''}`">
            <article>
              <nav>{{ item.name }}</nav>
              <span v-show="item.alia[0]" class="tns">({{ item.alia[0] }})</span>
            </article>
            <article>
              <slot name="vip" :t="item.fee" :sq="item.sq" :hr="item.hr"></slot>
            </article>
          </div>
          <div>
            <span v-for="(p, index) in item.ar" :title="item.ar.map((ar: any) => ar.name).join('/')">
              <nav @click="toartist(p.id)">{{ p.name }}</nav>{{ item.ar.length > index + 1 ? '/' : '' }}
            </span>
          </div>
          <div :title="item.al.name + `${item.al.tns[0] ? `(${item.al.tns[0]})` : ''}`">
            <nav @click="toalbum(item.al.id)">{{ item.al.name }}
              <nav class="tns" v-show="item.al.tns[0]">
                {{ item.al.tns[0] }}</nav></nav>
          </div>
          <div>{{ daytime.formatime(new Date(item.dt)) }}</div>
          <slot></slot>
    </li>
    <slot name="ing"></slot>
  </ul>
  <div v-else>加载中...</div>
</template>

<style lang="scss" scoped>
@import './list.scss';

.red {
  color: $ThemeC22  !important;
}
</style>