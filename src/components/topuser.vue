<script setup lang="ts">
import Login from './Login.vue';
import search from './search.vue';
import { onMounted, ref } from "vue";
import { themes } from "@/theme/index";
import { useruid, usersonglist, uservip, ids } from '@/server/user/index';
import { user, playmusic } from "@/store/index";
import { useRouter } from 'vue-router';
import { throttle } from '@/utils/throttle';

const play = playmusic();
onMounted(async () => {
  themes();
  if (localStorage.getItem('USERID')) {
    const usertag = await useruid(localStorage.getItem('USERID')!);
    uservip().then((res: any) => [
      users.userVIP = res.data
    ]);
    localStorage.setItem('USERVIP', usertag.profile?.vipType ?? 0);
    users.$patch((state) => {
      state.uname.profile = usertag.profile;
      state.uname.bool = true;
    });
    const result = await usersonglist({
      uid: Number(localStorage.getItem('USERID')), offset: 0
    });
    users.usersong = result.playlist.filter((s: { subscribed: boolean; }) => !s.subscribed);
    const result1 = await usersonglist({
      uid: Number(localStorage.getItem('USERID')), offset: usertag.profile.playlistCount - 1
    });
    users.usersongSub = result1.playlist.filter((s: { subscribed: boolean; }) => s.subscribed);
    ids(Number(localStorage.getItem('USERID')!)).then((res: any) => {
      localStorage.setItem('USERSUKILIST', JSON.stringify(res.ids));
      localStorage.setItem('USERSUKIID', result.playlist[0].id);
      play.sukiarr = res.ids;
    });
  }
});
const users = user();
const event = () => {
  login.value = false, window.removeEventListener('mouseup', event);
};
let login = ref(false);
const clicklogin = () => {
  login.value = true;
  window.addEventListener('mouseup', event);
};
let es = ref(false);
const router = useRouter();
const touser = (id: number) => {
  router.push({
    path: `/user/${id}`
  });
};
const logouts = () => {
  users.logouts();
  router.replace({
    path: `/`
  });
  es.value = !es.value;
};
const colors = () => {
  throttle(() => {
    if (localStorage.getItem('theme1') == '1') {
      themes(0);
      localStorage.setItem('theme1', '0');
      return;
    }
    themes(1);
    localStorage.setItem('theme1', '1');
  }, 600);
};
</script>

<template>
  <transition name="login">
    <Login v-if="login" @logininfo="event"></Login>
  </transition>
  <div class="top">
    <div class="top-path" @click="router.go(-1)">後退</div>
    <div class="top-path" @click="router.go(1)">前進</div>
    <search />
    <div class="login g" v-if="!users.uname.bool" @mouseup.stop="clicklogin"><span>點擊登錄</span></div>
    <div class="login g" v-else>
      <img :src="users.uname.profile.avatarUrl" alt="" @click="touser(users.uname.profile.userId)">
      <span @click="es = !es">{{ users.uname.profile.nickname }}</span>
    </div>
    <div v-if="es" @click="logouts" es="!es" class="g">退出登录</div>
    <div class="theme g" @click="colors">顔色切換</div>
  </div>
</template>

<style lang="scss" scoped>
.login-enter-active,
.login-leave-active {
  transition: 0.5s ease;
}

.login-enter-from,
.login-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.top {
  min-height: 4.5rem;
  width: 100%;
  background-color: $ThemeC1;
  display: flex;
  align-items: center;

  &-path {
    width: 4rem;
    height: 2.5rem;
    line-height: 2rem;
    cursor: pointer;
    font-size: 1.5rem;
    text-align: center;
    margin: 0 0.5rem;
    border: 1px solid $ThemeC22;

    &:hover {
      color: $ThemeC22;
    }
  }

  .g {
    font-size: 1.6rem;
    color: $ThemeC3;
    cursor: pointer;
  }

  .login {
    margin: 0 6rem;
    display: flex;
    align-items: center;

    & span:hover {
      color: $ThemeC22;
    }

    img {
      display: inline-block;
      width: 4rem;
      border-radius: 50%;
    }
  }

  .theme {
    margin-left: auto;
    margin-right: 2rem;
    user-select: none;
  }
}
</style>