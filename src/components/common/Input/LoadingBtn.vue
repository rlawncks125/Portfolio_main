<template>
  <button :class="{ 'pointer-events-none': isLoading }">
    <div class="px-2 py-2 w-full h-full flex justify-center flex-col">
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
        <p>{{ Msg }}</p>
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
    Msg: String,
    size: Number,
  },
  components: { RadialProgressBar },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
