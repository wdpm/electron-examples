<template>
  <div>
    <div class="menu" @click="goto('sender')">文件发送客户端</div>
    <div class="menu" @click="goto('receiver')">文件接收客户端</div>
  </div>
  <router-view />
</template>

<script lang="ts">
import { router } from "./router";
export default {
  setup() {
    let goto = (page) => {
      router.push(`/${page}`);
    };
    return { goto };
  },
};
</script>
<style lang="scss">
.menu {
  color: blue;
  cursor: pointer;
  display: inline-block;
  padding: 0 12px;
}
</style>
