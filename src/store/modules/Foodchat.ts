import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { State as rootState } from "../index";

export interface IState {
  name: string;
}

const state: IState = {
  name: "",
};

const getters: GetterTree<IState, rootState> & GettersTypes = {
  test:
    (state) =>
    ({ name }) => {
      return name;
    },
};

const mutations: MutationTree<IState> & MutationsTypes = {
  test: (state, { name }) => {
    return;
  },
  ds: () => {
    return;
  },
};

const actions: ActionTree<IState, rootState> & ActionTypes = {
  test: (context, { tile }) => {
    return;
  },
};

const module: Module<IState, rootState> = {
  // 호출할떄 [moduleName/호출] 로 호출
  // moduleName 은 modules에 정의된 모듈이름 따라감
  //  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {},
};

export default module;

import {
  FoodCahtGettersParamsMaps,
  FoodCahtGettersReturnsMaps,
  GettersType,
} from "../getters";

export type GettersTypes = GettersType<
  IState,
  FoodCahtGettersParamsMaps,
  FoodCahtGettersReturnsMaps
>;

import {
  FoodCahtMutationsPayloadMaps,
  FoodCahtMutationsReturnsMaps,
  MutationType,
} from "../mutatios";

export type MutationsTypes = MutationType<
  IState,
  FoodCahtMutationsPayloadMaps,
  FoodCahtMutationsReturnsMaps
>;

import {
  FoodCahtActionsPayloadMaps,
  FoodCahtActionsReturnsMaps,
  ActionType,
} from "../actions";
type myActionsContext = {
  commit<K extends keyof MutationsTypes>(
    key: K,
    payload: Parameters<MutationsTypes[K]>[1]
  ): ReturnType<MutationsTypes[K]>;
} & Omit<ActionContext<IState, rootState>, "commit">;

export type ActionTypes = ActionType<
  myActionsContext,
  FoodCahtActionsPayloadMaps,
  FoodCahtActionsReturnsMaps
>;
