import ApprovaWaitView from "@/components/ApprovaWaitView.vue";
import { shallowMount, VueWrapper } from "@vue/test-utils";

// store , 공용 검포넌트
import { key } from "@/store";
import { commonCompoenets, stubStore } from "@/../tests/Stubs/store";

// route mocks
import { routes } from "@/router";
import { createRouterMock, injectRouterMock } from "vue-router-mock";

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

  it("test", () => {
    expect(warpper.html());
  });
});
