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
                    <div class="text-header">
                        <h3>内容对比</h3>
                        <el-icon class="close-icon" @click="handleAbandonNewContent">
                            <Close />
                        </el-icon>
                    </div>
                    <div class="text-compare">
                        <div class="original-text">
                            <div class="text-label">原文</div>
                            <div class="text-content">{{ currentElementText }}</div>
                        </div>
                        <div class="new-text">
                            <div class="text-label">新内容</div>
                            <div class="text-content" :class="{ 'generating': seeNewGenerating }">
                                {{ newgenContent || '生成中...' }}
                            </div>
                        </div>
                    </div>
                    <div class="previewe-bottom">
                        <div class="loading" v-if="seeNewGenerating">内容生成中</div>
                        <div class="preview-actions" v-else>
                            <el-button @click="handleReplaceOriginal" type="primary">
                                替换原文</el-button>
                            <el-button @click="handleAbandonNewContent">取消</el-button>
                            <el-button @click="handleRegenerateNewContent" type="warning">重新生成</el-button>
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
import { useRoute, useRouter } from 'vue-router'
import useArticleStore from '@/store/modules/articles'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { createArticle, getArticleDetails, updateArticle } from '@/services/modules/articles/index'

const paramsData = ref({
    contentTemplate: '',
    max_token: 800,
    articleType: '',
    languageStyle: '',
})
const articleData = ref({})
const value1 = ref(false)
const cannotGenerate = ref(false)
const currentElementText = ref('')

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

        if (currentElement.value !== target) {
            currentElement.value = target
            // 保存当前文本内容
            currentElementText.value = target.innerText
            ElMessage.success('已获取当前段落/标题文本,可对其进行重写等操作')
        }
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

    // 重置新内容
    newgenContent.value = ''
    // 显示对比弹窗
    seeNewContent.value = true
    cannotGenerate.value = true
    seeNewGenerating.value = true

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
const handleReplaceOriginal = async () => {
    if (!currentElement.value) {
        ElMessage.warning('未找到要替换的段落')
        return
    }

    // 替换内容
    currentElement.value.innerText = newgenContent.value
    seeNewContent.value = false
    newgenContent.value = ''
    seeNewGenerating.value = true

    // 确保可以保存
    const canSave = await saveAfterReplacement()
    if (canSave) {
        // 更新文章
        await updateArticleData()
        ElMessage.success('内容替换成功并已保存')
    } else {
        ElMessage.success('内容已替换，但未保存到服务器')
    }
}

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
// 修改 updateArticleData 函数以确保这三个字段正确处理
const updateArticleData = async () => {
    try {
        if (!editor.value) {
            throw new Error('编辑器实例未初始化')
        }

        if (!articleData.value || !articleData.value.id) {
            throw new Error('文章数据不完整，无法更新')
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

        // 从 paramsData 中获取类型和风格的 ID
        const findId = (list, name) => {
            const item = list.value.find(item => item.name === name)
            return item ? item.id : null
        }

        // 确保这三个字段有值
        const article_type_id = articleData.value.article_type_id ||
            findId(articleTypes, paramsData.value.articleType)

        const language_style_id = articleData.value.language_style_id ||
            findId(languageStyles, paramsData.value.languageStyle)

        // 处理 content_template 字段
        let content_template
        if (articleData.value.content_template_id) {
            content_template = {
                contentId: articleData.value.content_template_id,
                contentName: paramsData.value.contentTemplate || ''
            }
        } else if (articleData.value.contentTemplate) {
            // 如果有 contentTemplate 对象
            content_template = {
                contentId: articleData.value.contentTemplate.id,
                contentName: paramsData.value.contentTemplate || articleData.value.contentTemplate.content || ''
            }
        } else {
            // 最后的备选方案
            content_template = {
                contentId: null,
                contentName: paramsData.value.contentTemplate || ''
            }
        }

        // 构建更新数据
        const updateData = {
            article_type_id: article_type_id,
            language_style_id: language_style_id,
            content_template: content_template,
            title: title,
            content: content,
            word_count: parseInt(paramsData.value.max_token) || articleData.value.wordCount || 0,
        }

        console.log('文章ID:', articleData.value.id)
        console.log('更新数据:', updateData)

        // 调用更新接口
        const result = await updateArticle(articleData.value.id, updateData)
        console.log('更新结果:', result)
        ElMessage.success('文章已保存')
    } catch (error) {
        console.error('更新失败:', error)
        ElMessage.error(`保存失败: ${error.message}`)
    }
}

const saveAfterReplacement = async () => {
    // 如果是从编辑页进入但没有 articleData，尝试从 route 获取并加载
    if (!articleData.value || !articleData.value.id) {
        if (route.query.id) {
            try {
                const { data } = await getArticleDetails(route.query.id)
                articleData.value = data
                ElMessage.info('已重新加载文章数据')
            } catch (err) {
                console.error('加载文章数据失败:', err)
                ElMessage.error('加载文章数据失败，无法保存')
                return false
            }
        } else {
            ElMessage.warning('当前没有要更新的文章，请先保存')
            return false
        }
    }
    return true
}


const route = useRoute()
// 获取文章类型和语言风格
const articleStore = useArticleStore()
onMounted(async () => {
    await articleStore.getArticleTypesAction()
    articleTypes.value = articleStore.articleTypes
    await articleStore.getArticleStylesAction()
    languageStyles.value = articleStore.articleStyles

    // 首先检查是否有文章ID (编辑现有文章)
    if (route.query.id) {
        try {
            const { data } = await getArticleDetails(route.query.id)
            console.log(data, '文章列表跳转获取文章详情')

            // 更新 articleData 对象，保存完整的文章数据
            articleData.value = data

            // 更新编辑器内容
            const articleBuffer = `${data.title}${data.content}`
            editor.value?.commands?.setContent(articleBuffer)

            // 更新参数表单
            paramsData.value.contentTemplate = data.contentTemplate?.content || ''
            paramsData.value.max_token = data.wordCount
            paramsData.value.articleType = data.articleType?.name || ''
            paramsData.value.languageStyle = data.languageStyle?.name || ''

            // 设置编辑模式
            editorVisible.value = true
        } catch (error) {
            console.error('加载文章详情失败:', error)
            ElMessage.error('加载文章详情失败')
        }
    }
    // 检查是否有从话题页面传来的参数
    else {
        const storedParams = localStorage.getItem('articleCreationParams');
        if (storedParams) {
            try {
                const params = JSON.parse(storedParams);
                console.log('从话题页面接收到的参数:', params);
                // 填充编辑器和表单
                if (params.title) {
                    // 可以选择是否将标题放入编辑器
                    // 或者放到单独的标题输入框
                    editor.value?.commands?.setContent(params.title);
                }

                // 填充参数表单
                paramsData.value.contentTemplate = params.contentTemplate || '';
                paramsData.value.max_token = params.max_token || 800;
                paramsData.value.articleType = params.articleType || '';
                paramsData.value.languageStyle = params.languageStyle || '';

                // 使用后清除，避免下次进入页面时自动填充
                localStorage.removeItem('articleCreationParams');
            } catch (error) {
                console.error('解析话题参数失败:', error);
            }
        }
    }
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
    background-color: #f8fafc;
}

/* 左侧面板 */
.left-panel {
    width: 30%;
    height: 100%;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: #fff;
    z-index: 2;
}

.left-params {
    width: 85%;
    height: 100%;
    padding: 10px 0;
    overflow-y: auto;
}

.page-header {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

/* 右侧面板 */
.right-panel {
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8fafc;
    padding: 20px;
    position: relative;
}

/* 生成文章预览容器 */
.preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 20px;
}

/* 预览页面 */
.preview-pane {
    width: 85%;
    max-height: 75vh;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 30px 40px;
    font-size: 16px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    overflow: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.preview-bar {
    width: 85%;
    margin: 20px auto 0;
    display: flex;
    justify-content: flex-end;
}

/* 生成中状态 */
.generate-bar {
    width: 100%;
    text-align: center;
    padding: 15px 0;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 0.7;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.7;
    }
}

/* 生成完成状态 */
.save-bar {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

/* 编辑器容器 */
.editor-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
}

/* Tiptap 编辑器样式 */
.tiptap-editor {
    width: 85%;
    height: 90%;
    background-color: #fff;
    border-radius: 12px;
    padding: 30px 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    overflow: auto;
    margin: 0 auto;
}

/* 魔法变换图标 */
.magic-icon {
    position: absolute;
    width: 32px;
    height: 32px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    color: #4d6bfe;
    transition: all 0.2s ease;
    z-index: 10;
}

.magic-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(77, 107, 254, 0.3);
}

/* 魔法操作栏 */
.magic-bar {
    position: absolute;
    top: 30px;
    left: -50px;
    display: none;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 8px;
    width: 120px;
    z-index: 11;
}

.magic-bar .el-button {
    width: 100%;
    margin: 4px 0 !important;
    border-radius: 6px;
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
}

.magic-icon:hover .magic-bar {
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 重写弹窗 */
/* 重写弹窗样式更新 */
.preview-content-text {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    overflow: hidden;
}

.text-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
}

.text-header h3 {
    margin: 0;
    font-size: 18px;
    color: #334155;
}

.close-icon {
    cursor: pointer;
    font-size: 20px;
    color: #64748b;
    transition: color 0.2s;
}

.close-icon:hover {
    color: #4d6bfe;
}

.text-compare {
    padding: 0;
    max-height: 60vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.original-text,
.new-text {
    padding: 15px 20px;
    background-color: #fff;
}

.original-text {
    border-bottom: 1px dashed #e2e8f0;
}

.text-label {
    font-weight: 600;
    color: #475569;
    margin-bottom: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.text-content {
    font-size: 16px;
    line-height: 1.6;
    color: #334155;
    padding: 10px;
    background-color: #f8fafc;
    border-radius: 8px;
    white-space: pre-wrap;
}

.text-content.generating {
    position: relative;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.text-content.generating::after {
    content: "...";
    animation: ellipsis 1.5s infinite;
    width: 20px;
    display: inline-block;
    text-align: left;
    margin-left: 5px;
}

.previewe-bottom {
    width: 100%;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
}

.loading {
    width: 100%;
    text-align: center;
    padding: 15px 0;
    color: #4d6bfe;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-actions {
    display: flex;
    gap: 10px;
}

.loading::after {
    content: "...";
    animation: ellipsis 1.5s infinite;
    width: 20px;
    display: inline-block;
    text-align: left;
}

@keyframes ellipsis {
    0% {
        content: ".";
    }

    33% {
        content: "..";
    }

    66% {
        content: "...";
    }
}

.preview-actions {
    display: flex;
    gap: 10px;
}

/* ProseMirror 样式覆盖 */
::v-deep(.tiptap.ProseMirror) {
    min-height: 80vh;
    max-height: 80vh;
    width: 100%;
    overflow: auto;
    font-family: 'Source Han Serif', 'Georgia', serif;
    line-height: 1.8;
    color: #334155;
    padding: 10px 0;
}

::v-deep(.tiptap.ProseMirror p) {
    margin: 1rem 0;
    text-indent: 2em;
    position: relative;
}

::v-deep(.tiptap.ProseMirror h1) {
    font-size: 2.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 1.5rem 0 1rem;
    line-height: 1.2;
}

::v-deep(.tiptap.ProseMirror-focused) {
    outline: none;
    box-shadow: 0 0 0 2px rgba(77, 107, 254, 0.1);
    border-radius: 8px;
}

@media (max-width: 1200px) {
    .container {
        flex-direction: column;
    }

    .left-panel,
    .right-panel {
        width: 100%;
    }

    .left-panel {
        height: auto;
        min-height: 300px;
        max-height: 40vh;
        overflow-y: auto;
    }

    .right-panel {
        height: 60vh;
    }

    .preview-pane,
    .tiptap-editor {
        width: 95%;
    }
}
</style>