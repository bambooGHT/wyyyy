<script setup lang="ts">
import daytime from '@/utils/day-prce';
import { album } from '@/store';
import { storeToRefs } from 'pinia';
import { useRouter } from "vue-router";
const router = useRouter();
const Album = album();
const { albumlist } = storeToRefs(Album);
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
};
</script>

<template>
  <div class="album-info">
    <div class="img">
      <img :src="albumlist.album.picUrl">
    </div>
    <div class="info">
      <div class="name" :title="albumlist.album.name">{{ albumlist.album.name }}</div>
      <div class="info-1">
        <div class="allmusic">
          <div @click="Album.playall">播放全部</div>
          <div @click="Album.playpush">+</div>
        </div>
        <div>收藏</div>
        <del>分享</del>
      </div>
      <div class="info-2">
        <div>歌手:
          <nav v-for="(p, index) of albumlist.album.artists">
            <span class="al" @click="toartist(p.id)">{{ p.name }}</span>
            {{ albumlist.album.artists.length > index + 1 ? '/' : '' }}
          </nav>
        </div>
        <div>发布时间:{{ daytime.formatDate(new Date(albumlist.album.publishTime)) }}</div>
        <div>曲数:{{ albumlist.album.size }}</div>
      </div>
    </div>
  </div>
  <div class="album-info1">
    <div>专辑信息:</div>
    <div>{{ albumlist.album.subType }}</div>
    <div>{{ albumlist.album.description }}</div>
  </div>
</template>

<style lang="scss" scoped>
.album-info {
  height: clamp(17rem, 16vw, 25rem);
  display: flex;
  margin-top: 2rem;
  margin-left: 2rem;
  font-size: 1.3rem;

  .img {
    width: clamp(15rem, 14vw, 22rem);
    height: clamp(15rem, 14vw, 22rem);
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 2rem 0.5rem rgba(#000000, .7);

    img {
      display: block;
      width: 100%;
      height: 100%;
      transform: translate(5px, 5px);
    }
  }

  .info {
    margin-left: 4rem;

    .name {
      font-size: clamp(1.7rem, 1.5vw, 2.5rem);
    }

    &-1 {
      display: flex;
      font-size: 1.5rem;
      margin-top: 1rem;

      div:hover {
        cursor: pointer;
        color: $ThemeC22;
      }

      div {
        margin: 0 1rem;
      }

      .allmusic {
        display: flex;
        border-bottom: 1px solid $ThemeC3;

        &:hover {
          border-bottom: 1px solid $ThemeC22;

        }

        div {
          margin: 0 0.3rem;

          &:nth-child(2) {
            font-size: 2.5rem;
            vertical-align: top;
            line-height: 0.7;
          }
        }
      }
    }

    &-2 {
      div {
        margin-top: 2rem;
      }

      nav {
        display: inline-block;
      }

      .al:hover {
        cursor: pointer;
        color: $ThemeC22;
      }
    }
  }
}

.album-info1 {
  margin-left: 2rem;
  font-size: clamp(1.5rem, 1.3vw, 1.8rem);
  white-space: pre-wrap;
  div:nth-child(1) {
    font-size: clamp(1.7rem, 1.5vw, 2.5rem);
  }
}
</style>