<template>
    <div class="TopciGenerate">
        <div class="topicParams">
            <div class="titile">话题生成器</div>
            <div class="parapmsSelect">
                <div class="hotFusion">
                    <el-icon size="40">
                        <HelpFilled color="#4d6bfe" />
                    </el-icon>
                    <div class="hotselect">
                        <div>热点融合</div>
                        <el-tag>
                            {{ parapmsSelect.hotmessage }} 江苏生育津贴不用准备
                        </el-tag>
                    </div>
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </div>
                <el-form :model="formData" style="width:90%">
                    <el-form-item>
                        <el-input v-model="formData.userInput" type="textarea" placeholder="补充话题描述，生成结果更容易匹配您的需求"
                            :rows="15" style="resize: none;" />
                    </el-form-item>
                </el-form>
                <div class="generate">
                    <el-button style="background-color: #4D6BFE;color: #fff;height: 46px;">开始生成</el-button>
                </div>
            </div>
        </div>
        <div class="topicMain">
            <div class="titile">已经生成的话题</div>
            <div class="topicList">
                <div class="topicItem">
                    <h3>未来城市的绿色科技革命:如何实现可持续性生活方式</h3>
                    <div class="shrink">未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                    </div>
                    <el-tag>文章类型</el-tag>
                    <el-tag>语言风格</el-tag>
                </div>
                <div class="topicItem">
                    <h3>未来城市的绿色科技革命:如何实现可持续性生活方式</h3>
                    <div class="shrink">未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                    </div>
                    <el-tag>文章类型</el-tag>
                    <el-tag>语言风格</el-tag>
                </div>
                <div class="topicItem">
                    <h3>未来城市的绿色科技革命:如何实现可持续性生活方式</h3>
                    <div class="shrink">未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                    </div>
                    <el-tag>文章类型</el-tag>
                    <el-tag>语言风格</el-tag>
                </div>
                <div class="topicItem">
                    <h3>未来城市的绿色科技革命:如何实现可持续性生活方式</h3>
                    <div class="shrink">未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                    </div>
                    <el-tag>文章类型</el-tag>
                    <el-tag>语言风格</el-tag>
                </div>
                <div class="topicItem">
                    <h3>未来城市的绿色科技革命:如何实现可持续性生活方式</h3>
                    <div class="shrink">未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                    </div>
                    <el-tag>文章类型</el-tag>
                    <el-tag>语言风格</el-tag>
                </div>
                <div class="topicItem">
                    <h3>未来城市的绿色科技革命:如何实现可持续性生活方式</h3>
                    <div class="shrink">未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                        未来城市的绿色科技革命:如何实现可持续性生活方式，
                    </div>
                    <el-tag>文章类型</el-tag>
                    <el-tag>语言风格</el-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const formData = ref({
    userInput: ''
})

// 话题生成参数
const parapmsSelect = ref({
    title: '这个数据来自热门数据中的title',
    desc: "这个数据来自热门数据中的desc",
    input: formData.userInput
})

</script>

<style lang="less" scoped>
.TopciGenerate {
    max-width: calc(100vw - 310px); // 减去sidebar250 以及父元素的60的padding
    height: 100%;
    display: flex;
}

//左侧 话题参数部分
.topicParams {
    min-width: 250px;
    height: 100%;

    .titile {
        width: 100%;
        height: 40px;
        line-height: 40px;
    }

    .parapmsSelect {
        width: 100%;
        height: calc(100% - 40px);
        box-shadow: 0 0 8px #ccc;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        .hotFusion {
            height: 60px;
            width: 90%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            cursor: pointer;
            background-color: #F9FAFE;
            box-shadow: 0 0 4px #ccc;
            border-radius: 5px;
        }
    }
}

// 右侧 话题列表部分
.topicMain {
    margin-left: 10px;
    height: 100%;

    .titile {
        width: 100%;
        height: 40px;
        line-height: 40px;
    }

    .topicList {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        width: 100%;
        height: calc(100% - 40px);


        .topicItem {
            padding: 20px;
            max-width: 290px;
            box-shadow: 0 0 8px #ccc;
            border-radius: 10px;
            border: 1px solid #ccc;

            .shrink {
                max-width: 100%;
                margin: 20px 0;
            }

        }
    }
}


/* 穿透 Element UI 的组件样式 */
.custom-form :deep(.el-textarea__inner) {
    width: 90% !important;
    margin: 0 auto;
    /* 水平居中 */
    display: block;
    /* 使宽度生效 */
}

.masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    /* 2列或3列 */
    grid-auto-rows: 10px;
    /* 设置基准行高 */
    gap: 16px;
}

.masonry-item {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    grid-row: span auto;
    /* 让 item 根据内容自动跨越多个 grid 行 */
}
</style>