<template>
    <div class="TopicCollection">
        <div class="title">我的收藏话题</div>
        <div class="topicList">
            <template v-for="(item, index) in collectionList" :key="index">
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
                        <button @click="cancelCollectionHandle(item, index)">
                            <i class="el-icon-close"></i> 取消收藏
                        </button>
                        <button @click="wirteArticle(item, index)">
                            <i class="el-icon-edit-outline"></i> 写成文章
                        </button>
                    </div>
                </div>
            </template>
        </div>

        <!-- 无数据提示 -->
        <div v-if="collectionList.length === 0" class="empty-state">
            <el-empty description="暂无收藏话题"></el-empty>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { fetchTopicList, cancelCollectTopic } from '@/services/modules/topics';

const router = useRouter();
const collectionList = ref([]);
const isLoading = ref(false);
const userId = 3; // 固定用户ID，实际应用中应从用户状态获取


// 初始化时获取收藏列表
onMounted(async () => {
    await loadCollectionList();
});

// 加载收藏列表
const loadCollectionList = async () => {
    isLoading.value = true;
    try {
        const response = await fetchTopicList(userId);
        console.log(response, "获取收藏列表的数据")
        if (response && response.success) {
            collectionList.value = response.userCollectTopic || [];
            console.log('获取到的收藏列表:', collectionList.value);
        } else {
            ElMessage.error('获取收藏列表失败');
        }
    } catch (error) {
        console.error('获取收藏列表出错:', error);
        ElMessage.error('获取收藏列表出错，请稍后重试');
    } finally {
        isLoading.value = false;
    }
};

// 取消收藏
const cancelCollectionHandle = async (item, index) => {
    try {
        await ElMessageBox.confirm('确定要取消收藏该话题吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        console.log(userId, item.id, "sada");
        try {
            const response = await cancelCollectTopic(userId, item.id);
            console.log(response, "取消的话题")
            if (response && response.success) {
                // 移除已取消收藏的项
                ElMessage.success('已取消收藏');
                loadCollectionList(); // 重新加载列表以更新状态
            } else {
                ElMessage.error(response.message || '取消收藏失败');
            }
        } catch (error) {
            console.error('取消收藏出错:', error);
            ElMessage.error('操作失败，请稍后重试');
        }
    } catch {
        // 用户取消操作
        console.log('用户取消了操作');
    }
};

// 写成文章
const wirteArticle = (item, index) => {
    // 提取文章创作所需的参数
    const articleParams = {
        contentTemplate: item.content_template.content,
        articleType: item.type.name,
        languageStyle: item.style.name,
        // 可以根据需要添加其他默认参数
        max_token: 800 // 默认字数限制，可根据需要调整
    };
    console.log(articleParams, "文章创作参数");

    // 将参数存储到localStorage
    localStorage.setItem('articleCreationParams', JSON.stringify(articleParams));

    // 导航到文章创作页
    router.push('/articleCreation');
};
</script>
<style lang="less" scoped>
.TopicCollection {
    max-width: calc(100vw - 310px); // 与原组件保持一致，减去sidebar250 以及父元素的60的padding
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .topicList {
        overflow-y: scroll;
        column-count: 3;
        column-gap: 20px;
        width: 100%;
        padding-bottom: 20px;
    }

    .topicItem {
        break-inside: avoid; // 确保每个项目不会被分割到不同的列
        display: inline-block; // 对于瀑布流布局很重要
        width: 100%; // 必须是100%以填充整个列宽
        margin-bottom: 20px;
        background: #F9FAFE;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #ccc;
        position: relative;
        transition: transform 0.2s, box-shadow 0.2s;
        box-sizing: border-box;

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
            visibility: hidden;
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

    .empty-state {
        width: 100%;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

/* 响应式调整 */
@media screen and (max-width: 1100px) {
    .TopicCollection .topicList {
        column-count: 2;
    }
}

@media screen and (max-width: 800px) {
    .TopicCollection .topicList {
        column-count: 1;
    }
}
</style>