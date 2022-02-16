<template>
  <div
    class="fixed bg-gray-600 inset-0 w-screen h-screen text-2xl sm:text-base"
    style="z-index: 1001"
  >
    <loding :isLoding="isLoading" />
    <div
      class="relative overflow-auto max-w-5xl p-2 pt-0 h-full bg-yellow-100 inset-0 sm:w-11/12 sm:h-5/6 sm:mx-auto sm:my-12 sm:rounded-xl sm:overflow-y-auto sm:p-4"
    >
      <button class="absolute top-2 right-4" @click="$emit('close')">X</button>

      <form class="text-center py-20">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-start"
        >
          <legend class="text-center px-4">대기 중인 유저들</legend>
          <template v-if="lists.length > 0">
            <div v-for="item in lists" :key="item.id" class="flex">
              <p>
                {{ item.username }}
              </p>
              <button class="ml-8" @click="onAccept(item.id)">승인</button>
            </div>
          </template>

          <p v-else>없음</p>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { postAccept } from "@/api/Room";
import { ApprovalWaitUsersDto } from "@/assets/swagger";
import { defineComponent, PropType, ref, toRaw, toRefs } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {
    lists: {
      type: Array as PropType<ApprovalWaitUsersDto[]>,
    },
  },
  emits: ["updateLists", "close"],
  setup(props, { emit }) {
    const isLoading = ref(false);
    const route = useRoute();

    const { lists } = toRefs(props);

    const onAccept = async (id: number) => {
      isLoading.value = true;
      const { ok, err } = await postAccept({
        uuid: route.params.uuid + "",
        id,
      });

      if (ok) {
        if (lists.value!.length > 0) {
          let copyLists = toRaw(lists.value);
          copyLists = copyLists?.filter((v) => v.id !== id);

          emit("updateLists", copyLists);
        }
      } else {
        console.log(`err : ${err}`);
      }
      isLoading.value = false;
    };

    return { isLoading, onAccept };
  },
});
</script>

<style scoped></style>
