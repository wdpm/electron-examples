<template>
  <button @click="reg">接收端</button>
</template>
<script lang="ts">

// issue: PeerJS:  Server message received: {type: "EXPIRE", src: "fileReceiver", dst: "fileSender"}

import Peer from "peerjs";
import { ref } from "vue";
let path = require("path");
let fs = require("fs");
let os = require("os");
export default {
  setup() {
    let fileSavePath = ref(path.join(os.homedir(), "Desktop"));
    let wstream;
    let reg = () => {
      let peer = new Peer("fileReceiver", {
        host: "127.0.0.1",
        port: 9418,
        path: "/webrtc",
        debug: 3,
      });
      peer.on("connection", (conn) => {
        conn.on("data", async (data) => {
          data = JSON.parse(data);
          if (data.msgName === "beginSendFile") {
            fileSavePath.value = path.join(
              fileSavePath.value,
              Date.now().toString() + data.fileName
            );
            wstream = await openWriteStream();
            let msg = {
              msgName: "readyToReceiveFile",
              sendTime: Date.now(),
            };
            conn.send(JSON.stringify(msg));
          } else if (data.msgName === "fileSendFinish") {
            wstream.end();
          } else if (data.msgName === "sendChunk") {
            let buffer = Buffer.from(data.chunk, "hex");
            wstream.write(buffer);
            let msg = {
              msgName: "chunkReady",
              sendTime: Date.now(),
            };
            conn.send(JSON.stringify(msg));
          }
        });
      });
    };
    let openWriteStream = async () => {
      return new Promise((resolve, reject) => {
        let wstream = fs.createWriteStream(fileSavePath.value);
        wstream.on("open", () => {
          resolve(wstream);
        });
        wstream.on("error", (err) => {
          console.error(err);
          reject();
        });
        wstream.on("finish", () => {
          console.log("write finish", true);
        });
      });
    };
    return { reg };
  },
};
</script>
