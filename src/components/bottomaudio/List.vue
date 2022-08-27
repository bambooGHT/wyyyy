<script setup lang="ts">
import { ref } from 'vue';
import daytime from '@/utils/day-prce';
import { playmusic, songlist } from '@/store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const play = playmusic();
const { palymusiclist, History } = storeToRefs(play);
const router = useRouter();
let song = songlist();
let Mosk = ref(true);
let b = ref(true);
let macks = ref('none');

//遮罩層
const click = () => {
  macks.value = 'none';
  Mosk.value = !Mosk.value;
  window.removeEventListener('click', click);
};
const res = () => {
  macks.value = 'block';
  Mosk.value = !Mosk.value;
  window.addEventListener('click', click);
};

const allempty = () => {
  play.allempty();
};
const indexempty = (index: number) => {
  console.log(play.palymusiclist[index].id, play.currentmusicinfo.id);
  if (play.palymusiclist[index].id === play.currentmusicinfo.id) {
    play.musicnext();
  }
  play.palymusiclist.splice(index, 1);
  play.palymusiclist.length < 1 && allempty();
};
//跳轉 歌手
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
  click();
};
//跳轉 歌手
const toradio = (id: number) => {
  router.push({
    path: `/radio/${id}`
  });
  click();
};
</script>

<template>
  <div>
    <div class="mask"></div>
    <div class="iconfont icon-bofangliebiao ili" @click.stop="res()">
      <transition name="playlist">
        <span v-if="palymusiclist.length > 0 && Mosk" class="list">
          {{ palymusiclist.length > 999 ? 999 + '^' : palymusiclist.length }}</span>
      </transition>
      <transition name="playlist">
        <div v-if="!Mosk" class="plist" @click.stop>
          <div class="top">
            <div class="tab">
              <div class="tab-a" :class="{ 'colors': b }" @click="b = true">当前列表</div>
              <div class="tab-a" :class="{ 'colors': !b }" @click="b = false; play.recentplay()">历史记录</div>
            </div>
            <div class="hr"></div>
            <div class="t">
              <span>共{{ b ? palymusiclist.length : History.length }}首</span>
              <span @click="allempty" class="t-1">清空</span>
            </div>
            <div class="hr"></div>
            <ul class="nav-center" :class="{ 'nav-center1': !b }">
              <li>
                <div>播放</div>
                <div>曲名</div>
                <div>歌手/电台</div>
                <div>時間</div>
                <div></div>
              </li>
            </ul>
          </div>
          <div class="nav">
            <ul v-if="b" class="nav-center">
              <li v-for="(p, index) in play.palymusiclist" :class="{ 'red': play.currentmusicinfo.id === p.id }">
                <div class="iconfont icon-bofang  not" @click="play.clickplay(p, index)"></div>
                <div :title="p.name + `${p.tns ? `${p.tns[0]}` : ''}`">
                  <article>
                    <nav>{{ p.name }}</nav><span class="tns" v-if="p.tns">({{ p.tns[0] }})</span>
                  </article>
                  <article>
                    <slot name="vip" :t="p.fee" :sq="p.sq" :hr="p.hr"></slot>
                  </article>
                </div>
                <div v-if="!p.dj">
                  <span v-for="(s, index) in p.ar" :title="p.ar.map((ar: any) => ar.name).join('/')">
                    <nav @click="toartist(s.id)">{{ s.name }}</nav>{{ p.ar.length > index + 1 ? '/' : '' }}
                  </span>
                </div>
                <div v-else>
                  <nav @click="toradio(p.radio.id)">{{ p.radio.name }}</nav>
                </div>
                <div>{{ daytime.formatime(new Date(p.dt ? p.dt : p.duration)) }}</div>
                <div @click="indexempty(index)" class="t-1">&#10006</div>
              </li>
            </ul>
            <ul v-else class="nav-center nav-center1">
              <li v-for="t in History">
                <div class="iconfont icon-bofang not" @click="song.splay1(t.id)"></div>
                <div :title="t.name + `${t.alia.length > 0 ? `${t.alia[0]}` : ''}`">
                  <article>
                    <nav>{{ t.name }}</nav><span class="tns" v-if="t.alia.length > 0">({{ t.alia[0] }})</span>
                  </article>
                  <article>
                    <slot name="vip" :t="t.fee" :sq="t.sq" :hr="t.hr"></slot>
                  </article>
                </div>
                <div>
                  <span v-for="(q, index) in t.ar" :title="t.ar.map((ar: any) => ar.name).join('/')">
                    <nav @click="toartist(q.id)">{{ q.name }}</nav>{{ t.ar.length > index + 1 ? '/' : '' }}
                  </span>
                </div>
                <div>{{ daytime.historytime(t.playTime) }}</div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>

</template>

<style lang="scss" scoped>
@import './List.scss';

.red {
  color: $ThemeC22;
  cursor: pointer;
}

nav {
  display: inline;
}

.tns {
  color: $ThemeC10;
}

.mask {
  display: v-bind(macks);
}

.t-1:hover {
  @extend .red;
}
</style>