<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 16:28:16
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-03-29 16:30:50
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
                <TopicGenerate v-if="currentIndex === 0" ref="topicGenerateRef"></TopicGenerate>
                <InspirationLibrary v-if="currentIndex === 1" @updateIndex="cpncheck"></InspirationLibrary>
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

import { ref } from 'vue';
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
    currentIndex.value = index
    console.log(index, title, desc, "子组件传过来的值")
    // 调用话题生成这个子组件的方法 更新话题参数
    if (topicGenerateRef.value) {
        topicGenerateRef.value.updateTopicData(index, title, desc);
    }
}

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