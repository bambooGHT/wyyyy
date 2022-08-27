import { debounce, debounce1 } from '@/utils/throttle';
import { onMounted, onUnmounted, ref } from 'vue';
import { tran } from './nav';
import { songlist } from '@/store/index';
import { useRoute } from "vue-router";

export let currentlist = ref(true);
let scroll = 0;

//滚动
export const songScroll = () => {
  //下滑改变状态
  let heights = ref(false);
  const route = useRoute();
  const Song = songlist();
  const index = () => {
    debounce(() => {
      scroll = tran.value.scrollTop;
    });
    debounce1(() => {
      if (tran.value.scrollTop + tran.value.offsetHeight === tran.value.scrollHeight) {
        if (Song.songall.tracks.length < Song.songall.trackCount) {
          if (heights.value) return;
          heights.value = true;
          const index = Math.ceil(Song.songall.tracks.length / 250);
          Song.songlistall({ id: Number(route.params.id), offset: index }).then(() => {
            heights.value = false;
          });
        }
        return;
      }
    });
  };
  onMounted(() => {
    if (!currentlist.value) {
      const time = setTimeout(() => {
        tran.value.scrollTo(0, scroll);
        clearTimeout(time);
      }, 30);
    } else {
      Song.song(Number(route.params.id));
    }
    tran.value.addEventListener('wheel', index);
    currentlist.value = false;
  });
  onUnmounted(() => {
    tran.value.removeEventListener('wheel', index);
  });
  return {
    Song,
    route,
    heights
  };
};