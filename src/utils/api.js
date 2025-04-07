import request from "./request";

// 获取实时数据
export function getRealTimeData() {
  return request({
    url: "/home/getCurrentData",
    method: "get",
  });
}
// 获取历史数据
export function getHistoryData(choice) {
  return request({
    url: "/home/getHistoryData",
    method: "get",
    params: choice,
  });
}

// 获取任务列表
export function getTaskList() {
  return request({
    url: "/tasks/showAll",
    method: "get",
  });
}

// 获取任务详情
export function getTaskDetail(id) {
  return request({
    url: `/tasks/getTaskDetail`,
    method: "get",
    params: { id },
  });
}

// 修改任务详情
export function updateTask(id, data) {
  return request({
    url: `/tasks/updateTask/${id}`,
    method: "put",
    data,
  });
}

// 添加任务
export function addTask(data) {
  return request({
    url: `/tasks/addTask`,
    method: "post",
    data,
  });
}

// 删除任务
export function deleteTask(id) {
  return request({
    url: `/tasks/deleteTask`,
    method: "delete",
    params: { id },
  });
}

// 获取预警消息列表
export function getMessageList() {
  return request({
    url: `/message/warnings`,
    method: "get",
  });
}

// 获取预警详情
export function getMessageDetail(id) {
  return request({
    url: `/message/warningDetail`,
    method: "get",
    params: { id },
  });
}
