<template>
  <div class="px-2">
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
    <!-- 페이지 번호 -->
    <div class="flex gap-[5px] py-[0.5rem]">
      <div v-for="item in paginationLists" :key="item">
        <label
          class="border px-[2rem] py-[0.5rem] cursor-pointer"
          :class="pagination === item ? 'text-white' : ''"
          :for="`pag${item}`"
          >{{ item }}</label
        >
        <input
          type="radio"
          :id="`pag${item}`"
          :value="item"
          v-model="pagination"
          class="w-0"
        />
      </div>
    </div>
    <!-- 찾은 방리스트 랜더 -->
    <p v-if="rnederLists && rnederLists.length === 0">
      <!-- 방층 찾을 못찾았을시 -->
      해당 하는 조건으로 찾은 있는 방의 결과가 없습니다.
    </p>
    <div
      v-else
      v-for="item in rnederLists"
      :key="item.id"
      class="flex flex-col border-2 mt-4 mb-10"
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
      rnederLists: [] as Array<roomInfoDto>,
      isLoading: false,
      isLoadingBtn: false,
      approvalWaitRooms: [] as Array<{ id: number }>,
    });

    const isCreateRoom = ref(false);
    // 페이지 번호
    const pagination = ref(1);
    const paginationRenderNumber = 4;
    const paginationLists = ref(
      Array.from(new Array(1), (v, index) => index + 1)
    );

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

      renderLists();

      data.isLoadingBtn = false;
    };

    const renderLists = () => {
      if (data.roomLists.length === 0) {
        paginationLists.value = [];
        data.rnederLists = [];
        return;
      }

      // trunc 정수값만 사용
      const listsNumber = Math.trunc(
        data.roomLists.length / paginationRenderNumber
      );

      // 페이지 번호 작업
      paginationLists.value = Array.from(
        new Array(listsNumber + 1),
        (v, index) => index + 1
      );

      data.rnederLists = data.roomLists.filter((v, index) => {
        const min = (pagination.value - 1) * paginationRenderNumber;
        const max = pagination.value * paginationRenderNumber;

        return min <= index && index < max;
      });
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

    watch(pagination, () => {
      renderLists();
    });

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
      pagination,
      paginationLists,
    };
  },
});
</script>

<style lang="scss"></style>
