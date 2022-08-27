import request from "../request";
import { param } from "@/types/DJ";
//获取电台信息
export const reinfo = (rid: number) => {
  return request({
    url: `/dj/detail?rid=${rid}`,
    method: 'GET',
  });
};

//获取电台节目
export const relist = (params: param) => {
  return request({
    url: `/dj/program`,
    method: 'GET',
    params
  });
};