<template>
  <van-config-provider :theme-vars="themeVars">
    <van-popup
      class="popup"
      v-model:show="showTop"
      position="bottom"
      :style="{ height: '100rem' }"
    >
      <div class="header">设置</div>
      <van-cell-group inset>
        <van-field v-model="cropName" label="当前作物" placeholder="作物名称">
          <!-- 自定义右侧图标 -->
          <template #right-icon>
            <van-popover v-model:show="showTip" placement="top" trigger="click">
              <template #reference>
                <van-icon name="warning-o" size="20" color="#f90" />
              </template>
              <div style="font-size: 3rem">
                标准值：温度80℃，湿度80%，光照81lux
              </div>
            </van-popover>
          </template>
        </van-field>
        <van-cell center title="自动灌溉">
          <template #right-icon>
            <van-switch v-model="checkedIrrigate" />
          </template>
        </van-cell>
        <van-cell center title="自动降温">
          <template #right-icon>
            <van-switch v-model="checkedCooling" />
          </template>
        </van-cell>
        <van-cell center title="自动调光">
          <template #right-icon>
            <van-switch v-model="checkedDimming" />
          </template>
        </van-cell>

        <!-- 添加任务 -->
        <van-cell title="添加任务">
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <template #right-icon>
            <van-icon name="add-o" class="add-icon" @click="toggleAdd" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-button
        class="saveButton"
        type="primary"
        size="large"
        @click="saveSettings"
      >
        保存
      </van-button>
    </van-popup>
    <!-- 圆角弹窗（居中） -->
    <van-popup
      class="popup"
      v-model:show="showAdd"
      round
      :style="{ height: '150rem', width: '100rem' }"
      @close="onReset"
    >
      <div class="header">添加任务</div>
      <van-form @submit="onSubmit" ref="formRef">
        <van-cell-group inset>
          <van-field
            v-model="taskName"
            name="TaskName"
            label="任务名称"
            placeholder="请输入任务名称"
            :rules="[{ required: true, message: '请填写任务名称' }]"
          />
          <van-cell title="任务类型">
            <van-radio-group v-model="checkedForTaskType">
              <van-radio name="irrigate">灌溉任务</van-radio>
              <van-radio name="cooling">降温任务</van-radio>
              <van-radio name="dimming">调光任务</van-radio>
            </van-radio-group>
          </van-cell>
          <van-cell
            title="任务日期"
            :value="date"
            @click="show = true"
            is-link
          />
          <van-calendar v-model:show="show" @confirm="onConfirm" />
          <van-field
            v-model="time"
            name="Time"
            label="任务时间"
            placeholder="请输入任务时间，如：12:00"
            :rules="[{ required: true, message: '请填写任务时间' }]"
          />
          <van-field
            v-model="duration"
            name="Duration"
            type="number"
            :min="1"
            :max="24 * 60"
            label="任务持续时间"
            placeholder="请输入任务持续时间，单位分钟"
            :rules="[{ required: true, message: '请填写任务持续时间' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="灌溉任务" name="irrigate">
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
      </van-collapse-item>
      <van-collapse-item title="降温任务" name="cooling">
        技术无非就是那些开发它的人的共同灵魂。
      </van-collapse-item>
      <van-collapse-item title="调光任务" name="dimming">
        在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。
      </van-collapse-item>
    </van-collapse>
    <van-floating-bubble
      v-model:offset="offset"
      axis="xy"
      icon="more-o"
      magnetic="x"
      @click="togglePopup"
    />
  </van-config-provider>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
const showTop = ref(false);
const showAdd = ref(false);

// Or create a function to toggle it
function togglePopup() {
  showTop.value = !showTop.value;
}
function toggleAdd() {
  showAdd.value = !showAdd.value;
}

const cropName = ref("小麦");
const showTip = ref(false);
const checkedIrrigate = ref(false);
const checkedCooling = ref(false);
const checkedDimming = ref(false);
const saveSettings = () => {
  // 保存设置
  console.log("保存设置：", {
    cropName: cropName.value,
    checkedIrrigate: checkedIrrigate.value,
    checkedCooling: checkedCooling.value,
    checkedDimming: checkedDimming.value,
  });
  showTop.value = false;
};

const taskName = ref("");
const checkedForTaskType = ref("irrigate");
const date = ref("");
const show = ref(false);
const time = ref("");
const duration = ref(0);
const formRef = ref(null);

const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
const onConfirm = (value) => {
  show.value = false;
  date.value = formatDate(value);
};
const onSubmit = () => {
  // 提交表单
  console.log("提交的任务信息：", {
    taskName: taskName.value,
    taskType: checkedForTaskType.value,
    date: date.value,
    time: time.value,
    duration: duration.value,
  });
  // 重置表单
  onReset();
};
const onReset = () => {
  taskName.value = "";
  checkedForTaskType.value = "irrigate";
  date.value = "";
  time.value = "";
  duration.value = 0;
  showAdd.value = false;
  show.value = false;
  // 清空表单验证状态
  formRef.value?.resetValidation?.();
};

// list
const activeName = ref("");

const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const themeVars = reactive({
  // cellBorderColor: "red",
});

const onLoad = () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      list.value.push({
        title: `任务 ${list.value.length + 1}`,
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

const offset = ref({ x: -50, y: 600 });
</script>

<style lang="less" scoped>
.popup {
  background-color: #f8f9fa;
  border-top-left-radius: 5rem;
  border-top-right-radius: 5rem;
  .header {
    height: 12rem;
    font-size: 5rem;
    text-align: center;
    line-height: 12rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ccc;
    margin-bottom: 5rem;
  }
  .add-icon {
    font-size: 5rem;
    line-height: inherit;
  }
  .saveButton {
    margin: 5rem;
    width: 90%;
    height: 10rem;
    font-size: 5rem;
    line-height: 10rem;
    background-color: #007bff;
    color: #fff;
    border-radius: 5rem;
  }
}
</style>
