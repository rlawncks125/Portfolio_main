<template>
  <p>방 찾기</p>
  <Loading :isLoding="isLoading" />
  <!-- 필터 -->
  <div class="flex items-center">
    <select v-model="serchFilter" class="flex-1 w-1/3">
      <template v-for="(value, key) in searchOptions" :key="key">
        <option :value="key">{{ key }}</option>
      </template>
    </select>
    <input type="text" class="flex-1 w-1/3" v-model="searchValue" />

    <LoadingBtn
      class="h-10 w-20 flex-initial"
      @click="getRoomLists"
      :isLoading="isLoadingBtn"
      Msg="찾기"
      :size="30"
    />
  </div>

  <!-- 방만들기 버튼 -->
  <button @click="isCreateRoom = true">방 만들기</button>
  <transition name="ani-fade">
    <room-create-form
      v-if="isCreateRoom"
      @onCreated="onCreateRoom"
      @onClose="
        (isActive) => {
          isCreateRoom = isActive;
        }
      "
    />
  </transition>
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
        class="text-pink-500 bg-slate-700 border-2"
        @click.prevent="joinReqRoom(item.uuid)"
      >
        {{
          approvalWaitRooms.find((v) => v.id === item.id)
            ? "승인 대기중"
            : "참여 하기"
        }}
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
    const searchType = ref<EnumRoomListInputDtoSearchType>(
      EnumRoomListInputDtoSearchType.All
    );
    const searchValue = ref("");
    const serchFilter = ref<keyof typeof searchOptions>("All");
    const searchOptions = {
      All: EnumRoomListInputDtoSearchType.All,
      "방 이름": EnumRoomListInputDtoSearchType.RoomName,
      "방장 이름": EnumRoomListInputDtoSearchType.SuperUser,
    };

    const getRoomLists = async () => {
      data.isLoadingBtn = true;

      const { ok, err, roomList } = await getRoomList({
        searchType: searchType.value!,
        value: searchValue.value,
      });
      data.isLoadingBtn = false;

      if (ok) {
        data.roomLists = roomList;
      }
      data.roomLists = data.roomLists.filter((v) => {
        const isExist = data.myJoinRoomLists.find((pre) => pre.uuid === v.uuid);
        if (isExist) return false;
        else return true;
      });
    };

    const joinReqRoom = async (uuid: string) => {
      console.log(`요청 보냄 ${uuid}`);
      data.isLoading = true;
      const { ok } = await joinRoom({ uuid });
      if (ok) {
        myApprovalWaitRooms();
      }
      data.isLoading = false;
    };

    const myApprovalWaitRooms = async () => {
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

    const goRoom = async (uuid: string) => {
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
          approvalWaitUsers: [],
        });
        goRoom(room.uuid);
      }
    };

    watch(serchFilter, () => {
      const filter: keyof typeof searchOptions = serchFilter.value;

      searchType.value = searchOptions[filter];
    });

    onMounted(async () => {
      const { ok, myRooms } = await getJoinRoomList();
      if (ok) {
        data.myJoinRoomLists = myRooms;
      }
      getRoomLists();
      myApprovalWaitRooms();
    });

    return {
      isCreateRoom,
      searchOptions,
      serchFilter,
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
