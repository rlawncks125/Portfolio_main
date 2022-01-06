import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
  {
    path: "/foodChat",
    name: "foodChat",
    component: () =>
      import(/* webpackChunkName: "router" */ "../views/FoodChat/Main.vue"),
    children: [
      {
        path: "",
        name: "RoomList",
        component: () =>
          import(
            /* webpackChunkName: "router" */ "../views/FoodChat/RoomList.vue"
          ),
      },
      {
        path: ":uuid",
        name: "foodChatRoomJoin",
        component: () =>
          import(
            /* webpackChunkName: "router" */ "../views/FoodChat/FoodChat.vue"
          ),
      },
    ],
  },
  // {
  //   path: "/foodChat/:uuid",
  //   name: "foodChatRoomJoin",
  //   component: () =>
  //     import(/* webpackChunkName: "router" */ "../views/FoodChat/FoodChat.vue"),
  // },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
