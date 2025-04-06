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
                        <div style="font-size: 14px">热点融合</div>
                        <transition>
                            <div class="hotTitle">
                                {{ parapmsSelect.title }}
                            </div>
                        </transition>
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
                            <button @click="deleteHandle(item, index)">
                                <i class="el-icon-delete"></i> 删除
                            </button>
                            <button @click="starHandle(item, index)">
                                <i class="el-icon-star-off"></i> 收藏
                            </button>
                            <button @click="wirteArticle(item, index)">
                                <i class="el-icon-edit-outline"></i> 写成文章
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- 热搜数据弹窗 -->
        <!-- 热搜数据弹窗 -->
        <div class="hotModal" v-if="showHotModal">
            <div class="close-btn" @click="showHotModal = false">
                <el-icon>
                    <Close />
                </el-icon>
            </div>
            <InspirationLibrary :isnewLayout="true" @updateIndex="cpncheck"></InspirationLibrary>
        </div>
    </div>
</template>

<script setup>
import InspirationLibrary from './InspirationLibrary.vue';
import { fetchTopicJson } from '@/services/modules/topics';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const formData = ref({
    userInput: ''
})
const router = useRouter()
const isGenerate = ref(false)
const showHotModal = ref(false);

// 修改sethotMessages函数
function sethotMessages() {
    showHotModal.value = true;
}

// 在cpncheck函数中应该关闭模态框
function cpncheck(index, title, desc) {
    // 您现有的代码...
    showHotModal.value = false;
    parapmsSelect.value.title = title;
    if (desc != '') {
        parapmsSelect.value.desc = desc
    } else {
        parapmsSelect.value.desc = ''
    }
}


let list = ref([])

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
}

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
// 更新话题参数 由父组件调用
const updateTopicData = (index, title, desc) => {
    parapmsSelect.value.title = title || parapmsSelect.value.title;
    parapmsSelect.value.desc = desc || parapmsSelect.value.desc;
};

// 删除话题
function deleteHandle(item, index) {
    console.log(item, index, "当前元素")
    list.value.splice(index, 1)
}
function starHandle(item, index) {

}
function wirteArticle(item, index) {
    router.push('/articleCreation')
}


defineExpose({
    updateTopicData
})
</script>
<style lang="less" scoped>
.TopciGenerate {
    max-width: calc(100vw - 310px); // 减去sidebar250 以及父元素的60的padding
    height: 100%;
    display: flex;
    position: relative;
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
            width: 230px;
            margin: 0 10px;
            /* 固定宽度 */
            display: flex;
            justify-content: space-between;
            /* 改为space-between以便更好地控制间距 */
            align-items: center;
            cursor: pointer;
            background-color: #F9FAFE;
            box-shadow: 0 0 4px #ccc;
            border-radius: 5px;
            overflow: hidden;
            padding: 0 10px;
            /* 添加内边距保持内容不贴边 */
            box-sizing: border-box;
        }

        .hotTitle {
            max-height: 42px;
            max-width: 330px;
            /* 固定最大宽度 */
            padding: 4px 8px;
            font-size: 10px;
            color: #4d6bfe;
            background-color: #DBEAFE;
            border-radius: 4px;

            /* 多行文本溢出处理 */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;

            line-height: 1.4;
            box-sizing: border-box;
            word-break: break-word;

            /* 添加渐变淡出效果 */
            position: relative;
        }

        /* 可选：添加渐变淡出效果，使长文本看起来更自然 */
        .hotTitle::after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 30px;
            background: linear-gradient(to right, rgba(219, 234, 254, 0), #DBEAFE);
            pointer-events: none;
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


.hotModal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    display: flex;
}

/* 左侧半透明遮罩 */
.hotModal::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 40vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    /* 半透明灰色 */
    backdrop-filter: blur(3px);
    /* 轻微模糊效果，提升视觉效果 */
}

/* 右侧热搜内容 */
.hotModal .inspiration {
    position: absolute;
    right: 0;
    top: 0;
    width: 60vw;
    height: 100vh;
    background-color: white;
    overflow-y: auto;
    box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
}

/* 添加关闭按钮 */
.hotModal .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hotModal .close-btn:hover {
    background-color: #e0e0e0;
}
</style>