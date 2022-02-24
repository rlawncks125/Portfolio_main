<template>
  <loding :isLoding="isLoading" />
  <div>My Room</div>

  <p>내가 접속중인 방</p>
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
import { getJoinRoomList, joinRoom } from "@/api/Room";
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
      const isExist = data.myJoinRoomLists.find((v) => v.uuid === uuid);
      if (isExist) {
        router.push({
          name: "foodChatRoomJoin",
          params: { uuid },
        });
      }
    };

    const myRoomListUpdate = async () => {
      const { ok, myRooms } = await getJoinRoomList();
      console.log(myRooms);
      if (ok) {
        data.myJoinRoomLists = myRooms;
      }
    };

    onMounted(async () => {
      data.isLoading = true;
      await myRoomListUpdate();
      data.isLoading = false;
      webSocket.catchApprovaWait(async () => {
        await myRoomListUpdate();
      });
    });

    return {
      ...toRefs(data),
      goRoom,
    };
  },
});
</script>

<style lang="scss"></style>
