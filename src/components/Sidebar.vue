<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-19 10:51:36
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-20 19:40:41
 * @FilePath: \AI_vue3\vue-aigc\src\components\Sidebar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="sidebar">
        <div :class="{ active: currentIndex == index }" class="sidebar-item" @click="pushtoview(item, index)"
            v-for="(item, index) in sidebarData" :key="index">
            <el-icon :size="20">
                <Component :is="Icons[item.icon]"></Component>
            </el-icon>
            <div>{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup>
import {
    Edit,
    Collection,
    SetUp,
    User,
    DataAnalysis
} from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const Icons = {
    Edit,
    Collection,
    SetUp,
    User,
    DataAnalysis
}
const sidebarData = [
    { name: '创作首页', path: '/home', icon: 'Edit' },
    { name: '作品管理', path: '/artichleManage', icon: 'Collection' },
    { name: '选题中心', path: '/topic', icon: 'SetUp' },
    { name: '文章数据', path: '/userSpace', icon: 'DataAnalysis' },
    { name: '个人中心', path: '/userInfo', icon: 'User' }
];
const currentIndex = ref(0);
const pushtoview = (item, index) => {
    currentIndex.value = index
    router.push(item.path)
}

onMounted(() => {
    // 解决router.back()后选中项不对的问题
    updateActiveIndex(route.path);
});

const updateActiveIndex = (path) => {
    const index = sidebarData.findIndex(item => item.path === path);
    currentIndex.value = index !== -1 ? index : 0;  // 找不到就默认选第一个
};

// 匹配当前路由 确保刷新选中的项
watch(() => route.path, (newval) => {
    updateActiveIndex(newval);
})
</script>

<style lang="less" scoped>
.sidebar {
    width: 250px;
    background-color: #F9F9F9;
    height: 100%;
    /* position: fixed;
    top: 0;
    left: 0; */

    .sidebar-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 20px;
        height: 32px;
        line-height: 32px;

        >div:nth-child(2) {
            padding-left: 20px;
        }

        &:hover {
            background-color: #ECECEC;
            cursor: pointer;
        }

        &.active {
            background-color: #DBEAFE;
            color: #4D6BFE;
        }
    }
}
</style>