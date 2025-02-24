<template>
    <div class="container">
        <div class="left-panel">
            <div class="left-params">
                <div class="page-header">
                    <el-button type="text" @click="goBack">
                        <el-icon>
                            <ArrowLeft />
                        </el-icon>
                        返回
                    </el-button>
                </div>
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
                            <el-option v-for="(item, index) in articleTypes" :key="item.id" :label="item.name"
                                :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="语言风格">
                        <el-select v-model="paramsData.languageStyle">
                            <el-option v-for="(item, index) in languageStyles" :key="item.id" :label="item.name"
                                :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章篇幅">
                        <el-input type="text" v-model="paramsData.max_token" />
                    </el-form-item>
                    <el-button type="primary" @click="handlesumbit">
                        直接成文
                    </el-button>
                </el-form>
            </div>
        </div>

        <div class="right-panel">
            <!-- 预览容器 -->
            <div v-show="!editorVisible" class="preview-container">
                <div class="preview-pane" v-html="sseBuffer">
                </div>
                <div class="preview-bar">
                    <!-- 生成中状态 -->
                    <div v-if="sseGenerating" class="generate-bar">
                        <el-button type="text">生成中...</el-button>
                    </div>
                    <!-- 生成完成状态 -->
                    <div v-if="!sseGenerating && !editorVisible" class="save-bar">
                        <el-button @click="handleSaveAndEdit" color="#4d6bfe">
                            保存 & 编辑
                        </el-button>
                        <el-button @click="handleAbandon">
                            弃用
                        </el-button>
                        <el-button @click="handleRegenerate">
                            重新生成
                        </el-button>
                    </div>
                </div>

            </div>

            <!-- 编辑器容器 -->
            <div v-show="editorVisible" class="editor-container">
                <EditorContent :editor="editor" class="tiptap-editor" />
                <div class="bottombar">
                    字数
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useArticleStore from '@/store/modules/articles'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { createArticle } from '@/services/modules/articles/index'

const value1 = ref(false)
const paramsData = ref({
    contentTemplate: '',
    max_token: 800,
    articleType: '',
    languageStyle: '',
})

const articleTypes = ref([])
const languageStyles = ref([])

const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>等待生成内容...</p>',
    autofocus: true,
    editable: true,
})

const sseBuffer = ref('')
const sseGenerating = ref(false)
const editorVisible = ref(true) // 默认显示编辑器
const sseFinished = ref(false)

// 编辑器
const handlesumbit = () => {
    // 隐藏编辑器，显示预览
    editorVisible.value = false
    sseGenerating.value = true

    // 重置数据
    sseBuffer.value = ''
    sseFinished.value = false

    const queryString = new URLSearchParams(paramsData.value).toString()
    const url = `http://localhost:3000/api/article/generateArticleDraft?${queryString}`
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
            sseFinished.value = true
            eventSource.close()
            sseGenerating.value = false
            return
        }
        sseBuffer.value += event.data
    }

    eventSource.onerror = (error) => {
        console.error('EventSource 错误:', error)
        eventSource.close()
        sseFinished.value = true
        sseGenerating.value = false
    }
}

/* // 此时保存当前文章
const handleSaveAndEdit = async () => {
    // 将生成内容填充到编辑器
    editor.value?.commands?.setContent(sseBuffer.value)
    // 切换回编辑器
    editorVisible.value = true
} */
const handleSaveAndEdit = async () => {
    try {
        // 1. 获取编辑器完整 HTML
        /*  const fullHtml = editor.value?.getHTML() || '' */
        const fullHtml = sseBuffer.value

        // 2. 解析并拆分标题与内容
        const parser = new DOMParser()
        const doc = parser.parseFromString(fullHtml, 'text/html')

        // 提取第一个 h1 作为标题（带标签）
        const titleElement = doc.querySelector('h1')
        const title = titleElement?.outerHTML || '未命名文章'

        // 移除 h1 后的内容（保留其他标签）
        if (titleElement) titleElement.remove()
        const content = doc.body.innerHTML

        // 3. 获取类型映射 ID
        const findId = (list, name) => list.value.find(item => item.name === name)?.id || null

        // 4. 构建请求数据
        const postData = {
            user_id: 3,
            topic_id: null,
            article_type_id: findId(articleTypes, paramsData.value.articleType),
            language_style_id: findId(languageStyles, paramsData.value.languageStyle),
            content_template: paramsData.value.contentTemplate,
            title: title,          // 带标签的标题
            content: content,      // 移除标题后的内容
            word_count: parseInt(paramsData.value.max_token) || 0,
            status: "draft"
        }

        // 5. 调用保存接口
        const response = await createArticle(postData)
        console.log(response, "结果")
        // 6. 成功后操作
        if (response.message==="文章创建成功") {
            // 这里用的还是蒙版的数据
            editor.value?.commands?.setContent(sseBuffer.value) // 保留完整内容
            editorVisible.value = true
            ElMessage.success('保存成功，已进入编辑模式')
        } else {
            throw new Error(response.data.message)
        }

    } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error(`保存失败: ${error.message}`)
    }
}



const handleAbandon = () => {
    // 清空内容
    sseBuffer.value = ''
    // 切换回编辑器
    editorVisible.value = true
}

const handleRegenerate = () => {
    // 隐藏编辑器，显示预览
    editorVisible.value = false
    sseGenerating.value = true
    handlesumbit()
}

const articleStore = useArticleStore()
onMounted(async () => {
    await articleStore.getArticleTypesAction()
    articleTypes.value = articleStore.articleTypes
    await articleStore.getArticleStylesAction()
    languageStyles.value = articleStore.articleStyles
})

const router = useRouter()
const goBack = () => {
    router.back()
}
</script>

<style scoped>
.container {
    display: flex;
    height: 100vh;
    overflow: hidden;
}

.left-panel {
    width: 30%;
    height: 100%;

    padding-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 8px 8px #ccc;

    .left-params {
        width: 80%;
        height: 100%;
    }
}


.right-panel {
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 8px #ccc;
}

/* 预览容器 */
.preview-container {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
}

.preview-pane {
    position: relative;
    width: 80%;
    max-height: 580px;
    background-color: #FAFBFC;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 20px;
    font-size: 20px;
    white-space: pre-wrap;
    word-break: break-word;
    overflow: auto;
    box-shadow: 0 0 8px 0 #ccc;

    .preview-bar {
        width: 400px;
        height: 60px;
        box-shadow: 0 0 8px 0 #ccc;
    }
}

/* 生成中状态 */
.generate-bar {
    margin-top: 16px;
    text-align: center;
    padding: 10px 0;
}

/* 生成完成状态 */
.save-bar {
    margin-top: 16px;
    text-align: right;
    padding: 10px 0;
}

/* 编辑器容器 */
.editor-container {
    width: 100%;
    height: 100%;
    position: relative;

    /* Tiptap 编辑器样式 内容*/
    .tiptap-editor {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 20px;
        box-sizing: border-box;
    }

    /* 底部用于展示文章的字数等信息 */
    .bottombar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background-color: pink;
    }
}



/* 深度穿透样式 */
::v-deep(.tiptap.ProseMirror) {
    min-height: 400px;
    height: 86%;
    width: 100%;
    overflow: auto;
    font-family: 'Georgia', serif;
    background-color: #fff;
    box-shadow: 0 0 8px #ccc;
    padding: 20px;
    box-sizing: border-box;
}

::v-deep(.tiptap.ProseMirror p) {
    margin: 0.75rem 0;
    text-indent: 2em;
}

::v-deep(.tiptap.ProseMirror h1) {
    font-size: 2.25rem;
    color: #1e293b;
}

::v-deep(.tiptap.ProseMirror-focused) {
    outline: 2px solid #DBEAFE;
}
</style>