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
  test: { name: string };
  ds: { ds: string };
}
export interface FoodCahtMutationsReturnsMaps {
  test: void;
  ds: void;
}
