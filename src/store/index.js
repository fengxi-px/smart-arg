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

// import {
//   createCompletions,
//   createImages,
//   login,
//   saveChatHistory,
//   userChatList,
// } from "@/utils/serviceAPI.js";

// // 判断登录状态，存储用户信息，存储对话记录
// export const userData = defineStore("userData", {
//   state: () => ({
//     isLogin: false,
//     userInfo: {}, // 用户信息
//     chatList: [], // 聊天列表，
//     sessionId: "", // 会话id
//     newChat: true, // //true：开启新会话，false：已有对话（或者打开了历史会话）
//   }),

//   actions: {
//     // 未登录获取用户信息
//     async isNotLoggedIn(email, password) {
//       // 请求接口
//       const result = await login({ email, password });
//       // 存储本地缓存
//       localStorage.setItem("userWeb", JSON.stringify(result.data));
//       this.userInfo = result.data;
//       // 请求聊天列表
//       const chatListData = await userChatList();
//       this.chatList = chatListData.data;
//       console.log(this.chatList, "chatList");
//       this.isLogin = true;
//       return result;
//     },
//     // 获取本地缓存用户信息，判断登录状态
//     async isLoggedIn() {
//       const userinfo = localStorage.getItem("userWeb");
//       this.userInfo = userinfo ? userinfo : {};
//       this.isLogin = userinfo ? true : false;
//       if (!userinfo) return false;
//       // 请求聊天列表
//       const chatListData = await userChatList();
//       this.chatList = chatListData.data;
//       // console.log(this.chatList, "chatList");
//     },
//   },

//   persist: {
//     enabled: true, // 启用持久化
//     strategies: [
//       {
//         key: "userData", // 在 storage 中存储的 key 名
//         storage: localStorage, // 可以选择使用 localStorage 或 sessionStorage
//       },
//     ],
//   },
// });

// // 文生文
// export const chatbotMessage = defineStore("chatbotMessage", {
//   state: () => ({
//     messages: [], // 存储聊天记录
//     receiveText: "", // 接受大模型返回的文本数据
//   }),
//   actions: {
//     // 接受服务器端大模型返回的数据
//     async handleText(objVal) {
//       let aiMessages = this.messages[this.messages.length - 1];
//       // 服务器开始响应
//       aiMessages.finish_reason = "respond";
//       // 把大模型返回的文本追加到receiveText
//       this.receiveText += objVal.choices[0].delta.content || "";
//       // 把文本追加到AI的回复中
//       aiMessages.content = this.receiveText;
//       // 判断是否回复完毕
//       if (objVal.choices[0].finish_reason) {
//         // 存储状态
//         aiMessages.finish_reason = objVal.choices[0].finish_reason;
//         // 如果有互联网查询的数据
//         aiMessages.web_search = objVal.web_search ? objVal.web_search : [];
//         // 如果回复异常
//         const condition = [
//           { type: "length", content: "到达token上限,请重新开启新会话" },
//           {
//             type: "sensitive",
//             content: "非常抱歉，我目前无法提供你需要的具体信息",
//           },
//           {
//             type: "network_error",
//             content: "推理异常，我或许出现了一些问题，你可以重新尝试",
//           },
//         ];
//         condition.forEach((item) => {
//           if (objVal.choices[0].finish_reason === item.type) {
//             aiMessages.content = item.content;
//           }
//         });
//         // 对话完毕
//         inProgress().value = false;

//         // 存储对话记录到服务器
//         const uploadChat = [...this.messages.slice(-2)];
//         const result = await saveChatHistory({
//           messages: uploadChat,
//           sessionId: userData().sessionId,
//         });
//         if (userData().newChat) {
//           userData().chatList.unshift(result.data);
//           userData().sessionId = result.data.session_id;
//           userData().newChat = false;
//           const chatListData = await userChatList();
//           this.chatList = chatListData.data;
//         }
//       }
//     },

//     // 发送数据到服务器端
//     async startSending(content) {
//       // content: 发送的值
//       console.log(content, "send");
//       this.receiveText = ""; // 清空上次的结果
//       this.messages.push({ role: "user", content });
//       this.messages.push({
//         role: "assistant",
//         content: "",
//         finish_reason: "start",
//         web_search: [], // 搜索网页返回的结果
//       });
//       // 对话正在进行中
//       inProgress().value = true;
//       /*
// 			 finish_reason：
// 				start：开始中，
// 				respond:ai响应中
// 				stop代表推理自然结束或触发停止词。
// 				tool_calls 代表模型命中函数。
// 				length代表到达 tokens 长度上限。
// 				sensitive 代表模型推理内容被安全审核接口拦截。请注意，针对此类内容，请用户自行判断并决定是否撤回已公开的内容。
// 				network_error 代表模型推理异常。
// 			 */

//       //请求服务器端进行发送
//       try {
//         await createCompletions({ messages: this.messages });
//       } catch (err) {
//         this.messages[this.messages.length - 1].finish_reason = "stop";
//         this.messages[this.messages.length - 1].content =
//           "AI回复异常，请稍后重试";
//         // 对话结束
//         inProgress().value = false;
//       }
//     },
//   },
// });

// // 文生图
// export const chatCreateImages = defineStore("chatCreateImages", {
//   state: () => ({
//     messages: [], //url;prompt
//   }),
//   actions: {
//     // 开始发送
//     async startSending(content) {
//       console.log(content);
//       this.messages = [
//         {
//           url: "",
//           prompt: "AI正在生成中...",
//         },
//       ];
//       inProgress().value = true;
//       try {
//         const res = await createImages({ prompt: content });
//         console.log(res);
//         let aimessages = this.messages[0];
//         if (res.serviceCode === 0) {
//           aimessages.url = res.data.url;
//         } else {
//           aimessages.url = "";
//         }
//         aimessages.prompt =
//           res.data.prompt || res.msg || "当前生成图片出错,你可重试";
//         inProgress().value = false;
//       } catch (err) {
//         console.log(err);
//         this.messages = [
//           {
//             url: "",
//             prompt: "当前生成图片出错,你可重试",
//           },
//         ];
//         inProgress().value = false;
//       }
//     },
//   },
// });

// // 查询对话是否进行中
// export const inProgress = defineStore("inProgress", {
//   state: () => ({
//     value: false, // false：表示对话完毕，true：正在进行中
//   }),
//   actions: {
//     queryValue() {
//       if (this.value) {
//         ElMessage({
//           message: "The request is in progress, please try again later",
//           type: "error",
//         });
//         this.value = true;
//         return true;
//       }
//     },
//   },
// });
