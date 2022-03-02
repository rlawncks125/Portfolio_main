// Cannot read property 'naver' of undefined
// Cannot read property 'LatLng' of undefined
// 등 cdn 으로 인한 못찾는 모듈 하나씩 다 목킹해서 정의시킴
//@ts-ignore
global.naver = {
  //@ts-ignore
  maps: {
    LatLng: jest.fn(),
    Map: jest.fn(),
    //@ts-ignore
    Event: {
      addListener: jest.fn(),
    },
    //@ts-ignore
  },
};

import axios from "axios";
jest.mock("axios", () => ({
  get: () => Promise.resolve("get mock"),
  post: () => Promise.resolve("post mock"),
  patch: () => Promise.resolve("patch mock"),
  delete: () => Promise.resolve("delete mock"),
}));
