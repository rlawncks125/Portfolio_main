import { createStore, Store } from "vuex";
import { State as rootState } from "@/store/index";
import { InjectionKey } from "vue";

export const stubStore = createStore<rootState>({
  state: {
    token: "",
    userName: "",
  } as rootState,
  getters: {},
  mutations: {
    setToken: () => {
      return "토큰 세팅";
    },
  },
  // actions: {},
  // modules: {},
});

import LoadingComponent from "@/components/Loding.vue";
import { FontAwesomeIcon } from "@/plugin/font-awesome";

export const commonCompoenets = {
  "fa-icon": FontAwesomeIcon,
  loding: LoadingComponent,
};
