<script setup lang="ts">
import { computed, ref } from "vue";
import { playmusic, user } from '@/store/index';
import { usertab } from "@/types/user";
let userlogin = user();
let play = playmusic();
let el = ref<usertab>(usertab.phone);
let Exp = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
let emit = defineEmits(['logininfo']);
let elint = computed(() => {
  if (el.value === usertab.phone) {
    if (!Exp.test(userlogin.user.account)) {
      return '手机号格式不正确';
    }
    return '✓';
  }
});
function idlogin() {
  if (el.value === usertab.phone) {
    if (Exp.test(userlogin.user.account) && userlogin.user.password) {
      userlogin.login().then((res: any) => {
        play.sukiarr = res;
      });
      emit('logininfo');
    }
    return;
  }
  el.value === usertab.email ? userlogin.emaillogin() : userlogin.uidlogin();
  emit('logininfo');
}
</script>
<template>
  <div ref="target" @mouseup.stop class="login">
    <div class="time">(响应可能有点慢)</div>
    <div class="elintH">
      <div class="login-top">{{ el }}登錄</div>
      <div v-if="el !== usertab.UID">
        <p>{{ el }}: <input type="text" v-model="userlogin.user.account" :placeholder="el" class="login-user"></p>
        <div class="login-elint">{{ elint }}</div>
        <p>密码: <input type="password" v-model="userlogin.user.password" class="login-user" @keydown.enter="idlogin">
        </p>
      </div>
      <div v-else>
        <p>{{ el }}: <input type="text" v-model="userlogin.user.password" :placeholder="el" class="login-user"
            @keydown.enter="idlogin"></p>
        <div class="login-elint"><i>https://music.163.com/</i><br />?id=後面的數字<br />再把cookie複製到本地存儲cookie</div>
      </div>
    </div>
    <div class="phea">
      <a @click="el = usertab.phone">手機登錄</a> |
      <a @click="el = usertab.email">郵箱登錄</a> |
      <a @click="el = usertab.UID">UID登录</a>
    </div>
    <button @click="idlogin">确定</button>
  </div>
</template>

<style lang="scss" scoped>
.login {
  width: 30rem;
  height: 40rem;
  background-color: $ThemeC5;
  position: absolute;
  border: 2px solid $ThemeC1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 99;
  box-shadow: 0 0 0 999rem rgba($color: #000000, $alpha: .2);

  .elintH {
    height: 13.5rem;
  }

  .time {
    font-size: 1.2rem;
    text-align: center;
    color: $ThemeC3;
    font-weight: bold;
  }

  .phea {
    font-size: 1.4rem;
    text-align: center;
    cursor: pointer;
    margin: 3rem 0;
  }

  &-top {
    font-size: 2rem;
    text-align: center;
    color: $ThemeC3;
    font-weight: bold;
    margin-bottom: 5rem;
  }

  p {
    margin-left: 4.5rem;
    position: relative;
    display: block;
    font-size: 1.5rem;
    color: $ThemeC3;

    &::before {
      content: "";
      position: absolute;
      left: 3.8rem;
      bottom: -1px;
      width: 17rem;
      transform: scaleX(1);
      height: 2px;
      background:
        linear-gradient(90deg, $ThemeC9 100%, #ffffff) no-repeat 0 100%/100% 100%;
    }

    &::after {
      content: "";
      position: absolute;
      left: 3.8rem;
      bottom: -1px;
      width: 17rem;
      transform: scaleX(0);
      height: 2px;
      background:
        linear-gradient(90deg, #ff6889, #44e72e, #d7ec14) no-repeat 0 100%/100% 100%;
      transition: transform .5s;
      transform-origin: 100% 0;
    }

    &:focus-within::after {
      transform: scaleX(1);
      transform-origin: 0 0;
    }

    input {
      font-size: 1.5rem;
    }
  }

  &-user {
    width: 17rem;
    outline: none;
    border: 0;
  }

  &-elint {
    margin-left: 8.3rem;
    height: 2rem;
    margin-top: 1px;
    color: red;
    font-size: 1.4rem;
  }

  button {
    display: block;
    width: 5rem;
    font-size: 1.5rem;
    margin: 0 auto;
    background-color: $ThemeC5;
    border: 2px solid $ThemeC22;
    transition: .2s;

    &:active {
      background-color: $ThemeC2;
      border: 2px solid $ThemeC22;
    }
  }
}
</style>