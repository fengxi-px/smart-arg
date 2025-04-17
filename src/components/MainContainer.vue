<template>
  <div class="main-container">
    <div class="header">
      <slot name="header">
        <h1 class="title">蔷影智联</h1>
      </slot>
      <div class="chat">
        <!-- <div style="color: inherit" @click="showChat = !showChat">
          <van-icon name="chat-o" />
        </div> -->
        <a
          href="http://117.72.12.143:3000/chat/share?shareId=sxwtd0cf3exqitpu01rwfqa3"
          target="_blank"
          style="color: inherit"
        >
          <van-icon name="chat-o"
        /></a>
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>

    <ul class="footer">
      <li class="footer-item">
        <van-icon
          class="icon"
          :name="choosedNav === 'home' ? 'wap-home' : 'wap-home-o'"
          @click="
            () => {
              choosedNav = 'home';
              router.push('/');
            }
          "
        />
      </li>
      <li class="footer-item">
        <van-icon
          :name="choosedNav === 'setting' ? 'setting' : 'setting-o'"
          class="icon"
          @click="
            () => {
              choosedNav = 'setting';
              router.push('/tasks');
            }
          "
        />
      </li>
      <li class="footer-item">
        <van-icon
          :name="choosedNav === 'envelop' ? 'comment' : 'comment-o'"
          class="icon"
          @click="
            () => {
              choosedNav = 'envelop';
              router.push('/messages');
            }
          "
          :badge="
            baseInformation().newMessageNumber > 0
              ? baseInformation().newMessageNumber
              : null
          "
        />
      </li>
    </ul>
  </div>
  <!-- <van-popup
    class="popup"
    v-model:show="showChat"
    round
    :style="{ height: '180rem', width: '80rem' }"
  >
    <iframe
      src="http://117.72.12.143:3000/chat/share?shareId=sxwtd0cf3exqitpu01rwfqa3"
      style="width: 80rem; height: 170rem; border: none"
    ></iframe>
  </van-popup> -->
</template>

<script setup>
import { useRouter } from "vue-router";
import { baseInformation } from "@/store";
import { ref } from "vue";
import { getUnreadCount } from "@/utils/api";

const choosedNav = ref("home");

const router = useRouter();

// 初始化 WebSocket
const store = baseInformation();
store.initWebSocket();
localStorage.setItem(
  "crop",
  JSON.stringify(
    JSON.stringify({
      name: store.crop,
      checkedIrrigate: true,
      checkedCooling: true,
      checkedDimming: true,
    })
  )
);
(async () => {
  const response = await getUnreadCount();
  // console.log(response.data.data.count);
  localStorage.setItem(
    "newMessageNumber",
    JSON.stringify({
      number: response.data.data.count,
    })
  );
  baseInformation().newMessageNumber = response.data.data.count;
})();
const showChat = ref(true);
</script>

<style lang="less" scoped>
.main-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  height: 100vh;
  padding: 15rem 0;
  background-color: #f7f9fc;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 15rem;
  // 修改为浅蓝色渐变，更加清新自然
  background: linear-gradient(to right, #78c5f7, #5ca6db);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  z-index: 999;
}

.title {
  margin: 0;
  font-size: 5rem;
  line-height: 15rem;
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.chat {
  width: 15rem;
  height: 15rem;
  position: absolute;
  top: 0rem;
  right: 0rem;
  // background-color: red;
  font-size: 8rem;
  line-height: 15rem;
  color: #fff;
  text-align: center;
}

.content {
  padding-bottom: 15rem;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15rem;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
  .footer-item {
    list-style-type: none;
    width: 33.33%;
    height: 100%;
    text-align: center;
    font-size: 7rem;
    line-height: 15rem;
    color: #5ca6db;
  }
}
</style>
