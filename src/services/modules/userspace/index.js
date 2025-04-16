/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-04-14 23:33:27
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-04-15 00:07:46
 * @FilePath: \AI_vue3\vue-aigc\src\services\modules\userspace\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import MYRequest from "../../request/index";

/**
 * 获取用户文章统计数据
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回包含文章统计数据的Promise
 */
export function fetchArticleStats(userId) {
  return MYRequest.get({
    url: "/user/stats/articles",
    params: { userId },
  });
}

/**
 * 获取用户写作习惯统计数据
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回包含写作习惯统计数据的Promise
 */
export function fetchWritingHabits(userId) {
  return MYRequest.get({
    url: "/user/stats/writing-habits",
    params: { userId },
  });
}

/**
 * 获取用户收藏统计数据
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回包含收藏统计数据的Promise
 */
export function fetchFavoriteStats(userId) {
  return MYRequest.get({
    url: "/user/stats/favorites",
    params: { userId },
  });
}

/**
 * 获取用户内容使用统计数据
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回包含内容使用统计数据的Promise
 */
export function fetchContentUsageStats(userId) {
  return MYRequest.get({
    url: "/user/stats/content-usage",
    params: { userId },
  });
}
