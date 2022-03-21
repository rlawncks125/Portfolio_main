<template>
  <p>방 찾기</p>
  <Loading :isLoding="isLoading" />
  <!-- 필터 -->
  <div class="flex items-center">
    <select v-model="filterType" class="flex-1 w-1/3">
      <template v-for="(value, key) in searchOptions" :key="key">
        <option :value="key">{{ key }}</option>
      </template>
    </select>
    <input type="text" class="flex-1 w-1/3" v-model="searchValue" />

    <LoadingBtn
      class="h-10 w-30 flex-initial"
      @click.prevent="getRoomLists"
      :isLoading="isLoadingBtn"
      :size="30"
    >
      <p>찾기</p>
    </LoadingBtn>
  </div>

  <!-- 방만들기 버튼 -->
  <button @click.prevent="isCreateRoom = true">방 만들기</button>
  <transition name="ani-fade">
    <room-create-form
      v-if="isCreateRoom"
      @onCreated="onCreateRoom"
      @onClose="isCreateRoom = false"
    />
  </transition>
  <!-- 찾은 방리스트 랜더 -->
  <div
    v-for="item in roomLists"
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
          <fa-icon v-else class="h-full" :icon="['fa', 'users']" />
        </div>
      </div>
      <p class="room-name">{{ item.roomName }}</p>
      <p class="room-super-user">👑{{ item.superUserinfo.username }}</p>

      <button
        v-if="approvalWaitRooms.find((v) => v.id === item.id)"
        class="text-pink-500 bg-slate-700 border-2 pointer-events-none"
      >
        <p>승인 대기중</p>
      </button>
      <button
        v-else
        class="text-pink-500 bg-slate-700 border-2"
        @click.prevent="joinReqRoom(item.uuid)"
      >
        <p>참여 하기</p>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  approvalWaitRoomInfo,
  EnumRoomListInputDtoSearchType,
  MyRoomsinfoDto,
  roomInfoDto,
  RoomOutPutDto,
} from "@/assets/swagger";
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";
import {
  getJoinRoomList,
  getRoomList,
  joinRoom,
  getApprovalWaitRooms,
} from "@/api/Room";
import { useRouter } from "vue-router";
import Loading from "@/components/Loding.vue";
import RoomCreateForm from "@/components/RoomCreateForm.vue";
import LoadingBtn from "@/components/common/Input/LoadingBtn.vue";
import * as webSocket from "@/api/Socket";

export default defineComponent({
  components: { Loading, RoomCreateForm, LoadingBtn },
  setup() {
    const router = useRouter();
    const data = reactive({
      roomLists: [] as Array<roomInfoDto>,
      myJoinRoomLists: [] as Array<MyRoomsinfoDto>,
      isLoading: false,
      isLoadingBtn: false,
      approvalWaitRooms: [] as Array<{ id: number }>,
    });

    const isCreateRoom = ref(false);

    // 서치 필터
    const searchValue = ref("");
    const filterType = ref<keyof typeof searchOptions>("All");
    const searchOptions = {
      All: EnumRoomListInputDtoSearchType.All,
      "방 이름": EnumRoomListInputDtoSearchType.RoomName,
      "방장 이름": EnumRoomListInputDtoSearchType.SuperUser,
    };

    const getRoomLists = async () => {
      data.isLoadingBtn = true;

      const { ok: ok_joinRoom, myRooms } = await getJoinRoomList();
      if (ok_joinRoom) {
        data.myJoinRoomLists = myRooms;
      }

      // 서치 타입
      const searchType = searchOptions[filterType.value];

      const { ok, err, roomList } = await getRoomList({
        searchType,
        value: searchValue.value,
      });

      if (ok) {
        data.roomLists = roomList;
      }

      data.roomLists = data.roomLists.filter(
        (v) => !data.myJoinRoomLists.find((f) => f.uuid === v.uuid)
      );

      data.isLoadingBtn = false;
    };

    const joinReqRoom = async (uuid: string) => {
      data.isLoading = true;
      const { ok } = await joinRoom({ uuid });
      if (ok) {
        updateApprovalWaitRooms();
        webSocket.updateReqApprovaWait(uuid);
      }
      data.isLoading = false;
    };

    const updateApprovalWaitRooms = async () => {
      const { ok, rooms, err } = await getApprovalWaitRooms();
      if (ok) {
        data.approvalWaitRooms = rooms.map((v) => {
          return {
            id: v.id,
          };
        });
      } else {
        console.log(`err : ${err}`);
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
        router.push({
          name: "foodChatRoomJoin",
          params: { uuid: room.uuid },
        });
      }
    };

    const UpdateRoomLists = async () => {
      await getRoomLists();
      await updateApprovalWaitRooms();
    };
    onMounted(async () => {
      await UpdateRoomLists();
      webSocket.catchApprovaWait(async () => {
        await UpdateRoomLists();
      });
    });

    return {
      isCreateRoom,
      searchOptions,
      filterType,
      searchValue,
      ...toRefs(data),
      getRoomLists,
      joinReqRoom,
      onCreateRoom,
    };
  },
});
</script>

<style lang="scss"></style>
