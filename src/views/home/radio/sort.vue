<script setup lang="ts">
import { catelist } from '@/server/hmusic';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { d } from '@/hooks/nav';

type cate = {
  id: number;
  picMacUrl: number;
  name: string;
};
const router = useRouter();
let arr = ref<cate[]>([]);
onMounted(() => {
  catelist().then((res: any) => {
    arr.value = res.categories;
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
  <div>
    <ul class="tags">
      <li>
        <div class="name">排行榜</div>
        <div class="img">
          <div class="imgs">
            无图
          </div>
          <div class="imgs1">
            无图
          </div>
        </div>
      </li>
      <li v-for="p in arr">
        <div class="name" @click="toradio1(p.id, p.name)">{{ p.name }}</div>
        <div class="img" @click="toradio1(p.id, p.name)">
          <div class="imgs" :style="{ 'background': `url('${p.picMacUrl}') no-repeat` }"
            style="background-position: -68px -10px;">
          </div>
          <div class="imgs1" :style="{ 'background': `url('${p.picMacUrl}') no-repeat` }"
            style="background-position: -8px -10px;">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  display: flex;
  align-items: center;
  overflow: hidden;
  overflow-x: auto;
  margin-top: 2rem;

  &::-webkit-scrollbar-track {
    border-radius: 2rem;
    background-color: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2rem;
    background-color: $ThemeC2;
  }

  &::-webkit-scrollbar {
    height: 0.6rem;
  }

  li {
    display: flex;
    flex-direction: column;
    flex-basis: 15rem;
    flex-shrink: 0;
    white-space: nowrap;
    height: 7.5rem;
    font-size: 1.6rem;
  }

  .img:hover,
  .name:hover+.img {
    cursor: pointer;

    .imgs {
      opacity: 1;
    }

    .imgs1 {
      opacity: 0;
    }
  }

  .name {
    cursor: pointer;
    order: 2;
    width: min-content;
    margin: 0 auto;
  }

  .img {
    order: 1;
    position: relative;
    width: 4.4rem;
    height: 5rem;
    margin: 0 auto;
  }

  .imgs {
    opacity: 0;
  }

  .imgs,
  .imgs1 {
    width: 4.4rem;
    height: 5rem;
    position: absolute;
    transition: .3s;
  }
}
</style>