import FoodCahtEditRoom from "@/components/FoodCahtEditRoom.vue";
import { shallowMount, VueWrapper } from "@vue/test-utils";

// store , 공용 검포넌트
import { key } from "@/store";
import { commonCompoenets, stubStore } from "@/../tests/Stubs/store";

// route mocks
import { routes } from "@/router";
import { createRouterMock, injectRouterMock } from "vue-router-mock";

import { editRoom } from "@/api/Room";
import { nextTick } from "vue";

jest.mock("@/api/Room", () => ({
  editRoom: () => Promise.resolve({ ok: true }),
}));

describe("FoodCahtEidtRoom 버튼 클릭 테스트", () => {
  let warpper: VueWrapper<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    const router = createRouterMock({
      routes,
    });
    injectRouterMock(router);

    warpper = shallowMount(FoodCahtEditRoom, {
      global: {
        components: commonCompoenets,
        plugins: [[stubStore, key]],
        mocks: {
          $route: router,
          setRoomInfo: jest.fn().mockReturnValue(true),
        },
      },
    });
  });

  it("x button click close event", async () => {
    await warpper.find("button").trigger("click");

    expect(warpper.emitted()).toHaveProperty("close");
  });

  it("setRoominfo 로 데이터 받아오기", () => {
    expect(warpper.vm.setRoomInfo()).toBe(true);
  });

  it("onChangeRoom edit emitted call", async () => {
    await warpper.vm.onChangeRoom();

    await nextTick();

    expect(warpper.emitted()).toHaveProperty("edit");
  });
});
