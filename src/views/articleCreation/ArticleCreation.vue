<template>
    <div class="container">
        <div class="left-panel">
            <div class="left-params">
                <div class="page-header">
                    <el-button type="link" @click="goBack">
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
                    <el-button type="primary" @click="handlesumbit" :disabled="cannotGenerate">
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
            <div v-show="editorVisible" class="editor-container" @click="trackClick">
                <!-- 编辑器内容区父元素 -->
                <EditorContent :editor="editor" class="tiptap-editor" />
                <!-- 浮动图标 -->
                <el-icon v-show="showMagicIcon" class="magic-icon"
                    :style="{ left: iconLeft + 'px', top: iconTop + 'px' }">
                    <MagicStick />
                    <div class="magic-bar">
                        <el-button @click="handleAction('polish')">润色</el-button>
                        <el-button @click="handleAction('expand')">扩写</el-button>
                        <el-button @click="handleAction('continue')">续写</el-button>
                        <el-button @click="handleAction('shorten')">简写</el-button>
                    </div>
                </el-icon>
                <!-- 大模型处理文本的弹窗 当调用重写那四个方法的时候将其展示位定位-->
                <div class="preview-content-text" v-if="seeNewContent">
                    <div class="text-compare">
                        {{ newgenContent }}
                    </div>
                    <!-- loading preview-actions 二者展示其一 -->
                    <div class="previewe-bottom">
                        <div class="loading" v-if="seeNewGenerating">loading...</div>
                        <div class="preview-actions" v-else>
                            <el-button @click="handleReplaceOriginal" type="success">
                                替换原文</el-button>
                            <el-button @click="handleAbandonNewContent">弃用</el-button>
                            <el-button @click="handleRegenerateNewContent">重新生成</el-button>
                        </div>
                    </div>
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
import { createArticle, updateArticle } from '@/services/modules/articles/index'

const paramsData = ref({
    contentTemplate: '',
    max_token: 800,
    articleType: '',
    languageStyle: '',
})
const articleData = ref({})
const value1 = ref(false)
const cannotGenerate = ref(false)


const articleTypes = ref([])
const languageStyles = ref([])

/* 编辑器实例化配置 */
const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>在左侧输入你的想法...</p>',
    autofocus: true,
    editable: true,
    onUpdate: ({ editor }) => {
        // 监听内容变化
        const html = editor.getHTML()
        const json = editor.getJSON()
        console.log('内容变化:', { html, json })
    },
})


const sseBuffer = ref('')
const sseGenerating = ref(false)
const editorVisible = ref(true) // 默认显示编辑器
const sseFinished = ref(false)
// 提交参数并生成文章
const handlesumbit = () => {
    // 控制按钮为不可用
    cannotGenerate.value = true
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
            cannotGenerate.value = false
            return
        }
        sseBuffer.value += event.data
    }
    eventSource.onerror = (error) => {
        console.error('EventSource 错误:', error)
        eventSource.close()
        sseFinished.value = true
        sseGenerating.value = false
        cannotGenerate.value = false
    }
}

// 保存生成的文章进入编辑模式
const handleSaveAndEdit = async () => {
    try {
        // 1. 获取编辑器完整 HTML
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
        articleData.value = response.data
        console.log(articleData.value, "结果")
        // 6. 成功后操作
        if (response.message === "文章创建成功") {
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
// 放弃本次生成的文章
const handleAbandon = () => {
    // 清空内容
    sseBuffer.value = ''
    // 切换回编辑器
    editorVisible.value = true
}
// 重新生成文章
const handleRegenerate = () => {
    // 隐藏编辑器，显示预览
    editorVisible.value = false
    sseGenerating.value = true
    handlesumbit()
}

// 控制小悬浮框的显示隐藏 
const showMagicIcon = ref(false);
// 控制小悬浮框的位置 
const iconLeft = ref(0);
const iconTop = ref(0);
// 保存鼠标点击编辑器所在的段落或标题(p h1)的值
const currentElement = ref(null)
// 新生成的内容
const newgenContent = ref('')
// 显示弹窗 生成ing
const seeNewContent = ref(false)
// 显示生成中 默认显示
const seeNewGenerating = ref(true)
// 新增状态保存操作类型
const currentActionType = ref('');


// 监听鼠标点击事件 通过时候点击到富文本编辑器中的h1或者p标签内容
// 然后获取相对位置 同时计算出悬浮图标的位置 同时让其显示出来
// 获取当前段落或者标题的内容用于重写等操作
const trackClick = (e) => {
    const target = e.target;
    // 判断目标是否是段落或标题
    if (target.closest('p, h1')) {
        // 获取目标元素的定位信息
        const rect = target.getBoundingClientRect();
        const editorRect = document.querySelector('.tiptap-editor').getBoundingClientRect();

        // 计算图标的位置（向左偏移24px）
        iconLeft.value = rect.left - editorRect.left - 30;
        iconTop.value = rect.top - editorRect.top - 10;
        showMagicIcon.value = true;
        console.log('已选中内容:', currentElement.value)
        if (currentElement.value == target) return
        currentElement.value = target
        ElMessage.success('已获取当前段落/标题文本,可对其进行重写等操作')
    } else {
        showMagicIcon.value = false;
    }
};

// 处理重写润色拓展等操作
const handleAction = (type) => {
    currentActionType.value = type
    // 收集参数 操作类型 待重写的内容 风格
    const textParams = {
        action: type,
        text: currentElement.value.innerText,
        style: paramsData.value.languageStyle
    }
    console.log(textParams)
    seeNewContent.value = true
    cannotGenerate.value = true
    const queryString = new URLSearchParams(textParams).toString()
    const url = `http://localhost:3000/api/article/rewriteText?${queryString}`
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
            eventSource.close()
            seeNewGenerating.value = false
            cannotGenerate.value = false
            return
        }
        newgenContent.value += event.data
    }
    eventSource.onerror = (error) => {
        console.error('EventSource 错误:', error)
        eventSource.close()
        seeNewGenerating.value = false
        cannotGenerate.value = false
    }
}

// 替换文本 清空新生成的内容 隐藏弹窗 调整正在生成元素的布尔值
const handleReplaceOriginal = () => {
    if (!currentElement.value) {
        ElMessage.warning('未找到要替换的段落');
        return;
    }
    currentElement.value.innerText = newgenContent.value
    seeNewContent.value = false;
    newgenContent.value = '';
    seeNewGenerating.value = true
    ElMessage.success('内容替换成功');
    updateArticleData()
};

// 放弃新生成的文本
const handleAbandonNewContent = () => {
    seeNewContent.value = false;
    newgenContent.value = '';
    seeNewGenerating.value = true;
    ElMessage.info('已弃用新生成的内容');
};

// 重新生成文本
const handleRegenerateNewContent = () => {
    newgenContent.value -= ''
    handleAction(currentActionType.value)
}

// 更新文章
const updateArticleData = async () => {
    try {
        if (!editor.value) {
            throw new Error('编辑器实例未初始化')
        }

        // 获取完整 HTML
        const fullHtml = editor.value.getHTML()

        // 解析内容
        const parser = new DOMParser()
        const doc = parser.parseFromString(fullHtml, 'text/html')
        const titleElement = doc.querySelector('h1')
        const title = titleElement?.outerHTML || '未命名文章'
        if (titleElement) titleElement.remove()
        const content = doc.body.innerHTML

        // 构建更新数据
        const updateData = {
            article_type_id: articleData.value.article_type_id,
            language_style_id: articleData.value.language_style_id,
            content_template: {
                contentId: articleData.value.content_template_id,
                contentName: paramsData.value.contentTemplate
            },
            title: title,
            content: content,
            word_count: parseInt(paramsData.value.max_token) || 0,
        }

        // 调用更新接口（假设 articleData.value.id 存在）
        const result = await updateArticle(articleData.value.id, updateData)
        console.log('更新结果:', result)
        ElMessage.success('文章已保存')
    } catch (error) {
        console.error('更新失败:', error)
        ElMessage.error(`保存失败: ${error.message}`)
    }
}


// 获取文章类型和语言风格
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

/* 左侧 */
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

/* 右侧 */
.right-panel {
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 8px #ccc;

    /* 生成文章预览容器 */
    .preview-container {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: #FFFFFF;

        /* 预览页面 */
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
    }

    /* 编辑器容器 */
    .editor-container {
        width: 100%;
        height: 100%;
        position: relative;

        /* Tiptap 编辑器样式 内容区父元素 实例化时 内容区是其子元素*/
        .tiptap-editor {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background-color: #fff;
            padding: 20px;
            box-sizing: border-box;
        }

        /* 魔法变换父元素(点击内容定位时显现的浮动图标) */
        .magic-icon {
            position: absolute;
            pointer-events: auto;
            /* 防止图标阻挡文字选择 */
            transition: opacity 0.2s;
            font-size: 22px;
            color: #666;
            width: 60px;
            height: 30px;


            &:hover {
                transform: scale(1.01);
                color: var(--el-color-primary);
                background-color: #DBEAFE;
            }

            /* 悬停在浮动图标的四种操作栏 */
            .magic-bar {
                position: absolute;
                top: 30px;
                display: none;

                .el-button {
                    width: 100%;
                    margin: 0 !important;
                    /* 覆盖默认margin */
                }
            }

            &:hover .magic-bar {
                display: flex;
                flex-direction: column;
            }
        }

        /* 重写等操作生成文本时的弹窗 */
        .preview-content-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;


            .text-compare {
                width: 90%;
                padding: 20px;
                min-height: 120px;
                box-sizing: border-box;
                overflow-y: auto;
                box-shadow: 0 0 8px 0 #ccc;
                border-radius: 6px;
            }
        }
    }
}

































/* 深度穿透样式 */
::v-deep(.tiptap.ProseMirror) {
    min-height: 400px;
    height: 90%;
    width: 100%;
    overflow: auto;
    font-family: 'Georgia', serif;
    background-color: #fff;
    padding: 10px;
    /* box-shadow: 0 0 8px #ccc;
    box-sizing: border-box; */
}

::v-deep(.tiptap.ProseMirror p) {
    margin: 0.75rem 0;
    text-indent: 2em;
    position: relative;
}

::v-deep(.tiptap.ProseMirror h1) {
    font-size: 2.25rem;
    color: #1e293b;
}

::v-deep(.tiptap.ProseMirror-focused) {
    outline: 2px solid #DBEAFE;
}
</style>