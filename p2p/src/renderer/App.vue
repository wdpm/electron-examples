<template>
  <div id="video"></div>
</template>

<script lang="ts">
import {onMounted} from "vue";

export default {
  name: "App",
  setup() {
    onMounted(() => {
      // let magnetUri = `magnet:?xt=urn:btih:d53f63e9a38e039a7f0089b111a5501013793db8&dn=a8014c086e061d9524efeb3772f40ad162d9ca10.jfif&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com`;
      let magnetUri = `magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent`;
      var WebTorrent = require("webtorrent");
      var client = new WebTorrent();
      client.add(magnetUri, function (torrent) {
        console.log("Client is downloading:", torrent.infoHash);
        torrent.files.forEach(function (file) {
          // Display the file by appending it to the DOM. Supports video, audio, images, and
          // more. Specify a container element (CSS selector or reference to DOM node).
          console.log('file: ', file)
          file.appendTo("#video");
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
