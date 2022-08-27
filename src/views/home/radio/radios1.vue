<script setup lang="ts">
import { useRouter } from 'vue-router';
import { feeradio } from '@/server/hmusic';
import { onMounted, ref } from 'vue';
import { d } from '@/hooks/nav';
const router = useRouter();
const arr: any = ref([]);
const toradio = (id: number) => {
  router.push({
    path: `/radio/${id}`,
  });
};
onMounted(() => {
  feeradio({ limit: 6 }).then(res => {
    arr.value = res.data.list;
  });
});
const toradio1 = (id: number, name: string) => {
  d.value = true;
  router.push({
    path: 'h-radios',
    query: {
      type: id,
      name: name
    }
  });
};
</script>

<template>
  <div class="boxs">
    <div class="names">
      <div>付费精品</div>
      <div @click="toradio1(-1, '付费精品')">更多 ></div>
    </div>
    <ul class="a">
      <li @click="toradio(p.id)" v-for="p in  arr">
        <div>
          <div class="w">原价:
            {{ p.originalPrice / 100 }}
          </div>
        </div>
        <img :src="`${p.picUrl}?param=200y200`" alt="">
        <div class="lastSong">
          <div class="name">节目数:<span>{{ p.programCount }}</span></div>
        </div>
        <div class="txt">
          <span class="topath">{{ p.name }}</span><br />
          <span class="topath">{{ p.rcmdText }}</span><br />
          <span class="topath">{{ p.lastProgramName }}</span><br />
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '../songlist/index.scss';
@import '../songlist/high.scss';

.names {
  font-size: 2rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.7rem;

  div:nth-child(2) {
    cursor: pointer;
  }
}

.boxs {
  margin: 0 4rem;
  margin-top: 2rem;
}

.a {
  justify-content: space-around;

  li {
    cursor: default;

    @media screen and (max-width:9999px) {
      width: 50%;
    }

    .topath:nth-child(1) {
      font-size: 1.6rem;
      cursor: pointer;
    }

    .topath:nth-child(3) {
      font-size: 1.6rem;
      cursor: default;
    }
  }
}
</style>