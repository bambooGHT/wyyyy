import { defineStore } from 'pinia';
import type { users, userdata, usermusictime, USERINFO, userdjtyoe } from '@/types/user';
import type { allsong } from '@/types/songlist';
import { userinfo, logout, userphome, useruid, usersonglist, userrecord, userdj, userdjlist, ids } from '@/server/user/index';
import message from "@/message/index";

const user = defineStore('user', {
  state: () => ({
    user: {} as users,
    uname: { bool: false, } as USERINFO,
    usersong: [] as allsong[],
    usersongSub: [] as allsong[],
    userhot: [] as usermusictime[],
    userINFO: {} as USERINFO,
    userVIP: { redVipLevel: 0, redVipDynamicIconUrl: '' },
    userDJ: [] as userdjtyoe[],
    userDJlist: { djRadios: [] as userdjtyoe[], count: 0 },
  }),
  actions: {
    async explogin(data: userdata) {
      if (data && data.code !== 200) {
        message({ type: 'error', message: data.message });
        return;
      }
      if (data) {
        const cookie = data.cookie;
        //存取cookie
        if (cookie) {
          const cookieArr: string[] = cookie.split(';;');
          cookieArr.forEach(item => {
            document.cookie = item;
          });
          localStorage.setItem('cookie', JSON.stringify(cookie));
        }
        localStorage.setItem('USERID', JSON.stringify(data.profile.userId));
        const result = await usersonglist({ uid: data.profile.userId, offset: 0 });
        localStorage.setItem('USERSUKIID', result.playlist[0].id);
        this.usersong = result.playlist.filter((s: { subscribed: boolean; }) => !s.subscribed);
        const result1 = await usersonglist({ uid: data.profile.userId, offset: data.profile.playlistCount - 1 });
        this.usersongSub = result1.playlist.filter((s: { subscribed: boolean; }) => s.subscribed);
        this.$patch((state) => {
          state.uname.profile = data.profile;
          state.uname.bool = true;
        });
        message({ type: 'success', message: '登录成功' });
      }
    },
    async login() {
      const result = await userinfo(this.user);
      this.explogin(result);
      const result1 = await ids(result.profile.userId);
      localStorage.setItem('USERSUKILIST', JSON.stringify(result1.ids));
      return result1.ids;
    },
    async emaillogin() {
      const result = await userphome(this.user);
      this.explogin(result);
    },
    async uidlogin() {
      const result = await useruid(this.user.password);
      this.explogin(result);
    },
    //退出登录
    logouts() {
      localStorage.removeItem('USERID');
      localStorage.removeItem('cookie');
      localStorage.removeItem('USERVIP');
      localStorage.removeItem('USERSUKIID');
      localStorage.removeItem('USERSUKILIST');
      this.$reset();
      logout();
      let keys = document.cookie.match(/[^ =;]+(?==)/g);
      if (keys) {
        for (var i = keys.length; i--;) {
          document.cookie =
            keys[i] + "=0;expires=" + new Date(0).toUTCString() + ";max-age=0";
        }
      }
    },
    //用户听歌排行
    async useRecord(data: { uid: number, type: number; }) {
      this.userhot = [];
      const result = await userrecord(data);
      if (!result) {
        message({ type: 'error', message: '聽歌排行僅限關注/自己可見' });
        return;
      }
      this.userhot = data.type ? result.weekData : result.allData;
    },
    //用户信息
    async useinfo(uid: string) {
      const result = await useruid(uid);
      this.userINFO = result;
    },
    async userdjs(id: number) {
      const result = await userdj(id);
      this.userDJ = result.djRadios;
    },
    async userdjlists() {
      const result = await userdjlist();
      this.userDJlist = result;
    }
  }
});

export default user;