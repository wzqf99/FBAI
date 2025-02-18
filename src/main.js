/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-01-08 14:58:47
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-18 16:54:28
 * @FilePath: \AI_vue3\vue-aigc\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import "normalize.css";
import "./assets/css/index.css";
import router from "./router";
import pinia from "./store";

import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

/* app.use(ElementPlus) */
app.use(router);
app.use(pinia).mount("#app");
