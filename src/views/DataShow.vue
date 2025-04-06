<template>
  <div class="DataShow">
    <van-config-provider :theme-vars="themeVars">
      <ul class="data-list">
        <li class="data-item">
          <van-circle
            v-model:current-rate="currentRateForTemperature"
            :rate="rateForTemperature"
            :speed="100"
            :text="textForTemperature"
            layer-color="#ebedf0"
            :color="gradientColor"
          />
        </li>
        <li class="data-item">
          <van-circle
            v-model:current-rate="currentRateForHumidity"
            :rate="rateForHumidity"
            :speed="100"
            :text="textForHumidity"
            layer-color="#ebedf0"
            :color="gradientColor"
          />
        </li>
        <li class="data-item">
          <van-circle
            v-model:current-rate="currentRateForIllumination"
            :rate="rateForIllumination"
            :speed="100"
            :text="textForIllumination"
            layer-color="#ebedf0"
            :color="gradientColor"
          />
        </li>
      </ul>
    </van-config-provider>
    <div class="graph">
      <div class="header">
        温度历史数据
        <div class="choice">
          <van-popover
            v-model:show="showPopover"
            :actions="actions"
            @select="onSelect"
          >
            <template #reference>
              <van-icon name="underway-o" />
            </template>
          </van-popover>
        </div>
      </div>
      <!-- <div ref="chartDom" style="width: 100rem; height: 80rem"></div> -->
      <!-- 横向滚动容器 -->
      <div style="overflow-x: auto; width: 100%">
        <div
          ref="chartDom"
          :style="{ width: chartWidth, height: '80rem' }"
        ></div>
      </div>
    </div>

    <!-- <div class="graph"></div>
    <div class="graph"></div>
    <div class="vedio"></div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, reactive } from "vue";

const themeVars = reactive({
  // cellBorderColor: "red",
  circleTextFontSize: "3.5rem",
  circleTextColor: "#5ca6db",
});

const currentRateForTemperature = ref(0); // 当前进度
const currentRateForHumidity = ref(0); // 当前进度
const currentRateForIllumination = ref(0); // 当前进度
const gradientColor = {
  "0%": "#78c5f7",
  "100%": "#5ca6db",
};
const targetForTemperature = ref(100);
const rateForTemperature = ref((80 / targetForTemperature.value) * 100); // 目标进度
const textForTemperature = computed(() => {
  return `温度：${currentRateForTemperature.value}`;
});

const textForHumidity = computed(() => {
  return `湿度：${currentRateForHumidity.value}`;
});
const targetForHumidity = ref(100);
const rateForHumidity = ref((60 / targetForHumidity.value) * 100); // 目标进度

const textForIllumination = computed(() => {
  return `光照：${currentRateForIllumination.value}`;
});
const targetForIllumination = ref(100);
const rateForIllumination = ref((77 / targetForIllumination.value) * 100); // 目标进度

// setTimeout(() => {
//   currentRate.value++;
// }, 1000); // 模拟数据更新

import * as echarts from "echarts";
import { showToast } from "vant";

const showPopover = ref(false);
// 通过 actions 属性来定义菜单选项
const actions = [{ text: "选项一" }, { text: "选项二" }, { text: "选项三" }];
const onSelect = (action) => showToast(action.text);

// // 创建一个响应式引用来保存DOM元素
// const chartDom = ref(null);
// let chartInstance = null;

// // 初始化ECharts实例并设置配置项（这里以折线图为例，但可灵活替换）
// onMounted(async () => {
//   await nextTick(); // 确保DOM已经渲染完成
//   chartInstance = echarts.init(chartDom.value);
//   const option = {
//     // 这里是ECharts的配置项，可以根据需要绘制不同类型的图表
//     title: {},
//     tooltip: {},
//     xAxis: {
//       data: [
//         "类别1",
//         "类别2",
//         "类别3",
//         "类别4",
//         "类别5",
//         "类别1",
//         "类别2",
//         "类别3",
//         "类别4",
//         "类别5",
//         "类别1",
//         "类别2",
//         "类别3",
//         "类别4",
//         "类别5",
//       ],
//     },
//     yAxis: {},
//     dataZoom: [
//       {
//         type: "slider",
//         show: true,
//         start: 0,
//         end: 30,
//       },
//       // {
//       //   type: "inside",
//       //   start: 0,
//       //   end: 30,
//       // },
//     ],
//     series: [
//       {
//         name: "数据系列",
//         type: "line", // 这里可以是'line'、'bar'、'pie'等，根据图表类型选择
//         data: [
//           120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70, 110, 130, 120,
//         ],
//       },
//     ],
//     grid: {
//       top: "15rem",
//       // bottom: "40rem",
//       // left: "60rem",
//       // right: 0,
//     },
//   };
//   chartInstance.setOption(option);
// });

// // 销毁ECharts实例
// onUnmounted(() => {
//   if (chartInstance != null && chartInstance.dispose) {
//     chartInstance.dispose();
//   }
// });
const chartDom = ref(null);
let chartInstance = null;

const xData = ["类别1", "类别2", "类别3", "类别4", "类别5", "类别6", "类别7"]; // 你可以动态传入数据
const yData = [120, 200, 150, 80, 70, 110, 130];

const chartWidth = computed(() => {
  const baseRem = 12; // 每个点的宽度（你可以微调）
  return xData.length <= 7 ? "100%" : `${xData.length * baseRem}rem`;
});

onMounted(async () => {
  await nextTick();
  chartInstance = echarts.init(chartDom.value);

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: xData,
      axisLabel: {
        interval: 0,
        rotate: xData.length > 7 ? 45 : 0,
      },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "数据系列",
        type: "line",
        data: yData,
        smooth: true,
        lineStyle: {
          color: "#5ca6db",
          width: 4,
        },
        itemStyle: {
          color: "#78c5f7",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(120, 197, 247, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(120, 197, 247, 0.1)",
              },
            ],
          },
        },
      },
    ],
    grid: {
      top: "20rem",
    },
  };

  chartInstance.setOption(option);
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<style lang="less" scoped>
.DataShow {
  width: 100rem;
  height: 500rem;
  // background-color: pink;

  .data-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100rem;
    height: 35rem;
    padding: 5rem;
    margin-top: 3rem;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    .data-item {
      width: 25rem;
      height: 25rem;
      // background-color: skyblue;
      .circle {
        width: 25rem;
        height: 25rem;
        // background-color: lightblue;
      }
    }
  }
  .graph {
    width: 100rem;
    height: 90rem;
    // padding-top: 10rem;
    margin-top: 10rem;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

    .header {
      position: relative;
      top: 0;
      left: 0;
      font-size: 5rem;
      line-height: 10rem;
      color: #5ca6db;
      text-align: center;
      width: 100%;
      height: 10rem;
      background-color: white;
      z-index: 999;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .choice {
      position: absolute;
      top: -10rem;
      right: 15rem;
      width: 10rem;
      height: 10rem;
      // background-color: pink;
      margin-top: 10rem;
      color: #5ca6db;
    }
  }
  .vedio {
    width: 100rem;
    height: 80rem;
    margin-top: 10rem;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  }
}
</style>
