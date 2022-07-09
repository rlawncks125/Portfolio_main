<template>
  <div class="foodChat-form">
    <loding :isLoding="isLoading" />
    <div
      class="foodChat-form-main"
      style="height: calc(var(--mobile--full) - 2vh)"
    >
      <button class="absolute top-2 right-4" @click.prevent="$emit('close')">
        X
      </button>

      <form class="text-center py-20">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-start"
        >
          <legend class="text-center px-4">대기 중인 유저들</legend>
          <template v-if="lists && lists.length > 0">
            <div v-for="item in lists" :key="item.id" class="flex">
              <p>
                {{ item.username }}
              </p>
              <button class="ml-8" @click.prevent="onAccept(item.id)">
                승인
              </button>
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
import { defineComponent, onMounted, PropType, ref, toRaw, toRefs } from "vue";
import { useRoute } from "vue-router";
import * as webSocket from "@/api/Socket";

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
    const uuid = route.params.uuid as string;

    const { lists } = toRefs(props);

    const onAccept = async (id: number) => {
      isLoading.value = true;
      const { ok, err } = await postAccept({
        uuid,
        id,
      });

      if (ok) {
        if (lists.value!.length > 0) {
          let copyLists = toRaw(lists.value);
          copyLists = copyLists?.filter((v) => v.id !== id);

          emit("updateLists", copyLists);
          webSocket.updateApprovaWait(id);
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
