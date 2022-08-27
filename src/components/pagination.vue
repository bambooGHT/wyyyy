<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
/**
 * pagin:分頁
 * total:評論總數
 * limit:每頁顯示數量
 * ofss:不帶query
 */
const router = useRouter();
const route = useRoute();
const props = defineProps<{ pagin: Function; total: number; limit: number; ofss?: number; }>();

const pagins = reactive({
  offset: 1,
  nav: 5
});
defineExpose({
  pagins
});
pagins.offset = route.query.off ? Number(route.query.off) : 1;
const maxindex = computed(() => {
  return Math.ceil(props.total / props.limit);
});
const index = computed(() => {
  let [seart, end] = [0, 0];
  if (pagins.nav > maxindex.value) {
    seart = 1, end = maxindex.value;
  } else if (pagins.nav < maxindex.value) {
    seart = pagins.offset - Math.floor(pagins.nav / 2);
    end = pagins.offset + Math.floor(pagins.nav / 2);
  }
  if (end > maxindex.value) seart = maxindex.value - pagins.nav + 1, end = maxindex.value;
  if (seart < 1) seart = 1, end = pagins.nav;
  return { seart, end };
});
const paginindex = (e: any) => {
  if (e.target.textContent == pagins.offset) return;

  if (e.target.textContent == '首页') {
    pagins.offset = 1;
  } else if (e.target.textContent == '尾页') {
    pagins.offset = maxindex.value;
  } else {
    pagins.offset = Number(e.target.textContent);
  }
  props.pagin(pagins.offset);
};

watch(() => pagins.offset, (newvalue) => {
  if (!props.ofss) router.replace({
    query: Object.assign({}, route.query, { off: newvalue })
  });
});

const toindex = ref<number>();

const paginindex1 = (value: number | undefined) => {
  if (!value) return;
  if (value == pagins.offset) return;
  pagins.offset = value;
  props.pagin(pagins.offset);
};
</script>

<template>
  <div class="nav">
    <button class="nav-t" @click="paginindex">首页</button>
    <template v-for="(p, i) in index.end">
      <button @click="paginindex" v-if="(p >= index.seart)" :class="{ disabled: pagins.offset === p }">{{ p }}</button>
    </template>
    <button class="nav-t" @click="paginindex">尾页</button>
    <input @click.stop type="number" v-model="toindex" :placeholder="`${maxindex}`">
    <button class="nav-t" @click="paginindex1(toindex)">跳转</button>
  </div>
</template>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

input {
  width: 4rem;
  height: 2.4rem;
  -moz-appearance: textfield;
  outline: none;
  border: 1px solid black;
  box-sizing: border-box;
}

.nav {
  font-size: 1.3rem;
  width: 100%;
  text-align: center;
  padding: 2rem 0;

  .disabled {
    background-color: #409eff;
  }

  button {
    width: 4rem;
    height: 2.5rem;
    margin: 0 0.4rem;
    background-color: #f4f4f5;
    color: #606266;
    vertical-align: top;
    display: inline-block;
    outline: none;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }

  &-t {
    width: 5rem !important;
  }
}
</style>