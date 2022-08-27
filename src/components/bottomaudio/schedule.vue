<script setup lang="ts">
import { watch } from 'vue';
import daytime from '@/utils/day-prce';
import { playmusic } from '@/store';
import { storeToRefs } from 'pinia';
const play = playmusic();
play.canplay();
const { Player, backsize, WIDTH, current } = storeToRefs(play);
//改變進度條
watch(() => Player.value.currentTime, (newvalue) => {
  //如果在控制滚动条
  if (!current.value) return;
  play.RangeTime = newvalue;
  //如果值为0
  if (newvalue == 0) {
    backsize.value = '0%';
    return;
  }
  backsize.value = daytime.percentage(newvalue, Player.value.initialDuration);
});
let size = (e: any) => {
  play.RangeTime = e.target.value;
  backsize.value = daytime.percentage(Number(e.target.value), Player.value.initialDuration);
};
const down = () => {
  if (Player.value.initialDuration < 1) return;
  current.value = false;
};
</script>

<template>
  <input type="range" min="0" @mouseup="play.musicseup" @input="size" :max="Player.initialDuration" @mousedown="down"
    :value="play.RangeTime">
</template>

<style lang="scss" scoped>
input {
  width: 100%;
  outline: 0;
  height: 5px;
  background-color: transparent;
  vertical-align: middle;
  -webkit-appearance: none;
  cursor: pointer;
  position: relative;

  &::before {
    position: absolute;
    width: v-bind(WIDTH);
    height: 100%;
    content: '';
    z-index: -1;
    border-radius: 20px;
    background: $ThemeC12
  }

  &::after {
    position: absolute;
    border-radius: 20px;
    width: 100%;
    height: 100%;
    content: '';
    z-index: -2;
    background: $ThemeC11
  }
}

input::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  margin-top: -5px;
  box-shadow: 0 0 0.7rem rgba($color: #000000, $alpha: .5);
  background-color: #00bbff;
}

input::-moz-range-thumb {
  -moz-appearance: none;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: #00bbff;
  box-shadow: 0 0 0.7rem rgba($color: #000000, $alpha: .5);
}

input::-ms-thumb {
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: #00bbff;
  box-shadow: 0 0 0.7rem rgba($color: #000000, $alpha: .5);
}

input::-webkit-slider-runnable-track {
  height: 5px;
  border-radius: 20px;
  background: -webkit-linear-gradient(left, $ThemeC2, #4890e2) no-repeat;
  background-size: v-bind(backsize);
}

input::-webkit-slider-thumb:active {
  background-color: #38caff;
}
</style>