<template>
  <div class="userspace">
    <div class="userspace-header">
      <h1>个人空间数据统计</h1>
    </div>

    <div class="loading-container" v-if="loading">
      <div class="loading-spinner"></div>
    </div>

    <div class="userspace-content" v-else>
      <div class="userspace-tabs">
        <div v-for="(tab, index) in tabs" :key="tab.key" :class="['tab-item', { active: activeTab === index }]"
          @click="activeTab = index">
          {{ tab.name }}
        </div>
      </div>

      <!-- 文章统计 -->
      <div class="stat-section" v-if="activeTab === 0 && articleStats">
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon article-icon"></div>
            <div class="stat-info">
              <div class="stat-value">{{ getTotalArticles() }}</div>
              <div class="stat-label">文章总数</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon words-icon"></div>
            <div class="stat-info">
              <div class="stat-value">{{ articleStats.wordStats?.total_words || 0 }}</div>
              <div class="stat-label">总字数</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon avg-icon"></div>
            <div class="stat-info">
              <div class="stat-value">{{ Math.round(Number(articleStats.wordStats?.avg_words) || 0) }}</div>
              <div class="stat-label">平均字数</div>
            </div>
          </div>
        </div>

        <div class="charts-row">
          <div class="chart-wrapper">
            <div ref="articleTrendChart" class="chart"></div>
          </div>
          <div class="chart-wrapper">
            <div ref="articleTypeChart" class="chart"></div>
          </div>
        </div>
      </div>

      <!-- 写作习惯 -->
      <div class="stat-section" v-if="activeTab === 1 && writingHabits">
        <div class="chart-wrapper">
          <div ref="timeDistributionChart" class="chart"></div>
        </div>

        <div class="charts-row">
          <div class="chart-wrapper">
            <div ref="weekdayChart" class="chart"></div>
          </div>
          <div class="chart-wrapper">
            <div ref="styleChart" class="chart"></div>
          </div>
        </div>
      </div>

      <!-- 收藏统计 -->
      <div class="stat-section" v-if="activeTab === 2 && favoriteStats">
        <div class="stats-cards">
          <div class="stat-card wide">
            <div class="stat-icon favorite-icon"></div>
            <div class="stat-info">
              <div class="stat-value">{{ favoriteStats.favoriteStats?.total_favorites || 0 }}</div>
              <div class="stat-label">收藏总数</div>
            </div>
          </div>
          <div class="stat-card wide">
            <div class="stat-icon date-icon"></div>
            <div class="stat-info">
              <div class="stat-value">{{ formatDate(favoriteStats.favoriteStats?.last_favorite_date) }}</div>
              <div class="stat-label">最近收藏时间</div>
            </div>
          </div>
        </div>

        <div class="chart-wrapper full-width">
          <div ref="favoriteTypeChart" class="chart"></div>
        </div>
      </div>

      <!-- 内容使用统计 -->
      <div class="stat-section" v-if="activeTab === 3 && contentUsageStats">
        <div class="conversion-rate">
          <div class="rate-label">话题转化率</div>
          <div class="rate-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${getConversionRate()}%` }"></div>
            </div>
            <div class="progress-text">
              {{ getConversionRate() }}% ({{ contentUsageStats.topicConversion?.converted_topics || 0 }}/{{
                contentUsageStats.topicConversion?.total_topics || 0 }})
            </div>
          </div>
        </div>

        <div class="chart-wrapper full-width">
          <div ref="templateUsageChart" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent
} from 'echarts/components';
import {
  LineChart,
  BarChart,
  PieChart,
  RadarChart
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { fetchContentUsageStats, fetchFavoriteStats, fetchArticleStats, fetchWritingHabits } from '@/services/modules/userspace';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  CanvasRenderer
]);

// 状态管理
const userId = ref(3);
const loading = ref(true);
const activeTab = ref(0);
const articleStats = ref(null);
const writingHabits = ref(null);
const favoriteStats = ref(null);
const contentUsageStats = ref(null);

// 图表引用
const articleTrendChart = ref(null);
const articleTypeChart = ref(null);
const timeDistributionChart = ref(null);
const weekdayChart = ref(null);
const styleChart = ref(null);
const favoriteTypeChart = ref(null);
const templateUsageChart = ref(null);

// 图表实例
const charts = {
  articleTrend: null,
  articleType: null,
  timeDistribution: null,
  weekday: null,
  style: null,
  favoriteType: null,
  templateUsage: null
};

// 标签页配置
const tabs = [
  { key: 'article', name: '文章统计' },
  { key: 'habits', name: '写作习惯' },
  { key: 'favorites', name: '收藏分析' },
  { key: 'usage', name: '内容使用' }
];

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true;

    // 直接使用API返回的数据，不需要.data
    const [articleRes, habitsRes, favoritesRes, usageRes] = await Promise.all([
      fetchArticleStats(userId.value),
      fetchWritingHabits(userId.value),
      fetchFavoriteStats(userId.value),
      fetchContentUsageStats(userId.value)
    ]);

    articleStats.value = articleRes;
    writingHabits.value = habitsRes;
    favoriteStats.value = favoritesRes;
    contentUsageStats.value = usageRes;

    console.log('Article Stats loaded:', articleStats.value);
    console.log('Writing Habits loaded:', writingHabits.value);
    console.log('Favorite Stats loaded:', favoriteStats.value);
    console.log('Content Usage loaded:', contentUsageStats.value);
  } catch (error) {
    console.error('获取用户统计数据失败', error);
  } finally {
    loading.value = false;
  }
};

// 计算文章总数
const getTotalArticles = () => {
  if (!articleStats.value?.articleStats) return 0;
  return articleStats.value.articleStats.reduce((sum, item) => sum + item.total, 0);
};

// 初始化图表
const initCharts = async () => {
  await nextTick();

  // 为所有图表容器设置一个延迟初始化
  setTimeout(() => {
    // 文章统计图表
    if (articleTrendChart.value && !charts.articleTrend) {
      console.log('Initializing article trend chart');
      charts.articleTrend = echarts.init(articleTrendChart.value);
    }

    if (articleTypeChart.value && !charts.articleType) {
      console.log('Initializing article type chart');
      charts.articleType = echarts.init(articleTypeChart.value);
    }

    // 写作习惯图表
    if (timeDistributionChart.value && !charts.timeDistribution) {
      console.log('Initializing time distribution chart');
      charts.timeDistribution = echarts.init(timeDistributionChart.value);
    }

    if (weekdayChart.value && !charts.weekday) {
      console.log('Initializing weekday chart');
      charts.weekday = echarts.init(weekdayChart.value);
    }

    if (styleChart.value && !charts.style) {
      console.log('Initializing style chart');
      charts.style = echarts.init(styleChart.value);
    }

    // 收藏统计图表
    if (favoriteTypeChart.value && !charts.favoriteType) {
      console.log('Initializing favorite type chart');
      charts.favoriteType = echarts.init(favoriteTypeChart.value);
    }

    // 内容使用统计图表
    if (templateUsageChart.value && !charts.templateUsage) {
      console.log('Initializing template usage chart');
      charts.templateUsage = echarts.init(templateUsageChart.value);
    }

    // 更新所有图表
    console.log('Updating all charts');
    updateCharts();

    // 打印所有图表实例，看哪些成功初始化了
    console.log('Chart instances:', charts);
  }, 300); // 延迟300ms确保DOM元素已渲染

  // 窗口大小变化时自动调整图表
  window.addEventListener('resize', handleResize);
};

// 处理窗口大小变化
const handleResize = () => {
  Object.values(charts).forEach(chart => {
    chart && chart.resize();
  });
};

// 更新所有图表
const updateCharts = () => {
  // 先手动调整当前标签页所有图表的大小
  resizeCurrentTabCharts();

  if (activeTab.value === 0) {
    updateArticleCharts();
  } else if (activeTab.value === 1) {
    updateHabitsCharts();
  } else if (activeTab.value === 2) {
    updateFavoriteCharts();
  } else if (activeTab.value === 3) {
    updateUsageCharts();
  }
};


const resizeCurrentTabCharts = () => {
  if (activeTab.value === 0) {
    charts.articleTrend && charts.articleTrend.resize();
    charts.articleType && charts.articleType.resize();
  } else if (activeTab.value === 1) {
    charts.timeDistribution && charts.timeDistribution.resize();
    charts.weekday && charts.weekday.resize();
    charts.style && charts.style.resize();
  } else if (activeTab.value === 2) {
    charts.favoriteType && charts.favoriteType.resize();
  } else if (activeTab.value === 3) {
    charts.templateUsage && charts.templateUsage.resize();
  }
};

// 更新文章统计图表
const updateArticleCharts = () => {
  if (!articleStats.value) {
    console.warn('No article stats data available');
    return;
  }

  try {
    // 文章趋势图
    if (charts.articleTrend) {
      console.log('Updating article trend chart');
      const trendData = articleStats.value.articleStats || [];
      console.log('Trend data:', trendData);

      charts.articleTrend.setOption({
        title: {
          text: '文章创作趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: trendData.map(item => item.month)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '文章数',
            type: 'line',
            data: trendData.map(item => item.total),
            smooth: true,
            itemStyle: {
              color: '#6b9bc3'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(107, 155, 195, 0.3)'
                }, {
                  offset: 1, color: 'rgba(107, 155, 195, 0.1)'
                }]
              }
            }
          }
        ]
      });
      console.log('Article trend chart updated');
    } else {
      console.warn('Article trend chart not initialized');
    }

    // 文章类型分布图
    if (charts.articleType) {
      console.log('Updating article type chart');
      const typeData = articleStats.value.typeStats || [];
      console.log('Type data:', typeData);

      const pieData = typeData.map(item => ({
        name: item.type_name,
        value: item.count
      }));

      charts.articleType.setOption({
        title: {
          text: '文章类型分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          type: 'scroll',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '文章类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '12',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: pieData
          }
        ]
      });
      console.log('Article type chart updated');
    } else {
      console.warn('Article type chart not initialized');
    }
  } catch (error) {
    console.error('Error updating article charts:', error);
  }
};

// 更新写作习惯图表
const updateHabitsCharts = () => {
  if (!writingHabits.value) {
    console.warn('No writing habits data available');
    return;
  }

  try {
    // 时间分布图
    // 修改updateHabitsCharts函数中的时间分布图部分
    if (charts.timeDistribution) {
      console.log('Updating time distribution chart');
      const timeData = writingHabits.value.timeStats || [];
      console.log('Time stats data:', timeData);

      const hours = Array(24).fill(0).map((_, i) => i);
      const counts = hours.map(hour => {
        const found = timeData.find(item => item.hour === hour);
        return found ? found.count : 0;
      });

      charts.timeDistribution.setOption({
        title: {
          text: '每日时段活跃度',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          // 修改这里的formatter为函数，而不是字符串模板
          formatter: function (params) {
            const hour = parseInt(params[0].name);
            return `${hour}:00 - ${hour}:59<br/>文章数: ${params[0].value}`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: hours.map(h => `${h}:00`),
          axisLabel: {
            interval: 2
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '文章数',
            type: 'bar',
            data: counts,
            itemStyle: {
              color: function (params) {
                const value = params.value;
                if (value === 0) return '#f0f2f5';
                if (value <= 3) return '#91cc75';
                if (value <= 7) return '#5470c6';
                return '#ee6666';
              }
            }
          }
        ]
      });
      console.log('Time distribution chart updated');
    } else {
      console.warn('Time distribution chart not initialized');
    }

    // 星期分布图
    if (charts.weekday) {
      console.log('Updating weekday chart');
      const weekdayData = writingHabits.value.weekdayStats || [];
      console.log('Weekday stats data:', weekdayData);

      const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const counts = Array(7).fill(0);

      weekdayData.forEach(item => {
        if (item.weekday >= 0 && item.weekday < 7) {
          counts[item.weekday] = item.count;
        }
      });

      charts.weekday.setOption({
        title: {
          text: '星期分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: weekdays
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '文章数',
            type: 'bar',
            data: counts,
            itemStyle: {
              color: function (params) {
                const colors = ['#91cc75', '#fac858', '#ee6666', '#73c0de', '#5470c6', '#9a60b4', '#fc8452'];
                return colors[params.dataIndex % colors.length];
              }
            }
          }
        ]
      });
      console.log('Weekday chart updated');
    } else {
      console.warn('Weekday chart not initialized');
    }

    // 风格分布图
    if (charts.style) {
      console.log('Updating style chart');
      const styleData = writingHabits.value.styleStats || [];
      console.log('Style stats data:', styleData);

      const pieData = styleData.map(item => ({
        name: item.style_name,
        value: item.count
      }));

      charts.style.setOption({
        title: {
          text: '语言风格偏好',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          top: 'middle'
        },
        series: [
          {
            name: '语言风格',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      console.log('Style chart updated');
    } else {
      console.warn('Style chart not initialized');
    }
  } catch (error) {
    console.error('Error updating habits charts:', error);
  }
};

// 更新收藏统计图表
const updateFavoriteCharts = () => {
  if (!favoriteStats.value) {
    console.warn('No favorite stats data available');
    return;
  }

  try {
    // 收藏类型分布
    if (charts.favoriteType) {
      console.log('Updating favorite type chart');
      const typeData = favoriteStats.value.favoriteTypes || [];
      console.log('Favorite type data:', typeData);

      const pieData = typeData.map(item => ({
        name: item.type_name,
        value: item.count
      }));

      charts.favoriteType.setOption({
        title: {
          text: '收藏话题类型分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'middle'
        },
        series: [
          {
            name: '话题类型',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)'
            }
          }
        ]
      });
      console.log('Favorite type chart updated');
    } else {
      console.warn('Favorite type chart not initialized');
    }
  } catch (error) {
    console.error('Error updating favorite charts:', error);
  }
};

// 更新内容使用统计图表
const updateUsageCharts = () => {
  if (!contentUsageStats.value) {
    console.warn('No content usage stats data available');
    return;
  }

  try {
    // 模板使用统计
    if (charts.templateUsage) {
      console.log('Updating template usage chart');
      const templateData = contentUsageStats.value.templateStats || [];
      console.log('Template usage data:', templateData);

      charts.templateUsage.setOption({
        title: {
          text: '模板使用频率',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '模板ID: {b}<br/>使用次数: {c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: templateData.map(item => `模板 ${item.template_id}`)
        },
        series: [
          {
            name: '使用次数',
            type: 'bar',
            data: templateData.map(item => item.usage_count),
            itemStyle: {
              color: function (params) {
                const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
                return colors[params.dataIndex % colors.length];
              }
            }
          }
        ]
      });
      console.log('Template usage chart updated');
    } else {
      console.warn('Template usage chart not initialized');
    }
  } catch (error) {
    console.error('Error updating usage charts:', error);
  }
};

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return '无数据';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 计算话题转化率
const getConversionRate = () => {
  if (!contentUsageStats.value || !contentUsageStats.value.topicConversion) return 0;

  const { total_topics, converted_topics } = contentUsageStats.value.topicConversion;
  if (!total_topics) return 0;

  return Math.round((converted_topics / total_topics) * 100);
};

// 修改标签页切换的监听逻辑
// 修改标签页切换的监听逻辑
watch(activeTab, (newValue, oldValue) => {
  nextTick(() => {
    // 清理旧标签页的图表
    if (oldValue === 0) {
      // 可选：销毁文章统计图表，便于下次重新创建
      // 如果不想销毁，只需要resize就删除这部分代码
      if (charts.articleTrend) {
        charts.articleTrend.dispose();
        charts.articleTrend = null;
      }
      if (charts.articleType) {
        charts.articleType.dispose();
        charts.articleType = null;
      }
    } else if (oldValue === 1) {
      if (charts.timeDistribution) {
        charts.timeDistribution.dispose();
        charts.timeDistribution = null;
      }
      if (charts.weekday) {
        charts.weekday.dispose();
        charts.weekday = null;
      }
      if (charts.style) {
        charts.style.dispose();
        charts.style = null;
      }
    } else if (oldValue === 2) {
      if (charts.favoriteType) {
        charts.favoriteType.dispose();
        charts.favoriteType = null;
      }
    } else if (oldValue === 3) {
      if (charts.templateUsage) {
        charts.templateUsage.dispose();
        charts.templateUsage = null;
      }
    }

    // 延迟初始化新标签页的图表
    setTimeout(() => {
      // 初始化新标签页的图表
      if (newValue === 0) {
        if (articleTrendChart.value && !charts.articleTrend) {
          charts.articleTrend = echarts.init(articleTrendChart.value);
        }
        if (articleTypeChart.value && !charts.articleType) {
          charts.articleType = echarts.init(articleTypeChart.value);
        }
      } else if (newValue === 1) {
        if (timeDistributionChart.value && !charts.timeDistribution) {
          charts.timeDistribution = echarts.init(timeDistributionChart.value);
        }
        if (weekdayChart.value && !charts.weekday) {
          charts.weekday = echarts.init(weekdayChart.value);
        }
        if (styleChart.value && !charts.style) {
          charts.style = echarts.init(styleChart.value);
        }
      } else if (newValue === 2) {
        if (favoriteTypeChart.value && !charts.favoriteType) {
          charts.favoriteType = echarts.init(favoriteTypeChart.value);
        }
      } else if (newValue === 3) {
        if (templateUsageChart.value && !charts.templateUsage) {
          charts.templateUsage = echarts.init(templateUsageChart.value);
        }
      }

      // 更新图表
      updateCharts();
    }, 300);
  });
});

// 添加一个DOM变化监听，确保图表在容器大小变化时自动调整
onMounted(() => {
  // 创建一个ResizeObserver来监视图表容器的大小变化
  const resizeObserver = new ResizeObserver(() => {
    resizeCurrentTabCharts();
  });

  // 观察所有图表容器
  [
    articleTrendChart.value,
    articleTypeChart.value,
    timeDistributionChart.value,
    weekdayChart.value,
    styleChart.value,
    favoriteTypeChart.value,
    templateUsageChart.value
  ].forEach(el => {
    el && resizeObserver.observe(el);
  });

  // 在组件卸载时停止观察
  onBeforeUnmount(() => {
    resizeObserver.disconnect();
  });
});

// 数据变化时更新图表
watch([articleStats, writingHabits, favoriteStats, contentUsageStats], () => {
  nextTick(() => {
    setTimeout(() => {
      console.log('Data changed, updating charts');
      updateCharts();
    }, 300);
  });
});

// 组件挂载
onMounted(async () => {
  console.log('Component mounted');
  await fetchData();
  await initCharts();
});

// 组件卸载
onBeforeUnmount(() => {
  console.log('Component unmounting, cleaning up...');
  window.removeEventListener('resize', handleResize);

  // 销毁图表实例
  Object.values(charts).forEach(chart => {
    chart && chart.dispose();
  });
});
</script>

<style lang="less" scoped>
.userspace {
  max-width: 1000px;
  padding: 20px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  color: #333;

  .userspace-header {
    text-align: center;
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      font-weight: 500;
      color: #333;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #409eff;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }

  .userspace-content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .userspace-tabs {
    display: flex;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;

    .tab-item {
      padding: 16px 20px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #409eff;
      }

      &.active {
        color: #409eff;
        border-bottom: 2px solid #409eff;
        background-color: #fff;
      }
    }
  }

  .stat-section {
    padding: 20px;
  }

  .stats-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;

    .stat-card {
      flex: 1 1 calc(33.333% - 16px);
      min-width: 200px;
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 16px;
      display: flex;
      align-items: center;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-3px);
      }

      &.wide {
        flex: 1 1 calc(50% - 16px);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 16px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 50%;

        &.article-icon {
          background-color: #ecf5ff;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23409eff"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v10H6V3h7z"/></svg>');
        }

        &.words-icon {
          background-color: #f0f9eb;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2367c23a"><path d="M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-9 14H9v-2h2v2zm0-4H9V8h2v4z"/></svg>');
        }

        &.avg-icon {
          background-color: #fdf6ec;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e6a23c"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>');
        }

        &.favorite-icon {
          background-color: #fef0f0;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f56c6c"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>');
        }

        &.date-icon {
          background-color: #f5f7fa;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23909399"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5z"/></svg>');
        }
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }
  }

  .charts-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;

    .chart-wrapper {
      flex: 1 1 calc(50% - 10px);
      min-width: 300px;
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 16px;

      &.full-width {
        flex: 1 1 100%;
      }

      .chart {
        height: 350px;
        width: 100%;
      }
    }
  }

  .chart-wrapper {
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 16px;
    margin-bottom: 20px;

    .chart {
      height: 350px;
      width: 100%;
    }
  }

  .conversion-rate {
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 20px;
    margin-bottom: 20px;

    .rate-label {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .rate-progress {
      .progress-bar {
        height: 20px;
        background-color: #f0f2f5;
        border-radius: 10px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background-color: #409eff;
          border-radius: 10px;
          transition: width 0.5s ease;
        }
      }

      .progress-text {
        margin-top: 8px;
        text-align: right;
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

@media (max-width: 768px) {
  .userspace {
    padding: 10px;

    .userspace-tabs {
      overflow-x: auto;

      .tab-item {
        padding: 14px 16px;
        white-space: nowrap;
      }
    }

    .stat-section {
      padding: 15px;
    }

    .stats-cards {
      .stat-card {
        flex: 1 1 100%;
      }
    }

    .charts-row {
      .chart-wrapper {
        flex: 1 1 100%;

        .chart {
          height: 280px;
        }
      }
    }
  }
}
</style>