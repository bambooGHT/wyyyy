<script setup lang="ts">
import Message from '@/message';
import { defineAsyncComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { d, load, Scroll } from '@/hooks/nav';
import { album, songlist } from '@/store';
import { currentlist } from '@/hooks/music';

const Album = album();
const recommend = defineAsyncComponent(() =>
  import('./recommend.vue')
);
const router = useRouter();
const song = songlist();
onMounted(() => {
  if (!d.value) return;
  if (localStorage.getItem('USERID')) {
    song.songresource();
  } else {
    Message({ type: 'error', message: '尚未登陆' });
  }
  load[0] = 20;
  load[1] = 20;
});
Scroll();
const loads = (index: number) => {
  load[index] += 20;
};

const tomusic = (id: number) => {
  song.song(id).then(res => {
    song.playlistreplace();
  });
};

const topath = (id: number) => {
  router.push({
    path: `/song/${id}`,
  });
  currentlist.value = true;
};
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
</script>

<template>
  <div>
    <div class="h1">个性推荐</div>
    <hr />
    <recommend v-if="song.resource.length > 1" :t="true">
      <li v-for="p of song.resource" :key="p.id">
        <div>
          <div class="w">播放:
            {{ p.playcount > 9999 ? `${String(p.playcount).replace(/\d{4}$/, '')}万` : p.playcount }}
          </div>
        </div>
        <img :src="`${p.picUrl}?param=400y400`" alt="">
        <div class="playlist iconfont icon-bofang" @click="tomusic(p.id)"></div>
        <span class="topath" @click="topath(p.id)">{{ p.name }}</span>
      </li>
    </recommend>
    <div class="h1">最近播放-歌单</div>
    <hr />
    <recommend>
      <li v-for="p of song.recentsonglist.slice(0, load[0])" :key="p.data.id">
        <img :src="`${p.data.coverImgUrl}?param=400y400`" alt="">
        <div class="lastSong">
          <div class="play">最近播放<span @click="song.play(p.data.lastSong)">播放</span></div>
          <div class="name">{{ p.data.lastSong?.name }}</div>
          <div class="iconfont icon-bofang" @click="tomusic(p.data.id)"></div>
        </div>
        <span class="topath" @click="topath(p.data.id)">{{ p.data.name }}</span>
      </li>
    </recommend>
    <div class="toload" v-if="song.recentsonglist && load[0] < song.recentsonglist.length" @click="loads(0)">
      //点击加载更多
    </div>
    <div class="h1">最近播放-专辑</div>
    <hr />
    <recommend>
      <li v-for="p of song.recentalbum.slice(0, load[1])" :key="p.data.id">
        <img :src="`${p.data.picUrl}?param=400y400`" alt="">
        <div class="lastSong">
          <div class="play">最近播放<span @click="song.play(p.data.lastSong)">播放</span></div>
          <div class="name">{{ p.data.lastSong.name }}</div>
          <div class="name">曲数:<span>{{ p.data.size }}</span></div>
          <div class="iconfont icon-bofang" @click="Albumplay(p.data.id)"></div>
        </div>
        <span class="topath" @click="toalbum(p.data.id)">{{ p.data.name }}</span>
      </li>
    </recommend>
    <div class="toload" v-if="song.recentalbum && load[1] < song.recentalbum.length" @click="loads(1)">
      //点击加载更多
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';

.h1 {
  font-size: 2rem;
}

hr {
  margin: 1rem 0 2rem;
  width: 40%;
}

.toload {
  display: inline-block;
  width: auto;
  font-size: clamp(1.4rem, 1.2vw, 1.7rem);
  margin-bottom: 1rem;
  color: $ThemeC3;
  cursor: pointer;
  border-bottom: 1px solid $ThemeC3;

  &:hover {
    color: $ThemeC22;
    border-bottom: 1px solid $ThemeC22;
  }
}
</style>