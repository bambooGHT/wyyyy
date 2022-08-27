<script setup lang="ts">
import daytime from "@/utils/day-prce";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import list from './list.vue';
import { radio } from "@/store";
import { storeToRefs } from "pinia";
const router = useRouter();
const route = useRoute();
const Radio = radio();
const { readioinfo } = storeToRefs(Radio);
const touser = (id: number) => {
  router.push({
    path: `/user/${id}`
  });
};
const text = ref(true);
Radio.reinfos(Number(route.params.id)).then((res: any) => {
  if (readioinfo.value.desc.length <= 30) {
    text.value = false;
  }
});
const tab = ref(true);
</script>

<template>
  <div v-if="readioinfo?.name">
    <div class="song">
      <img :src="`${readioinfo.picUrl}?param=200y200`" alt="">
      <div class="user">
        <div class="user-songid"><span class="ing">{{ readioinfo.feeInfo ? '付费精品' : '电台' }}</span> {{ readioinfo.name }}
        </div>
        <div class="user-time">
          <img :src="`${readioinfo.dj.avatarUrl}?param=200y200`" alt="" @click="touser(readioinfo.dj.userId)">
          <span @click="touser(readioinfo.dj.userId)">{{ readioinfo.dj.nickname }}
            {{ daytime.formatDate(new Date(readioinfo.createTime)) }}创建</span>
        </div>
        <div class="user-Details">
          <div @click="Radio.playall()" title="播放全部">
            播放全部
            <nav v-if="!readioinfo.feeInfo" @click.stop="Radio.playpush()" title="添加到列表"><span></span><span></span>
            </nav>
          </div>
          <div title="收藏">订阅</div>
          <del title="分享">分享</del>
        </div>
        <div id="Introduction" class="user-Introduction" v-if="readioinfo.desc">
          <div v-if="readioinfo.desc.length > 30" @click="text = !text" class="text">{{ text ? '展开' : '收起' }}</div>
          <span class="ing">{{ readioinfo.category }}</span> <span>{{ text ? `${readioinfo.desc.slice(0, 30)}......`
              : readioinfo.desc
          }}</span>
        </div>
      </div>
    </div>
    <div class="tab">
      <div @click="tab = true">节目<span>({{ readioinfo.programCount }})</span></div>
      <div @click="tab = false">订阅者<span>({{ readioinfo.subCount }})</span></div>
    </div>
    <list v-show="tab" />
    <div v-show="!tab" style="text-align: center;">没想到吧,我也没想到</div>
  </div>
</template>

<style lang="scss" scoped>
@import '../song/songlist/index.scss';

.tab {
  font-size: 1.6rem;
  display: flex;
  margin-top: 2rem;

  div {
    margin: 0 2rem;
    cursor: pointer;
    position: relative;

    &:hover {
      color: $ThemeC22;
    }

    &:hover::before {
      position: absolute;
      content: '';
      bottom: -4px;
      width: 100%;
      height: 3px;
      background-color: $ThemeC1;
    }
  }
}
</style>