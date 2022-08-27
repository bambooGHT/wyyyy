<script setup lang="ts">
import daytime from "@/utils/day-prce";
import { useRouter } from "vue-router";
import { computed, onBeforeUpdate, ref } from "vue";
import { songlist, user } from '@/store/index';
import { storeToRefs } from "pinia";
import { subscribe } from '@/server/user';
import Message from '@/message';
import { throttle } from "@/utils/throttle";
const Song = songlist();
const User = user();
const router = useRouter();
const { songall } = storeToRefs(Song);
const touser = (id: number) => {
  router.push({
    path: `/user/${id}`
  });
};
const text = ref(true);

const sub = (id: number) => {
  throttle(() => {
    if (Song.songall.subscribed === false) {
      Song.songall.subscribed = true;
      subscribe({ id: id, t: 1 });
      Message({ type: 'success', message: '收藏成功' });
      User.usersongSub.unshift(Song.songall);
    } else {
      Song.songall.subscribed = false;
      subscribe({ id: id, t: 2 });
      Message({ type: 'success', message: '取消收藏成功' });
      if (User.usersongSub.length <= 10) {
        const index = User.usersongSub.findIndex(p => p.id === id);
        index && User.usersongSub.splice(index, 1);
      }
    }
  }, 1100);

};
const uid = computed(() => {
  return Song.songall.creator.userId !== Number(localStorage.getItem('USERID'));
});

onBeforeUpdate(() => {
  if (songall.value.description)
    if (songall.value.description.length <= 30) {
      text.value = false;
    }
});
</script>

<template>
  <div class="song" v-if="Song.songall.creator">
    <img :src="`${Song.songall.coverImgUrl}?param=500y500`" alt="">
    <div class="user">
      <div class="user-songid"><span class="ing">歌单</span> {{ Song.songall.name }}</div>
      <div class="user-time">
        <img :src="`${Song.songall.creator.avatarUrl}?param=200y200`" @click="touser(Song.songall.creator.userId)">
        <span @click="touser(Song.songall.creator.userId)">{{ Song.songall.creator.nickname }}
          {{ daytime.formatDate(new Date(Song.songall.createTime)) }}创建</span>
      </div>
      <div class="user-Details">
        <div @click="Song.playlistreplace()" title="播放全部">
          播放全部
          <nav @click.stop="Song.playlistpush()" title="添加到列表"><span></span><span></span></nav>
        </div>
        <div title="收藏" @click="sub(Song.songall.id)" v-if="uid">收藏<i v-if="Song.songall.subscribed">✓</i></div>
        <del title="分享">分享</del>
        <del title="下载全部">下载全部</del>
      </div>
      <div id="Introduction" class="user-Introduction" v-if="Song.songall.description">
        <div v-if="Song.songall.description.length > 30" @click="text = !text" class="text">{{ text ? '展开' : '收起' }}
        </div>
        <span>{{ text ? `${Song.songall.description.slice(0, 30)}......` : Song.songall.description }}</span>
      </div>
    </div>
    <div class="user-track">
      <div class="track-t">
        <div>
          <p>歌曲數量</p>
          <p class="color">{{ Song.songall.trackCount }}</p>
        </div>
        <span></span>
        <div>
          <p>播放次數</p>
          <p class="color">
            {{ Song.songall.playCount > 9999 ? Song.songall.playCount > 99999999 ?
                `${String(Song.songall.playCount).replace(/\d{8}$/, '')}億` :
                `${String(Song.songall.playCount).replace(/\d{4}$/, '')}万` :
                Song.songall.playCount
            }}
          </p>
        </div>
      </div>
      <div class="track-b">
        <span v-if="Song.songall.tags.length > 0">標簽:</span>
        <span v-for="(s, index) in Song.songall.tags">
          <nav>{{ s }}</nav>{{ Song.songall.tags.length > index + 1 ? '/' : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';

</style>