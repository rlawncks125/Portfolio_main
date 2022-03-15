<template>
  <loding :isLoding="isLoading" />
  <p>My Room</p>

  <div class="flex justify-between">
    <p>내가 접속중인 방</p>
    <button class="cursor-pointer" @click.prevent="myRoomListUpdate">
      새로고침
    </button>
  </div>

  <div
    v-for="item in myJoinRoomLists"
    :key="item.id"
    class="flex flex-col border-2 mt-4"
  >
    <div class="room-info">
      <div class="room-marke">
        <div>
          <img
            v-if="item.markeImageUrl"
            :src="item.markeImageUrl"
            class="w-full h-full bg-cover bg-center"
          />
          <fa-icon v-else class="w-full h-full" :icon="['fa', 'users']" />
        </div>
      </div>
      <p class="room-name">{{ item.roomName }}</p>
      <p class="room-super-user">👑{{ item.superUser.username }}</p>
      <button
        class="text-pink-500 bg-slate-700 border-2"
        @click.prevent="goRoom(item.uuid)"
      >
        입장
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { getJoinRoomList } from "@/api/Room";
import { MyRoomsinfoDto } from "@/assets/swagger";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import * as webSocket from "@/api/Socket";

export default defineComponent({
  setup() {
    const router = useRouter();

    const data = reactive({
      myJoinRoomLists: [] as Array<MyRoomsinfoDto>,
      isLoading: false,
    });

    const goRoom = async (uuid: string) => {
      await myRoomListUpdate();
      const isExist = data.myJoinRoomLists.find((v) => v.uuid === uuid);
      if (isExist) {
        router.push({
          name: "foodChatRoomJoin",
          params: { uuid },
        });
      }
    };

    const myRoomListUpdate = async () => {
      data.isLoading = true;
      const { ok, myRooms } = await getJoinRoomList();
      if (ok) {
        data.myJoinRoomLists = myRooms;
      }
      data.isLoading = false;
    };

    onMounted(async () => {
      await myRoomListUpdate();
      webSocket.catchApprovaWait(async () => {
        await myRoomListUpdate();
      });
    });

    return {
      ...toRefs(data),
      myRoomListUpdate,
      goRoom,
    };
  },
});
</script>

<style lang="scss"></style>
