<template>
    <div class="container">
        <div class="left-panel">
            <!-- 参数收集 -->
            <div class="left-params">
                <div class="page-header">
                    <el-button type="text" @click="goBack">
                        <el-icon>
                            <ArrowLeft />
                        </el-icon>
                        返回
                    </el-button>
                </div>
                <el-form>
                    <el-form-item>
                        <div>文章描述:</div>
                        <el-input v-model="form.desc" type="textarea" placeholder="告诉我你想写什么" :rows="6" />
                    </el-form-item>
                    <el-form-item label="是否开启联网">
                        <el-switch v-model="value1" />
                    </el-form-item>
                    <el-form-item label="文案类型">
                        <el-select>
                            <el-option label="技术" value="1" />
                            <el-option label="生活" value="2" />
                            <el-option label="情感" value="3" />
                            <el-option label="其他" value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="语言风格">
                        <el-select>
                            <el-option label="正式" value="1" />
                            <el-option label="随意" value="2" />
                            <el-option label="幽默" value="3" />
                            <el-option label="其他" value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章篇幅">
                        <el-input></el-input>
                    </el-form-item>
                    <el-button type="primary">直接成文</el-button>
                </el-form>
            </div>
        </div>
        <div class="right-panel">
            <!-- 内容展示 -->
            <div class="right-content">
                文章内容展示区域
                v-html 渲染
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const value1 = ref(false);

const form = ref({
    style: "", // 语言风格值
    styleLabel: "", // 语言风格文本
    type: "", // 文案类型值
    typeLabel: "", // 文案类型文本
    desc: '', // 文章描述
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