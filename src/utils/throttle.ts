
//时间戳節流
let t = 0;
const throttle = (fn: Function, m: number) => {
  const time = new Date().getTime();
  if (time - t > m) {
    fn();
    t = time;
  }
};
//定时器防抖
let time: any = 0;
function debounce(fn: Function) {
  time && clearTimeout(time);
  time = setTimeout(() => {
    fn();
  }, 200);
}

//定时器防抖1
let time1: any = 0;
function debounce1(fn: Function) {
  time1 && clearTimeout(time1);
  time1 = setTimeout(() => {
    fn();
  }, 50);
}
//歌詞滾動定時器防抖
let time2: any = 0;
function lyricde(fn: Function) {
  time2 && clearTimeout(time2);
  time2 = setTimeout(() => {
    fn();
  }, 2500);
}
// let time3: any = 0;
// function lyricde1(fn: Function) {
//   time3 && clearTimeout(time3);
//   time3 = setTimeout(() => {
//     fn();
//   }, 2000);
// }
export {
  throttle,
  debounce,
  debounce1,
  lyricde,
  
};

