export type ActionType<T, U, V> = {
  [K in keyof (U | V)]: (actionContext: T, payload: U[K]) => V[K];
};

// 음식 채팅
export interface FoodCahtActionsPayloadMaps {
  test: { tile: string };
}
export interface FoodCahtActionsReturnsMaps {
  test: void;
}
