<template>
  <div class="over-star-wrap" :style="overStarWrap">
    <div :style="overBinStarWrap">
      <p
        class="cursor-pointer"
        v-for="index in starNum * 2"
        :key="index"
        :style="overBinStar"
        @mouseover="starEvent(index)"
      >
        ☆
      </p>
    </div>

    <div :style="overFillStarWrap">
      <p
        class="cursor-pointer"
        v-for="index in starNum * 2"
        :key="index"
        :style="overFillStar"
        @mouseover="starEvent(index)"
        @click.prevent="onClickStartEvent(index)"
      >
        ★
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from "vue";

export default defineComponent({
  props: {
    starSize: {
      type: Number,
      default: 0,
    },
    starNum: {
      type: Number,
      default: 0,
    },
    fill: {
      type: Number,
      default: 0,
    },
  },
  emits: ["clickStar"],
  setup(props, { emit }) {
    const { fill, starSize, starNum } = toRefs(props);

    const starWidth = starSize.value * starNum.value;

    const isSelected = ref(false);

    const commonStarWrapStyle = {
      position: "absolute",
      display: "flex",
    };
    const commonStarFillStyle = {
      flex: `0 0 ${starSize.value * 0.5}rem`,
      margin: 0,
      overflow: "hidden",
      fontSize: `${starSize.value}rem`,
      top: `2px`,
      lineHeight: `normal`,
    };

    const overStarWrap = {
      width: `${starWidth * 1}rem`,
      position: "relative",
      height: `${starSize.value * 1.5}rem`,
      display: "flex",
      alignItems: "flex-start",
    };
    const overBinStarWrap = {
      width: `100%`,
      ...commonStarWrapStyle,
    };
    const overBinStar = {
      ...commonStarFillStyle,
    };
    const overFillStarWrap = reactive({
      width: `${starWidth * (fill.value / starNum.value)}rem`,
      ...commonStarWrapStyle,
      color: "gold",
      overflow: "hidden",
    });
    const overFillStar = {
      ...commonStarFillStyle,
    };
    const starEvent = (index: number) => {
      if (isSelected.value === true) return;
      const fillStartWidth = starWidth * (index / (starNum.value * 2));

      overFillStarWrap.width = `${fillStartWidth}rem`;
    };
    const onClickStartEvent = (index: number) => {
      isSelected.value = !isSelected.value;
      const fillStartWidth = starWidth * (index / (starNum.value * 2));

      overFillStarWrap.width = `${fillStartWidth}rem`;
      if (isSelected.value === true) {
        emit("clickStar", index / 2);
      }
    };

    return {
      overStarWrap,
      overBinStarWrap,
      overBinStar,
      overFillStarWrap,
      overFillStar,
      isSelected,
      starEvent,
      onClickStartEvent,
    };
  },
});
</script>

<style scoped lang="scss">
.over-star-wrap {
  & div {
    & p:nth-child(2n) {
      transform: scaleX(-1);
    }
  }
}
</style>
