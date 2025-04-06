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
}
</style>
