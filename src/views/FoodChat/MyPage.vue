<template>
  <button class="border-2" @click.prevent="userLogOut">LogOut</button>
</template>

<script lang="ts">
import { logOut } from "@/api/auth";
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    console.log(route.params);

    const userLogOut = () => {
      router.push("/foodChat");
      logOut();
    };

    return { userLogOut };
  },
});
</script>

<style scoped></style>
