<template>
  <div class="sender">
    <button @click="sendFile">开始发送</button>
  </div>
</template>
<script lang="ts">
import Peer from "peerjs";
import {ref} from "vue";

let path = require("path");
let fs = require("fs");
export default {
  setup() {
    let fileFullPath = ref("D:\\Downloads\\vs_Community.exe");
    let peer, conn, readStream, sendFinished;
    let sendFile = () => {
      // 建立conn的逻辑应该只初始化一次，不应该每次UI点击都触发初始化。
      peer = new Peer("fileSender", {
        host: "127.0.0.1",
        port: 9418,
        path: "/webrtc",
        debug: 3,
      });
      conn = peer.connect("fileReceiver");
      conn.on("open", () => {
        let msg = {
          msgName: "beginSendFile",
          fileName: path.basename(fileFullPath.value),
          sendTime: Date.now(),
        };
        conn.send(JSON.stringify(msg));
      });
      conn.on("data", (data) => sendData(data));
    };
    let sendData = (data) => {
      data = JSON.parse(data);
      if (data.msgName === "chunkReady") {
        if (sendFinished) {
          let msg = {
            msgName: "fileSendFinish",
            sendTime: Date.now(),
          };
          conn.send(JSON.stringify(msg));
        } else {
          readStream.resume();
        }
      } else if (data.msgName === "readyToReceiveFile") {
        readStream = fs.createReadStream(fileFullPath.value, {
          highWaterMark: 10240,
          flags: "r",
          autoClose: true,
          start: 0,
        });
        readStream.on("data", function (chunk) {
          let msg = {
            msgName: "sendChunk",
            chunk: chunk.toString("hex"),
            sendTime: Date.now(),
          };
          readStream.pause();
          conn.send(JSON.stringify(msg));
        });
        readStream.on("end", function () {
          sendFinished = true;
        });
      }
    };
    return {sendFile};
  },
};
</script>
<style scoped>
.sender {
  height: 300px;
  border: 1px solid gray;
}
</style>
