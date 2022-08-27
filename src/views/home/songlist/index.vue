<script setup lang="ts">
import { songlistype, songlistalltype, listparatype } from '@/types/Hmusic';
import { useRoute, useRouter } from 'vue-router';
import { alllist, hotlist, highquality } from '@/server/hmusic';
import { onMounted, reactive, ref, watch } from 'vue';
import { Hmusic, songlist } from '@/store';
import recommend from '@/views/userrecommend/recommend.vue';
import pagination from '@/components/pagination.vue';
import { d } from '@/hooks/nav';
import { currentlist } from '@/hooks/music';

const router = useRouter();
const route = useRoute();
const music = Hmusic();
const arr = ref<songlistype>({ tags: [] });
const arr1 = ref({} as songlistalltype);
const off = ref();//切换顺序修改分页为1
let data = reactive<listparatype>({
  cat: '',
  limit: 50,
  offset: 0
});
const song = songlist();

//监听参数变化发送请求
watch(() => route.query.value, (neevalue) => {
  if (neevalue === undefined) return;
  music.datahove = false;
  data.cat = String(neevalue);
  data.offset = (route.query.off ? Number(route.query.off) - 1 : 0) * 50;
  if (music.songlist.total > 50) {
    if (off.value) off.value.pagins.offset = 1;
  };
  music.songs(data);
}, {
  immediate: true
});
onMounted(async () => {
  arr1.value = await alllist();
  arr.value = await hotlist();
  highquality().then((res: any) => {
    music.toptags = res.tags;
  });
});
const id = (value: string) => {
  router.replace({
    query: { value: value }
  });
};
const touser = (id: number) => {
  router.push({
    path: `/user/${id}`
  });
};
const topath = (id: number) => {
  router.push({
    path: `/song/${id}`,
  });
  currentlist.value = true;
};
//分页
const pagin = async (index: number) => {
  music.datahove = false;
  data.offset = (index - 1) * 50;
  await music.songs(data);
};
//播放音乐
const tomusic = (id: number) => {
  song.song(id);
  song.playlistreplace();
};
const tohigh = (id: string) => {
  d.value = true;
  router.push({
    path: 'h-high',
    query: {
      value: id
    }
  });
};
</script>

<template>
  <div class="tag" v-if="arr1.all">
    <div class="tag-all">
      <div class="cats"><span>{{ route.query.value ?? '???' }}</span>⏷</div>
      <div class="count">
        共有<span>"{{ music.songlist.total || '' }}"</span>歌单</div>
      <nav>
        <ul>
          <li>
            <div class="catall">{{ arr1.all.name }}</div>
          </li>
          <template v-for="(p, key) of arr1.categories">
            <li>
              <div class="tags">{{ p }}</div>
              <div class="cat">
                <div v-for="s in arr1.sub.filter((a: any) => a.category == key)"
                  :class="{ 'key': route.query.value === s.name }" @click="id(s.name)">
                  {{ s.name }}
                  <span v-if="s.hot">HOT</span>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </nav>
    </div>
    <div class="hotcat">
      <div>热门标签:&nbsp;&nbsp;</div>
      <template v-for="(p, index) in arr.tags">
        <div @click="id(p.name)" :class="{ click: route.query.value === p.name }">{{ p.name }}</div>
        <span>{{ arr.tags.length > index + 1 ? '|' : '' }}</span>
      </template>
    </div>
    <transition name="song" mode="out-in">
      <recommend class="a" v-if="music.datahove">
        <li v-if="music.toptags.find((s: any) => s.name === route.query.value) && data.offset <= 1"
          @click="tohigh(String(route.query.value))" style="cursor: pointer;">
          <div class="hotsonglist">
            <div>精品歌單 ></div>
          </div>
          <span class="topath">精⭐品⭐歌單傾心推薦,給最懂YY的你</span>
        </li>
        <li v-for="p  of music.songlist.playlists" :key="p.id" @click="">
          <div>
            <div class="w">播放:
              {{ p.playCount > 9999 ? `${String(p.playCount).replace(/\d{4}$/, '')}万` : p.playCount }}
            </div>
          </div>
          <img :src="`${p.coverImgUrl}?param=400y400`">
          <div class="lastSong">
            <div class="name">曲数:<span>{{ p.trackCount }}</span></div>
            <div class="playlist iconfont icon-bofang" @click="tomusic(p.id)"></div>
          </div>
          <span class="topath" @click="topath(p.id)">{{ p.name }}</span>
          <span class="topath topath1" style="color: var(--ThemeC10);" @click.stop="touser(p.creator.userId)">
            by {{ p.creator.nickname }}</span>
        </li>
      </recommend>
      <div v-else style="text-align: center;">加载中...</div>
    </transition>
    <pagination ref="off" v-if="music.songlist.total > 50" :pagin="pagin" :total="music.songlist.total" :limit="50">
    </pagination>
  </div>
</template>

<style lang="scss" scoped>
.song-enter-active,
.song-leave-active {
  transition: opacity 0.2s ease;
}

.song-enter-from,
.song-leave-to {
  opacity: 0;
}

@import './index.scss'
</style>