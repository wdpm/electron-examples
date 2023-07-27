import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

createApp(App).mount("#app");
console.log(process["env"].WEB_PORT);
