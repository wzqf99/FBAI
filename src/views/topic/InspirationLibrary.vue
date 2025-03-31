<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-03-06 17:14:23
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-03-29 16:27:47
 * @FilePath: \AI_vue3\vue-aigc\src\views\topic\InspirationLibrary.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="inspiration">
        <div class="tab-hot-select">
            <div v-for="(item, index) in tabItems" :key="index">
                <div class="tab-hot-item" :class="{ active: activeTab === item.key }" @click="handleHotClick(item.key)">
                    {{ item.label }}
                </div>
            </div>
        </div>
        <div class="hot-messages">
            <div class="hot-item" v-for="(item, index) in currentList" :key="index">
                <h3 class="title">{{ item.index }}.{{ item.title }}</h3>
                <div class="description">{{ item.desc }}</div>
                <div class="more">
                    <div class="details" @click="viewDetails(item)">查看详情</div>
                    <div class="generte" @click="goToCreate(item)">结合该热点去创作</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchhotMessages } from '@/services/modules/topics';

const emit = defineEmits(['updateIndex']);

// 数据
const allHotMessages = ref({});
const activeTab = ref('all'); // 默认显示全部

// 定义标签与数据键的映射关系
const tabItems = [
    { label: '全部', key: 'all' },
    { label: '微博', key: 'weibo' },
    { label: '百度', key: 'baidu' },
    { label: '知乎', key: 'zhihu' },
    { label: '抖音', key: 'douyin' },
    { label: '哔哩哔哩', key: 'bilihot' }
];

// 计算属性：当前显示的列表
const currentList = computed(() => {
    return allHotMessages.value[activeTab.value] || [];
});

//初始化数据 将数据整合添加一个all分类 这个分类是所有分类的集合
async function loadmessages() {
    try {
        const res = await fetchhotMessages();
        let listObj = res.data;
        console.log(res.data, "原始数据");
        let allList = [];
        let i = 1;
        // 处理每个分类的数据
        for (let key of Object.keys(listObj)) {
            listObj[key].forEach((item) => {
                allList.push({
                    index: i,
                    url: item.url,
                    title: item.title,
                    desc: item.desc,
                    category: key
                });
                i++;
            });
        }

        // 添加全部分类
        listObj['all'] = allList;
        allHotMessages.value = listObj;
        console.log(allHotMessages.value, "最终数据");
    } catch (error) {
        console.error("加载热门消息失败:", error);
    }
}

// 处理标签点击
function handleHotClick(key) {
    console.log(key, "点击的标签键");
    activeTab.value = key;
}

// 详情查看
function viewDetails(item) {
    console.log("查看详情:", item);
    // 可以添加导航到详情页的逻辑
    window.open(item.url, '_blank');
}

// 去创作
function goToCreate(item) {
    console.log("去创作:", item.title, item.desc);
    // 添加导航到创作页面的逻辑
    emit('updateIndex', 0, item.title, item.desc);
}

onMounted(() => {
    loadmessages();
});
</script>

<style lang="less" scoped>
.tab-hot-select {
    display: flex;
    margin-bottom: 20px;
}

.tab-hot-item {
    padding: 8px 16px;
    cursor: pointer;
    margin-right: 10px;
    border-radius: 4px;
}

.tab-hot-item:hover {
    background-color: #f0f0f0;
}

.tab-hot-item.active {
    background-color: #e0e0e0;
    font-weight: bold;
}

.hot-messages {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.hot-item {
    border: 1px solid #eee;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.title {
    margin-top: 0;
    margin-bottom: 10px;
    width: 400px;
    /* 方案1: 单行省略号 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* 添加title属性，鼠标悬停时显示完整标题 */
    cursor: default;
}

.description {
    color: #666;
    width: 600px;
    font-size: 12px;
    margin-bottom: 15px;
}

.more {
    display: flex;
    justify-content: space-between;
}

.details,
.generte {
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f5f5f5;
}

.generte {
    background-color: #4caf50;
    color: white;
}


.inspiration {
    display: flex;
    height: calc(100vh - 80px);
    /* 让整体铺满屏幕 */
    padding: 0;
}

/* 左侧：热搜 Tab 选择 */
.tab-hot-select {
    width: 180px;
    display: flex;
    flex-direction: column;
    /* 纵向排列 */
    padding: 10px;
    box-shadow: 0 0 4px #ccc;
    border-radius: 10px;
}

.tab-hot-item {
    padding: 12px;
    text-align: center;
    cursor: pointer;
    background-color: #fff;
    margin-bottom: 10px;
    /* 保持间距 */
    border-radius: 6px;
    transition: background-color 0.3s;
}

.tab-hot-item:hover {
    background-color: #007aff;
    color: white;
}


/* 右侧：热搜内容（自上而下排列） */
.hot-messages {
    flex: 1;
    /* 让内容占满剩余空间 */
    display: flex;
    flex-direction: column;
    /* 让内容纵向排列 */
    gap: 10px;
    padding: 15px;
    overflow-y: auto;
    /* 当内容过多时可滚动 */
    box-shadow: 0 0 2px #ccc;
    border-radius: 10px;
    margin-left: 20px;
}

.hot-item {
    position: relative;
    padding: 15px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.more {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;

    .details {
        margin-right: 10px;
        padding: 5px 10px;
        background-color: #fff;
        color: #007aff;
        border-radius: 20px;
        cursor: pointer;
        border: 1px solid #ccc;

        &:hover {
            background-color: #007AFF;
            color: #fff;
        }


    }

    .generte {
        padding: 5px 10px;
        background-color: #007aff;
        color: white;
        border-radius: 20px;
        cursor: pointer;

        &:hover {
            background-color: #2788f0;
            color: #fff;
            border: 1px solid #007aff;
        }
    }
}

.hot-item:hover {
    transform: scale(1.02);
}
</style>