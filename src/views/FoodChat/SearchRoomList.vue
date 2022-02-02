<template>
  <loding :isLoding="isLoading" />
  <p>방 찾기</p>
  <!-- 방만들기 버튼 -->
  <button @click="isCreateRoom = true">방 만들기</button>
  <room-create-form
    v-if="isCreateRoom"
    @onCreated="onCreateRoom"
    @onClose="
      (isActive) => {
        isCreateRoom = isActive;
      }
    "
  />

  <div
    v-for="item in roomLists"
    :key="item.id"
    class="flex flex-col border-2 mt-4"
  >
    <div class="room-info">
      <div class="room-marke">
        <div>
          <img
            :src="item.markeImageUrl ? item.markeImageUrl : baseRoomMarke"
            class="w-full h-full bg-cover bg-center"
          />
        </div>
      </div>
      <p class="room-name">{{ item.roomName }}</p>
      <p class="room-super-user">👑{{ item.superUserinfo.username }}</p>
      <button
        class="text-pink-500 bg-slate-700 border-2"
        @click.prevent="goRoom(item.uuid)"
      >
        참여 하기
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { MyRoomsinfoDto, roomInfoDto, RoomOutPutDto } from "@/assets/swagger";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { getJoinRoomList, getRoomList, joinRoom } from "@/api/Room";
import { useRouter } from "vue-router";
import Loding from "@/components/Loding.vue";
import RoomCreateForm from "@/components/RoomCreateForm.vue";
import baseImage from "@/assets/images/user-shape.png";

export default defineComponent({
  components: { Loding, RoomCreateForm },
  setup() {
    const router = useRouter();
    const data = reactive({
      roomLists: [] as Array<roomInfoDto>,
      myJoinRoomLists: [] as Array<MyRoomsinfoDto>,
      isLoading: false,
      baseRoomMarke: baseImage,
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

    const onCreateRoom = async ({
      ok,
      room,
    }: {
      ok: boolean;
      room: RoomOutPutDto;
    }) => {
      if (ok && room) {
        data.myJoinRoomLists.push({
          id: room.id,
          uuid: room.uuid,
          roomName: room.roomName,
          lating: room.lating,
          restaurantInfo: [],
          markeImageUrl: room.markeImageUrl,
          superUser: room.superUser,
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

    onMounted(async () => {
      const { ok, myRooms } = await getJoinRoomList();
      if (ok) {
        data.myJoinRoomLists = myRooms;
      }
      getRoomLists();
    });

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

<style lang="scss"></style>
