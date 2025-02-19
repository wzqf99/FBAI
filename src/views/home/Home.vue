<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 16:22:19
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-02-19 20:09:22
 * @FilePath: \AI_vue3\vue-aigc\src\views\home\Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="home">
        <div class="content">
            <span ref="text" class="msg"></span>
            <!-- 引导模块 -->
            <div class="guide">
                <div class="guide-item">
                    <div class="top">
                        <el-icon :size="40" color="#4D6BFE">
                            <DocumentAdd />
                        </el-icon>
                    </div>
                    <div class="bottom">
                        <h2>
                            开始创作
                        </h2>
                        <i>题材，主题自定义</i>
                    </div>
                    <el-icon class="arrow-icon">
                        <Right />
                    </el-icon>
                </div>
                <div class="guide-item">
                    <div class="top">
                        <el-icon :size="40" color="#FF5A72">
                            <EditPen />
                        </el-icon>
                    </div>
                    <div class="bottom">
                        <h2>
                            故事创作
                        </h2>
                        <i>文字绘梦，打造引人入胜的精彩故事。</i>
                    </div>
                    <el-icon class="arrow-icon">
                        <Right />
                    </el-icon>
                </div>
                <div class="guide-item">
                    <div class="top">
                        <el-icon :size="40" color="#6291FF">
                            <Reading />
                        </el-icon>
                    </div>
                    <div class="bottom">
                        <h2>
                            知识科普
                        </h2>
                        <i>通俗讲解，让知识触手可及</i>
                    </div>
                    <el-icon class="arrow-icon">
                        <Right />
                    </el-icon>
                </div>
                <div class="guide-item">
                    <div class="top">
                        <el-icon :size="40" color="#56D1D8">
                            <QuestionFilled />
                        </el-icon>
                    </div>
                    <div class="bottom">
                        <h2>
                            资讯信息
                        </h2>
                        <i>一手信息，快速创作文章</i>
                    </div>
                    <el-icon class="arrow-icon">
                        <Right />
                    </el-icon>
                </div>
            </div>
            <!-- 推荐模块 -->
            <div class="recommend">
                <!-- 左侧 -->
                <div class="hotmessage">
                    <div class="header">
                        <span>选题推荐</span>
                        <div class="refresh">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            <span>换一换</span>
                        </div>

                    </div>
                    <div class="bottom">
                        <div class="message">
                            <i>1</i>
                            <li>独立游戏开发:如何避免盲目跟风</li>
                        </div>
                        <div class="message">
                            <i>2</i>
                            <li>四川被拐男子靠腊肉折耳根锁定家乡：美食如何成为寻根的桥梁</li>
                        </div>
                        <div class="message">
                            <i>3</i>
                            <li>《哪吒2》在俄罗斯上映：中俄文化交融的新里程碑？</li>
                        </div>
                        <div class="message">
                            <i>4</i>
                            <li>独立游戏开发:如何避免盲目跟风</li>
                        </div>
                        <div class="message">
                            <i>5</i>
                            <li>独立游戏开发:如何避免盲目跟风</li>
                        </div>
                    </div>
                </div>
                <!-- 右侧 -->
                <div class="tools">
                    <div class="header">AI工具箱</div>
                    <div class="toolscollection">
                        <div class="tool-item">
                            <el-icon size="20">
                                <EditPen />
                            </el-icon>
                            <span class="title">起标题</span>
                            <span class="des">快速生成吸睛标题</span>
                        </div>
                        <div class="tool-item">
                            <el-icon size="20">
                                <EditPen />
                            </el-icon>
                            <span class="title">起标题</span>
                            <span class="des">快速生成吸睛标题</span>
                        </div>
                        <div class="tool-item">
                            <el-icon size="20">
                                <EditPen />
                            </el-icon>
                            <span class="title">起标题</span>
                            <span class="des">快速生成吸睛标题</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TypeIt from 'typeit' // 引入typeit 打字机效果    
const text = ref(null)
onMounted(() => {
    new (TypeIt)(text.value, {
        strings: ["在文字的海洋中，寻找灵感的航迹，书写属于你的心灵故事。"],
        cursorChar: "<span class='cursorChar'>|<span>",//用于光标的字符。HTML也可以
        speed: 100,
        lifeLike: true,// 使打字速度不规则
        cursor: true,//在字符串末尾显示闪烁的光标
        breakLines: false,// 控制是将多个字符串打印在彼此之上，还是删除这些字符串并相互替换
        loop: false,//是否循环
    }).go()
})
</script>

<style lang="less" scoped>
.home {
    ::-webkit-scrollbar {
        display: none;
    }
}

.content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    ::-webkit-scrollbar {
        display: none;
    }

    // 打字机效果
    span {
        width: 80%;
        font-size: 26px;
        margin: 20px 0;
    }

    // 引导部分
    .guide {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 280px;
        width: 80%;
        border-radius: 16px;
        background: linear-gradient(270deg, #F5F8FE, #EFF7FF, #EEF6FF);

        // 引导内容的每一项
        .guide-item {
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            height: 200px;
            padding: 20px;
            box-sizing: border-box;
            width: 20%;
            background-color: #fff;
            border-radius: 16px;
            position: relative;
            overflow: hidden;

            // 遮罩层和箭头
            &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                /* border-radius: 16px; */
                background: linear-gradient(225deg, #4D6BFE, #DBEAFE, #fff, #fff);
                opacity: 0;
                transition: opacity 0.1s ease-in-out;
            }

            .arrow-icon {
                position: absolute;
                bottom: 10px;
                right: 10px;
                font-size: 24px;
                color: #4D6BFE;
                opacity: 0;
                transition: opacity 0.1s linear;
                z-index: 10;
            }

            &:hover {
                cursor: pointer;

                &::after {
                    opacity: 0.3; // 显示遮罩层
                }

                .arrow-icon {
                    opacity: 1;
                }
            }

            // 引导内容上半部分 图标
            .top {
                height: 50%;
                width: 100%;

                >.el-icon {
                    padding-top: 10px;
                }
            }

            // 引导内容的下半部分 文字叙述
            .bottom {
                height: 50%;
                width: 100%;

                >h2 {
                    padding-bottom: 10px;
                }
            }

            &:first-child {
                margin-right: 20px;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            }

            &:nth-child(2) {
                border-radius: 16px 0 0 16px;
                box-shadow: 0 -10px 10px -6px rgba(0, 0, 0, 0.1),
                    0 10px 10px -6px rgba(0, 0, 0, 0.1),
                    -10px 0 10px -6px rgba(0, 0, 0, 0.1);
            }

            &:nth-child(3) {
                border-radius: 0;
                box-shadow: 0 -10px 10px -6px rgba(0, 0, 0, 0.1),
                    0 10px 10px -6px rgba(0, 0, 0, 0.1);
            }

            &:nth-child(4) {
                border-radius: 0 16px 16px 0;
                box-shadow: 0 -10px 10px -6px rgba(0, 0, 0, 0.1),
                    0 10px 10px -6px rgba(0, 0, 0, 0.1),
                    10px 0 10px -6px rgba(0, 0, 0, 0.1);
            }

        }

    }

    // 选题推荐部分
    .recommend {
        display: flex;
        width: 80%;
        height: 280px;
        margin-top: 20px;
        border-radius: 16px;
        overflow: hidden;

        // 热门信息
        .hotmessage {
            width: 70%;
            height: 100%;
            background-color: #F8FAFD;
            border-radius: 16px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

            // 热门信息的头部
            .header {
                display: flex;
                justify-content: center;
                align-self: center;
                height: 20px;
                line-height: 20px;
                padding: 20px 10px 10px 20px;

                >span {
                    font-size: 16px;
                    height: 100%;
                    margin: 0 0;
                }

                .refresh {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 16px;

                    &:hover {
                        cursor: pointer;
                        color: #4D6BFE;
                    }

                    >span {
                        font-size: 16px
                    }
                }
            }

            // 热门信息主体部分
            .bottom {
                height: 240px;

                padding-left: 20px;

                .message {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    padding: 10px 20px;
                    box-sizing: border-box;

                    &:hover {
                        cursor: pointer;
                        color: #4d6bfe;
                    }

                    >i {
                        font-size: 16px;
                        padding-right: 10px;
                    }

                    >li {
                        font-size: 16px;
                    }
                }
            }
        }

        // 工具箱
        .tools {
            margin-left: 30px;
            width: 30%;
            height: 100%;
            background-color: #F2F5FB;
            border-radius: 16px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

            // 头部 
            .header {
                font-size: 20px;
                font-weight: 600;
                padding: 20px 10px 10px 20px
            }

            // 工具集合
            .toolscollection {
                .tool-item {
                    padding: 16px;
                    height: 30px;
                    background-color: #FAFAFC;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:hover {
                        cursor: pointer;
                        background-color: #DBEAFE;
                    }

                    >span {
                        font-size: 14px;
                        margin-left: 14px
                    }

                    .title {
                        font-weight: 600;
                        width: 72px;
                    }

                    .des {
                        font-size: 12px;
                        color: #868597;
                    }


                }
            }
        }
    }
}
</style>