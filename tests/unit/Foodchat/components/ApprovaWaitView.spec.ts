import ApprovaWaitView from "@/components/ApprovaWaitView.vue";
import { shallowMount, VueWrapper } from "@vue/test-utils";

// store , 공용 검포넌트
import { key } from "@/store";
import { commonCompoenets, stubStore } from "@/../tests/Stubs/store";

// route mocks
import { routes } from "@/router";
import { createRouterMock, injectRouterMock } from "vue-router-mock";

import { postAccept } from "@/api/Room";
import { nextTick } from "vue";

jest.mock("@/api/Room", () => ({
  postAccept: () => Promise.resolve({ ok: true }),
}));

describe("ApprovaWaitView", () => {
  let warpper: VueWrapper<any>;
  beforeEach(() => {
    jest.clearAllMocks();
    const router = createRouterMock({
      routes,
    });
    injectRouterMock(router);

    warpper = shallowMount(ApprovaWaitView, {
      props: {
        lists: [],
      },
      global: {
        components: commonCompoenets,
        plugins: [[stubStore, key]],
        mocks: {
          $route: router,
        },
      },
    });
  });

  it("onAccept update emiteed 전달 테스트  ", async () => {
    const lists = [
      {
        username: "2",
        id: 1,
      },
      {
        username: "1",
        id: 2,
      },
    ];
    await warpper.setProps({ lists });

    warpper.vm.onAccept(1);

    const resultLists = lists.filter((v) => v.id !== 1);

    await nextTick();

    expect(warpper.emitted()["updateLists"]).toEqual([[resultLists]]);
  });

  it("close button emitted 절달 테스트", () => {
    warpper.find("button").trigger("click");

    expect(warpper.emitted()).toHaveProperty("close");
  });
});
