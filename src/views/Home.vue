<template>
  <div>자기소개하기</div>
  <div class="image"></div>
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "../store/index";

export default defineComponent({
  setup() {
    const store = useStore();

    return {};
  },
});
</script>

<style scoped>
.image {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background: url("~@/assets/images/HOME.png");
}
</style>
