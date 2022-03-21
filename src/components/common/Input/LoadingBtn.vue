<template>
  <button
    :class="{
      'pointer-events-none': isLoading,
      'red-btn': type && type === 'red',
      'blue-btn': type && type === 'blue',
    }"
  >
    <div
      class="px-2 py-2 w-full h-full flex justify-center flex-col text-black"
      :class="isLoading ? 'pointer-events-none' : ''"
    >
      <template v-if="isLoading">
        <radial-progress-bar
          class="animate-spin w-full h-full m-auto"
          :diameter="size"
          :totalSteps="20"
          :completedSteps="3"
          :strokeWidth="7"
          :innerStrokeWidth="7"
          innerStrokeColor="#323232"
          startColor="#3e91d4"
          stopColor="#3e91d4"
        >
        </radial-progress-bar>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RadialProgressBar from "vue-radial-progress";

export default defineComponent({
  props: {
    isLoading: Boolean,
    size: Number,
    type: String,
  },
  components: { RadialProgressBar },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
