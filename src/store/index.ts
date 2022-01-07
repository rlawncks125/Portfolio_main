// store/index.ts
import { InjectionKey } from "vue";
import {
  createStore,
  useStore as baseUseStore,
  Store,
  CommitOptions,
  MutationTree,
} from "vuex";

import FoodCaht, { IState as FoodCahtState } from "./modules/Foodchat";

export interface State {
  token: string;
  foodChat?: FoodCahtState;
}

export const key: InjectionKey<Store<State>> = Symbol();

const state: State = {
  token: "",
};

const mutations: MutationTree<State> & indexMutationsTypes = {
  setToken: (state, { token }) => {
    console.log(token);
    state.token = token;
    return;
  },
};

//store 정의
export const store = createStore<State>({
  state,
  mutations,
  // 모듈 사용 ,
  modules: {
    FoodCaht,
  },
});

// Composition Api에서 접근할떄 이함수를 사용
export function useStore(): StoreType {
  return baseUseStore(key);
}

// 타입 정의 추가
import {
  ActionTypes as foodActions,
  MutationsTypes as foodMutations,
  GettersTypes as foodGetters,
} from "./modules/Foodchat";

// 정의한 모듈들 타입 정의
type MutationsTypes = indexMutationsTypes & foodMutations;
type ActionsTypes = foodActions;
type GettersTypes = foodGetters;

export type StoreType = Omit<
  Store<State>,
  "getters" | "commit" | "dispatch"
> & {
  commit<
    K extends keyof MutationsTypes,
    P extends Parameters<MutationsTypes[K]>[1]
  >(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<MutationsTypes[K]>;
} & {
  dispatch<K extends keyof ActionsTypes>(
    key: K,
    payload: Parameters<ActionsTypes[K]>[1],
    options?: ActionsTypes
  ): ReturnType<ActionsTypes[K]>;
} & {
  getters: {
    [K in keyof GettersTypes]: ReturnType<GettersTypes[K]>;
  };
};

import {
  IndexMutationsPayloadMaps,
  IndexMutationsReturnsMaps,
  MutationType,
} from "./mutatios";

type indexMutationsTypes = MutationType<
  State,
  IndexMutationsPayloadMaps,
  IndexMutationsReturnsMaps
>;
