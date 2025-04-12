<!--
 * @Author: yelan wzqf99@foxmail.com
 * @Date: 2025-03-06 17:14:23
 * @LastEditors: yelan wzqf99@foxmail.com
 * @LastEditTime: 2025-04-12 11:36:24
 * @FilePath: \AI_vue3\vue-aigc\src\views\topic\InspirationLibrary.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="inspiration" :class="{ rowLatout: isnewLayout }">
    <div class="tab-hot-select" :class="{ tabLayout: isnewLayout }">
      <div v-for="(item, index) in tabItems" :key="index">
        <div class="tab-hot-item" :class="{ active: activeTab === item.key }" @click="handleHotClick(item.key)">
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="hot-messages">
      <div class="hot-item" v-for="(item, index) in currentList" :key="index">
        <h3 class="title">{{ item.index }}.{{ item.title }}</h3>
        <div class="description">{{ item.desc }}</div>
        <div class="more">
          <div class="details" @click="viewDetails(item)">查看详情</div>
          <div class="generte" @click="goToCreate(item)">结合该热点去创作</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { fetchhotMessages } from "@/services/modules/topics";
import { ElMessage } from 'element-plus'
const emit = defineEmits(["updateIndex"]);
const props = defineProps({
  isnewLayout: {
    type: Boolean,
    default: false,
  },
});

// 数据
const allHotMessages = ref({});
const activeTab = ref("all"); // 默认显示全部

// 定义标签与数据键的映射关系
const tabItems = [
  { label: "全部", key: "all" },
  { label: "微博", key: "weibo" },
  { label: "百度", key: "baidu" },
  { label: "知乎", key: "zhihu" },
  { label: "抖音", key: "douyin" },
  { label: "哔哩哔哩", key: "bilihot" },
];

// 计算属性：当前显示的列表
const currentList = computed(() => {
  return allHotMessages.value[activeTab.value] || [];
});

//初始化数据 将数据整合添加一个all分类 这个分类是所有分类的集合
async function loadmessages() {
  try {
    const res = await fetchhotMessages();
    let listObj = res.data;
    console.log(res.data, "原始数据");
    let allList = [];
    let i = 1;
    // 处理每个分类的数据
    for (let key of Object.keys(listObj)) {
      listObj[key].forEach((item) => {
        allList.push({
          index: i,
          url: item.url,
          title: item.title,
          desc: item.desc,
          category: key,
        });
        i++;
      });
    }

    // 添加全部分类
    listObj["all"] = allList;
    allHotMessages.value = listObj;
    console.log(allHotMessages.value, "最终数据");
    ElMessage({
      message: '获取热搜数据成功',
      type: 'success',
    })
  } catch (error) {
    console.error("加载热门消息失败:", error);
  }
}

// 处理标签点击
function handleHotClick(key) {
  console.log(key, "点击的标签键");
  activeTab.value = key;
}

// 详情查看
function viewDetails(item) {
  console.log("查看详情:", item);
  // 可以添加导航到详情页的逻辑
  window.open(item.url, "_blank");
}

// 去创作
function goToCreate(item) {
  console.log("去创作:", item.title, item.desc);
  // 添加导航到创作页面的逻辑
  emit("updateIndex", 0, item.title, item.desc);
}

onMounted(() => {
  loadmessages();
});
</script>

<style lang="less" scoped>
/* 基础样式 */
.inspiration {
  display: flex;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  width: 75vw;
  /* 固定宽度为视窗宽度的60% */
  flex-shrink: 0;
  /* 防止被压缩 */
  background-color: white;
  position: relative;
}

/* 垂直布局模式 - 默认 */
.tab-hot-select {
  width: 180px;
  min-width: 180px;
  /* 确保最小宽度 */
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-shadow: 0 0 4px #ccc;
  border-radius: 10px;
  box-sizing: border-box;
  flex-shrink: 0;
  /* 防止压缩 */
}

.tab-hot-item {
  padding: 12px;
  text-align: center;
  cursor: pointer;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

/* 水平布局覆盖样式 */
.rowLatout {
  flex-direction: column;
  width: 60vw;
  /* 保持固定宽度 */

  .tab-hot-select {
    width: 100%;
    min-width: initial;
    /* 覆盖最小宽度 */
    margin-bottom: 20px;
  }

  .hot-messages {
    margin-left: 0;
    width: 100%;
  }
}

/* 水平Tab覆盖样式 */
.tabLayout {
  flex-direction: row !important;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  /* 确保100%宽度 */

  .tab-hot-item {
    width: auto;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

/* Tab项样式 */
.tab-hot-item:hover {
  background-color: #007aff;
  color: white;
}

.tab-hot-item.active {
  background-color: #007aff;
  color: white;
  font-weight: bold;
}

/* 热门消息区域 */
.hot-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  overflow-y: auto;
  /* 垂直方向可滚动 */
  overflow-x: hidden;
  /* 水平方向不滚动 */
  box-shadow: 0 0 2px #ccc;
  border-radius: 10px;
  margin-left: 20px;
  box-sizing: border-box;
  width: calc(100% - 220px);
  /* 减去tab宽度和margin */
}

/* 热门消息项 */
.hot-item {
  position: relative;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.title {
  margin-top: 0;
  margin-bottom: 10px;
  width: calc(100% - 200px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
}

.description {
  color: #666;
  width: 100%;
  font-size: 12px;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  /* 确保长单词可以换行 */
}

.more {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;

  .details,
  .generte {
    white-space: nowrap;
    /* 防止按钮文字换行 */
  }

  .details {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: #fff;
    color: #007aff;
    border-radius: 20px;
    cursor: pointer;
    border: 1px solid #ccc;

    &:hover {
      background-color: #007aff;
      color: #fff;
    }
  }

  .generte {
    padding: 5px 10px;
    background-color: #007aff;
    color: white;
    border-radius: 20px;
    cursor: pointer;

    &:hover {
      background-color: #2788f0;
      color: #fff;
      border: 1px solid #007aff;
    }
  }
}

.hot-item:hover {
  transform: scale(1.02);
}

/* 在水平布局下调整热消息区域 */
.rowLatout .hot-messages {
  width: 100%;
  margin-left: 0;
}
</style>