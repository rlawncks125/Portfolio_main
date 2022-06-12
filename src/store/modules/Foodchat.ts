import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { State as rootState } from "../index";

export interface IState {
  pickRestaurant: RestaurantInfoDto | null;
  roomInfo: RoominfoDto | null;
}

const state: IState = {
  pickRestaurant: null,
  roomInfo: null,
};

const getters: GetterTree<IState, rootState> & GettersTypes = {
  pickRestaurantInfo: (state) => () => {
    const dumy = {
      id: 999999,
      resturantSuperUser: {
        id: 999999,
        nickName: "",
      },
      restaurantName: "",
      restaurantImageUrl: "",
      location: "",
      comments: [],
      avgStar: 0,
      lating: {
        x: 0,
        y: 0,
      },
      hashTags: [],
      specialization: [],
    } as RestaurantInfoDto;

    return state.pickRestaurant || dumy;
  },
  getRoomInfo: (state) => () => {
    return state.roomInfo;
  },
};

const mutations: MutationTree<IState> & MutationsTypes = {
  setRestaurantInfo(state, { restaurnt }) {
    state.pickRestaurant = restaurnt;
  },
  cleanRestaurantInfo(state) {
    state.pickRestaurant = null;
  },
  setRoomInfo: (state, { room }) => {
    state.roomInfo = room;
  },
  cleanRoomInfo: () => {
    state.roomInfo = null;
  },
};

const actions: ActionTree<IState, rootState> & ActionTypes = {};

const module: Module<IState, rootState> = {
  // 호출할떄 [moduleName/호출] 로 호출
  // moduleName 은 modules에 정의된 모듈이름 따라감
  // namespaced: true,
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
import { RestaurantInfoDto, RoominfoDto } from "@/assets/swagger";
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
