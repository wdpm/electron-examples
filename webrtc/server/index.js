const {PeerServer} = require("peer");
const peerServer = PeerServer({
  port: 9418, path: "/webrtc"
});
