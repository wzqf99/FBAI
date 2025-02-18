/*
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 15:09:07
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-18 16:01:11
 * @FilePath: \AI_vue3\vue-aigc\src\services\modules\login\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import MYRequest from "../../request/index";

// 登录 {usernameOrEmail:string,password:string}
export function accountLogin(account) {
  return MYRequest.post({ url: "/login", data: account });
}

// 注册 { username, email, password }
export function accountRegister(account) {
  return MYRequest.post({ url: "register", data: account });
}

// 登出 请求拦截器中请求头带token
export function accountLogout() {
  return MYRequest.post({ url: "logout" });
}
