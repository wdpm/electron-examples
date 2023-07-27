import App from "./App.svelte";
import JsStore from "jsstore";
import { Article } from "./model/Article";
import { Category } from "./model/Category";
let connection = new JsStore.Connection(
  new Worker("./resource/js/jsstore.worker.min.js")
);
connection.initDb({
  name: "rrs",
  tables: [Article.getMetaData(), Category.getMetaData()],
});

const app = new App({
  target: document.body,
});
