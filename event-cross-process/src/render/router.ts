import { createRouter, createWebHashHistory } from "vue-router";
let routes = [
  {
    path: "/index",
    component: () => import("./pages/index.vue"),
  },
  {
    path: "/page",
    component: () => import("./pages/page.vue"),
  },
];
export let router = createRouter({
  history: createWebHashHistory(),
  routes,
});
