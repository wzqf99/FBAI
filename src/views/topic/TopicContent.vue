<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 16:28:16
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-05-11 00:51:27
 * @FilePath: \AI_vue3\vue-aigc\src\views\topic\TopicContent.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="topic">
        <div class="topic_content">
            <div class="tabs-content">
                <TabsSlider @updateIdx="handleCheck" :tabs="tabs" :currentIndex="currentIndex"></TabsSlider>
            </div>
            <div class="maincontent">
                <TopicGenerate v-show="currentIndex === 0" ref="topicGenerateRef"></TopicGenerate>
                <InspirationLibrary v-show="currentIndex === 1" @updateIndex="cpncheck"></InspirationLibrary>
                <TopicCollection v-if="currentIndex === 2"></TopicCollection>
            </div>
        </div>
    </div>
</template>

<script setup>
import TopicCollection from './TopicCollection.vue'
import TopicGenerate from './TopicGenerate.vue'
import InspirationLibrary from './InspirationLibrary.vue'
import TabsSlider from './TabsSlider.vue'

import { nextTick, onMounted, ref } from 'vue';
const tabs = [
    { id: 1, name: "话题生成" },
    { id: 2, name: "灵感库" },
    { id: 3, name: "话题收藏" }
]
const currentIndex = ref(0)
const handleCheck = (index) => {
    currentIndex.value = index
}
const topicGenerateRef = ref(null);
// 从热搜这个组件传过来的值  接受热搜组件的传值 更新话题组件的参数
const cpncheck = (index, title, desc) => {
    // 如果是从首页跳转过来的（index = 999）
    if (index === 999) {
        console.log("从首页推荐选题跳转: ", title);
        // 设置为话题生成页面（索引0）
        currentIndex.value = 0;

        // 确保组件已渲染后再调用方法
        nextTick(() => {
            if (topicGenerateRef.value) {
                // 调用话题生成组件的方法，更新话题参数
                // 注意：我们传递0作为index，因为我们希望保持在话题生成页
                topicGenerateRef.value.updateTopicData(0, title, desc || "");
            } else {
                console.error("topicGenerateRef is null");
            }
        });
    } else {
        // 正常的组件间切换行为
        currentIndex.value = index;
        console.log(index, title, desc, "子组件传过来的值");

        // 调用话题生成这个子组件的方法 更新话题参数
        nextTick(() => {
            if (topicGenerateRef.value) {
                topicGenerateRef.value.updateTopicData(index, title, desc);
            }
        });
    }
}

onMounted(() => {
    // 检查本地存储中是否有选题信息
    const selectedTopic = localStorage.getItem('selectedTopic');
    if (selectedTopic) {
        const { index, title, desc } = JSON.parse(selectedTopic);

        // 调用处理函数
        cpncheck(index, title, desc);

        // 清除本地存储，避免重复使用
        localStorage.removeItem('selectedTopic');
    }
});
</script>

<style lang="less" scoped>
.topic_content {
    width: 100%;
    height: 100vh;
    background-color: #FFFFFF;

    .tabs-content {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
        background-color: #FFFFFF;
    }

    .maincontent {
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
        /* background-color: pink; */
        height: calc(100vh - 80px - 40px);
    }
}
</style>