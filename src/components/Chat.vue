<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-01-06 19:37:09
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-01-08 14:53:30
 * @FilePath: \AI_vue3\vue-aigc\src\components\Chat.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="chat">
    <h1 class="content">{{ responseResult }}</h1>
    <input type="text" v-model="userInput" placeholder="请输入" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userInput = ref("");
const responseResult = ref("");
const userMessages = ref([
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "你是谁？" }
]);

function sendMessage() {
  // 1. 将 messages 数组 JSON.stringify
  userMessages.value.push({ role: "user", content: userInput.value });
  const encodedMessages = encodeURIComponent(JSON.stringify(userMessages.value));

  // 2. 拼接到 SSE URL 的 query 参数中
  // 比如 /api/test?messages=...
  const url = `http://localhost:3000/api/test?messages=${encodedMessages}`;
  console.log("Sending message:", url);
  const eventSource = new EventSource(url);

  // 3. 监听 SSE 消息
  eventSource.onmessage = (event) => {
    console.log("Received message:", event.data);
    // 这里把数据拼接到 responseResult，或推入一个 "assistant" 角色的消息里
    responseResult.value = responseResult.value + event.data
  };

  // 4. 监听 SSE 错误事件
  eventSource.onerror = (error) => {
    console.error("SSE Error:", error);
    eventSource.close();
  };
}

</script>

<style scoped>
.content {
  white-space: pre-wrap;
  /* 可换行显示内容 */
}
</style>