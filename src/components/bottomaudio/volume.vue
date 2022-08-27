<script setup lang="ts">
import { playmusic } from '@/store';
import daytime from '@/utils/day-prce';
import { watch } from 'vue';
import audio from '@/hooks/audio';
import { storeToRefs } from 'pinia';
const play = playmusic();
let { backsize1 } = storeToRefs(play);
watch(() => play.Player.volume, (newvalue) => {
  backsize1.value = daytime.percentage(newvalue, 1);
  audio.volume = newvalue;
});
</script>

<template>
  <div class="volume">
    <input type="range" min="0" max="1" step="0.1" v-model="play.Player.volume"
      @input="play.Player.volume = Number(($event.target as HTMLInputElement).value)">
  </div>
</template>

<style lang="scss" scoped>
input {
  width: 6.5rem;
  outline: 0;
  background-color: transparent;
  vertical-align: middle;
  -webkit-appearance: none;
  cursor: pointer;
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
  background: -webkit-linear-gradient(left, $ThemeC2, #4890e2) no-repeat, #ebebeb;
  background-size: v-bind(backsize1);
}

input::-webkit-slider-thumb:active {
  background-color: #38caff;
  box-shadow: 0 0 0.7rem rgba($color: #000000, $alpha: .3);
}

.volume {
  margin: 0 1rem;
  position: relative;
  margin: auto 0.8rem;

}
</style>