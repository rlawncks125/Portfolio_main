<template>
  <div :style="starWrap">
    <p :style="binStar">
      {{ "☆".repeat(starNum) }}
    </p>
    <p :style="fillStar">
      {{ "★".repeat(starNum) }}
    </p>
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
  setup(props) {
    const { fill, starSize, starNum } = toRefs(props);

    const starWidth = ref(starSize.value * starNum.value);

    const starWrap = {
      position: "relative",
      width: `${starWidth.value}rem`,
      height: `${starSize.value * 1.5}rem`,
      display: "flex",
      alignItems: "flex-start",
    };
    const binStar = reactive({
      fontSize: `${starSize.value}rem`,
      width: `${starWidth.value}rem`,
      position: "absolute",
      color: "black",
      margin: 0,
      top: `2px`,
      lineHeight: `normal`,
    });
    const fillStar = reactive({
      fontSize: `${starSize.value}rem`,
      width: `${starWidth.value * (fill.value / starNum.value)}rem`,
      position: "absolute",
      margin: 0,
      color: "gold",
      overflow: "hidden",
      top: `2px`,
      lineHeight: `normal`,
    });

    watch(props, () => {
      fillStar.width = `${starWidth.value * (fill.value / starNum.value)}rem`;
    });

    return {
      starWrap,
      binStar,
      fillStar,
    };
  },
});
</script>

<style scoped></style>
