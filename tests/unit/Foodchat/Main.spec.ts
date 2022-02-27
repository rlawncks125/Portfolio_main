import { render, RenderResult } from "@testing-library/vue";
import FoodChatMain from "@/views/FoodChat/Main.vue";

// store , 공용 검포넌트
import { key } from "@/store";
import { commonCompoenets, stubStore } from "@/../tests/Stubs/store";

// route mocks
import { routes } from "@/router";
import { createRouterMock, injectRouterMock } from "vue-router-mock";

describe("FoodChatMain", () => {
  let warpper: RenderResult;
  beforeEach(() => {
    const router = createRouterMock({
      routes,
    });
    injectRouterMock(router);

    warpper = render(FoodChatMain, {
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
    expect(warpper.getByText("음식 채팅방 메인방"));
  });
});
