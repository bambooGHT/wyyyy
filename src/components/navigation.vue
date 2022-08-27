<script setup lang="ts">
import { user } from '@/store/index';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { d } from '@/hooks/nav';
import { currentlist } from '@/hooks/music';
const router = useRouter();
let nav = [
  { name: '發現音楽', path: '/', icon: 'icon-icon-test' },
  { name: '个性推薦', path: '/userrecommend', icon: 'icon-tuijian' },
  { name: 'M V', path: '/', icon: 'icon-bofang' },
  { name: '關於項目', path: '/songlist', icon: 'icon-guanyu' }
];
let topath = (index: number) => {
  router.push({
    path: `/song/${index}`,
  });
  currentlist.value = true;
};
let toindex = (p: string) => {
  router.push({
    path: p,
  });
  d.value = true;
};
let touser = (id: number, index: number) => {
  router.push({
    name: `user`,
    params: {
      id,
      index
    }
  });
  d.value = true;
};
const users = user();
const { usersong, usersongSub } = storeToRefs(users);
</script>

<template>
  <div class="nav">
    <img src="@/assets/wyyyy.jpeg" alt="">
    <hr />
    <ul class="nav-ul">
      <li v-for="(p, index) in nav" :key="index" @click="toindex(p.path)">
        <span class="iconfont" :class="p.icon"></span>
        {{ p.name }}
      </li>
    </ul>
    <div class="nav-song" v-if="usersong.length > 0">創建的歌單</div>
    <div class="nav-ul">
      <div :title="item.name" class="song" v-for="(item, index) in usersong.slice(0, 10)" :key="index"
        @click="topath(item.id)">
        {{ item.name }}
      </div>
      <div v-if="usersong.length > 10"><span class="click" @click="touser(users.uname.profile.userId, 1)">//查看更多</span>
      </div>
      <div class="nav-song" v-if="usersongSub.length > 0">收藏的歌單</div>
      <div class="nav-ul">
        <div :title="item.name" class="song" v-for="(item, index) in usersongSub.slice(0, 10)" :key="index"
          @click="topath(item.id)">
          {{ item.name }}
        </div>
        <div v-if="usersongSub.length > 10"><span @click="touser(users.uname.profile.userId, 0)"
            class="click">//查看更多</span></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.click {
  color: #858585;
  width: auto;

  &:hover {
    cursor: pointer;
    color: $ThemeC22;
  }
}

.nav {
  width: 22%;
  max-width: 30rem;
  min-width: 23rem;
  height: 100%;
  overflow: hidden;
  position: sticky;
  overflow-y: auto;
  top: 0;
  bottom: 0;
  background-color: #ececec;

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

  &-ul {
    color: #464646;
    font-size: 1.6rem;

    li {
      padding: 0.5rem 0 0.5rem 3.5rem;
      cursor: pointer;

      &:hover {
        background-color: #c7c7c7;
      }

      span {
        font-size: 1.9rem;
      }
    }

    .song {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      width: auto;
      padding: 0.8rem 0 0.8rem 3.5rem;

      &:hover {
        background-color: #c7c7c7;
      }
    }
  }

  &-song {
    font-size: 1.5rem;
    color: #858585;
    margin: 1rem;
  }

  img {
    width: 60%;
    display: block;
    margin: 1rem auto;
  }
}
</style>
