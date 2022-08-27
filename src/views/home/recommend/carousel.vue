<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Hmusic } from '@/store/index';
import type { banner } from '@/types/Hmusic';
import { useRouter } from 'vue-router';
import { currentlist } from '@/hooks/music';

const home = Hmusic();
const router = useRouter();
home.ban();

const radio = ref(0);
const input = ref<any>([]);
const click = (num: number, p: banner) => {
  if (radio.value === num) {
    //判断类型

    p.targetType === 3000 && window.open(p.url);
    p.targetType === 1 && home.play(p.song);
    p.targetType === 10 && router.push({ path: `/album/${p.targetId}` });
    p.targetType === 1002 && router.push({ path: `/user/${p.targetId}` });
    p.targetType === 1009 && router.push({ path: `/radio/${p.targetId}` });
    p.targetType === 1000 && (() => {
      router.push({ path: `/song/${p.targetId}` });
      currentlist.value = true;
    })();
    return;
  }
  radio.value = num;
  i = num;
};
let time = -1;
let i = 1;
const times = () => {
  time = setTimeout(() => {
    if (i == 7) {
      i = 0;
    }
    radio.value = i;
    input.value[i].checked = true;
    i++;
    times();
  }, 3000);
};
const enter = () => {
  clearTimeout(time);
};
const leave = () => {
  times();
};
onMounted(() => {
  times();

});
onBeforeUnmount(() => {
  clearTimeout(time);
  input.value = '';
});
</script>

<template>
  <div id="slider" @mouseenter="enter" @mouseleave="leave">
    <input :ref="el => { if (el) input[index] = el; }" :key="index" v-for="(p, index) of home.banner.slice(0, 7)"
      @click="click(index, p)" type="radio" name="slider" :id="`s${1 + index}`" :checked="radio === index">
    <div class="tab">
      <label class="not" v-for="(p, index) of home.banner.slice(0, 7)" :class="{ copy: radio === index }"
        :for="`s${1 + index}`">
        {{ 1 + index }}
      </label>
    </div>
    <label v-for="(p, index) of home.banner.slice(0, 7)" :for="`s${1 + index}`" :id="`ss${1 + index}`">
      <img :src="p.pic" alt="">
      <div class="txt">{{ p.typeTitle }}</div>
    </label>
  </div>
</template>

<style lang="scss" scoped>
@import './car.scss';

@for $i from 1 to 8 {

  #{'#s1'}:checked~#{'#ss'+$i},
  #{'#s2'}:checked~#{'#ss'+ if($i == 7, $i - 6,$i+1)},
  #{'#s3'}:checked~#{'#ss'+if($i+2 > 7, $i - 5,$i+2)},
  #{'#s4'}:checked~#{'#ss'+if($i+3 > 7, $i - 4,$i+3)},
  #{'#s5'}:checked~#{'#ss'+if($i+4 > 7, $i - 3,$i+4)},
  #{'#s6'}:checked~#{'#ss'+if($i+5 > 7, $i - 2,$i+5)},
  #{'#s7'}:checked~#{'#ss'+if($i+6 > 7, $i - 1,$i+6)} {
    @if $i==1 {
      box-shadow: 0 14px 26px 0 rgba($color: #000000, $alpha: 0.3), 0 12px 8px 0 rgba($color: #000000, $alpha: 0.2);
      transform: translate3d(0, 0, 0);
      z-index: 5;

      &::before {
        background-color: rgba($color: #000000, $alpha: 0);
      }
    }

    @else if $i==2 {
      box-shadow: 0 10px 10px 0 rgba($color: #000000, $alpha: 0.3), 0 6px 8px 0 rgba($color: #000000, $alpha: 0.2);
      transform: translate3d(25%, 0, -6.83rem);
      left: 14%;
      z-index: 4;

      @media screen and (max-width:1200px) {
        transform: translate3d(0%, 0, 0px);
        left: 30%;
      }
    }

    @else if $i==3 {
      box-shadow: 0 4px 10px 0 rgba($color: #000000, $alpha: 0.3), 0 6px 6px 0 rgba($color: #000000, $alpha: 0.2);
      transform: translate3d(15%, 0, -8.4rem);
      left: 50%;
      z-index: 3;

      @media screen and (max-width:1500px) {
        opacity: 0;
      }
    }

    @else if $i==4 {
      transform: translate3d(100%, 0, -300px);
      z-index: 2;
      opacity: 0;
    }

    @else if $i==5 {
      transform: translate3d(-100%, 0, -300px);
      z-index: 2;
      opacity: 0;
    }

    @else if $i==6 {
      box-shadow: 0 4px 10px 0 rgba($color: #000000, $alpha: 0.3), 0 6px 6px 0 rgba($color: #000000, $alpha: 0.2);
      transform: translate3d(-15%, 0, -8.4rem);
      left: -50%;
      z-index: 3;

      @media screen and (max-width:1500px) {
        opacity: 0;
      }
    }

    @else if $i==7 {
      box-shadow: 0 10px 10px 0 rgba($color: #000000, $alpha: 0.3), 0 6px 8px 0 rgba($color: #000000, $alpha: 0.2);
      transform: translate3d(-25%, 0, -6.83rem);
      left: -14%;
      z-index: 4;

      @media screen and (max-width:1200px) {
        transform: translate3d(0%, 0, 0px);
        left: -30%;
      }
    }
  }
}
</style>