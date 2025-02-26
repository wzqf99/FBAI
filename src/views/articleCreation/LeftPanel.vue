<!-- LeftPanel.vue -->
<template>
    <div class="left-panel">
        <div class="left-params">
            <div class="page-header">
                <el-button type="text" @click="goBack">
                    <el-icon>
                        <ArrowLeft />
                    </el-icon> 返回
                </el-button>
            </div>
            <el-form :model="paramsData">
                <el-form-item>
                    <div>文章描述:</div>
                    <el-input v-model="paramsData.contentTemplate" type="textarea" placeholder="告诉我你想写什么" :rows="6" />
                </el-form-item>
                <el-form-item label="是否开启联网">
                    <el-switch v-model="enableNetwork" />
                </el-form-item>
                <el-form-item label="文案类型">
                    <el-select v-model="paramsData.articleType">
                        <el-option v-for="item in articleTypes" :key="item.id" :label="item.name" :value="item.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="语言风格">
                    <el-select v-model="paramsData.languageStyle">
                        <el-option v-for="item in languageStyles" :key="item.id" :label="item.name"
                            :value="item.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="文章篇幅">
                    <el-input type="text" v-model="paramsData.max_token" />
                </el-form-item>
                <el-button type="primary" @click="handleSubmit">直接成文</el-button>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useArticleStore from '@/store/modules/articles'
import { ArrowLeft } from '@element-plus/icons-vue'

const emit = defineEmits(['submit'])

const router = useRouter()
const articleStore = useArticleStore()

// 响应式数据
const paramsData = ref({
    contentTemplate: '',
    max_token: 800,
    articleType: '',
    languageStyle: '',
})
const enableNetwork = ref(false)
const articleTypes = ref([])
const languageStyles = ref([])

// 生命周期
onMounted(async () => {
    await articleStore.getArticleTypesAction()
    articleTypes.value = articleStore.articleTypes
    await articleStore.getArticleStylesAction()
    languageStyles.value = articleStore.articleStyles
})

// 事件处理
const goBack = () => {
    router.back()
}

const handleSubmit = () => {
    emit('submit', {
        paramsData,
    })
}
</script>

<style scoped>
.left-panel {
    width: 30%;
    height: 100%;
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 8px 8px #ccc;
}

.left-params {
    width: 80%;
    height: 100%;
}
</style>