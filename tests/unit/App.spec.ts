import { render, RenderResult } from "@testing-library/vue";
import App from "@/App.vue";

// store , 공용 검포넌트
import { key } from "@/store";
import { commonCompoenets, stubStore } from "@/../tests/Stubs/store";

// route mocks
import { routes } from "@/router";
import { createRouterMock, injectRouterMock } from "vue-router-mock";

describe("App style", () => {
  let warpper: RenderResult;
  beforeEach(() => {
    jest.clearAllMocks();
    const router = createRouterMock({
      routes,
    });
    injectRouterMock(router);

    warpper = render(App, {
      global: {
        components: commonCompoenets,
        plugins: [[stubStore, key]],
        mocks: {
          $route: router,
        },
      },
    });
  });
  it("app Style", () => {
    expect(warpper.html());
  });
});
