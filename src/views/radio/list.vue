<script setup lang="ts">
import daytime from '@/utils/day-prce';
import { radio } from '@/store';
import { useRoute } from "vue-router";
import { onUnmounted, ref } from 'vue';
import pagination from '@/components/pagination.vue';
const route = useRoute();
const Radio = radio();
const indexs = ref(-1);
const off = ref();//切换顺序修改分页为1
let i = false;
Radio.relists({
  rid: Number(route.params.id),
  offset: route.query.off ? Number(route.query.off) : 0
});
//點擊高亮
const libackg = (i: number) => {
  indexs.value = i;
};

const data = (index: number, boo?: boolean) => {
  Radio.ask = false;
  Radio.relists({
    rid: Number(route.params.id),
    offset: (index - 1) * 30,
    asc: boo
  });
  if (boo !== undefined && Radio.readiolist.count > 30) {
    off.value.pagins.offset = 1;
  }
};
onUnmounted(() => {
  Radio.readiolist.programs = [];
});
</script>

<template>
  <div class="list">
    <div class="sub">
      <div>排序</div>
      <div @click="data(1, false); i = false" :class="{ c: !i }">↓</div>
      <div @click="data(1, true); i = true" :class="{ c: i }">↑</div>
    </div>
    <hr />
    <ul v-if="Radio.ask">
      <li v-for="(p, index) in Radio.readiolist.programs" :class="{ liback: indexs === index }" @click="libackg(index)"
        @dblclick="Radio.play(p as any)">
        <div>{{ p.serialNum }}</div>
        <div>
          <img :src="`${p.coverUrl}?param=100y100`">
        </div>
        <div><span v-if="p.programFeeType" class="ing" :class="{ ing1: p.programFeeType === 5 }">
            {{ p.programFeeType === 10 ? '付费' : '试听' }}</span> {{ p.name }}
        </div>
        <div>播放:{{ p.listenerCount >= 10000 ? `${String(p.listenerCount).replace(/\d{4}$/, '')}万` : p.listenerCount
        }}
        </div>
        <div>点赞:{{ p.likedCount >= 10000 ? `${String(p.likedCount).replace(/\d{4}/, '')}万` : p.likedCount }}</div>
        <div>{{ daytime.formatDate(new Date(p.createTime)) }}</div>
        <div>{{ daytime.time1(p.duration) }}</div>
      </li>
    </ul>
    <div v-else class="ings">加载中...</div>
    <pagination v-if="Radio.readiolist.count > 30" ref="off" :pagin="data" :limit="30"
      :total="Radio.readiolist.count" />
  </div>
</template>

<style lang="scss" scoped>
@import './list.scss'
</style>