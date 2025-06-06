/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 16:53:05
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-04-17 00:27:07
 * @FilePath: \AI_vue3\vue-aigc\src\store\modules\articles.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";
import {
  getArticleTypes,
  getArticleStyles,
  getArticleList,
  deleteArticle,
} from "@/services/modules/articles/index";
const useArticleStore = defineStore("article", {
  state: () => ({
    articleTypes: [],
    articleStyles: [],
    articleList: [],
    pagination: {},
  }),

  actions: {
    // 获取文章类型
    async getArticleTypesAction() {
      const result = await getArticleTypes();
      this.articleTypes = result.data;
    },

    // 获取文章风格
    async getArticleStylesAction() {
      const result = await getArticleStyles();
      this.articleStyles = result.data;
    },

    // 获取文章列表
    async getArticleListAction(user_id, page, pageSize, searchParams) {
      const result = await getArticleList(
        user_id,
        page,
        pageSize,
        searchParams
      );
      this.articleList = result.data;
      this.pagination = result.pagination;
    },

    // 删除文章
    async deleteArticleAction(id) {
      console.log("删除？", id);
      const result = await deleteArticle(id);
      console.log("删除结果", result);
      return result.articleId;
    },
  },
});

export default useArticleStore;
