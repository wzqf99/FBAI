/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 16:05:14
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-18 16:36:47
 * @FilePath: \AI_vue3\vue-aigc\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: () => import("@/views/home/Home.vue"),
  },
  {
    path: "/artichleManage",
    component: () => import("@/views/articleManage/ArticleManage.vue"),
  },
  {
    path: "/topic",
    component: () => import("@/views/topic/TopicContent.vue"),
  },
  {
    path: "/userSpace",
    component: () => import("@/views/userSpace/UserContent.vue"),
  },
  {
    path: "/articleCreation",
    component: () => import("@/views/articleCreation/ArticleCreation.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
