export type GettersType<S, P, R> = {
  [K in keyof (P | R)]: (state: S) => (payload: P[K]) => R[K];
};

// 음식 채팅
export interface FoodCahtGettersParamsMaps {
  test: { name: string };
}
export interface FoodCahtGettersReturnsMaps {
  test: string;
}
