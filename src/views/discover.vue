<!-- <script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
interface banner {
  pic: string;//图片
  url: string;//url
  targetType: number;//资源类型
  targetId: number;//id
  typeTitle: string;//注释
}
const arr = [
  {
    "targetId": 2509701493,
    "targetType": 60001,
    "pic": "http://p1.music.126.net/_OSJ_RHEWgN4b2ZXRpWQig==/109951167790814882.jpg",
    "url": "orpheus://program/2509701493",
    "typeTitle": "明星专区",
    "exclusive": false
  },
  {
    "targetId": 2509650736,
    "targetType": 60001,
    "pic": "http://p1.music.126.net/wfOcZLArAYZyEnRU_eN5RA==/109951167790833140.jpg",
    "url": "orpheus://program/2509650736",
    "typeTitle": "故事",
    "exclusive": false
  },
  {
    "targetId": 2509590714,
    "targetType": 60001,
    "pic": "http://p1.music.126.net/Ik00NHiMEmQtPrqA6uznOA==/109951167792945832.jpg",
    "url": "orpheus://program/2509590714",
    "typeTitle": "音乐推荐",
    "exclusive": false
  }
];


const radio = ref(0);
const input = ref<any>([]);
const click = (num: number, p: banner) => {
  if (radio.value === num) {
    return;
  }
  radio.value = num;
  i = num;
};
let time = -1;
let i = 0;
const times = () => {
  time = setTimeout(() => {
    if (i == 3) {
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
    <input :ref="el => { if (el) input[index] = el; }" :key="index" v-for="(p, index) of arr" @click="click(index, p)"
      type="radio" name="slider" :id="`s${1 + index}`" :checked="radio === index">
    <div class="tab">
      <label class="not" v-for="(p, index) of arr" :class="{ copy: radio === index }" :for="`s${1 + index}`">
        {{ 1 + index }}
      </label>
    </div>
    <label v-for="(p, index) of arr" :for="`s${1 + index}`" :id="`ss${1 + index}`">
      <img :src="p.pic" alt="">
      <div class="txt">{{ p.typeTitle }}</div>
    </label>
  </div>
</template>

<style lang="scss" scoped>
@import '@/views/home/recommend/car.scss';

@for $i from 1 to 4 {

  #{'#s1'}:checked~#{'#ss'+$i},
  #{'#s2'}:checked~#{'#ss'+ if($i == 3, $i - 2,$i+1)},
  #{'#s3'}:checked~#{'#ss'+if($i+2 > 3, $i - 1,$i+2)} {
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
</style> -->