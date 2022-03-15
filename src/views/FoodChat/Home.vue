<template>
  <div class="px-2">
    <div>FoodChat Home</div>
    <button @click.prevent="router.push('/foodChat/myRoomList')">
      내 방리스트 보기
    </button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    return { router };
  },
};
</script>

<style lang="scss" scoped></style>
