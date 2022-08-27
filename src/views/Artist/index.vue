<script setup lang="ts">
import { tabartist } from '@/types/Artist';
import { defineAsyncComponent, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { album } from '@/store';
import { storeToRefs } from 'pinia';
import info from "./info.vue";
import pagination from '@/components/pagination.vue';
import { throttle } from "@/utils/throttle";
import { arlikes } from '@/server/user';
import Message from '@/message';
const Album = album();
const route = useRoute();
const router = useRouter();
const list = defineAsyncComponent(() =>
  import("@/components/list1.vue")
);
const recommend = defineAsyncComponent(() =>
  import('../userrecommend/recommend.vue')
);
const { albumlist } = storeToRefs(Album);
const pagin = (offset: number) => {
  Album.artistalbum({
    id: Number(route.params.id),
    offset: (offset - 1) * 30
  });
};
let tab = ref<tabartist>(tabartist.TOPMUSIC);

const toalbum = (id: number) => {
  router.push({
    path: `/album/${id}`,
  });
};
const Albumplay = (id: number) => {
  Album.albums(id).then(() => {
    Album.playall();
  });
};
onMounted(() => {
  Album.artist(Number(route.params.id)).then(() => {
    Album.ARinfo(Number(route.params.id));
  });
});
pagin(route.query.off ? Number(route.query.off) : 1);
onUnmounted(() => {
  albumlist.value = {} as any;
});

const subar = () => {
  throttle(() => {
    arlikes({ id: albumlist.value.artist.id, t: albumlist.value.artist.followed ? 2 : 1 });
    Message({ type: 'success', message: albumlist.value.artist.followed ? '取消收藏成功' : '收藏成功' });
    albumlist.value.artist.followed = !albumlist.value.artist.followed;
  }, 600);
};
</script>

<template>
  <div class="artist" v-if="albumlist.artist">
    <div class="artist-info">
      <div class="img">
        <img :src="`${albumlist.artist.img1v1Url}?param=500y500`">
      </div>
      <div class="info">
        <div class="name">{{ albumlist.artist.name }}</div>
        <div class="name1">
          <span v-for="s of albumlist.artist.alias">{{ s }}</span>
        </div>
        <div class="name2" @click="subar">收藏<i v-if="albumlist.artist.followed">✓</i></div>
        <div class="info-2">
          <div>曲数:{{ albumlist.artist.musicSize }}</div>
          <div>專輯数:{{ albumlist.artist.albumSize }}</div>
          <div>MV数:{{ albumlist.artist.mvSize }}</div>
        </div>
      </div>
    </div>
    <div class="tag">
      <div class="tag-list">
        <div @click="tab = tabartist.TOPMUSIC">HOTMUSIC</div>
        <div @click="tab = tabartist.ALBUM">專輯</div>
        <div @click="tab = tabartist.MV">MV</div>
        <div @click="tab = tabartist.ARTISTINFO">歌手介紹</div>
      </div>
      <p class="hr"></p>
    </div>
    <transition name="song" mode="out-in">
      <list v-if="tab === tabartist.TOPMUSIC" :indexs="1">
        <template #vip="vipProps">
          <span v-if="vipProps.sq" class="vip">SQ</span>
          <span v-if="vipProps.t === 1" class="vip">VIP</span>
          <span v-if="vipProps.hr" class="vip">Hi-Res</span>
        </template>
      </list>
      <recommend v-else-if="Album.aralbum.length > 1 && tab === tabartist.ALBUM" :t="false">
        <li v-for="p of Album.aralbum" :key="p.id">
          <img :src="`${p.picUrl}?param=500y500`" alt="">
          <div class="playlist iconfont icon-bofang" @click="Albumplay(p.id)"></div>
          <span class="topath" @click="toalbum(p.id)">{{ p.name }}</span>
        </li>
        <template #pag>
          <pagination :pagin="pagin" :total="albumlist.artist.albumSize" :limit="30"
            v-if="albumlist.artist.albumSize > 30" />
        </template>
      </recommend>
      <div v-else-if="tab === tabartist.MV">MV</div>
      <info v-else-if="tab === tabartist.ARTISTINFO" :data="Album.arinfo" />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
@import '../userrecommend/index.scss';

.song-enter-active,
.song-leave-active {
  transition: opacity 0.3s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

@import '@/components/vip.scss';
</style>