import { RestaurantInfoDto, RoominfoDto } from "@/assets/swagger";

export type MutationType<S, P, R> = {
  [K in keyof (P | R)]: (state: S, payload: P[K]) => R[K];
};

// 메인 index
export interface IndexMutationsPayloadMaps {
  setToken: { token: string; userName: string };
}
export interface IndexMutationsReturnsMaps {
  setToken: void;
}

// 음식 채팅
export interface FoodCahtMutationsPayloadMaps {
  setRestaurantInfo: { restaurnt: RestaurantInfoDto };
  cleanRestaurantInfo: null;
  setRoomInfo: { room: RoominfoDto };
  cleanRoomInfo: null;
}
export interface FoodCahtMutationsReturnsMaps {
  setRestaurantInfo: void;
  cleanRestaurantInfo: void;
  setRoomInfo: void;
  cleanRoomInfo: void;
}
