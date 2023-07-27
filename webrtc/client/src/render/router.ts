import { createRouter, createWebHashHistory } from "vue-router";
let routes = [
  {
    path: "/index",
    component: () => import("./pages/index.vue"),
  },
  {
    path: "/sender",
    component: () => import("./pages/sender.vue"),
  },
  {
    path: "/receiver",
    component: () => import("./pages/receiver.vue"),
  },
];
export let router = createRouter({
  history: createWebHashHistory(),
  routes,
});
