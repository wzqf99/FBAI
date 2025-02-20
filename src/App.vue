<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-01-08 14:58:47
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-19 17:39:26
 * @FilePath: \AI_vue3\vue-aigc\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
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
