/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-21 15:12:36
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-28 14:55:39
 * @FilePath: \AI_vue3\vue-aigc\src\services\modules\articles\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import MYRequest from "../../request/index";

// 获取文章类型
export function getArticleTypes() {
  return MYRequest.get({ url: "/article/types" });
}

// 获取文章风格
export function getArticleStyles() {
  return MYRequest.get({ url: "/article/styles" });
}

// 生成文章
export function generateArticle(query) {
  return MYRequest.get({ url: "/article/generate", params: query });
}

// 保存文章
/**
 * @description: 
 * @param {*} data
 *
 * {
  "user_id": 1,
  "topic_id": null, 
  "article_type_id": 1, 
  "language_style_id": 1, 
  "content_template": "用户输入测试", 
  "title": "测试文章标题",
  "content": "这是文章的内容，包含一些测试文本。",
  "word_count": 800,
  "status": "draft"
   }
 */
export function createArticle(data) {
  return MYRequest.post({ url: "/article/createArticle", data });
}

// 更新文章
export function updateArticle(id, data) {
  return MYRequest.put({ url: `/article/${id}`, data });
}

// 获取文章列表 查询 searchParams
/* - `title`: 文章标题，支持模糊搜索(可选)
- `article_type`: 文章类型(可选)
- `status`: 文章状态(可选)
- `start_date`: 开始日期(可选)
- `end_date`: 结束日期(可选) */
export function getArticleList(user_id, page, pageSize, searchParams) {
  return MYRequest.get({
    url: "/article/articleList",
    params: {
      user_id,
      page,
      pageSize,
      ...searchParams,
    },
  });
}
