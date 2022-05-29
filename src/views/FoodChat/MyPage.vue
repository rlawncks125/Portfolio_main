<template>
  <p>{{ myName }}</p>
  <button class="border-2" @click.prevent="userLogOut">LogOut</button>
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
