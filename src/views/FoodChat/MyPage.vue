<template>
  <div class="p-4">
    <p>유저 닉네임 : {{ myName }}</p>
    <br />
    <button class="border-2" @click.prevent="userLogOut">LogOut</button>
  </div>
</template>

<script lang="ts">
import { logOut } from "@/api/auth";
import { useStore } from "@/store";
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const myName = computed(() => store.state.userName);

    console.log(route.params);

    const userLogOut = () => {
      router.push("/foodChat");
      logOut();
    };

    return { userLogOut, myName };
  },
});
</script>

<style scoped></style>
