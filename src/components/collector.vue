<script setup lang="ts">
import { commentsub } from '@/store/index';
import pagination from '@/components/pagination.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
let subscr = commentsub();
const route = useRoute();
const props = defineProps<{ songid: number; }>();
let sub = (value: number) => {
  if (value > 1) {
    value = value * 50 - 50;
    subscr.subsc(props.songid, value);
    return;
  }
  subscr.subsc(props.songid);
};
onMounted(() => {
  sub(route.query.off ? Number(route.query.off) : 1);
});
</script>

<template>
  <div>
    <div class="user">
      <div class="userinfo" v-for="p of subscr.subscribers.subscribers">
        <img :src="`${p.avatarUrl}?param=300y300`" alt="">
        <span>{{ p.nickname }}</span>
      </div>
    </div>
    <pagination :pagin="sub" :limit="50" v-if="subscr.subscribers.total > 50" :total="subscr.subscribers.total" />
    <div class="loing" v-else>無</div>
  </div>

</template>

<style lang="scss" scoped>
.loing {
  text-align: center;
  margin-top: 5rem;
}

.user {
  display: grid;
  grid-template-columns: repeat(auto-fit, 9.5rem);
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.3rem;
  margin: 0 0.5rem;
}

.userinfo {
  width: 9.5rem;

  img {
    width: 7rem;
    display: block;
    border-radius: 50%;
    margin: 0 auto;
  }

  span {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0.5rem 0;
    text-align: center;
  }
}
</style>