<script setup lang="ts">
import list from "@/components/list.vue";
import { songlist } from '@/store/index';
import { onMounted } from "vue";
const Song = songlist();
onMounted(async () => {
  await Song.usersong();
});

</script>

<template>
  <div>
    <div class="n1">
      <div class="t">
        <span>{{ new Date().toLocaleString('zh-cn', { weekday: "long" }) }}</span>
        <br />
        <span>{{ new Date().getDate() }}</span>
        <span></span>
      </div>
      <div class="t1">
        <p>每日歌曲推荐</p>
        <p>根据你的音乐口味生成,每天6:00点更新</p>
        <button @click="Song.playlistreplace">播放全部</button>
        <button @click="Song.playlistpush">添加到列表</button>
      </div>
    </div>
    <list>
      <template #vip="vipProps">
        <span v-if="vipProps.sq" class="vip">SQ</span>
        <span v-if="vipProps.t === 1" class="vip">VIP</span>
        <span v-if="vipProps.hr" class="vip">Hi-Res</span>
      </template>
    </list>
  </div>
</template>

<style lang="scss" scoped>
.n1 {
  display: flex;
  margin-top: 3rem;
  margin-left: 5rem;
}

.t {
  width: clamp(12rem, 12vw, 14rem);
  height: clamp(12rem, 12vw, 14rem);
  text-align: center;
  border: 1px solid rgba(161, 161, 161, 0.411);
  box-sizing: border-box;

  span {
    display: inline-block;
    font-size: 7rem;
    margin-top: 1rem;

    &:nth-child(1) {
      font-size: 2rem;
    }
  }
}

.t1 {
  font-size: 2rem;
  margin-left: 2rem;

  p:nth-child(1) {
    margin-top: 2rem;
  }

  p:nth-child(2) {
    font-size: 1.3rem;
    margin-top: 3rem;
  }

  button {
    font-size: 1.5rem;
    margin: 1rem 0.5rem;
  }
}

@import '@/components/vip.scss';
</style>