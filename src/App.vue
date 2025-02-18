<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-01-08 14:58:47
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-18 17:17:56
 * @FilePath: \AI_vue3\vue-aigc\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import Chat from './components/Chat.vue';
</script>

<template>
  <div id="app">
    <router-view></router-view>
    <Chat />
  </div>
</template>

<style scoped></style>
