<template>
  <div class="messages-container">
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="预警消息" name="warnings" @click="onLoad">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <!-- <van-cell title="单元格" value="内容" label="描述信息" /> -->
          <van-cell
            v-for="item in list"
            :key="item"
            class="message-cell"
            :class="{ newMessage: !item.read }"
            :title="item.title"
            :label="item.message + ' ' + item.time"
            is-link
            center
            @click="showMessage(item.id, item)"
          />
        </van-list>
      </van-collapse-item>
      <van-collapse-item title="报告列表" name="reports">
        <van-list
          v-model:loading="loadingForReports"
          :finished="finishedForReports"
          finished-text="没有更多了"
          @load="onLoadForReports"
        >
          <van-cell
            v-for="item in listForReports"
            :key="item"
            class="message-cell"
            :title="item.title"
            :label="item.time"
            is-link
            center
            @click="showReport(item.id, item)"
          />
        </van-list>
      </van-collapse-item>
    </van-collapse>
    <!-- <van-config-provider :theme-vars="themeVars">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="item in list"
          :key="item"
          class="message-cell"
          :class="{ newMessage: !item.read }"
          :title="item.title"
          :label="item.message + ' ' + item.time"
          is-link
          center
          @click="showMessage(item.id, item)"
        />
      </van-list>
    </van-config-provider> -->
    <van-popup
      class="popup"
      v-model:show="showAdd"
      round
      :style="{ height: '80rem', width: '80rem' }"
    >
      <div class="header">{{ showDetail.title }}</div>
      <van-cell-group inset>
        <van-cell title="温度" :value="showDetail.temperature" />
        <van-cell title="空气湿度" :value="showDetail.humidity" />
        <van-cell title="土壤湿度" :value="showDetail.soil_moisture" />
        <van-cell title="光照" value="1234" />
        <van-cell title="时间" :value="showDetail.time" />
      </van-cell-group>
    </van-popup>
    <van-popup
      class="popup report"
      v-model:show="showForReport"
      round
      :style="{ height: '180rem', width: '80rem' }"
    >
      <iframe
        src="http://117.72.12.143/report.html"
        style="width: 80rem; height: 180rem; border: none"
      ></iframe>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  getMessageList,
  getMessageDetail,
  getReports,
  getReportDetail,
  getUnreadCount,
  readMessage,
} from "@/utils/api";
import { baseInformation } from "@/store";
// list
const activeName = ref("");

const list = ref([]);
const loading = ref(false);
const finished = ref(false);

const themeVars = reactive({
  cellBackground: "#ffffff",
  cellTextColor: "#333333",
  cellActiveColor: "#f7f9fc",
  cellBorderColor: "#e8eef4",
});

const onLoad = async () => {
  const res = await getMessageList();
  if (res.status === 200) {
    list.value = res.data.data.list.map((item, index) => {
      item.read = item.isRead;
      // Format the date from ISO format to a more readable format
      item.time = new Date(item.time).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return item;
    });
    const response = await getUnreadCount();
    // console.log(response.data.data.count);
    localStorage.setItem(
      "newMessageNumber",
      JSON.stringify({
        number: response.data.data.count,
      })
    );
    baseInformation().newMessageNumber = response.data.data.count;
    // 处理成功情况
    console.log(list.value);
    // 加载状态结束;
    loading.value = false;
    // 数据全部加载完成
    finished.value = true;
  } else {
    // 处理错误情况
    showToast("获取预警消息列表失败，请稍后重试");
  }
};

const showDetail = ref({});
const showAdd = ref(false);
const showMessage = async (id, item) => {
  showAdd.value = true;
  const { data } = await getMessageDetail(id);
  showDetail.value = data.data;
  showDetail.value.time = new Date(data.data.time).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  if (!item.read) {
    baseInformation().newMessageNumber--;
    localStorage.setItem(
      "newMessageNumber",
      JSON.stringify({
        number: baseInformation().newMessageNumber,
      })
    );
    await readMessage(id);
  }
  console.log(item);
  item.read = true;
  onLoad();
};

const listForReports = ref([]);
const loadingForReports = ref(false);
const finishedForReports = ref(false);

const onLoadForReports = async () => {
  const res = await getReports();
  listForReports.value = res.data.data.data.map((item) => {
    // Format the date from ISO format to a more readable format
    item.title = `报告${item.id}`;
    item.time = new Date(item.datetime).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return item;
  });
  if (res.status === 200) {
    // console.log(res);
    // 处理成功情况
    console.log(list.value);
    // 加载状态结束;
    loadingForReports.value = false;
    // 数据全部加载完成
    finishedForReports.value = true;
  } else {
    // 处理错误情况
    showToast("获取报告列表失败，请稍后重试");
  }
};

const showDetailForReport = ref({});
const showForReport = ref(false);
const showReport = async (id, item) => {
  showForReport.value = true;
  const res = await getReportDetail(id);
  // console.log(res);
  // document.querySelector(".report").innerHTML = res.data.data.data.analysis;
};
</script>

<style lang="less" scoped>
.messages-container {
  padding: 10px;
  background-color: #f7f9fc;
  min-height: 100%;

  .popup {
    background-color: #f7f9fc;
    border-top-left-radius: 5rem;
    border-top-right-radius: 5rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);

    .header {
      height: 12rem;
      font-size: 5rem;
      text-align: center;
      line-height: 12rem;
      background-color: #f7f9fc;
      border-bottom: 1px solid #e8eef4;
      margin-bottom: 5rem;
      color: rgba(255, 0, 8, 0.315);
      font-weight: bold;
    }
  }
}

.message-cell {
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}
.newMessage {
  position: relative;
}

.newMessage::before {
  content: "";
  position: absolute;
  top: 12px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: #ff4d4f;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 5px rgba(255, 77, 79, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
  }
}

// :deep(.van-cell__title) {
//   color: #5ca6db;
//   font-weight: 500;
// }

// :deep(.van-cell__value) {
//   color: #5ca6db;
// }

// :deep(.van-list__finished-text) {
//   color: #aac7db;
//   font-size: 3.5rem;
//   padding: 10px 0;
// }

// :deep(.van-list__loading) {
//   color: #5ca6db;
// }
:deep(.van-collapse) {
  background-color: transparent;
  margin: 10px 0;
}

:deep(.van-collapse-item) {
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

:deep(.van-collapse-item__title) {
  background-color: #ffffff;
  color: #5ca6db;
  font-weight: bold;
}

:deep(.van-floating-bubble) {
  background-color: #5ca6db;
  box-shadow: 0 2px 8px rgba(92, 166, 219, 0.4);
}
</style>
