<template>
    <div class="ArticleManage">、
        <!-- 搜索框部分 -->
        <div class="searchpart">
            <el-form>
                <el-row>
                    <!-- 文章标题 -->
                    <el-col :span="8">
                        <el-form-item style="width: 240px;">
                            <el-input placeholder="文章标题"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 文章类型 -->
                    <el-col :span="8">
                        <el-form-item style="width: 240px;">
                            <el-select v-model="formInline.region" placeholder="文章类型" clearable>
                                <el-option label="科普" value="shanghai" />
                                <el-option label="故事" value="beijing" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 文章状态 -->
                    <el-col :span="8">
                        <el-form-item style="width: 240px;">
                            <el-select v-model="formInline.region" placeholder="文章状态" clearable>
                                <el-option label="已导出" value="exported" />
                                <el-option label="草稿" value="draft" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 日期选择  -->
                    <el-col :span="12">
                        <el-form-item>
                            <div class="demo-datetime-picker">
                                <div class="block">
                                    <el-date-picker v-model="value2" type="datetimerange" start-placeholder="Start date"
                                        end-placeholder="End date" format="YYYY-MM-DD HH:mm:ss"
                                        date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss" />
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                    <!-- 搜索按钮 点击提交 联合参数 -->
                    <el-col :span="12">
                        <el-button type="primary" style="width:88px;height:36px">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- table表格部分 -->
        <div class="tablepart">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="date" label="文章标题" width="180" />
                <el-table-column prop="name" label="文章类型" width="180" />
                <el-table-column prop="name" label="文章状态" width="180" />
                <el-table-column prop="name" label="更新时间" width="180" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">删除</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页功能 -->
        <div class="pagination-block">
            <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :size="size"
                :disabled="disabled" :background="background" layout=" prev, pager, next,jumper, total" :total="400"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'

const formInline = reactive({
    user: '',
    region: '',
    date: '',
})
const tableData = [
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]
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
</style>