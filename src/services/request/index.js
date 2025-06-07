/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 15:01:30
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-04-16 23:59:43
 * @FilePath: \AI_vue3\vue-aigc\src\services\request\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
import { BASE_URL, TIMEOUT } from "../config";

class MYRequest {
  constructor(baseURL, timeout = 10000) {
    this.instance = axios.create({
      baseURL,
      timeout,
    });

    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          // 设置Authorization头部
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return error;
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        return error;
      }
    );
  }

  request(config) {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get(config) {
    return this.request({ ...config, method: "get" });
  }

  post(config) {
    return this.request({ ...config, method: "post" });
  }

  put(config) {
    return this.request({ ...config, method: "put" });
  }

  delete(url, config = {}) {
    return this.request({ ...config, url, method: "delete" });
  }
}

export default new MYRequest(BASE_URL, TIMEOUT);
