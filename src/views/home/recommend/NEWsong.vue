<script setup lang="ts">
import { newsong } from '@/server/hmusic';
import { search } from '@/store';
import type { NEWsong } from '@/types/Hmusic';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const Search = search();
let nesongs = ref<NEWsong[]>();
onMounted(() => {
  newsong().then((res: any) => {
    nesongs.value = res.result;
  });
});
const router = useRouter();
const toar = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
};
const tonew = () => {
  router.push({
    path: 'h-new',
    query: {
      type: 0
    }
  });
};
</script>

<template>
  <div>
    <div class="box">
      <div>最新音乐</div>
      <div @click="tonew" style="cursor:pointer;">更多 ></div>
    </div>
    <hr class="hr" />
    <ul class="newmusic" v-if="nesongs">
      <li v-for="(p, index) in nesongs" @dblclick="Search.songsplay(p.id)">
        <div class="index">{{ index < 10 ? `0${index + 1}` : index }}</div>
            <div class="img iconfont icon-bofang" @click.stop="Search.songsplay(p.id)">
              <img :src="`${p.picUrl}?param=50y50`" alt="">
            </div>
            <div class="id">
              <div>{{ p.name }}</div>
              <div class="ar" :title="p.song.artists.map((i:any) => i.name).join(' / ')">
                <nav v-for="(s, index) in p.song.artists">
                  <span class="click" @click.stop="toar(s.id)">{{ s.name }}</span>
                  <span class="copy">{{ p.song.artists.length > index + 1 ? ` /&nbsp` : '' }}</span>
                </nav>
              </div>
            </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.hr {
  margin: 1rem 4rem;

}

.click:hover {
  color: $ThemeC22;
  cursor: pointer;
}

.box {
  display: flex;
  justify-content: space-between;
  margin: 4rem 4rem 0;
  font-size: 1.7rem;
}

.newmusic {
  display: flex;
  flex-direction: column;
  height: 30rem;
  width: auto;
  flex-wrap: wrap;
  box-sizing: content-box;
  border: 1px solid $ThemeC9;
  margin: 0 4rem;

  li {
    width: 50%;
    height: 6rem;
    display: flex;
    align-items: center;

    .index {
      width: 3rem;
    }

    .img {
      position: relative;
      width: 4rem;
      height: 4rem;
      cursor: pointer;

      &::before {
        font-size: 2rem;
        height: 2rem;
        width: 2rem;
        position: absolute;
        display: block;
        top: -0.5rem;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 2;
        color: #fff;
        display: none;
      }

      img {
        width: 4rem;
        height: 4rem;
        vertical-align: sub;
      }
    }

    .id {
      margin-left: 1rem;
      width: 100%;
      overflow: hidden;

      .ar {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: auto;
      }

      nav {
        display: inline-block;

        .copy {
          color: $ThemeC10;

        }
      }

      div {
        font-size: 1.4rem;
        padding: 0.2rem 0;
      }
    }

    &:nth-child(-n+5):nth-child(2n) {
      background-color: $ThemeC7;
    }

    &:nth-last-child(-n+5):nth-child(odd) {
      background-color: $ThemeC7;
    }

    &:hover {
      background-color: $ThemeC8 !important;

      .img {
        &:after {
          content: '';
          width: 100%;
          height: 100%;
          left: 0;
          position: absolute;
          background-color: rgba($color: #000000, $alpha: .5);
          z-index: 1;
        }

        &::before {
          display: block;
        }
      }
    }
  }
}
</style>