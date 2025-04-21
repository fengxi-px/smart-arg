import { defineStore } from "pinia";
import { getHistoryData } from "@/utils/api.js";

export const baseInformation = defineStore("baseInformation", {
  state: () => ({
    temperature: [15, 25], // 温度
    humidity: [50, 70], // 湿度
    soil_moisture: [60, 80], // 土壤湿度
    light_intensity: [10000, 50000], // 光照强度
    isSafeForT: true,
    isSafeForH: true,
    isSafeForS: true,
    isSafeForL: true,
    historyData: {}, // 历史数据

    crop: JSON.parse(localStorage.getItem("crop"))?.name || "",

    // 新增 WebSocket 实例
    socket: null,

    // 原有消息计数器
    newMessageNumber:
      JSON.parse(localStorage.getItem("newMessageNumber"))?.number || 0,
  }),
  actions: {
    // 获取历史数据
    async getHistoryData(choice) {
      const result = await getHistoryData(choice);
      this.historyData = result.data.data;
    },

    // 初始化 WebSocket 连接
    initWebSocket() {
      if (this.socket) return; // 避免重复创建

      this.socket = new WebSocket("ws://localhost:8080");

      // 连接打开监听
      this.socket.onopen = () => {
        console.log("WebSocket连接已建立");
        // 发送消息（可选）
        this.socket.send(
          JSON.stringify({
            type: "control",
            payload: {
              device: "fan",
              action: null,
              autoControl:
                JSON.parse(localStorage.getItem("crop"))?.checkedCooling ||
                false,
            },
          })
        );
        this.socket.send(
          JSON.stringify({
            type: "control",
            payload: {
              device: "pump",
              action: null,
              autoControl:
                JSON.parse(localStorage.getItem("crop"))?.checkedIrrigate ||
                false,
            },
          })
        );
      };

      // 消息接收监听
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "warnings") {
          this.handleWarning(data.data);
        } else if (data.type === "connection") {
          console.log("连接消息:", data.message);
        }
      };

      // 错误处理
      this.socket.onerror = (error) => {
        console.error("WebSocket错误:", error);
      };

      // 连接关闭处理
      this.socket.onclose = () => {
        console.log("WebSocket连接已关闭");
        this.socket = null; // 清理实例
      };
    },

    // 处理预警消息
    handleWarning(warningData) {
      console.log("收到预警消息:", warningData);
      this.newMessageNumber++;
      this.persistMessageCount();
    },

    // 持久化消息计数
    persistMessageCount() {
      localStorage.setItem(
        "newMessageNumber",
        JSON.stringify({ number: this.newMessageNumber })
      );
    },

    // 关闭连接（可选）
    closeWebSocket() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    },
  },
});
