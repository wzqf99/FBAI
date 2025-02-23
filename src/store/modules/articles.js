/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 16:53:05
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-23 16:32:35
 * @FilePath: \AI_vue3\vue-aigc\src\store\modules\articles.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";
import {
  getArticleTypes,
  getArticleStyles,
  generateArticle,
} from "@/services/modules/articles/index";
const useArticleStore = defineStore("login", {
  state: () => ({
    articleTypes: [],
    articleStyles: [],
  }),

  actions: {
    async getArticleTypesAction() {
      try {
        const result = await getArticleTypes();
        console.log(result); // 输出返回的完整响应
        if (result && result.data) {
          this.articleTypes = result.data;
        } else {
          console.error("获取文章类型失败：没有返回正确的数据", result);
        }
      } catch (error) {
        console.error("请求失败", error);
      }
    },

    async getArticleStylesAction() {
      const result = await getArticleStyles();
      this.articleStyles = result.data;
    },
  },
});

export default useArticleStore;
