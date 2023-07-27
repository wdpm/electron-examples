<template>
  <div>成功了Index</div>
</template>
<script lang="ts">
import { onMounted } from "@vue/runtime-core";
import { eventer } from "../../common/eventer";
// import { eventer } from "../../common/eventerIpc";
export default {
  setup() {
    onMounted(() => {
      console.log("on");
      eventer.on("eventName", (args) => {
        console.log('Render Process: ',args)
      });
    });
  },
};
</script>
