<template>
  <div class="DataShow">
    <van-config-provider :theme-vars="themeVars">
      <ul class="data-list">
        <div class="header">数据实时显示</div>
        <li class="data-item">
          <van-circle
            v-model:current-rate="currentRateForTemperature"
            :rate="rateForTemperature"
            :speed="100"
            :text="textForTemperature"
            layer-color="#ebedf0"
            :color="gradientColor"
            class="circle-with-shadow"
          />
          <div
            class="tab"
            :class="baseInformation().isSafeForT ? 'safe' : 'danger'"
          >
            {{ baseInformation().isSafeForT ? "正常" : "危险" }}
          </div>
        </li>
        <li class="data-item">
          <van-circle
            v-model:current-rate="currentRateForHumidity"
            :rate="rateForHumidity"
            :speed="100"
            :text="textForHumidity"
            layer-color="#ebedf0"
            :color="gradientColor"
            class="circle-with-shadow"
          />
          <div
            class="tab"
            :class="baseInformation().isSafeForH ? 'safe' : 'danger'"
          >
            {{ baseInformation().isSafeForH ? "正常" : "危险" }}
          </div>
        </li>
        <li class="data-item">
          <van-circle
            v-model:current-rate="currentRateForSoilHumidity"
            :rate="rateForSoilHumidity"
            :speed="100"
            :text="textForSoilHumidity"
            layer-color="#ebedf0"
            :color="gradientColor"
            class="circle-with-shadow"
          />
          <div
            class="tab"
            :class="baseInformation().isSafeForS ? 'safe' : 'danger'"
          >
            {{ baseInformation().isSafeForS ? "正常" : "危险" }}
          </div>
        </li>
        <li class="data-item">
          <van-circle
            v-model:current-rate="currentRateForIllumination"
            :rate="rateForIllumination"
            :speed="100"
            :text="textForIllumination"
            layer-color="#ebedf0"
            :color="gradientColor"
            class="circle-with-shadow"
          />
          <div
            class="tab"
            :class="baseInformation().isSafeForL ? 'safe' : 'danger'"
          >
            {{ baseInformation().isSafeForL ? "正常" : "危险" }}
          </div>
        </li>
      </ul>
    </van-config-provider>
    <div class="graph">
      <div class="header">
        <div class="choiceType">
          <van-popover
            v-model:show="showPopoverType"
            :actions="actionsType"
            @select="onSelectType"
          >
            <template #reference>
              <van-icon name="bar-chart-o" />
            </template>
          </van-popover>
        </div>
        {{ graphType }}历史数据
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
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  reactive,
  onUpdated,
} from "vue";

const themeVars = reactive({
  // cellBorderColor: "red",
  circleTextFontSize: "3.5rem",
  circleTextColor: "#5ca6db",
});

const currentRateForTemperature = ref(0); // 当前进度
const currentRateForHumidity = ref(0); // 当前进度
const currentRateForSoilHumidity = ref(0); // 当前进度
const currentRateForIllumination = ref(0); // 当前进度
const gradientColor = {
  "0%": "#78c5f7",
  "100%": "#5ca6db",
};

import { baseInformation } from "@/store";

let textForTemperature = "";

let textForHumidity = "";

let textForSoilHumidity = "";

let textForIllumination = "";

const targetForTemperature = 0;
const rateForTemperature = ref((0 / targetForTemperature) * 100); // 目标进度
const targetForHumidity = 0;
const rateForHumidity = ref((0 / targetForHumidity) * 100); // 目标进度
const targetForSoilHumidity = 0;
const rateForSoilHumidity = ref((0 / targetForSoilHumidity) * 100); // 目标进度
const targetForIllumination = 0;
const rateForIllumination = ref((0 / targetForIllumination) * 100); // 目标进度

import { getHistoryData, getRealTimeData } from "@/utils/api.js"; // 假设你有一个API可以获取实时数据

setInterval(async () => {
  const { data } = await getRealTimeData(); // 获取实时数据
  // console.log(data.data);
  let temperature = Number(data.data.temperature); // 更新温度数据
  let humidity = Number(data.data.humidity); // 更新湿度数据
  let soil_moisture = Number(data.data.soil_moisture); // 更新土壤湿度数据
  let illumination = Number(data.data.illumination) || 0; // 更新光照数据

  currentRateForTemperature.value =
    ((temperature - baseInformation().temperature[0]) /
      (baseInformation().temperature[1] - baseInformation().temperature[0])) *
    100; // 更新目标进度
  currentRateForHumidity.value =
    ((humidity - baseInformation().humidity[0]) /
      (baseInformation().humidity[1] - baseInformation().humidity[0])) *
    100; // 更新目标进度
  currentRateForSoilHumidity.value =
    ((soil_moisture - baseInformation().soil_moisture[0]) /
      (baseInformation().soil_moisture[1] -
        baseInformation().soil_moisture[0])) *
    100; // 更新目标进度
  currentRateForIllumination.value =
    ((illumination - baseInformation().light_intensity[0]) /
      (baseInformation().light_intensity[1] -
        baseInformation().light_intensity[0])) *
    100; // 更新目标进度

  baseInformation().isSafeForT =
    currentRateForTemperature.value <= 100 &&
    currentRateForTemperature.value >= 0;
  baseInformation().isSafeForH =
    currentRateForHumidity.value < 100 && currentRateForHumidity.value >= 0;
  baseInformation().isSafeForS =
    currentRateForSoilHumidity.value < 100 &&
    currentRateForSoilHumidity.value >= 0;
  baseInformation().isSafeForL =
    currentRateForIllumination.value < 100 &&
    currentRateForIllumination.value >= 0;

  textForTemperature = `温度：${temperature} ℃`;
  textForHumidity = `空气湿度：${humidity} %`;
  textForSoilHumidity = `土壤湿度：${soil_moisture} %`;
  textForIllumination = `光照：${illumination} lux`;
}, 2000);

import * as echarts from "echarts";
import { showToast } from "vant";
import axios from "axios";

const showPopover = ref(false);
const showPopoverType = ref(false);
// 通过 actions 属性来定义菜单选项
const actions = [{ text: "3 天" }, { text: "7 天" }, { text: "30 天" }];
const actionsType = [
  { text: "温度" },
  { text: "空气湿度" },
  { text: "土壤湿度" },
  { text: "光照" },
];
const graphType = ref("温度");
const choiceTime = ref(7);
const onSelect = (action) => {
  choiceTime.value = action.text;
  switch (action.text) {
    case "3 天":
      choiceTime.value = 3;
      break;
    case "7 天":
      choiceTime.value = 7;
      break;
    case "30 天":
      choiceTime.value = 30;
      break;
  }
  updateGraph();
};
const onSelectType = (action) => {
  graphType.value = action.text;
  updateGraph();
};

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

let xData = ["类别1", "类别2", "类别3", "类别4", "类别5", "类别6", "类别7"]; // 你可以动态传入数据
let yData = [120, 200, 150, 80, 70, 110, 130];

const chartWidth = computed(() => {
  const baseRem = 12; // 每个点的宽度（你可以微调）
  return xData.length <= 7 ? "100%" : `${xData.length * baseRem}rem`;
});

onMounted(async () => {
  await nextTick();
  chartInstance = echarts.init(chartDom.value);

  console.log(choiceTime, graphType);
  // 获取数据
  await baseInformation().getHistoryData({ choice: 7 });
  xData = baseInformation().historyData.dates.map((item) => {
    // 格式化日期为YYYY-MM-DD格式
    const date = new Date(item);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  });
  yData = baseInformation().historyData.temperature;

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
        name: "value",
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

const updateGraph = async () => {
  // 获取数据
  await baseInformation().getHistoryData({ choice: choiceTime });
  xData = baseInformation().historyData.dates.map((item) => {
    // 格式化日期为YYYY-MM-DD格式
    const date = new Date(item);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  });

  switch (graphType.value) {
    case "温度":
      yData = baseInformation().historyData.temperature;
      break;
    case "空气湿度":
      yData = baseInformation().historyData.humidity;
      break;
    case "土壤湿度":
      yData = baseInformation().historyData.soil_moisture;
      break;
    case "光照":
      yData = baseInformation().historyData.temperature;
      break;
  }

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
        name: "value",
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
};
</script>

<style lang="less" scoped>
.DataShow {
  width: 100rem;
  // height: 500rem;
  // background-color: pink;

  .data-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width: 100rem;
    height: 120rem;
    padding: 5rem;
    margin-top: 3rem;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    .header {
      height: 10rem;
      width: 100rem;
      font-size: 5rem;
      line-height: 10rem;
      color: #5ca6db;
      text-align: center;
      background-color: white;
    }
    .data-item {
      width: 40rem;
      height: 45rem;
      margin: 2rem;
      // padding: 5rem;
      // background-color: skyblue;
      .circle-with-shadow {
        width: 40rem;
        height: 40rem;
        // padding: 5rem;
        // background-color: lightblue;
        position: relative;
        border-radius: 50%; /* 确保阴影是圆形 */
      }
    }
    .tab {
      width: 20rem;
      height: 5rem;
      margin: 0 10rem;
      margin-top: -13rem;
      line-height: 5rem;
      text-align: center;
      font-size: 3.5rem;
      color: #fff;
      border-radius: 10px;
    }
    .safe {
      background-color: #78c5f7;
    }
    .danger {
      background-color: #f56c6c;
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
    .choiceType {
      position: absolute;
      top: -10rem;
      left: 15rem;
      width: 10rem;
      height: 10rem;
      // background-color: pink;
      margin-top: 10rem;
      color: #5ca6db;
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
