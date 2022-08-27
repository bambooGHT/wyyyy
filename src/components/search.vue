<script setup lang="ts">
import { search } from '@/store';
import { onMounted, reactive, ref, watch } from 'vue';
import { searchof } from '@/server/search/index';
import { debounce } from '@/utils/throttle.js';
import { useRoute, useRouter } from 'vue-router';
import { currentlist } from '@/hooks/music';

const Search = search();
let value = ref('');
let searchistory = ref<string[]>([]);
onMounted(() => {
  if (localStorage.getItem('search')) {
    searchistory.value = JSON.parse(String(localStorage.getItem('search')));
  }
});
//搜索记录
const history = () => {
  if (searchistory.value.length > 29) {
    searchistory.value.splice(searchistory.value.length, 1);
  }
  const indexs = searchistory.value.findIndex(p => p === value.value);
  indexs !== -1 && searchistory.value.splice(indexs, 1);
  searchistory.value.unshift(value.value);
  localStorage.setItem('search', JSON.stringify(searchistory.value));
};
const splice = (index: number) => {
  searchistory.value.splice(index, 1);
  localStorage.setItem('search', JSON.stringify(searchistory.value));
};
const remove = () => {
  searchistory.value = [];
  localStorage.removeItem('search');
};
interface datatype {
  albums: { //专辑
    id: number;
    name: string;
    artist: {
      name: string;
    };
  }[];
  artists: {
    id: number;
    name: string;
  }[];
  songs: {
    id: number;
    name: string;
    artists: {
      id: number;
      name: string;
    }[];
  }[];
  playlists: {
    id: number;
    name: string;
  }[];
}

let data = reactive({
  data: {} as datatype
});
const of = () => {
  searchof(value.value).then((res: any) => {
    data.data = res.result;
  });
};

watch(value, (newvalue) => {
  debounce(of);
});

const router = useRouter();
const route = useRoute();
const toalbum = (id: number) => {
  router.push({
    path: `/album/${id}`
  });
  history();
};
const toartist = (id: number) => {
  router.push({
    path: `/artist/${id}`
  });
  history();
};
const tosong = (id: number) => {
  router.push({
    path: `/song/${id}`
  });
  currentlist.value = true;
  history();
};
const tosearch = (e: any) => {
  const reg = route.path.match(/((?<=\/search\/)songs|album|artist|lyric|radio|user)/) ?? ['songs'];
  router.push({
    path: `/search/${reg[0]}`,
    query: {
      value: value.value,
      type: route.query.type ? String(route.query.type) : 1
    }
  });
  e.target.blur();
  history();
};
const topath = (txt: string) => {
  const reg = route.path.match(/((?<=\/search\/)songs|album|artist|lyric|radio|user)/) ?? ['songs'];
  router.push({
    path: `/search/${reg[0]}`,
    query: {
      value: txt,
      type: route.query.type ? String(route.query.type) : 1
    }
  });
};
</script>

<template>
  <div class="text">
    <input type="text" @keydown.enter="tosearch" v-model="value" placeholder=" 搜索音楽,視頻...">
    <div class="block">
      <div v-if="value === ''" class="search">
        <div>搜索歷史 <span @click="remove" class="click">清空</span></div>
        <hr />
        <div class="hist">
          <div v-for="(p, index) in searchistory" :key="p" @click="topath(p)">{{ p }}
            <span @click.stop="splice(index)" class="x">&#10006</span>
          </div>
        </div>
      </div>
      <ul v-else class="search">
        <li v-if="value === ''" class="user">
          搜索"<span>{{ value }}</span>"相關用戶></li>
        <li>
          <div class="se">单曲</div>
          <div class="li">
            <template v-if="data.data?.songs" v-for="p of data.data?.songs.slice(0, 5)">
              <div @click="Search.songsplay(p.id); history()">{{ p.name }}-<span>{{ p.artists[0].name }}</span></div>
            </template>
            <p></p>
          </div>
        </li>
        <li>
          <div class="se">歌手</div>
          <div class="li">
            <template v-if="data.data?.artists" v-for="p of data.data?.artists.slice(0, 5)">
              <div @click="toartist(p.id)">{{ p.name }}</div>
            </template>
            <p></p>
          </div>
        </li>
        <li>
          <div class="se">專輯</div>
          <div class="li">
            <template v-if="data.data?.albums" v-for="p of data.data?.albums.slice(0, 5)">
              <div @click="toalbum(p.id)">{{ p.name }}-<span>{{ p.artist.name }}</span></div>
            </template>
            <p></p>
          </div>
        </li>
        <li>
          <div class="se">歌單</div>
          <div class="li">
            <template v-if="data.data?.playlists" v-for="p of data.data?.playlists.slice(0, 5)">
              <div @click="tosong(p.id)">{{ p.name }}</div>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  display: none;

  &:hover {
    display: block;
  }
}

.text {
  margin-left: 3rem;
  position: relative;

  .x {
    font-size: 1.5rem;
    color: $ThemeC22;
    padding-left: 0.8rem;
  }

  hr {
    width: 80%;
    margin: 0.5rem 0;
  }

  * {
    color: $ThemeC3;
    font-size: 1.5rem;
  }

  .user {
    padding: 0.5rem 0;
    overflow: hidden;
    white-space: nowrap;

    &:hover {
      cursor: pointer;
      background-color: $ThemeC9;
    }

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: $ThemeC22;
    }
  }

  p {
    margin-top: 0.5rem;
  }

  li {
    display: flex;

    .se {
      border-right: 1.5px solid $ThemeC2;
      padding: 0.5rem 0;
      width: 5rem;
    }

    .li {
      flex: 1;
      width: auto;

      overflow: hidden;

      div {
        padding: 0.5rem 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &:hover {
          cursor: pointer;
          background-color: $ThemeC9;
        }
      }

      span {
        color: $ThemeC10;
      }
    }
  }

  .search {
    margin-top: 1rem;
    position: absolute;
    width: 25rem;
    height: 38rem;
    background-color: $ThemeC5;
    box-shadow: 0 0.3rem 2rem #000;
    transition: 0.3s;
    z-index: 10;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar-track {
      border-radius: 2rem;
      background-color: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 2rem;
      background-color: $ThemeC2;
    }

    &::-webkit-scrollbar {
      width: 0.6rem;
    }

    .click:hover {
      cursor: pointer;
      color: $ThemeC22;
    }

    .hist {
      display: flex;
      width: 24rem;
      flex-wrap: wrap;

      div {
        max-width: 20rem;
        font-size: 1.3rem;
        line-height: 1.3rem;
        border: 1.5px solid $ThemeC1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 1rem;
        margin: 0.5rem;
        cursor: pointer;
        transition: 0.3s;
        padding: 0 0.5rem;

        &:hover {
          border: 1.5px solid $ThemeC22;
          color: $ThemeC22;
        }
      }
    }
  }

  input {
    outline: none;
    height: 2.5rem;
    font-size: 1.6rem;
    border: 2px solid $ThemeC2 ;
    border-radius: 5rem;
    background: none;
    text-indent: 0.5rem;

    &:focus {
      border-color: $ThemeC22;

      &+.block {
        display: block;
      }
    }
  }
}
</style>