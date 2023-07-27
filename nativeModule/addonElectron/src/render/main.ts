import {createApp} from "vue";
import Main from "./Main.vue";
import {router} from "./router";

createApp(Main).use(router).mount("#app");

// let addonPath = `D:\\Code\\OtherGithubProjects\\simple-but-profound-electron\\nativeModule\\addonElectron\\addonNodeApi\\build\\Release\\addon.node`;
let addonPath = `D:\\Code\\OtherGithubProjects\\simple-but-profound-electron\\nativeModule\\addonElectron\\addonNodeApi\\build\\Release\\addon.node`;
let addon = require(addonPath);
console.log("addon hello", addon.hello());
