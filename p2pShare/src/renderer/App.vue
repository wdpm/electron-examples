<template>
  <div id="video"></div>
</template>

<script lang="ts">
import { onMounted } from "vue";
export default {
  name: "App",
  setup() {
    onMounted(() => {
      var dragDrop = require("drag-drop");
      var WebTorrent = require("webtorrent");

      var client = new WebTorrent();

      // When user drops files on the browser, create a new torrent and start seeding it!
      dragDrop("body", function (files) {
        client.seed(files, function (torrent) {
          console.log("Client is seeding:", torrent.magnetURI);
        });
      });
    });
    return {};
  },
};
</script>
<style scoped>
#video {
  height: 600px;
  width: 800px;
}
</style>
