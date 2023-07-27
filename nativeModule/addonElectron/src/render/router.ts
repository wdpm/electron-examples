import { createRouter, createWebHashHistory } from "vue-router";
let routes = [
  {
    path: "/index",
    component: () => import("./pages/index.vue"),
  },
];
export let router = createRouter({
  history: createWebHashHistory(),
  routes,
});
