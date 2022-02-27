import { render, RenderResult } from "@testing-library/vue";
import loading from "@/components/Loding.vue";

// 공용 컴포넌트
import { commonCompoenets } from "@/../tests/Stubs/store";

describe("loading", () => {
  let warpper: RenderResult;
  beforeEach(() => {
    jest.clearAllMocks();

    warpper = render(loading, {
      global: {
        components: commonCompoenets,
        stubs: {
          RadialProgressBar: true,
        },
      },
    });
  });

  it("Loading text check", () => {
    warpper.getByText("Loding...");
  });
});
