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
              <div style="font-size: 3rem; padding: 1.5rem; color: #f90">
                温度:{{ baseInformation().temperature }}， 空气湿度:{{
                  baseInformation().humidity
                }}， 土壤湿度:{{ baseInformation().soil_moisture }}， 光照:{{
                  baseInformation().light_intensity
                }}，
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
      :style="{ height: '120rem', width: '100rem' }"
      @close="onReset"
    >
      <div class="header">
        {{ typeForModel == "change" ? "编辑" : "添加" }}任务
      </div>
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
              <van-radio name="watering">灌溉任务</van-radio>
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
            placeholder="请输入任务时间，如：9:00"
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
        <div style="margin-top: 10rem; padding: 0 10rem">
          <van-button round block type="primary" native-type="submit">
            保存
          </van-button>
        </div>
        <div style="margin-top: 5rem; padding: 0 10rem">
          <van-button round block type="danger" @click="deleteThisTask">
            删除该任务
          </van-button>
        </div>
      </van-form>
    </van-popup>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="灌溉任务" name="irrigate" @click="onLoad">
        <van-list
          v-model:loading="loadingForWatering"
          :finished="finishedForWatering"
          finished-text="没有更多了"
          @onload="onLoad"
        >
          <van-cell
            v-for="item in listForWatering"
            :key="item"
            :title="item.title"
            :label="item.detail"
            is-link
            @click="showDetail(item.id)"
          />
        </van-list>
      </van-collapse-item>
      <van-collapse-item title="降温任务" name="cooling">
        <van-list
          v-model:loading="loadingForTemperature"
          :finished="finishedForTemperature"
          finished-text="没有更多了"
          @onload="onLoad"
        >
          <van-cell
            v-for="item in listForTemperature"
            :key="item"
            :title="item.title"
            :label="item.detail"
            is-link
            @click="showDetail(item.id)"
          />
        </van-list>
      </van-collapse-item>
      <van-collapse-item title="调光任务" name="dimming">
        <van-list
          v-model:loading="loadingForLighting"
          :finished="finishedForLighting"
          finished-text="没有更多了"
          @onload="onLoad"
        >
          <van-cell
            v-for="item in listForLighting"
            :key="item"
            :title="item.title"
            :label="item.detail"
            is-link
            @click="showDetail(item.id)"
          />
        </van-list>
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
import { baseInformation } from "@/store";
import {
  getTaskList,
  getTaskDetail,
  updateTask,
  addTask,
  deleteTask,
} from "@/utils/api";
import { showToast } from "vant";
import { ref, reactive } from "vue";
const showTop = ref(false);
const showAdd = ref(false);
const typeForModel = ref("change");

// Or create a function to toggle it
function togglePopup() {
  showTop.value = !showTop.value;
}
function toggleAdd() {
  showAdd.value = !showAdd.value;
  typeForModel.value = "add";
}

const cropName = ref(JSON.parse(localStorage.getItem("crop"))?.name || "");
const showTip = ref(false);
const checkedIrrigate = ref(
  JSON.parse(localStorage.getItem("crop"))?.checkedIrrigate || false
);
const checkedCooling = ref(
  JSON.parse(localStorage.getItem("crop"))?.checkedCooling || false
);
const checkedDimming = ref(
  JSON.parse(localStorage.getItem("crop"))?.checkedDimming || false
);
const saveSettings = () => {
  // 保存设置
  console.log("保存设置：", {
    cropName: cropName.value,
    checkedIrrigate: checkedIrrigate.value,
    checkedCooling: checkedCooling.value,
    checkedDimming: checkedDimming.value,
  });
  localStorage.setItem(
    "crop",
    JSON.stringify({
      name: cropName.value,
      checkedIrrigate: checkedIrrigate.value,
      checkedCooling: checkedCooling.value,
      checkedDimming: checkedDimming.value,
    })
  );
  showTop.value = false;
};

const taskName = ref("");
const checkedForTaskType = ref("irrigate");
const date = ref("");
const show = ref(false);
const time = ref("");
const duration = ref(0);
const formRef = ref(null);
const taskId = ref("");

const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
const onConfirm = (value) => {
  show.value = false;
  date.value = formatDate(value);
};
const onSubmit = async () => {
  // 提交表单
  console.log("提交的任务信息：", {
    taskName: taskName.value,
    taskType: checkedForTaskType.value,
    date: date.value,
    time: time.value,
    duration: duration.value,
  });

  if (typeForModel.value == "change") {
    // 修改任务
    const res = await updateTask(taskId.value, {
      name: taskName.value,
      type: checkedForTaskType.value,
      day: date.value,
      time: time.value,
      duration: duration.value,
    });
    if (res.status === 200) {
      // 处理成功情况
      showToast("修改任务成功");
    } else {
      // 处理错误情况
      showToast("修改任务失败，请稍后重试");
    }
  } else {
    // 添加任务
    const res = await addTask({
      name: taskName.value,
      type: checkedForTaskType.value,
      day: date.value,
      time: time.value,
      duration: duration.value,
    });
    if (res.status === 200) {
      // 处理成功情况
      showToast("添加任务成功");
    } else {
      // 处理错误情况
      showToast("添加任务失败，请稍后重试");
    }
  }

  // 重置表单
  onReset();
};
const deleteThisTask = async () => {
  const res = await deleteTask(taskId.value);
  console.log(res);
  if (res.status === 200) {
    // 处理成功情况
    showToast("删除任务成功");
  } else {
    // 处理错误情况
    showToast("删除任务失败，请稍后重试");
  }
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

const listForWatering = ref([]);
const listForTemperature = ref([]);
const listForLighting = ref([]);
const loadingForWatering = ref(false);
const loadingForTemperature = ref(false);
const loadingForLighting = ref(false);
const finishedForWatering = ref(false);
const finishedForTemperature = ref(false);
const finishedForLighting = ref(false);
const themeVars = reactive({
  // cellBorderColor: "red",
  switchActiveColor: "#5ca6db",
  radioCheckedIconColor: "#5ca6db",
  buttonPrimaryBackground: "#5ca6db",
  buttonPrimaryBorderColor: "#5ca6db",
  collapseItemContentBackground: "#f7f9fc",
  dropdownMenuTitleActiveTextColor: "#5ca6db",
  dropdownMenuTitleBackground: "#f7f9fc",
  cellBackground: "#ffffff",
  cellGroupInsetBackground: "#ffffff",
  cellGroupInsetBorderRadius: "10px",
  cellGroupInsetPadding: "0 4px",
});

const onLoad = async () => {
  const res = await getTaskList();
  if (res.status === 200) {
    // 处理成功情况
    listForWatering.value = [];
    listForTemperature.value = [];
    listForLighting.value = [];
    res.data.data.tasks.forEach((item) => {
      if (item.type === "watering") {
        listForWatering.value.push({
          id: item.id,
          title: item.name,
          detail: `${item.day} ${item.time}`,
        });
      } else if (item.type === "cooling") {
        listForTemperature.value.push({
          id: item.id,
          title: item.name,
          detail: `${item.day} ${item.time}`,
        });
      } else if (item.type === "dimming") {
        listForLighting.value.push({
          id: item.id,
          title: item.name,
          detail: `${item.day} ${item.time}`,
        });
      }
    });
    loadingForWatering.value = false;
    finishedForWatering.value = true;
    loadingForTemperature.value = false;
    finishedForTemperature.value = true;
    loadingForLighting.value = false;
    finishedForLighting.value = true;
  } else {
    // 处理错误情况
    showToast("获取任务列表失败，请稍后重试");
  }
};

const showDetail = async (id) => {
  typeForModel.value = "change";
  taskId.value = id;
  // 显示任务详情
  showAdd.value = true;
  // 根据 id 获取任务详情并显示
  const res = await getTaskDetail(id);
  if (res.status === 200) {
    // 处理成功情况
    const task = res.data.data;
    taskName.value = task.name;
    checkedForTaskType.value = task.type;
    let month = task.day.split("/")[0];
    let day = task.day.split("/")[1];
    date.value = formatDate(new Date(2025, month - 1, day));
    time.value = task.time;
    duration.value = task.duration;
  } else {
    // 处理错误情况
    showToast("获取任务详情失败，请稍后重试");
  }
};

const offset = ref({ x: -50, y: 600 });
</script>

<style lang="less" scoped>
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
    color: #5ca6db;
    font-weight: bold;
  }

  .add-icon {
    font-size: 5rem;
    line-height: inherit;
    color: #5ca6db;
  }

  .saveButton {
    margin: 5rem;
    width: 90%;
    height: 10rem;
    font-size: 5rem;
    line-height: 10rem;
    background-color: #5ca6db;
    color: #fff;
    border-radius: 5rem;
    border: none;
    box-shadow: 0 2px 8px rgba(92, 166, 219, 0.3);
  }
}

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
