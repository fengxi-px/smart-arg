<template>
  <div class="messages-container">
    <van-config-provider :theme-vars="themeVars">
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
          :title="item.title"
          :label="item.detail"
          is-link
        />
      </van-list>
    </van-config-provider>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
// list
const list = ref([]);
const loading = ref(false);
const finished = ref(false);

const themeVars = reactive({
  cellBackground: "#ffffff",
  cellTextColor: "#333333",
  cellActiveColor: "#f7f9fc",
  cellBorderColor: "#e8eef4",
});

const onLoad = () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      list.value.push({
        title: `消息 ${list.value.length + 1}`,
        detail: `2025/01/01 12:00`,
      });
    }

    // 加载状态结束
    loading.value = false;

    // 数据全部加载完成
    if (list.value.length >= 10) {
      finished.value = true;
    }
  }, 1000);
};
</script>

<style lang="less" scoped>
.messages-container {
  padding: 10px;
  background-color: #f7f9fc;
  min-height: 100%;
}

.message-cell {
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

:deep(.van-cell__title) {
  color: #5ca6db;
  font-weight: 500;
}

:deep(.van-cell__value) {
  color: #5ca6db;
}

:deep(.van-list__finished-text) {
  color: #aac7db;
  font-size: 3.5rem;
  padding: 10px 0;
}

:deep(.van-list__loading) {
  color: #5ca6db;
}
</style>
