<template>
  <div class="">
    나의 페이지 zzz머 만들지 계속 이상하게 하나씩 추가되서 잡되는거같아
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    console.log(route.params);

    return {};
  },
});
</script>

<style scoped></style>
