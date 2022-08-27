<script setup lang="ts">
import { ref } from 'vue';
import { user, album } from '@/store';
import { useRoute } from 'vue-router';
import daytime from '@/utils/day-prce';
import { throttle } from '@/utils/throttle';

const User = user();
const route = useRoute();
let all = ref(0);
let index = ref(-1);
const Album = album();
const usehot = (type: number) => {
  all.value = type;
  User.useRecord({ uid: Number(route.params.id), type });
};

//點擊高亮
let libackg = (i: number) => {
  index.value = i;
};
await User.useRecord({ uid: Number(route.params.id), type: 0 });

const sikus = (id: number) => {
  throttle(() => {
    Album.deadd(id);
  }, 1200);
};
</script>

<template>
  <div>
    <div class="s">
      <span @click="usehot(1)" :class="{ 'copy': !all }">最近一周</span> |
      <span @click="usehot(0)" :class="{ 'copy': all }">所有時間</span>
    </div>
    <ul class="li">
      <li class="D">
        <div>#</div>
        <div>操作</div>
        <div>曲名</div>
        <div></div>
      </li>
    </ul>
    <ul class="li">
      <li v-for="(p, indexs) of User.userhot" @click="libackg(indexs)" @dblclick="Album.play(p.song.id)"
        :class="{ 'copy': p.song.privilege.cp === 0, liback: indexs === index }">
        <div>{{ 1 + indexs }}</div>
        <div :class="{ 'liked': Album.sukiarr.indexOf(p.song.id) != -1 }" @click="sikus(p.song.id)">喜歡</div>
        <div :title="`${p.song.name}${p.song.alia[0] ? `(${p.song.alia[0]})` : ''}`">
          <article>
            <span class="click">{{ p.song.name }}</span>
            <span class="copy" v-if="p.song.alia[0]">({{ p.song.alia[0] }})</span>
          </article>
          <article>
            <slot name="vip" :t="p.song.fee" :sq="p.song.sq" :hr="p.song.hr"></slot>
          </article>
        </div>
        <div class="hot" :style="{ 'background-size': `${daytime.percentage(p.score, 100)}` }">
          <span class="h" v-if="p.playCount !== 0">{{ p.playCount }}次</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.liback {
  background-color: $ThemeC9  !important;
}

.copy {
  color: $ThemeC10;
}

.s {
  span {
    font-size: clamp(1.3rem, 1.2vw, 1.5rem);

    &:hover {
      cursor: pointer;
      color: $ThemeC22;
    }
  }
}

.li {
  .click:hover {
    color: $ThemeC22;
    cursor: pointer;
  }

  .copy {
    color: $ThemeC10;
  }

  .liked {
    color: $ThemeC22;
  }

  li {
    display: flex;

    &:nth-child(2n) {
      background-color: $ThemeC7;
    }

    &:not(.D):hover {
      background-color: $ThemeC8;
    }

    .hot {
      background: -webkit-linear-gradient(left, $ThemeC2, $ThemeC2) no-repeat, #ffffff00;
      .h {
        color: $ThemeC3  !important;
      }
    }

    &:not(.D) div:nth-child(2) {
      cursor: pointer;
    }

    div {
      font-size: clamp(1.4rem, 1.2vw, 1.6rem);
      padding: 0.9rem 0;
      padding-right: 0.5rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &:nth-child(1) {
        width: 5rem;
        text-align: center;
      }

      &:nth-child(2) {
        width: 4rem;
      }

      &:nth-child(3) {
        flex: 1.5;
      }

      &:nth-child(3) {
        display: flex;
        text-overflow: clip;

        article:nth-child(1) {
          overflow: hidden;
          white-space: nowrap;
          width: min-content;
          text-overflow: ellipsis;
        }

        article:nth-child(2) {
          width: min-content;
        }
      }

      &:nth-child(4) {
        flex: 1;
      }
    }
  }
}
</style>