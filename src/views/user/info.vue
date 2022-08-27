<script setup lang="ts">
import { user } from '@/store';
import findCityZipCode from '@/utils/city';
const User = user();

</script>

<template>
  <div class="user-info" v-if="User.userINFO.profile">
    <div class="img">
      <img :src="`${User.userINFO.profile.avatarUrl}?param=500y500`">
    </div>
    <div class="info">
      <div class="name">{{ User.userINFO.profile.nickname }}
        <img v-if="User.userINFO.profile.avatarDetail" :src="User.userINFO.profile.avatarDetail.identityIconUrl" alt="">
        <slot></slot>
        <span v-if="User.userINFO.profile.mainAuthType">{{ User.userINFO.profile.mainAuthType.desc }}</span>
      </div>
      <hr />
      <div class="info-1">
        <div>
          <p>{{ User.userINFO.profile.eventCount }}</p>
          <p>動態</p>
        </div>
        <div>
          <p>{{ User.userINFO.profile.follows }}</p>
          <p>關注</p>
        </div>
        <div>
          <p>{{ User.userINFO.profile.followeds }}</p>
          <p>粉絲</p>
        </div>
      </div>
      <div class="info-2">
        <div>所屬地區:
          {{ findCityZipCode(User.userINFO.profile.province) }} -
          {{ findCityZipCode(User.userINFO.profile.city) }}
        </div>
        <div>纍計聽歌:{{ User.userINFO.listenSongs }}</div>
        <div>個人介紹:{{ User.userINFO.profile.signature }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-info {
  height: auto;
  background: linear-gradient(-90deg, transparent, $ThemeC2 100%);
  display: flex;
  margin-top: 2rem;
  margin-left: 2rem;
  font-size: 1.3rem;

  .img {
    width: clamp(15rem, 14vw, 22rem);
    height: clamp(15rem, 14vw, 22rem);
    margin: auto 0;

    img {
      width: clamp(15rem, 14vw, 22rem);
      height: clamp(15rem, 14vw, 22rem);
      border: 1px solid $ThemeC22;
    }
  }

  .info {
    margin-left: 2rem;

    .name {
      font-size: clamp(1.7rem, 1.5vw, 2.5rem);

      img {
        height: clamp(1.3rem, 1.4vw, 2rem);
        vertical-align: -0.2rem;
        margin-right: 1rem;
      }

      span {
        color: $ThemeC22;
      }
    }

    &-1 {
      display: flex;

      div {
        font-size: clamp(1.4rem, 1.2vw, 1.7rem);
        margin-right: 3rem;
      }
    }

    &-2 {
      margin-top: 2rem;

      div {
        margin-top: 1rem;
      }
    }
  }
}
</style>