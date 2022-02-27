<template>
  <div
    v-show="isLoding"
    class="loding fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center"
  >
    <div class="p-8 bg-red-300 rounded-xl flex items-center">
      <radial-progress-bar
        class="animate-spin mr-2"
        :diameter="50"
        :totalSteps="20"
        :completedSteps="3"
        :strokeWidth="7"
        :innerStrokeWidth="7"
        innerStrokeColor="#323232"
        startColor="#3e91d4"
        stopColor="#3e91d4"
        id="42sswzSSwq"
      >
      </radial-progress-bar>
      <p class="text-black">Loding...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RadialProgressBar from "vue-radial-progress";

export default defineComponent({
  components: { RadialProgressBar },
  props: {
    isLoding: Boolean,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300&family=Song+Myung&display=swap");
$dsds: 10px;

.loding {
  z-index: 1002;
}
</style>
