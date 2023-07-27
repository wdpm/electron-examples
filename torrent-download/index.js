var WebTorrent = require("webtorrent");

var client = new WebTorrent();

var magnetURI =
  "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent";

client.add(
  magnetURI,
  { path: "D:\\Downloads" },
  function (torrent) {
    console.log(torrent);
    torrent.on("infoHash", function () {
      console.log("infoHash", torrent);
    });
    torrent.on("metadata", function () {
      console.log("metadata", torrent);
    });
    torrent.on("ready", function () {
      console.log("ready", torrent);
    });
    torrent.on("done", function () {
      console.log("torrent download finished");
    });
  }
);

let Discovery = require("torrent-discovery");
const DHT = require("bittorrent-dht");
const randombytes = require("randombytes");
const dht = new DHT();
let discovery = new Discovery({
  infoHash: randombytes(20),
  peerId: randombytes(20),
  port: 6000,
  dht,
});
discovery.on("peer", (peer, source) => {
  console.log(peer, source);
});
