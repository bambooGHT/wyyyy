<script setup lang="ts">
import { usertab } from '@/types/songlist';
import { songlist, user } from "@/store";
import pagination from '@/components/pagination.vue';
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { currentlist } from '@/hooks/music';

let arr = [
  { name: '聽歌排行', type: usertab.PLAYLIST },
  { name: '歌單', type: usertab.SONG },
  { name: '收藏的歌單', type: usertab.COLLECTSONG },
  { name: '電臺', type: usertab.RADIO },
];
const info = defineAsyncComponent(() =>
  import('./info.vue')
);
const list = defineAsyncComponent(() =>
  import('./list.vue')
);
const listdj = defineAsyncComponent(() =>
  import('./list1.vue')
);
const radio = defineAsyncComponent(() =>
  import('./radio.vue')
);
const recommend = defineAsyncComponent(() =>
  import('../userrecommend/recommend.vue')
);
const artist = defineAsyncComponent(() =>
  import('./artist.vue')
);
const router = useRouter();
const route = useRoute();
let tab = ref<usertab>((route.query.type as usertab) ?? usertab.PLAYLIST);
const Song = songlist();
const User = user();
const pagin1 = (type: number) => {
  Song.usersongarr({
    uid: Number(route.params.id),
    offset: (type - 1) * 30
  });
};
const pagin2 = (type: number) => {
  Song.usersongarr1({
    uid: Number(route.params.id),
    offset: (User.userINFO.profile.playlistCount - 1) + ((type - 1) * 30)
  });
};
onMounted(() => {
  if (localStorage.getItem('USERID')) {
    localStorage.getItem('USERID') == route.params.id &&
      arr.push({ name: '收藏的電臺', type: usertab.COLLECTRADIO },
        { name: '收藏的歌手', type: usertab.ARTIST },
      );

  }
  if (route.params?.index) {
    if (route.params.index === '1') {
      tab.value = usertab.SONG;
    } else {
      tab.value = usertab.COLLECTSONG;
    }
  }

});
//歌單跳轉
const topath = (id: number) => {
  router.push({
    path: `/song/${id}`
  });
  currentlist.value = true;
};
//播放
const allpaly = (id: number) => {
  Song.song(id).then((res) => {
    res && Song.playlistreplace();
  });
};
const ifs = () => {
  if (tab.value === usertab.SONG) {
    pagin1(route.query.off ? Number(route.query.off) : 1);
  }
  if (tab.value === usertab.COLLECTSONG) {
    pagin2(route.query.off ? Number(route.query.off) : 1);
  }
};
User.useinfo(String(route.params.id)).then(() => {
  ifs();
});
watch(() => tab.value, () => {
  ifs();
});
//歌單跳轉
const users = (type: usertab) => {
  router.replace({
    query: {
      type: type
    }
  });
  tab.value = type;
};
</script>

<template>
  <div class="user">
    <Suspense>
      <info>
        <img class="vipimg" v-if="User.uname.profile?.userId == Number(route.params.id)"
          :src="User.userVIP.redVipDynamicIconUrl" alt="">
      </info>
      <template #fallback>
        <div>加载中...</div>
      </template>
    </Suspense>
    <div class="user-info1">
      <div v-for="p in arr" @click="users(p.type)" :class="{ click: tab === p.type }">
        {{ p.name }}
        <span v-if="p.type === usertab.SONG">({{ User.userINFO?.profile?.playlistCount }})</span>
      </div>
    </div>
    <hr />
    <transition name="song" mode="out-in">
      <Suspense>
        <list v-if="tab === usertab.PLAYLIST">
          <template #vip="vipProps">
            <span v-if="vipProps.sq" class="vip">SQ</span>
            <span v-if="vipProps.t === 1" class="vip">VIP</span>
            <span v-if="vipProps.hr" class="vip">Hi-Res</span>
          </template>
        </list>
        <recommend v-else-if="tab === usertab.SONG">
          <li v-for="p of Song.userSong" :key="p.id">
            <img :src="`${p.coverImgUrl}?param=500y500`" alt="">
            <div class="lastSong">
              <div class="name">曲数:<span>{{ p.trackCount }}</span></div>
              <div class="iconfont icon-bofang" @click="allpaly(p.id)"></div>
            </div>
            <span class="topath" @click="topath(p.id)">{{ p.name }}</span>
          </li>
          <template #pag>
            <pagination v-if="User.userINFO?.profile?.playlistCount > 30" :pagin="pagin1"
              :total="User.userINFO.profile.playlistCount" :limit="30" />
          </template>
        </recommend>
        <recommend v-else-if="tab === usertab.COLLECTSONG">
          <li v-for="p of Song.userSongSub" :key="p.id">
            <img :src="`${p.coverImgUrl}?param=500y500`" alt="">
            <div class="lastSong">
              <div class="name">曲数:<span>{{ p.trackCount }}</span></div>
              <div class="iconfont icon-bofang" @click="allpaly(p.id)"></div>
            </div>
            <span class="topath" @click="topath(p.id)">{{ p.name }}</span>
          </li>
          <template #pag>
            <div style="text-align: center;">實際上可能沒有這麽多頁</div>
            <pagination :pagin="pagin2" :total="1000" :limit="30" />
          </template>
        </recommend>
        <listdj v-else-if="tab === usertab.RADIO" />
        <radio v-else-if="tab === usertab.COLLECTRADIO" />
        <artist v-else-if="tab === usertab.ARTIST" />
        <template #fallback>
          <div>加载中...</div>
        </template>
      </Suspense>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import '../userrecommend/index.scss';

.song-enter-active,
.song-leave-active {
  transition: opacity 0.2s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

hr {
  margin-bottom: 1rem;
}

.vipimg {
  height: clamp(1.3rem, 1.4vw, 2rem);
  vertical-align: -0.2rem;
  margin-right: 1rem;
}

.click::before {
  content: '';
  position: absolute;
  width: 100%;
  bottom: -0.3rem;
  height: 0.3rem;
  background-color: $ThemeC22;
}

.user {
  width: 100%;
  height: auto;

  * {
    color: $ThemeC3;
  }

  &-info1 {
    margin: 2rem 0;
    display: flex;

    div {
      margin-left: 2rem;
      font-size: clamp(1.4rem, 1.2vw, 1.7rem);
      position: relative;

      &:hover {
        cursor: pointer;
        color: $ThemeC22;
      }
    }
  }
}

@import '@/components/vip.scss';
</style>