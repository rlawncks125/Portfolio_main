import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { store, key } from "./store";
import "@/assets/css/TailwindOutput.css";
import LoadingComponent from "@/components/Loding.vue";

createApp(App)
  .mixin({
    // vue Property "_uid" was accessed during render 경고 처리
    beforeCreate: function () {
      const uuid = Math.random() * 10000;
      this._uid = uuid.toString();
    },
  })
  .use(store, key)
  .use(router)
  .component("loding", LoadingComponent)
  .mount("#app");
