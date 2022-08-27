<script setup lang="ts">
import { pemv } from '@/server/hmusic';
import type { MV } from '@/types/Hmusic';
import { ref, onMounted } from 'vue';
let mv = ref<MV[]>();
onMounted(() => {
  pemv().then((res: any) => {
    mv.value = res.result;
  });
});
</script>

<template>
  <div class="radio">
    <div class="box">
      <div>推荐 MV</div>
      <div style="cursor:pointer;">更多 ></div>
    </div>
    <hr class="hr" />
    <ul>
      <li v-for="p in mv">
        <div class="w">{{ p.copywriter }}</div>
        <img :src="`${p.picUrl}?param=727y409`" alt="">
        <div class="click">{{ p.name }}</div>
        <div>
          <nav v-for="(s, index) in p.artists">
            <span class="click">{{ s.name }}</span>
            {{ p.artists.length > index + 1 ? ` /&nbsp` : '' }}
          </nav>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.hr {
  margin: 1rem auto;
}

.box {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 4rem;
  font-size: 1.7rem;
}

.click:hover {
  color: $ThemeC22;
  cursor: pointer;
}

.radio {
  margin: 0 4rem;

  ul {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;

    li {
      font-size: 1.4rem;
      flex: 1;
      height: 100%;
      position: relative;
      overflow: hidden;

      &:hover .w {
        transform: translateY(0);
      }

      .w {
        width: 100%;
        height: auto;
        transform: translateY(-100%);
        padding: 0.5rem 0;
        position: absolute;
        transition: 0.3s;
        color: aliceblue;
        font-weight: bold;
        font-size: 1.4rem;
        background: linear-gradient(0deg, #00000080, #00000080 60%);
      }

      &:nth-child(n+2) {
        margin-left: 2rem;
      }

      @media screen and (max-width:1250px) {
        &:nth-child(4) {
          display: none;
        }
      }

      img {
        width: 100%;
        max-width: 36em;
      }

      nav {
        display: inline-block;
        font-size: 1.3rem;
      }
    }
  }
}
</style>