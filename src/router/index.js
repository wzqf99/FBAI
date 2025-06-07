/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 16:05:14
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-05-11 08:46:19
 * @FilePath: \AI_vue3\vue-aigc\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: () => import("@/views/home/Home.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/artichleManage",
    component: () => import("@/views/articleManage/ArticleManage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/topic",
    name: "topic",
    component: () => import("@/views/topic/TopicContent.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/userSpace",
    component: () => import("@/views/userSpace/UserContent.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/articleCreation",
    component: () => import("@/views/articleCreation/ArticleCreation.vue"),
    meta: {
      isShow: true,
      requiresAuth: true,
    },
  },
  {
    path: "/auth",
    component: () => import("@/views/auth/Auth.vue"),
    meta: {
      isShow: false,
      requiresAuth: false,
    },
  },
  {
    path: "/userInfo",
    component: () => import("@/views/userInfo/UserInfo.vue"),
    meta: {
      isShow: false,
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // 判断页面是否需要登录权限
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 如果需要登录权限但没有token，重定向到登录页面
    if (!token) {
      next({
        path: "/auth",
        query: { redirect: to.fullPath }, // 将要访问的路径作为参数，便于登录后重定向
      });
    } else {
      next(); // 有token，放行
    }
  } else {
    next(); // 不需要登录权限的页面，直接放行
  }
});

export default router;

/* import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: () => import("@/views/home/Home.vue"),
  },
  {
    path: "/auth",
    component: () => import("@/views/auth/Auth.vue"),
    meta: {
      isShow: false, // Hide the sidebar for login/register page
    },
  }
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
    meta: {
      isShow: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; */
