export type GettersType<T, U, V> = {
  [K in keyof (U | V)]: (state: T) => (payload: U[K]) => V[K];
};

// 음식 채팅
export interface FoodCahtGettersParamsMaps {
  test: { name: string };
}
export interface FoodCahtGettersReturnsMaps {
  test: string;
}
