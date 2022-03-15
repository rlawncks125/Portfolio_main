import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";

export const routes: Array<RouteRecordRaw> = [
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
      import(/* webpackChunkName: "foodChat" */ "../views/FoodChat/Main.vue"),
    children: [
      {
        path: "",
        name: "FoodChatHome",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/Home.vue"
          ),
      },
      {
        path: "myRoomList",
        name: "myRoomList",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/MyRoomList.vue"
          ),
      },
      {
        path: "search",
        name: "RoomList",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/SearchRoomList.vue"
          ),
      },
      {
        path: "MyPage",
        name: "MyPage",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/MyPage.vue"
          ),
      },
      {
        path: ":uuid",
        name: "foodChatRoomJoin",
        component: () =>
          import(
            /* webpackChunkName: "foodChat" */ "../views/FoodChat/FoodChat.vue"
          ),
      },
    ],
  },
  {
    path: "/SubWay",
    name: "SubWay",
    component: () =>
      import(/* webpackChunkName: "SubWay" */ "../views/SubWay/Main.vue"),
  },
  // {
  //   path: "/foodChat/:uuid",
  //   name: "foodChatRoomJoin",
  //   component: () =>
  //     import(/* webpackChunkName: "foodChat" */ "../views/FoodChat/FoodChat.vue"),
  // },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
