import { defineStore } from 'pinia';
import type { Commentnew, Commentype, subscribertype, CommenHOT, data } from '@/types/comsub';
import { Comment, subscribers, Commenthot, Commentmusic, Commentalbum, CommentDJ } from '@/server/comsub';

const commentall = defineStore('commentall', {
  state: () => ({
    //最新评论
    Comment: { total: 0, comments: [] } as Commentnew,
    //收藏者
    subscribers: {} as subscribertype,
    //精彩评论
    commenthot: {} as CommenHOT,

    //歌曲评论:
    CommentMusic: { total: 0, comments: [] } as Commentnew,
    CommentMusichot: {} as CommenHOT,
  }),
  actions: {
    //获取评论
    async commentnew(data: Commentype, index: number) {
      let result;
      if (index === 0) {
        result = await Commentmusic(data);
        this.CommentMusic = result;
        // this.CommentMusic.comments = result.comments;
      }
      if (index === 2) {
        result = await Comment(data);
        this.Comment = result;
        // this.Comment.total = result.total;
        // this.Comment.comments = result.comments;
      }
      if (index === 3) {
        result = await Commentalbum(data);
        this.Comment = result;
        // this.Comment.total = result.total;
        // this.Comment.comments = result.comments;
      }
      if (index === 4) {
        result = await CommentDJ(data);
        this.CommentMusic = result;
        // this.CommentMusic.comments = result.comments;
      }
    },
    //获取精彩评论
    async commenHot(data: data) {
      let result = await Commenthot(data);
      if (data.type === 0||data.type === 4) {
        this.CommentMusichot = result;
        // this.CommentMusichot.total = result.total;
        // this.CommentMusichot.hotComments = result.hotComments;
      }
      if (data.type === 2) {
        this.commenthot = result;
        // this.commenthot.total = result.total;
        // this.commenthot.hotComments = result.hotComments;
      }
    },
    //获取收藏者
    async subsc(id: number, offset?: number) {
      let result = await subscribers({ id, offset, limit: 50 });
      this.subscribers = result;
      //  this.subscribers.total = result.total;
      // this.subscribers.subscribers = result.subscribers;
    }
  }
});

export default commentall;
