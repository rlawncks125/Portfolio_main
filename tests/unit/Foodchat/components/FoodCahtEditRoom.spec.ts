import FoodCahtEditRoom from "@/components/FoodCahtEditRoom.vue";
import { shallowMount, VueWrapper } from "@vue/test-utils";

// store , Compoenets
import { key } from "@/store";
import { commonCompoenets, stubStore } from "@/../tests/Stubs/store";

// route mocks
import { routes } from "@/router";
import { createRouterMock, injectRouterMock } from "vue-router-mock";

describe("FoodCahtEidtRoom 버튼 클릭 테스트", () => {
  let warpper: VueWrapper<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    const router = createRouterMock({
      routes,
    });
    injectRouterMock(router);

    warpper = shallowMount(FoodCahtEditRoom, {
      props: {
        lists: [],
      },
      global: {
        components: commonCompoenets,
        plugins: [[stubStore, key]],
        mocks: {
          $route: router,
          onChangeRoom: jest.fn(),
          setRoomInfo: jest.fn().mockReturnValue(true),
        },
      },
    });
  });

  it("x button click close event", async () => {
    await warpper.find("button").trigger("click");

    expect(warpper.emitted()["close"]).toEqual([[]]);
  });
  it("변경 클릭시 onChangeRoom called ", async () => {
    const spyOn = jest.spyOn(warpper.vm, "onChangeRoom");

    await warpper.find("[role=change]").trigger("click");

    expect(spyOn).toHaveBeenCalled();
  });
  it("setRoominfo 로 데이터 받아오기", () => {
    expect(warpper.vm.setRoomInfo()).toBe(true);
  });
});
