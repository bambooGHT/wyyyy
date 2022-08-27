<script setup lang="ts">
import { commentsub } from '@/store';
import { Commentype, Liked, CommenHOT, Commentnew } from '@/types/comsub';
import daytime from '@/utils/day-prce';
import pagination from './pagination.vue';
import { commentLiked } from '@/server/comsub';
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';


const route = useRoute();
const props = defineProps<{ songid: number; index: number; fn?: Function; }>();
const comments = commentsub();
const router = useRouter();
//1最新 2精彩
let ct = ref(1);
//最新评论
let COMMENT = ref<Commentnew>({ total: 0, comments: [] });
//精彩评论
let COMMENTHOT = ref<CommenHOT>({ total: 0, hotComments: [] });
//分页
const commentnew = (offset: number, before?: number) => {
  const data: Commentype = {
    id: props.songid,
    before,
    limit: 20
  };
  if (before) {
    data.before = before;
  }
  if (offset > 1) {
    data.offset = (offset - 1) * 20;
  }
  comments.commentnew(data, props.index).then(res => {
    ct.value = 1;
    if (props.index === 0 || props.index === 4) {
      COMMENT.value = comments.CommentMusic;
    } else {
      COMMENT.value = comments.Comment;
    }
  });
};
//精彩評論
const commentHOT = () => {
  comments.commenHot({ id: props.songid, type: props.index, }).then(res => {
    if (props.index === 0) {
      COMMENTHOT.value = comments.CommentMusichot;
    } else {
      COMMENTHOT.value = comments.commenthot;
    }
  });
};
//切换
const commentto = (value: number) => {
  ct.value = value;
  if (value === 2) commentHOT();
};

//點贊評論
const liked = (id: number, value: boolean, index: number) => {
  const data: Liked = {
    id: props.songid,
    cid: id,
    t: value ? 0 : 1,
    type: props.index
  };
  commentLiked(data);
  const time = setTimeout(() => {
    index ? commentHOT() : commentnew(route.query.off ? Number(route.query.off) : 1);
    clearTimeout(time);
  }, 1000);
};
//監聽獲取評論
watch(() => props.songid, () => {
  commentnew(route.query.off ? Number(route.query.off) : 1);
  commentHOT();
}, { immediate: true });

const touser = (id: number) => {
  router.push({
    path: `/user/${id}`
  });
  if (props.fn) {
    props.fn();
  }
};
</script>

<template>
  <div class="comment">
    <div class="comments">
      <div class="comments-a" @click="commentto(1)">
        最新评论<span>({{ COMMENT.total ? COMMENT.total : 0 }})</span>
      </div>
      <div class="comments-a" @click="commentto(2)">
        精彩评论<span>({{ COMMENTHOT.total ? COMMENTHOT.total : 0 }})</span>
      </div>
    </div>
    <div class="info" v-if="ct === 1" v-for="p in COMMENT.comments">
      <hr />
      <img @click="touser(p.user.userId)" :src="`${p.user.avatarUrl}?param=100y100`" alt="" class="info-left click">
      <div class="info-right">
        <div class="info-a">
          <div class="comment1">
            <span class="click" @click="touser(p.user.userId)">{{ p.user.nickname }}</span>
            {{ p.content }}
          </div>
          <div class="comment2" v-if="p.beReplied.length > 0">
            <span class="click" @click="touser(p.beReplied[0].user.userId)">{{ p.beReplied[0]?.user?.nickname }}</span>
            {{ p.beReplied[0]?.content }}
          </div>
        </div>
        <div class="info-b">
          <div>
            <span>{{ p.timeStr }}</span>
            <span>&nbsp;&nbsp;{{ daytime.current(new Date(p.time)) }}</span>
          </div>
          <div>
            <span @click="liked(p.commentId, p.liked, 0)" class="liked" :class="{ 'color': p.liked === true }">点赞<span
                v-if="p.likedCount > 0">({{ p.likedCount }})</span></span>
            <i></i>
            <del>分享</del>
            <i></i>
            <del>回复</del>
          </div>
        </div>
      </div>
    </div>
    <div class="info" v-else-if="ct === 2" v-for="p in COMMENTHOT.hotComments">
      <hr />
      <img @click="touser(p.user.userId)" :src="`${p.user.avatarUrl}?param=100y100`" alt="" class="info-left click">
      <div class="info-right">
        <div class="info-a">
          <div class="comment1">
            <span class="click" @click="touser(p.user.userId)">{{ p.user.nickname }}</span>
            {{ p.content }}
          </div>
          <div class="comment2" v-if="p.beReplied.length > 0">
            <span class="click" @click="touser(p.beReplied[0].user.userId)">{{ p.beReplied[0].user.nickname }}</span>
            {{ p.beReplied[0].content }}
          </div>
        </div>
        <div class="info-b">
          <div>
            <span>{{ p.timeStr }}</span>
            <span>&nbsp;&nbsp;{{ daytime.current(new Date(p.time)) }}</span>
          </div>
          <div>
            <span @click="liked(p.commentId, p.liked, 1)" class="liked" :class="{ 'color': p.liked === true }">点赞<span
                v-if="p.likedCount > 0">({{ p.likedCount }})</span></span>
            <i></i>
            <del>分享</del>
            <i></i>
            <del>回复</del>
          </div>
        </div>
      </div>
    </div>
    <pagination :ofss="1" :pagin="commentnew" :limit="20" :total="COMMENT.total"
      v-show="ct === 1 && COMMENT.total > 20" />
  </div>
</template>

<style lang="scss" scoped>
.color {
  color: $ThemeC22;
}

.nonav {
  margin: 3rem 0;
  text-align: center;
}

.click {
  cursor: pointer;
}

.comment {
  font-size: 1.4rem;
  padding-bottom: 3rem;

  .comments {
    margin: 2rem 0 1rem;
    display: flex;

    &-a {
      margin: 0 1rem;

      &:hover {
        cursor: pointer;
      }

    }
  }

  .info {
    display: flex;
    flex-wrap: wrap;
    margin: 0 1rem;

    &-left {
      display: flex;
      max-width: 4rem;
      max-height: 4rem;
      border-radius: 50%;
      margin-right: 1rem;
    }

    &-right {
      flex: 1;
    }

    hr {
      width: 100%;
      margin: 0.5rem 0;
      border: 1px solid $ThemeC10;
    }

    &-a {
      width: auto;
      margin-right: 1rem;
      color: $ThemeC3;

      .comment1 {
        margin: 0.5rem 0;
      }

      .comment2 {
        padding: 1rem 0.5rem;
        background-color: $ThemeC8;
      }

      span {
        color: #0C73C2;
      }
    }

    &-b {
      width: 100%;
      margin: 0.5rem 0;
      display: flex;
      justify-content: space-between;

      .liked {
        cursor: pointer;
      }

      i {
        display: inline-block;
        width: 1px;
        height: 70%;
        margin: 0 1rem;
        background-color: #0C73C2;
      }
    }
  }
}
</style>