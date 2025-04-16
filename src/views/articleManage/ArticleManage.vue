<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-02-18 16:22:43
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-04-14 21:21:28
 * @FilePath: \AI_vue3\vue-aigc\src\views\articleManage\ArticleManage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="ArticleManage">
        <!-- 搜索框部分 -->
        <div class="searchpart">
            <el-form :model="params">
                <!-- 文章标题 类型 状态 -->
                <el-row>
                    <!-- 文章标题 -->
                    <el-col :span="8">
                        <el-form-item style="width: 240px;">
                            <el-input placeholder="文章标题" v-model="params.title"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 文章类型 -->
                    <el-col :span="8">
                        <el-form-item style="width: 240px;">
                            <el-select v-model="params.article_type" placeholder="文章类型" clearable>
                                <el-option v-for="(item, index) in articleTypes" :key=item.id :label="item.name"
                                    :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 文章状态 -->
                    <el-col :span="8">
                        <el-form-item style="width: 240px;">
                            <el-select v-model="params.status" placeholder="文章状态" clearable>
                                <el-option label="已导出" value="exported" />
                                <el-option label="草稿" value="draft" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 时间信息的收集 提交联合数据 -->
                <el-row>
                    <!-- 日期选择  -->
                    <el-col :span="12">
                        <el-form-item>
                            <div class="demo-datetime-picker">
                                <div class="block">
                                    <el-date-picker v-model="DateTime" type="datetimerange"
                                        start-placeholder="Start date" end-placeholder="End date"
                                        format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
                                        date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss" @change="handleDateChange"
                                        handleDateChange />
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                    <!-- 搜索按钮 点击提交 联合参数 -->
                    <el-col :span="12">
                        <el-button @click="handleSearch" type="primary" style="width:88px;height:36px">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- table表格部分 -->
        <div class="tablepart">
            <el-table :data="articleList" style="width: 100%">
                <el-table-column prop="title" label="文章标题" width="240" align="center">
                    <template #default="scope">
                        {{ scope.row.title.replace(/<[^>]+>/g, '') }}
                    </template>
                </el-table-column>
                <el-table-column prop="article_type" label="文章类型" width="140" align="center" />
                <el-table-column prop="status" label="文章状态" width="140" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status == 'draft' ? 'info' : 'success'">
                            {{ statusMap[row.status] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" width="180" align="center">
                    <template #default="{ row }">
                        {{ row.updated_at ? formatDateTime(row.updated_at) : formatDateTime(row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" :icon="Edit" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button type="danger" :icon="Delete" @click="handleDelte(row)">
                            删除
                        </el-button>
                        <el-button type="success" :icon="Download" @click="handleExport(row)">
                            导出
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页功能 -->
        <div class="pagination-block">
            <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
                :page-sizes="[6, 8, 10]" :disabled="disabled" :background="background"
                layout=" prev, pager, next,jumper, sizes,total " :total="pagination.total"
                :page-count="pagination.totalPages" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { Edit, Delete, Download } from '@element-plus/icons-vue';
import { computed, onMounted, reactive, ref } from 'vue'
import useArticleStore from '@/store/modules/articles'
import { storeToRefs } from 'pinia'
import { formatDateTime } from '@/utils/dateTime';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getArticleDetails } from '@/services/modules/articles';

const router = useRouter()
const statusMap = {
    draft: "草稿",
    exported: "已导出"
}
const articleStore = useArticleStore()
const { articleList, pagination } = storeToRefs(articleStore)
const { articleTypes } = storeToRefs(articleStore)
const user_id = 3
const page = ref(1);
const pageSize = ref(8)

console.log(articleTypes, articleList, "11");

const params = ref({
    title: '',
    article_type: '',
    status: '',
    start_date: '',
    end_date: '',
})
const DateTime = ref([]);
const isSearch = ref(false)

const handleEdit = (row) => {
    router.push({
        path: 'articleCreation',
        query: { id: row.id }
    })
}

const handleExport = async (row) => {
    const result = await getArticleDetails(row.id)
    const article = result.data
    const content = `# ${article.title}\n\n${article.content}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); // 创建 Blob URL
    link.download = `${article.title}.txt`;
    link.click(); // 触发下载
    URL.revokeObjectURL(link.href);
}

const handleDelte = async (row) => {
    const id = await articleStore.deleteArticleAction(row.id)
    ElMessage({
        message: `成功删除id为${id}的文章`,
        type: 'success',
    })
    loadArticleData()
}

const handleDateChange = () => {
    console.log(DateTime.value, "当前获取的时间")
    if (!DateTime.value || DateTime.value.length === 0) {
        params.value.start_date = '';
        params.value.end_date = '';
    } else {
        params.value.start_date = DateTime.value[0];
        params.value.end_date = DateTime.value[1];
    }
}

const handleSearch = () => {
    isSearch.value = true
    if (isSearch.value) {
        loadArticleData();
    } else {
        // 如果没有搜索，分页时不携带 params
        loadArticleDataWithoutParams();
    }
}

const handleCurrentChange = (newPage) => {
    page.value = newPage
    if (isSearch.value) {
        loadArticleData();
    } else {
        loadArticleDataWithoutParams();
    }
}

const handleSizeChange = (newSize) => {
    pageSize.value = newSize
    loadArticleData()
}

const loadArticleData = async () => {
    await articleStore.getArticleListAction(user_id, page.value, pageSize.value, params.value)
}

const loadArticleDataWithoutParams = async () => {
    // 如果没有进行搜索，分页时清空 params，只带分页参数
    const emptyParams = {
        title: '',
        article_type: '',
        status: '',
        start_date: '',
        end_date: ''
    };
    await articleStore.getArticleListAction(user_id, page.value, pageSize.value, emptyParams);
}

const loadTypes = async () => {
    await articleStore.getArticleTypesAction()
}
onMounted(() => {
    loadArticleData()
    loadTypes()
})
</script>

<style lang="less" scoped>
.searchpart {
    padding-left: 20px;
}

.tablepart {
    padding-left: 20px;
    margin-top: 20px;
}

.pagination-block {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
}

/* 统一图标与文字间距 */
.btn-icon {
    margin-right: 6px;
}

/* 查看&编辑 - 蓝色 */
.edit-btn {
    color: #409EFF;
}

.edit-btn:hover {
    color: #79BBFF;
    /* 悬停时颜色变浅 */
}

/* 删除 - 红色 */
.delete-btn {
    color: #F56C6C;
}

.delete-btn:hover {
    color: #F89898;
    /* 悬停时颜色变浅 */
}

/* 导出 - 绿色 */
.export-btn {
    color: #67C23A;
}

.export-btn:hover {
    color: #95D475;
    /* 悬停时颜色变浅 */
}
</style>