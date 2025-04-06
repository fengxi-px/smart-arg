<template>
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
      :title="item.title"
      :label="item.detail"
      is-link
    />
  </van-list>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
// list
const list = ref([]);
const loading = ref(false);
const finished = ref(false);

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
.test {
  font-size: 5rem;
  width: 50rem;
  height: 50rem;
  background-color: skyblue;
}
</style>
