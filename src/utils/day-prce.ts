export default class daytime {
  //播放进度 百分比转换
  static percentage(currentTime: number, duration: number): string {
    if (window.isNaN(duration)) return '0%';
    return currentTime / duration * 100 + '%';
  }
  //时间格式化
  //歌曲 a:秒数
  static time(a: number): string {
    const m = Math.floor((a / 60 % 60));
    const s = Math.floor((a % 60));
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }
  //电台 a:毫秒
  static time1(a: number): string {
    const time = a / 1000;
    const h = Math.floor(time / 60 / 60);
    const i = Math.floor((time / 60)) % 60;
    const m = Math.floor(time) % 60;
    if (h > 0) {
      return `${h < 10 ? '0' + h : h}:${i < 10 ? '0' + i : i}:${m < 10 ? '0' + m : m}`;
    }
    return `${i < 10 ? '0' + i : i}:${m < 10 ? '0' + m : m}`;
  }
  //日期
  static formatDate(value: Date): string {
    const year = value.getFullYear(),
      month = value.getMonth() + 1,
      date = value.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
  }
  //歌曲毫秒转换
  static formatime(value: Date): string {
    const Minutes = value.getMinutes(),
      Seconds = value.getSeconds();
    return `${Minutes < 10 ? '0' + Minutes : Minutes}:${Seconds < 10 ? '0' + Seconds : Seconds}`;
  }
  //历史播放歌曲时间转换
  static historytime(value: number): string | undefined {
    const t = new Date().getTime();
    const t1 = (t - value) - 8 * 60 * 60 * 1000;
    const time = new Date(t1);
    const d = time.getDate() - 1;
    const h = time.getHours();
    const m = time.getMinutes();
    if (h < 1 && m < 1 && d < 1) return '刚刚';
    if (h < 1 && m <= 59 && d < 1) {
      return `${m}分钟前`;
    }
    if (h <= 23 && d < 1) {
      return `${h}小时前`;
    }
    if (d >= 1) {
      const ti = new Date(value);
      const Year = ti.getFullYear();
      const Month = ti.getMonth() + 1;
      const day = ti.getDate();
      return `${Year}.${Month}.${day}`;
    }
  }
  //评论时间
  static current(value: Date): string {
    const h = value.getHours();
    const m = value.getMinutes();
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
  }
}