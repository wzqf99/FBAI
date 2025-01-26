<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-01-06 19:37:09
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-01-08 17:15:28
 * @FilePath: \AI_vue3\vue-aigc\src\components\Chat.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="main">
    <div class="header">
      <div class="txt">ChatGPT</div>
      <div class="userinfo">用户名</div>
    </div>
    <!-- 整个聊天区域 -->
    <div class="chat">
      <!-- 聊天交互区域 -->
      <div class="chat-box">{{ responseResult }}</div>
      <!-- 发出提问区域 -->
      <div class="input-box">
        <input class="output" type="text" v-model="userInput" placeholder="给Chatgpt发送消息" />
        <button @click="sendMessage">发送</button>
      </div>
    </div>
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

/* function sendMessage() {
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
} */

</script>

<style scoped>
.chat .content {
  white-space: pre-wrap;
  /* 可换行显示内容 */
}

.main {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;

  /* 顶部用户信息栏 */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 44px;
    background-color: #FFFFFF;
    font-size: 20px;
    text-align: center;
    line-height: 44px;

    .userinfo {
      align-self: flex-end;
      font-size: 20px;
      color: #000000;
    }
  }

  /* 整个聊天区域  */
  .chat {
    width: 80%;
    height: 80%;

    /* 聊天区域对话 */
    .chat-box {
      width: 100%;
      height: calc(100% - 88px);
    }

    /* 发送消息区域 */
    .input-box {

      display: flex;
      flex-direction: column;
      padding: 10px;
      height: 88px;
      background-color: #F4F4F4;
      /* 圆角边框 */
      border-radius: 16px;

      .output {
        width: 100%;
        height: 40px;
        border: none;
        border-radius: 20px;
        font-size: 16px;
        color: #000000;
        background-color: #F4F4F4;
        outline: none;
      }

      button {
        align-self: flex-end;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 16px;
        font-size: 12px;
        color: #fff;
        background-color: #000000;
        outline: none;
        cursor: pointer;
      }
    }
  }

}
</style>