<script setup lang="ts">
import { Hmusic } from '@/store';
import { onUnmounted, onMounted, ref, watch } from 'vue';
import type { high } from '@/types/Hmusic';
import { highquality, highqualist } from '@/server/hmusic';
import { useRouter, useRoute } from 'vue-router';
import { debounce1 } from '@/utils/throttle';
import { storeToRefs } from 'pinia';
import { tran, Scroll } from '@/hooks/nav';
import { currentlist } from '@/hooks/music';

const router = useRouter();
const route = useRoute();
const music = Hmusic();
const { higharr } = storeToRefs(music);
let i = ref(0);
let height = ref(false);
const scrollTop = () => {
  debounce1(() => {
    if (tran.value.scrollTop + tran.value.offsetHeight === tran.value.scrollHeight) {
      if (higharr.value.playlists.length < higharr.value.total) {
        if (height.value) return;
        height.value = true;
        gethigh({ cat: String(route.query.value), before: higharr.value.lasttime });
      }
    }
  });
};
Scroll();
onMounted(() => {
  if (music.toptags.length < 1) highquality().then((res: any) => {
    music.toptags = res.tags;
  });
  tran.value.addEventListener('scroll', scrollTop);
});
const gethigh = (data: high) => {
  highqualist(data).then((res: any) => {
    if (!higharr.value.total) {
      higharr.value.total = res.total;
    }
    higharr.value.lasttime = res.lasttime;
    higharr.value.playlists.push(...res.playlists);
    i.value = 1;
    height.value = false;
  });
};
const tore = (name: string) => {
  router.replace({
    query: {
      value: name
    }
  });
};
const tosong = (id: number) => {
  router.push({
    path: `/song/${id}`,
  });
  currentlist.value = true;
};
const touser = (id: number) => {
  router.push({
    path: `/user/${id}`,
  });
};
watch(() => route.query.value, (newvalue, oldvalue) => {
  if (!newvalue) return;
  if (!oldvalue && higharr.value.total) {
    i.value = 1;
    return;
  };
  i.value = 0;
  gethigh({ cat: newvalue ? String(newvalue) : '全部' });
  higharr.value = { playlists: [] } as any;
}, {
  immediate: true
});
onUnmounted(() => {
  tran.value.removeEventListener('scroll', scrollTop);
});
</script>

<template>
  <div class="tag">
    <div class="tag-all">
      <div class="cats"><span>{{ route.query.value ? route.query.value : '???' }}</span>⏷</div>
      <div class="count">
        共有<span>"{{ higharr.total }}"</span>個<i>精⭐品⭐</i>歌单</div>
      <nav>
        <ul>
          <li>
            <div class="catall" @click="tore('全部')">全部歌單</div>
          </li>
          <li>
            <div class="cat">
              <div v-for="p in music.toptags" @click="tore(p.name)" :class="{ 'key': route.query.value === p.name }">
                {{ p.name }}</div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <transition name="song" mode="out-in">
      <ul class="a" v-if="i">
        <li @click="tosong(p.id)" v-for="p in higharr.playlists">
          <div>
            <div class="w">播放:
              {{ p.playCount > 9999 ? `${String(p.playCount).replace(/\d{4}$/, '')}万` : p.playCount }}
            </div>
          </div>
          <img :src="`${p.coverImgUrl}?param=300y300`" alt="">
          <div class="lastSong">
            <div class="name">曲數:<span>{{ p.trackCount }}</span></div>
            <div class="name"><span>{{ p.tag }}</span></div>
          </div>
          <div class="txt">
            <span class="topath">{{ p.name }}</span> <br />
            <span class="topath" @click="touser(p.creator.userId)">BY {{ p.creator.nickname }}</span><br />
            <span class="topath">{{ p.copywriter }}</span>
          </div>
        </li>
        <li class="ings" v-if="higharr.playlists.length < higharr.total">{{ height ? '加載中...' : '加載更多' }}
        </li>
      </ul>
      <div v-else style="text-align: center;">加載中...</div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';

.song-enter-active,
.song-leave-active {
  transition: opacity 0.2s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}


@import './high.scss'
</style>