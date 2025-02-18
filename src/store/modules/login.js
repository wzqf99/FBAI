import { defineStore } from "pinia";
import {
  accountLogin,
  accountRegister,
  accountLogout,
} from "@/services/modules/login/index";
const useLoginStore = defineStore("login", {
  state: () => ({
    token: "",
  }),

  actions: {
    async loginAccountAction(account) {
      const result = await accountLogin(account);
    },
  },
});
