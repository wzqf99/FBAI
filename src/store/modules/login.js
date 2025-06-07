// stores/modules/login.js
import { defineStore } from "pinia";
import {
  accountLogin,
  accountRegister,
  accountLogout,
} from "@/services/modules/login/index";

const useLoginStore = defineStore("login", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}"),
    expiredAt: localStorage.getItem("expiredAt") || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    getUserInfo: (state) => state.userInfo,
  },

  actions: {
    async loginAccountAction(account) {
      try {
        const result = await accountLogin(account);

        // 根据后端接口调整处理逻辑
        if (result && result.token) {
          // 保存token和过期时间
          this.token = result.token;
          this.expiredAt = result.expiredAt;

          // 从token中解析用户信息
          // JWT格式：header.payload.signature
          try {
            const payload = JSON.parse(atob(result.token.split(".")[1]));
            this.userInfo = {
              userId: payload.userId,
              username: payload.username,
              email: payload.email,
            };
          } catch (e) {
            console.error("解析token中的用户信息出错:", e);
          }

          // 保存到localStorage
          localStorage.setItem("token", result.token);
          localStorage.setItem("expiredAt", result.expiredAt);
          localStorage.setItem("userInfo", JSON.stringify(this.userInfo));

          return { success: true, message: "登录成功" };
        } else if (result && result.error) {
          return { success: false, message: result.error };
        } else {
          return { success: false, message: "登录失败，未知错误" };
        }
      } catch (error) {
        console.error("登录错误:", error);
        return {
          success: false,
          message: error.message || "登录出错，请稍后再试",
        };
      }
    },

    async registerAccountAction(account) {
      try {
        const result = await accountRegister(account);

        // 根据后端接口调整处理逻辑
        if (result && result.message === "注册成功") {
          return { success: true, message: "注册成功" };
        } else if (result && result.error) {
          return { success: false, message: result.error };
        } else {
          return { success: false, message: "注册失败，未知错误" };
        }
      } catch (error) {
        console.error("注册错误:", error);
        return {
          success: false,
          message: error.message || "注册出错，请稍后再试",
        };
      }
    },

    async logoutAction() {
      try {
        // 确保请求头包含token
        const result = await accountLogout();

        // 无论后端返回什么，都清除本地存储
        this.clearUserState();

        if (result && result.message === "退出登录成功") {
          return { success: true, message: "已退出登录" };
        } else if (result && result.error) {
          return { success: false, message: result.error };
        } else {
          return { success: true, message: "已清除本地登录状态" };
        }
      } catch (error) {
        console.error("登出错误:", error);
        // 即使API调用失败，也清除本地存储
        this.clearUserState();
        return {
          success: false,
          message: "登出过程中出错，但已清除本地登录状态",
        };
      }
    },

    // 清除用户状态的辅助方法
    clearUserState() {
      this.token = "";
      this.userInfo = {};
      this.expiredAt = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expiredAt");
    },
  },
});

export default useLoginStore;
