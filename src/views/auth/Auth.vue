<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-tab" :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">
          登录
        </div>
        <div class="auth-tab" :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">
          注册
        </div>
      </div>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'" class="auth-form">
        <h2>欢迎回来</h2>
        <div class="form-group">
          <label>用户名或邮箱</label>
          <input style="width:25vw" type="text" v-model="loginForm.usernameOrEmail" placeholder="请输入用户名或邮箱" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input style="width:25vw" type="password" v-model="loginForm.password" placeholder="请输入密码" />
        </div>
        <div class="form-actions">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="loginForm.remember">
            <label for="remember">记住我</label>
          </div>
          <a href="#" class="forgot-password">忘记密码?</a>
        </div>
        <div v-if="loginError" class="error-message">{{ loginError }}</div>
        <button class="auth-button" @click="handleLogin" :disabled="loginLoading">
          {{ loginLoading ? '登录中...' : '登录' }}
        </button>
      </div>

      <!-- Register Form -->
      <div v-if="activeTab === 'register'" class="auth-form">
        <h2>创建账号</h2>
        <div class="form-group">
          <label>用户名</label>
          <input style="width:25vw" type="text" v-model="registerForm.username" placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input style="width:25vw" type="email" v-model="registerForm.email" placeholder="请输入邮箱" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input style="width:25vw" type="password" v-model="registerForm.password" placeholder="请输入密码" />
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input style="width:25vw" type="password" v-model="registerForm.confirmPassword" placeholder="请再次输入密码" />
        </div>
        <div v-if="registerError" class="error-message">{{ registerError }}</div>
        <button class="auth-button" @click="handleRegister" :disabled="registerLoading">
          {{ registerLoading ? '注册中...' : '注册' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import useLoginStore from '@/store/modules/login';

const router = useRouter();
const loginStore = useLoginStore();
const activeTab = ref('login');

// 状态变量
const loginLoading = ref(false);
const registerLoading = ref(false);
const loginError = ref('');
const registerError = ref('');

// 登录表单数据
const loginForm = reactive({
  usernameOrEmail: '',
  password: '',
  remember: false
});

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// 登录处理
const handleLogin = async () => {
  if (!loginForm.usernameOrEmail || !loginForm.password) {
    loginError.value = '请填写完整的登录信息';
    return;
  }
  try {
    loginLoading.value = true;
    loginError.value = '';
    const result = await loginStore.loginAccountAction({
      usernameOrEmail: loginForm.usernameOrEmail,
      password: loginForm.password
    });
    if (result.success) {
      const redirectPath = router.currentRoute.value.query.redirect || '/home';
      router.push(redirectPath);
    } else {
      loginError.value = result.message;
    }
  } catch (error) {
    console.error('登录错误:', error);
    loginError.value = '登录出错，请稍后再试';
  } finally {
    loginLoading.value = false;
  }
};

// 注册处理
const handleRegister = async () => {
  if (!registerForm.username || !registerForm.email || !registerForm.password) {
    registerError.value = '请填写完整的注册信息';
    return;
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    registerError.value = '两次输入的密码不一致';
    return;
  }
  try {
    registerLoading.value = true;
    registerError.value = '';
    const result = await loginStore.registerAccountAction({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    });
    if (result.success) {
      registerForm.username = '';
      registerForm.email = '';
      registerForm.password = '';
      registerForm.confirmPassword = '';
      activeTab.value = 'login';
      loginError.value = '注册成功，请登录';
    } else {
      registerError.value = result.message;
    }
  } catch (error) {
    console.error('注册错误:', error);
    registerError.value = '注册出错，请稍后再试';
  } finally {
    registerLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.auth-header {
  display: flex;
  border-bottom: 1px solid #eee;
}

.auth-tab {
  flex: 1;
  text-align: center;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-tab.active {
  color: #3498db;
  border-bottom: 2px solid #3498db;
}

.auth-form {
  padding: 24px;
}

.auth-form h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 24px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 16px;
  font-size: 14px;
}

.auth-button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.auth-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
</style>