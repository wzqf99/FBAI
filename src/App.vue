<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-01-08 14:58:47
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-04-16 23:52:18
 * @FilePath: \AI_vue3\vue-aigc\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <!-- 只在需要的页面显示侧边栏 -->
    <Sidebar v-if="shouldShowSidebar" />
    <!-- 内容区域，根据是否显示侧边栏调整样式 -->
    <div class="content" :class="{ 'full-width': !shouldShowSidebar }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import useLoginStore from '@/store/modules/login.js';

// 获取当前加载的路由和store
const route = useRoute();
const router = useRouter();
const loginStore = useLoginStore();

// 判断用户是否已认证
const isAuthenticated = computed(() => !!loginStore.token);

// 计算是否应该显示侧边栏
const shouldShowSidebar = computed(() => {
  // 不显示侧边栏的情况：
  // 1. 路由meta中isShow为true (如创作页)
  // 2. 当前路径是/auth (登录/注册页)
  // 3. 用户未认证
  return !route.meta.isShow && route.path !== '/auth' && isAuthenticated.value;
});

// 在组件挂载时检查认证状态并重定向
onMounted(() => {
  // 如果用户未登录且当前不在登录页面，重定向到登录页面
  if (!isAuthenticated.value && route.path !== '/auth') {
    router.push('/auth');
  }
  // 如果用户已登录但在登录页面，重定向到首页
  else if (isAuthenticated.value && route.path === '/auth') {
    router.push('/home');
  }
});
</script>

<style scoped>
#app {
  height: 100vh;
  display: flex;
}

.Sidebar {
  width: 250px;
  flex-shrink: 0;
}

.content {
  flex-grow: 1;
  box-sizing: border-box;
  height: 100vh;
  overflow: auto;
}

/* 当不显示侧边栏时，内容区域占满全宽 */
.content.full-width {
  width: 100%;
}

.content ::-webkit-scrollbar {
  display: none;
}
</style>



<!-- <template>
  <div id="app">
    <Sidebar v-if="!route.meta.isShow" />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Chat from './components/Chat.vue';
import Sidebar from './components/Sidebar.vue';
import { useRoute } from 'vue-router'
// 获取当前加载的路由 根据路由元信息来确定是否展示tabbar组件 
// 直接在此处判断v-if="!route.meta.isShow" 防止信息变为非响应式
const route = useRoute()
</script>

<style scoped>
#app {
  height: 100vh;
  display: flex;

  .Sidebar {
    width: 250px;
    flex-shrink: 0;
  }

  .content {
    flex-grow: 1;
    box-sizing: border-box;
    height: 100vh;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }

}
</style>
 -->