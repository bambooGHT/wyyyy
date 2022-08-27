<script setup lang="ts">
import recommend from '@/views/userrecommend/recommend.vue';
import { topload } from '@/server/hmusic';
import { leadtype } from '@/types/Hmusic';
import { onMounted, ref } from 'vue';
import { songlist } from '@/store';
import { useRouter } from 'vue-router';
import { currentlist } from '@/hooks/music';

const arr = ref<leadtype[]>([]);
onMounted(() => {
  topload().then((res: any) => {
    arr.value = res.list;
  });
});

const router = useRouter();
const song = songlist();
const tomusic = (id: number) => {
  song.song(id).then(() => {
    song.playlistreplace();
  });
};

const topath = (id: number, nmae: string) => {
  router.push({
    path: `/song/${id}`,
    query: {
      value: nmae
    }
  });
  currentlist.value = true;
};
</script>

<template>
  <div>
    <div class="h1">官方榜</div>
    <hr />
    <recommend class="s">
      <li v-for="p of arr.slice(0, 4)" :key="p.id">
        <div>
          <div class="w">播放:
            {{ p.playCount > 9999 ? p.playCount > 99999999 ?
                `${String(p.playCount).replace(/\d{8}$/, '')}億` :
                `${String(p.playCount).replace(/\d{4}$/, '')}万` :
                p.playCount
            }}
          </div>
        </div>
        <img :src="`${p.coverImgUrl}?param=400y400`" alt="">
        <div class="lastSong">
          <div class="play">{{ p.updateFrequency }}</div>
          <div class="iconfont icon-bofang" @click="tomusic(p.id)"></div>
        </div>
        <span class="topath" @click="topath(p.id, p.name)">{{ p.name }}</span>
      </li>
    </recommend>
    <div class="h1 h2">全球榜</div>
    <hr />
    <recommend class="s">
      <li v-for="p of arr.slice(4)" :key="p.id">
        <div>
          <div class="w">播放:
            {{ p.playCount > 9999 ? p.playCount > 99999999 ?
                `${String(p.playCount).replace(/\d{8}$/, '')}億` :
                `${String(p.playCount).replace(/\d{4}$/, '')}万` :
                p.playCount
            }}
          </div>
        </div>
        <img :src="`${p.coverImgUrl}?param=400y400`" alt="">
        <div class="lastSong">
          <div class="play">{{ p.updateFrequency }}</div>
          <div class="iconfont icon-bofang" @click="tomusic(p.id)"></div>
        </div>
        <span class="topath" @click="topath(p.id, p.name)">{{ p.name }}</span>
      </li>
    </recommend>
  </div>
</template>

<style lang="scss" scoped>
@import '@/views/userrecommend/index.scss';

.h1 {
  font-size: 2rem;
}

.h2 {
  margin-top: 2rem;
}

hr {
  margin: 1rem 0 2rem;
  width: 80%;
}

.s {
  li {
    .lastSong {
      background: linear-gradient(0deg, #00000080, #00000080 60%);
      height: auto;
      color: aliceblue;
      padding: 0.7rem 0;

    }
  }
}
</style>