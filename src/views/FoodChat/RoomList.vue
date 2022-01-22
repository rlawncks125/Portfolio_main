<template>
  <loding :isLoding="isLoading" />
  <button @click="getRoomLists">Loom List 얻기</button>

  <!-- 방만들기 버튼 -->
  <button @click="isCreateRoom = true">방 만들기</button>
  <room-create-form
    v-if="isCreateRoom"
    @createRoom="onCreateRoom"
    @onClose="
      (isActive) => {
        isCreateRoom = isActive;
      }
    "
  />

  <div
    v-for="item in roomLists"
    :key="item.key"
    class="grid grid-cols-1 gap-y-2 border-2"
  >
    <p>uuid : {{ item.uuid }}</p>
    <p>roomName : {{ item.roomName }}</p>
    <p>방장유저 : {{ item.superUserinfo.username }}</p>
    <button
      class="text-pink-500 bg-slate-700 border-2 w-3/6 mx-auto"
      @click.prevent="goRoom(item.uuid)"
    >
      참여 하기
    </button>
  </div>
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
import { MyRoomsinfoDto, roomInfoDto } from "@/assets/swagger";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { createRoom, getJoinRoomList, getRoomList, joinRoom } from "@/api/Room";
import { useRouter } from "vue-router";
import Loding from "@/components/Loding.vue";
import RoomCreateForm from "@/components/RoomCreateForm.vue";

export default defineComponent({
  components: { Loding, RoomCreateForm },
  setup() {
    const router = useRouter();
    const data = reactive({
      roomLists: [] as Array<roomInfoDto>,
      myJoinRoomLists: [] as Array<MyRoomsinfoDto>,
      isLoading: false,
    });

    const isCreateRoom = ref(false);

    const getRoomLists = async () => {
      data.isLoading = true;
      const { ok, err, roomList } = await getRoomList();
      data.isLoading = false;

      if (ok) {
        data.roomLists = roomList;
      }
      data.roomLists = data.roomLists.filter((v) => {
        const isExist = data.myJoinRoomLists.find((pre) => pre.uuid === v.uuid);
        if (isExist) return false;
        else return true;
      });
    };
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

    const onCreateRoom = async ({
      LatLng,
      roomName,
    }: {
      LatLng: { x: number; y: number };
      roomName: string;
    }) => {
      data.isLoading = true;
      const { ok, room } = await createRoom({
        roomName: roomName,
        lating: LatLng,
      });
      data.isLoading = false;

      if (ok && room) {
        data.myJoinRoomLists.push({
          id: room.id,
          uuid: room.uuid,
          roomName: room.roomName,
          lating: room.lating,
          restaurantInfo: [],
          joinUsersInfo: [
            {
              id: room.superUser.id,
              username: room.superUser.username,
            },
          ],
        });
        goRoom(room.uuid);
      }
    };

    return {
      isCreateRoom,
      ...toRefs(data),
      getRoomLists,
      goRoom,
      onCreateRoom,
    };
  },
});
</script>

<style></style>
