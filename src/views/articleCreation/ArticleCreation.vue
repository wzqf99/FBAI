<template>
    <div class="container">
        <div class="left-panel">
            <!-- 参数收集 -->
            <div class="left-params">
                <!-- 返回上一级路由 -->
                <div class="page-header">
                    <el-button type="text" @click="goBack">
                        <el-icon>
                            <ArrowLeft />
                        </el-icon>
                        返回
                    </el-button>
                </div>
                <!-- 表单 -->
                <el-form :model="paramsData">
                    <el-form-item>
                        <div>文章描述:</div>
                        <el-input v-model="paramsData.contentTemplate" type="textarea" placeholder="告诉我你想写什么"
                            :rows="6" />
                    </el-form-item>
                    <el-form-item label="是否开启联网">
                        <el-switch v-model="value1" />
                    </el-form-item>
                    <el-form-item label="文案类型">
                        <el-select v-model="paramsData.articleType">
                            <!-- 这里需要收集的是值 而不是id -->
                            <el-option v-for="(item, index) in articleTypes" :key="item.id" :label="item.name"
                                :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="语言风格">
                        <el-select v-model="paramsData.languageStyle">
                            <!-- 这里需要收集的是值 而不是id -->
                            <el-option v-for="(item, index) in languageStyles" :key="item.id" :label="item.name"
                                :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章篇幅">
                        <el-input type="text" v-model="paramsData.max_token"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="handlesumbit">直接成文</el-button>
                </el-form>
            </div>
        </div>
        <div class="right-panel">
            <!-- 内容展示 -->
            <div class="right-content" v-html="articleData.content">
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

import useArticleStore from '@/store/modules/articles'
const value1 = ref(false);

const paramsData = ref({
    contentTemplate: '',
    max_token: 800,
    articleType: '',
    languageStyle: '',
})

function getTypeOrStyleId(targetArr, value) {
    return targetArr.filter(item => item.name == value)[0].id; // 这里需要根据值获取id
}

/* {
  "user_id": 1, //来自token
  "topic_id": null, 
  "article_type_id": 1, 
  "language_style_id": 1, 
  "content_template": "用户输入测试", 
  "title": "测试文章标题",
  "content": "这是文章的内容，包含一些测试文本。",
  "word_count": 800,
  "status": "draft"
   } */
const articleData = ref({
    user_id: 1,
    topic_id: null,
    article_type_id: getTypeOrStyleId(articleTypes.value, paramsData.value.articleType),
    language_style_id: getTypeOrStyleId(languageStyles.value, paramsData.value.languageStyle),
    content_template: paramsData.value.contentTemplate,
    title: '测试文章标题',
    content: '',
    word_count: paramsData.value.max_token,
    status: 'draft',
})

const articleTypes = ref([])

const languageStyles = ref([])

const handlesumbit = () => {
    const queryString = new URLSearchParams(paramsData.value).toString();
    const url = `http://localhost:3000/api/article/generateArticleDraft?${queryString}`;
    const eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
        articleData.value.content = articleData.value.content + event.data;
    };
    eventSource.onerror = (error) => {
        console.error('EventSource 错误:', error);
        eventSource.close();
    };

}

const articleStore = useArticleStore();

onMounted(async () => {
    // 获取文章类型和语言风格
    await articleStore.getArticleTypesAction();
    articleTypes.value = articleStore.articleTypes;
    await articleStore.getArticleStylesAction();
    languageStyles.value = articleStore.articleStyles;
});


const router = useRouter();
const goBack = () => {
    router.back()
}



</script>

<style scoped>
.container {
    display: flex;
    /* 去除滚动条 */
    overflow-y: hidden;
    height: 100vh;
}

.left-panel {
    display: flex;
    justify-content: center;
    height: 100%;
    width: 30%;
    padding-top: 60px;

    .left-params {
        width: 80%;
        height: 100%;
    }
}


.right-panel {
    display: flex;
    justify-content: center;
    background-color: lightgreen;
    flex-grow: 1;
    height: 100%;

    .right-content {
        margin-top: 10px;
        width: 80%;
        height: 100%;
        background-color: pink;
    }
}
</style>