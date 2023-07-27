<template>
  <div>成功了Page</div>
</template>
<script lang="ts">
import {onMounted} from "@vue/runtime-core";
// import {eventer} from "../../common/eventerIpc";
import { eventer } from "../../common/eventer";
export default {
  setup() {
    onMounted(() => {
      setTimeout(() => {
        console.log("emit");
        eventer.emit("eventName", {
          param: `hello from renderer process`,
          from: 'RENDERER_PROCESS',
          to: 'MAIN_PROCESS',
        });
      }, 6000);
    });

    eventer.on("eventName", (args) => {
      console.log('Render Process: ', args)
    })
  },
};
</script>

