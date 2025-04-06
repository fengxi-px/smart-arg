<template>
  <MainContainer> </MainContainer>
</template>

<script>
import MainContainer from "./components/MainContainer.vue";

export default {
  name: "App",
  components: {
    MainContainer,
  },
  mounted() {
    this.setFontSize();
    window.addEventListener("resize", this.setFontSize);
  },
  // beforeDestroy() {
  //   window.removeEventListener("resize", this.setFontSize);
  // },
  methods: {
    setFontSize() {
      const html = document.documentElement;
      const width = html.clientWidth;
      html.style.fontSize = width / 100 + "px"; // 每100px宽度为1rem
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
li {
  list-style-type: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f7f9fc;
}

/* 添加全局过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #f7f9fc;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #aac7db;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #5ca6db;
}

/* 美化全局按钮 */
button {
  transition: all 0.3s ease;
}
button:active {
  transform: scale(0.98);
}

/* 美化全局输入框 */
input,
textarea {
  border: 1px solid #e8eef4;
  transition: border-color 0.3s ease;
}
input:focus,
textarea:focus {
  border-color: #5ca6db;
  outline: none;
}
</style>
