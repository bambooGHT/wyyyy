import { ref, reactive, onMounted, onUnmounted } from "vue";
import { debounce } from '@/utils/throttle';

export const tran = ref();
export function data() {
  let e = ref(false);
  let macks = ref('none');
  let lyricshow = () => {
    macks.value = macks.value === 'block' ? 'none' : 'block';
    e.value = !e.value;
  };
  return {
    tran,
    lyricshow,
    e,
    macks
  };
}

export let d = ref(true);
let scroll = 0;
export let load = reactive<number[]>([20, 20]);
const index = () => {
  debounce(() => {
    scroll = tran.value.scrollTop;
  });
};
//滚动
export const Scroll = () => {
  onMounted(() => {
    if (!d.value) {
      const time = setTimeout(() => {
        tran.value.scrollTo(0, scroll);
        clearTimeout(time);
      }, 30);
    };
    tran.value.addEventListener('wheel', index);
    d.value = false;
  });
  onUnmounted(() => {
    tran.value.removeEventListener('wheel', index);
  });
};