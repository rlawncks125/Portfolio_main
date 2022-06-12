import { RestaurantInfoDto, RoominfoDto } from "@/assets/swagger";

export type GettersType<S, P, R> = {
  [K in keyof (P | R)]: (state: S) => (payload: P[K]) => R[K];
};

// 음식 채팅
export interface FoodCahtGettersParamsMaps {
  pickRestaurantInfo: void;
  getRoomInfo: void;
}
export interface FoodCahtGettersReturnsMaps {
  pickRestaurantInfo: RestaurantInfoDto;
  getRoomInfo: RoominfoDto | null;
}
