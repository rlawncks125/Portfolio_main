<template>
  <loding :isLoding="isLoading" />
  <div>My Room</div>

  <p>내가 접속중인 방</p>
  <div
    v-for="item in myJoinRoomLists"
    :key="item.id"
    class="grid grid-cols-1 gap-y-2 border-2"
  >
    <p>uuid : {{ item.uuid }}</p>
    <p>roomName : {{ item.roomName }}</p>
    <button
      class="text-pink-500 bg-slate-700 border-2 w-3/6 mx-auto"
      @click.prevent="goRoom(item.uuid)"
    >
      입장
    </button>
  </div>
</template>

<script lang="ts">
import { getJoinRoomList, joinRoom } from "@/api/Room";
import { MyRoomsinfoDto } from "@/assets/swagger";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();

    const data = reactive({
      myJoinRoomLists: [] as Array<MyRoomsinfoDto>,
      isLoading: false,
    });

    const goRoom = async (uuid: string) => {
      console.log(`go ${uuid}`);
      const isExist = data.myJoinRoomLists.find((v) => v.uuid === uuid);
      if (isExist) {
        router.push({
          name: "foodChatRoomJoin",
          params: { uuid },
        });
      } else {
        console.log("수락 기달리기");
        data.isLoading = true;
        const { ok } = await joinRoom({ uuid });
        data.isLoading = false;
        if (ok) {
          router.push({
            name: "foodChatRoomJoin",
            params: { uuid },
          });
        }
      }
    };

    onMounted(async () => {
      data.isLoading = true;
      const { ok, myRooms } = await getJoinRoomList();
      data.isLoading = false;
      if (ok) {
        data.myJoinRoomLists = myRooms;
      }
    });

    return {
      ...toRefs(data),
      goRoom,
    };
  },
});
</script>

<style scoped></style>
