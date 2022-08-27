<script setup lang="ts">
import navigation from '@/components/navigation.vue';
import topuser from '@/components/topuser.vue';
import bottomaudio from './components/bottomaudio/index.vue';
import lyric from './components/lyric.vue';
import { data } from '@/hooks/nav';
const { tran, lyricshow, e, macks } = data();
</script>

<template>
  <div class="box" id="box">
    <navigation />
    <div class="box-right">
      <topuser />
      <div class="tran" ref="tran">
        <router-view v-slot="{ Component, route }">
          <transition name="list" mode="out-in">
            <component :is="Component" :key="route.params.id || route.name" />
          </transition>
        </router-view>
      </div>
      <div class="mask"></div>
      <transition name="T" mode="out-in">
        <lyric v-show="e" @lyricshow="lyricshow" />
      </transition>
      <bottomaudio @lyricshow="lyricshow" />
    </div>
  </div>
</template>

<style lang="scss">
html,
body,
#app {
  height: 100%;

  img {
    image-rendering: -webkit-optimize-contrast;
  }
}

body {
  position: relative;
  min-width: 1030px;
}

@mixin name {
  &::-webkit-scrollbar-track {
    border-radius: 2rem;
    background-color: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2rem;
    background-color: $ThemeC2;
  }

  &::-webkit-scrollbar {
    width: 0.6rem;
  }
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: v-bind(macks);
}

.T-enter-active,
.T-leave-active {
  transition: all 0.4s ease-out;
}

.T-enter-from {
  transform: translateY(200px);
  opacity: 0;
}

.T-enter-to,
.T-leave-from {
  transform: translateY(0px);
}

.T-leave-to {
  transform: translateY(200px);
  opacity: 0;
}


.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease-out;
}

.list-enter-from {
  transform: translateX(-200px);
  opacity: 0;
}

.list-enter-to,
.list-leave-from {
  transform: translateX(0px);
}

.list-leave-to {
  transform: translateX(200px);
  opacity: 0;
}


* {
  box-sizing: border-box;
}

.box {
  display: flex;
  height: 100%;

  &-right {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    @include name;

    .tran {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding-bottom: 1rem;
      padding-right: 0.5rem;
      overflow-x: hidden;
      @include name;
    }
  }
}

.ne {
  max-width: 150rem;
  margin: 0 auto;
}
</style>
