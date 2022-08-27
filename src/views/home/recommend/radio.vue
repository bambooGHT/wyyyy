<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { REdio } from '@/types/Hmusic';
import { useRouter } from 'vue-router';
import { Hmusic } from '@/store';
const props = defineProps<{ num: number, name: string; }>();
const music = Hmusic();
const router = useRouter();
let data = ref<any[]>([]);
onMounted(async () => {
  data.value = await music.rarecoms(props.num);
});
const toradio = (id: number) => {
  router.push({
    path: `/radio/${id}`
  });
};
const toHradio = () => {
  if (props.num === -1) {
    router.push({ path: `h-radio` });
    return;
  }
  router.push({
    path: 'h-radios',
    query: {
      type: props.num,
      name: props.name
    }
  });
};
</script>

<template>
  <div class="radio">
    <div class="box">
      <div>{{ name }}</div>
      <div @click="toHradio()" style="cursor:pointer;" v-if="num === -1 || num > 0">更多 ></div>
    </div>
    <hr class="hr" />
    <ul>
      <li v-for="p in data.slice(0, 6)" @click="toradio(num === -1 ? p.program.radio.id : p.id)">
        <div class="w">{{ num === -1 ? p.copywriter : p.rcmdtext }}</div>
        <img :src="`${p.picUrl}?param=200y200`" alt="">
        <div class="click">{{ p.name }}</div>
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

      &:nth-child(n+2) {
        margin-left: 3rem;
      }

      &:hover {
        .w {
          transform: translateY(0);

        }
      }

      @media screen and (max-width:1250px) {
        &:nth-child(6) {
          display: none;
        }
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

      img {
        width: 100%;
        height: 100%;
      }

      nav {
        display: inline-block;
        font-size: 1.3rem;
      }
    }
  }
}
</style>