<template>
    <div class="TopciGenerate">
        <!-- 参数收集部分 -->
        <div class="topicParams">
            <div class="titile">话题生成器</div>
            <div class="parapmsSelect">
                <!-- 热搜数据 -->
                <div class="hotFusion" @click="sethotMessages">
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
                <div class="generate" @click="loadData">
                    <el-button :disabled="isGenerate" style="background-color: #4D6BFE;color: #fff;height: 46px;">{{
                        isGenerate ? '生成中...' : '生成话题' }}</el-button>
                </div>
            </div>
        </div>
        <!-- 生成的话题列表部分 -->
        <div class="topicMain">
            <div class="titile" v-if="!isGenerate">已经生成的话题</div>
            <div class="titile" v-else>正在生成话题</div>
            <div class="topicList">
                <template v-for="(item, index) in list" :key="index">
                    <div class="topicItem">
                        <!-- 渲染部分 -->
                        <h3>{{ item.title }}</h3>
                        <div class="shrink">
                            {{ item.content_template.content }}
                        </div>
                        <div class="tagContent">
                            <el-tag style="margin-right:10px">{{ item.type.name }}</el-tag>
                            <el-tag>{{ item.style.name }}</el-tag>
                        </div>
                        <!-- 操作部分 -->
                        <div class="what-todo">
                            <button>
                                <i class="el-icon-delete"></i> 删除
                            </button>
                            <button>
                                <i class="el-icon-star-off"></i> 收藏
                            </button>
                            <button>
                                <i class="el-icon-edit-outline"></i> 写成文章
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- 热搜数据弹窗 -->

    </div>
</template>

<script setup>
import { fetchTopicJson } from '@/services/modules/topics';
import { ref } from 'vue';
const formData = ref({
    userInput: ''
})
const isGenerate = ref(false)
const isShowInspiration = ref(false)


/* let list = ref([])
const obj = {
    "jsonObject": [
        {
            "title": "缅甸地震：一场如巨刀切入地球的灾难",
            "content_template": {
                "id": -1,
                "content": "3月28日下午，缅甸中部地区遭遇了一场7.9级的强烈地震，这场突如其来的自然灾害不仅造成了超过千人的死亡，还给当地居民的生活带来了极大的破坏。从地质学的角度来看，这次地震的力量之大，仿佛是一把无形的巨刀，深深地切入了地球的地壳之中。这样的比喻不仅形象地描绘了地震带来的震撼与破坏力，也提醒我们面对自然力量时人类的渺小。在探讨这一事件时，我们可以思考如何更好地预测和应对类似的自然灾害，以及在全球范围内加强地震科学研究的重要性。"
            },
            "style": {
                "id": 1,
                "name": "正式"
            },
            "type": {
                "id": 1,
                "name": "新闻"
            }
        }
    ]
}
for (let i = 0; i < 4; i++) {
    list.value.push(obj.jsonObject[0])
} */

// 话题生成参数
const parapmsSelect = ref({
    title: "华为阔折叠屏手机开售10分钟缺货",
    desc: "30日10时8分，华为阔折叠屏手机PuraX正式开售，售价7499元起。截至10时18分，华为商城显示所有版本均暂时缺货。",
    input: formData.userInput
})

// 一次生成四条数据 生成话题
const loadData = async () => {
    isGenerate.value = true
    const promiseArr = Array.from({ length: 4 }, () => fetchTopicJson(parapmsSelect.value))
    const result = await Promise.all(promiseArr)
    console.log(result, "返回的数据")
    /* list.value.push(result.data[0]) */
    for (let i = 0; i < result.length; i++) {
        list.value.push(result[i].data[0])
    }
    isGenerate.value = false
}

const sethotMessages = () => {
    const item = {
        title: "县城贵妇最爱的“秋裤”股价崩盘",
        desc: "近日，县城贵妇最爱的“秋裤”品牌Lululemon遇到了大考验，交出了一份不错的试卷，股价却崩盘了，一天蒸发400亿元。",
    }
    parapmsSelect.value.title = item.title
    if (item.desc != '') {
        parapmsSelect.value.desc = item.desc
    } else {
        parapmsSelect.value.desc = ''
    }
    loadData()
}

defineExpose({
    loadData
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
    margin-left: 20px;
    height: 100%;
    flex-grow: 1;
    overflow-y: auto;

    .titile {
        width: 100%;
        height: 40px;
        line-height: 40px;
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 1;
    }

    .topicList {
        margin-top: 2px;
        column-count: 2;
        column-gap: 20px;
        width: 100%;
        padding-bottom: 20px;
    }

    .topicItem {
        break-inside: avoid;
        margin-bottom: 20px;
        background: #F9FAFE;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #ccc;
        position: relative;
        transition: transform 0.2s, box-shadow 0.2s;

        h3 {
            margin-top: 0;
            margin-bottom: 12px;
            color: #333;
        }

        .shrink {
            margin-bottom: 30px;
            color: #666;
            line-height: 1.5;
        }

        .el-tag {
            margin-bottom: 10px;
        }

        &:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);

            .what-todo {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
        }

        .tagContent {
            position: absolute;
            left: 16px;
            bottom: 1px;
        }

        .what-todo {
            position: absolute;
            bottom: 10px;
            right: 10px;
            display: flex;
            gap: 8px;
            opacity: 0;
            visibility: hidden; // 增加visibility属性以完全隐藏
            transform: translateY(10px);
            transition: all 0.3s ease;

            button {
                padding: 6px 12px;
                border-radius: 20px;
                border: none;
                background: #fff;
                color: #333;
                font-size: 12px;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;

                &:first-child {
                    background-color: #F56C6C;
                    color: white;
                }

                &:nth-child(2) {
                    background-color: #E6A23C;
                    color: white;
                }

                &:last-child {
                    background-color: #4d6bfe;
                    color: white;
                }

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                &:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
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