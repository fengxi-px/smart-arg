import { createRouter, createWebHashHistory } from "vue-router";
import DataShow from "../views/DataShow.vue";
import Tasks from "../views/Tasks.vue";
import Messages from "../views/Messages.vue";
import Chat from "../views/Chat.vue";

const routes = [
  {
    path: "/",
    name: "DataShow",
    component: DataShow,
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: Tasks,
  },
  {
    path: "/messages",
    name: "Messages",
    component: Messages,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 登录访问拦截
// router.beforeEach((to) => {
//   if (!localStorage.getItem("userWeb") && to.path !== "/login") return "/login";
// });

export default router;
