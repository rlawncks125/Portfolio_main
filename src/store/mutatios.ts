export type MutationType<T, U, V> = {
  [K in keyof (U | V)]: (state: T, payload: U[K]) => V[K];
};

// 메인 index
export interface IndexMutationsPayloadMaps {
  setToken: { token: string };
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
