import axios from 'axios';
import message from "@/message/index";
const request = axios.create({
  // baseURL: 'http://localhost:3000/',
  baseURL: 'http://43.138.26.158:3000/',
  timeout: 6000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
});
request.interceptors.request.use((config) => {
  if (localStorage.getItem('cookie') && config.method === "get") {
    let local = localStorage.getItem('cookie'),
      cookie = encodeURIComponent(local!);
    if (config.params) {
      config.params = Object.assign(config.params, { timestamp: new Date().getTime(), cookie });
    } else {
      config.params = { timestamp: new Date().getTime(), cookie };
    }
    return config;
  }

  if (config.method === "post") {
    config.params = { timestamp: new Date().getTime() };
  }
  return config;
}, error => {
  // return message({ type: 'error', message: error.response.data?.message });
});
request.interceptors.response.use((response) => {

  return response.data;
}, error => {
  if (error.response?.data?.message) {
    message({ type: 'error', message: error.response.data.message });
  }
  // return message({ type: 'error', message: error.response.data?.message });
});

export default request;