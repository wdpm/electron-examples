<template>
  <img alt="Vue logo" src="./assets/logo.png"/>
  <HelloWorld msg="Hello Vue 3.0 + Vite"/>
</template>

<script lang="ts">
import {onMounted} from "vue";
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  setup() {
    // 渲染进程中导入Electron内置的包，不能通过import导入，而应该使用require导入，代码如下所示
    let electron = require("electron");
    console.log(electron);
    onMounted(() => {
      console.log(Date.now() - performance.timing.fetchStart);
    });
    return {};
  },
};
</script>
