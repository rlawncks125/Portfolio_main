export type ActionType<C, P, R> = {
  [K in keyof (P | R)]: (actionContext: C, payload: P[K]) => R[K];
};

// 음식 채팅
export interface FoodCahtActionsPayloadMaps {}
export interface FoodCahtActionsReturnsMaps {}
