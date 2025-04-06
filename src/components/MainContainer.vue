<template>
  <div class="main-container">
    <div class="header">
      <slot name="header">
        <h1 class="title">智链农境</h1>
      </slot>
    </div>

    <div class="content">
      <router-view />
    </div>

    <ul class="footer">
      <li class="footer-item">
        <van-icon
          name="wap-home-o"
          class="icon"
          @click="() => router.push('/')"
        />
      </li>
      <li class="footer-item">
        <van-icon
          name="setting-o"
          class="icon"
          @click="() => router.push('/tasks')"
        />
      </li>
      <li class="footer-item">
        <van-icon
          name="envelop-o"
          class="icon"
          @click="() => router.push('/messages')"
          badge="99+"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
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
  background-color: #f5f5f5;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 15rem;
  // background-color: ;
  // 渐变色背景
  background: linear-gradient(to right, #3fecff, #6149f6);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.title {
  margin: 0;
  font-size: 5rem;
  line-height: 15rem;
  color: #333;
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
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  .footer-item {
    list-style-type: none;
    width: 33.33%;
    height: 100%;
    text-align: center;
    font-size: 7rem;
    line-height: 15rem;
  }
}
</style>
