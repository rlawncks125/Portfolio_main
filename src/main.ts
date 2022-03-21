import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { store, key } from "./store";
import "@/assets/css/TailwindOutput.css";
import LoadingComponent from "@/components/Loding.vue";
import { FontAwesomeIcon } from "@/plugin/font-awesome";

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
  .directive("enter-next-focus", {
    beforeMount(el: HTMLElement) {
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();

          const btn = (e.target as HTMLElement).parentNode
            ?.lastChild as HTMLElement;

          if (btn.tagName === "BUTTON") {
            btn.focus();
          }
        }
      });
    },
  })
  .component("loding", LoadingComponent)
  .component("fa-icon", FontAwesomeIcon)
  .mount("#app");
