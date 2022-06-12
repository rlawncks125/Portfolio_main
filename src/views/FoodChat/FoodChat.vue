<template>
  <loding :isLoding="isLoding" />

  <!-- 현재 접속 중인방 정보  -->
  <div class="bg-blue-400 text-center pt-2">
    <span v-if="isSpuerUser" class="text-red-800">👑 </span>
    <span v-if="roomInfoData">{{ roomInfoData.roomName }} 방</span>
  </div>
  <!-- 기타 등등 우선 토글에 넣어놓음 -->
  <details class="block relative w-full h-10 bg-blue-400">
    <summary class="cursor-pointer px-4">기타 등등</summary>
    <div class="absolute top-10 z-[101] bg-white w-full h-auto">
      <div class="grid sm:grid-cols-2 gap-2 py-4 px-4 bg-blue-400">
        <button @click.prevent="onLeaveRoom">방 나가기</button>
        <button @click.prevent="router.push('/foodChat/myRoomList')">
          방으로 돌아가기
        </button>

        <template v-if="isSpuerUser">
          <button @click.prevent="isActiveApprovalWait = true">
            신청 대기 유저
          </button>
          <button
            v-if="isSpuerUser"
            class="hidden sm:block"
            @click.prevent="openEditRoom"
          >
            방 설정
          </button>
          <button @click.prevent="onDeleteRoom">방 삭제하기</button>
        </template>
      </div>
    </div>
  </details>

  <!-- 맵 -->
  <div ref="mapRef" class="w-full h-full mx-auto relative">
    <!-- 맵 하단에 서치 버튼 추가  -->
    <div class="absolute bottom-10 right-4" style="z-index: 101">
      <transition name="acodi">
        <div
          class="overflow-hidden mb-2 flex flex-col gap-1"
          v-show="isOptionsCheckd"
        >
          <!-- 방 설정 버튼 -->
          <div
            v-show="isSpuerUser"
            class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-gray-500 bg-opacity-50 sm:hidden"
            @click.prevent="openEditRoom"
          >
            <fa-icon :icon="['fa', 'gear']" class="text-white" />
          </div>
          <!-- 승인 요청 목록 버튼 -->
          <div
            v-show="isSpuerUser"
            class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-gray-500 bg-opacity-50 sm:hidden"
            @click.prevent="isActiveApprovalWait = true"
          >
            <fa-icon :icon="['fa', 'user-plus']" class="text-white" />
          </div>

          <!-- 서치 버튼 -->
          <div
            class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-opacity-50"
            :class="isActiveFilterSearch ? 'bg-red-400' : 'bg-gray-500'"
            @click.prevent="isActiveFilterSearch = !isActiveFilterSearch"
          >
            <fa-icon :icon="['fa', 'magnifying-glass']" class="text-white" />
          </div>
          <!-- 레스토랑 추가 & 취소 버튼 -->
          <div
            class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-gray-500 bg-opacity-50"
            @click.prevent="isActiveAdd = !isActiveAdd"
          >
            <fa-icon
              v-if="!isActiveAdd"
              :icon="['fa', 'plus']"
              class="text-white"
            />
            <fa-icon
              v-else
              :icon="['fa', 'ban']"
              class="text-red-500 bg-opacity-50"
            />
          </div>
        </div>
      </transition>

      <!-- 클릭 체크 -->
      <label
        type="checkbox"
        class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-opacity-60"
        :class="isOptionsCheckd ? 'bg-cyan-300' : 'bg-gray-500'"
        for="option"
      >
        <fa-icon
          v-if="isOptionsCheckd"
          :icon="['fa', 'angle-down']"
          class="text-white"
          size="2x"
        />
        <fa-icon
          v-else
          :icon="['fa', 'angle-up']"
          class="text-white"
          size="2x"
        />
      </label>
      <input
        class="hidden"
        type="checkbox"
        id="option"
        v-model="isOptionsCheckd"
      />
    </div>

    <!-- 트리거 표시 메세지 -->
    <div class="z-[102] absolute top-10 w-full text-center pointer-events-none">
      <p
        class="w-1/2 mx-auto py-[2rem] text-yellow-500 bg-blue-700 border rounded-md shadow-lg"
        v-show="isActiveAdd"
      >
        생성 할곳을 클릭하세요
      </p>
    </div>
  </div>

  <transition name="ani-fade">
    <foot-chat-add-form
      v-show="isAddFormActive"
      ref="refCompoAddForm"
      @closeAddForm="() => (isAddFormActive = false)"
      @createMaker="createMaker"
    />
  </transition>
  <transition name="ani-fade">
    <foot-chat-view-form
      v-show="isViewActive"
      ref="refCompoViewForm"
      :isRoomSuperUser="isSpuerUser"
      @closeViewForm="() => (isViewActive = false)"
      @DeleteRestrunt="onDeleteRestaurnt"
      @UpdateRestaurantById="onUpdateRestaurant"
    />
  </transition>
  <transition name="ani-fade">
    <ApprovaWaitView
      v-show="isActiveApprovalWait"
      :lists="ApprovalWaitUserLists"
      @updateLists="updateApprovaWatiUsers"
      @close="isActiveApprovalWait = false"
    />
  </transition>

  <!-- 레스토랑 정보 창 -->
  <div
    v-show="isOpenRestaurantInfo"
    class="absolute bottom-0 w-full flex justify-center"
  >
    <div
      class="bg-slate-100 w-4/6 max-w-3xl h-32 text-center rounded-xl flex flex-col justify-center cursor-pointer shadow-lg shadow-black/40 hover:scale-110"
      @click.prevent="onClickViewRestrauntInfo"
      v-if="RestaurantInfoData"
    >
      {{ RestaurantInfoData.restaurantName }}
    </div>
  </div>

  <!-- 서치 버튼 클릭시 보여주기 -->
  <!-- form?  -->
  <!-- 클릭시 마커로 이동  -->

  <!-- 방 설정 -->
  <edit-room
    v-show="isEditRoomAcitve"
    ref="refCompoEditRoom"
    @close="isEditRoomAcitve = false"
    @edit="onEditRoom"
  />

  <!-- 레스토랑 필터  -->
  <div v-show="isActiveFilterSearch" class="foodChat-form">
    <div
      class="foodChat-form-main scrollbar-clean px-8 !py-0"
      style="height: calc(var(--mobile--full) - 2vh)"
    >
      <div class="sticky top-0 bg-white z-[101] py-2">
        <div
          class="flex justify-between items-center px-2 border-b-2 border-b-gray-500 border-opacity-50"
        >
          <button
            class="none-btn text-3xl cursor-pointer px-[1rem] font-bold"
            @click.prevent="isActiveFilterSearch = !isActiveFilterSearch"
          >
            <!-- <fa-icon :icon="['fa', 'arrow-left']" /> -->
            &lt;
          </button>
          <input
            type="text"
            class="flex-1 w-1/3"
            @input="
              (e) => {
                filterName = e.target.value;
              }
            "
            :value="filterName"
            placeholder="찾으실 조건을 입력하세요"
          />
          <LoadingBtn :isLoading="false" :size="20" class="h-10">
            <span>검색</span>
          </LoadingBtn>
        </div>
        <label for="restaurntFilter">필터할 종류 : </label>
        <select v-model="selectedText" id="restaurntFilter">
          <option class="hidden" disabled value>종류</option>
          <template v-for="item in selectedFilter" :key="item.id">
            <option>
              {{ item.type }}
            </option>
          </template>
        </select>
      </div>

      <!-- 필터 결과 랜더 -->
      <div class="scrollbar-clean overflow-auto">
        <div
          v-for="restaurant in fillterArry"
          class="my-4 cursor-pointer flex flex-col border-2 rounded-lg border-gray-400"
          :key="restaurant.id"
          @click.prevent="goRestaurantPostionById(restaurant.id)"
        >
          <picture>
            <img
              v-if="restaurant.restaurantImageUrl"
              :src="restaurant.restaurantImageUrl"
              alt=""
              class="w-full h-60 object-cover object-center"
            />
            <img
              v-else
              src="https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg"
              alt=""
              class="w-full h-60 object-cover object-center"
            />
          </picture>
          <div class="flex flex-col gap-2 px-2 pt-4 pb-8">
            <StarFiil
              class="float-right"
              :fill="restaurant.avgStar"
              :starNum="5"
              :starSize="1"
            />
            <h2 class="font-bold text-xl sm:text-2xl">
              {{ restaurant.restaurantName }}
            </h2>
            <p>위치 : {{ restaurant.location }}</p>
            <div class="flex flex-col gap-2 flex-warp">
              <div class="flex flex-wrap gap-2">
                <template
                  v-for="specialization in restaurant.specialization"
                  :key="specialization.id"
                >
                  <p class="bg-amber-300 text-white px-2">
                    {{ specialization }}
                  </p>
                </template>
              </div>
              <div class="flex flex-wrap gap-2">
                <template v-for="hash in restaurant.hashTags" :key="hash.id">
                  <p class="bg-sky-300 text-white px-2">{{ hash }}</p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import FootChatAddForm from "@/components/FoodChatAddForm.vue";
import FootChatViewForm from "@/components/FoodChatViewForm.vue";
import ApprovaWaitView from "@/components/ApprovaWaitView.vue";
import EditRoom from "@/components/FoodCahtEditRoom.vue";
import LoadingBtn from "@/components/common/Input/LoadingBtn.vue";
import StarFiil from "@/components/common/StarFill.vue";
import { useRoute, useRouter } from "vue-router";
import {
  ApprovalWaitUsersDto,
  CreateRestaurantOutPutDto,
  Restaurant,
  RestaurantInfoDto,
  RoominfoDto,
} from "@/assets/swagger";
import {
  deleteRoom,
  getMySuperRooms,
  getRoomInfo,
  leaveRoom,
} from "@/api/Room";
import { deleteFile } from "@/api/file";
import { deleteRestaurant, getRestaurantById } from "@/api/Restaurant";
import { useStore } from "@/store/index";
import axios from "axios";
import * as webSocket from "@/api/Socket";
import { CustomNaverMaps } from "@/plugin/naverMaps";

enum EnumFilter {
  RestaurantName = "레스토랑 이름",
  HashTag = "해시태그",
  Specialization = "전문 분야",
  Location = "지역",
}

export default defineComponent({
  components: {
    FootChatAddForm,
    FootChatViewForm,
    ApprovaWaitView,
    EditRoom,
    StarFiil,
    LoadingBtn,
  },
  setup() {
    const consoleTest = (s: any) => {
      console.log(s);
    };

    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const roomInfoData = ref<RoominfoDto>();
    const uuid = route.params.uuid as string;
    const isLoding = ref(false);
    const isSpuerUser = ref(false);

    const isOptionsCheckd = ref(false);

    // 네이버 api
    let naverMaps: CustomNaverMaps;
    const mapRef = ref();

    // 마커 & 레스토랑 데이터
    const makerInfoWindow = new naver.maps.InfoWindow({ content: "" });
    let makers: Array<{
      maker: naver.maps.Marker;
      restaurantData: RestaurantInfoDto;
    }> = [];

    // 승인 대기중인 유저들
    const isActiveApprovalWait = ref(false);
    const ApprovalWaitUserLists = ref<Array<ApprovalWaitUsersDto>>([]);

    const updateApprovaWatiUsers = (updateData: ApprovalWaitUsersDto[]) => {
      ApprovalWaitUserLists.value = updateData;
    };

    // addform
    const isAddFormActive = ref<boolean>(false);
    const isActiveAdd = ref(false);
    const refCompoAddForm = ref<InstanceType<typeof FootChatAddForm>>();

    // view Form
    const isViewActive = ref<boolean>(false);
    const refCompoViewForm = ref<InstanceType<typeof FootChatViewForm>>();

    // eidt room form
    const isEditRoomAcitve = ref(false);
    const refCompoEditRoom = ref<InstanceType<typeof EditRoom>>();

    const openEditRoom = () => {
      refCompoEditRoom.value?.setRoomInfo(roomInfoData.value!);
      isEditRoomAcitve.value = true;
    };

    // 레스토랑 정보창
    const isOpenRestaurantInfo = ref(false);
    const RestaurantInfoData = ref<RestaurantInfoDto>();

    const openViewRestaurantInfo = (restaurnt: RestaurantInfoDto) => {
      isOpenRestaurantInfo.value = true;
      RestaurantInfoData.value = restaurnt;
    };
    const closeViewRestaurantInfo = () => {
      isOpenRestaurantInfo.value = false;
    };
    const onClickViewRestrauntInfo = () => {
      refCompoViewForm.value?.setOpenViewData(RestaurantInfoData.value!);
      isViewActive.value = true;
    };

    // 마커 이벤트
    const markerCommonEvent = (maker: naver.maps.Marker) => {
      maker.addListener("click", () => {
        if (makerInfoWindow.getMap()) {
          makerInfoWindow.close();
          closeViewRestaurantInfo();
        } else {
          activeMakerinfoWindow(maker);
        }
      });
    };
    const activeMakerinfoWindow = (maker: naver.maps.Marker) => {
      let restaurant = makers.filter((v) => v.maker === maker)[0]
        .restaurantData;

      const infoContent = `
          <p class="font-mono text-xs">레스토랑 id :${restaurant.id}</p>
          <p class="font-mono text-sm">${restaurant.restaurantName}</p>
          <p class="text-xs">${restaurant.resturantSuperUser.nickName} 님이 만들었습니다.</p>
          `;

      makerInfoWindow.setContent(infoContent);

      makerInfoWindow.open(naverMaps.map, maker);
      openViewRestaurantInfo(restaurant);
    };

    const createMaker = ({
      maker,
      restaurant,
    }: {
      maker: naver.maps.Marker;
      restaurant: Restaurant;
    }) => {
      isAddFormActive.value = false;

      // console.log("createMaker", restaurant);

      if (!restaurant) return;

      markerCommonEvent(maker);

      makers.push({ maker, restaurantData: restaurant });
      webSocket.createMaker({
        uuid,
        restaurantId: restaurant.id,
      });
      // console.log(makers);
      isActiveAdd.value = false;
      updateFilterInfo();
    };

    const updateByRemoveMarker = (maker: naver.maps.Marker) => {
      maker.onRemove();
      updateFilterInfo();
      makerInfoWindow.close();
      closeViewRestaurantInfo();
    };

    // ROOM & Restaurant CRUD
    const onLeaveRoom = async () => {
      if (!window.confirm("방을 나가실겁니까?")) return;

      const { ok } = await leaveRoom({ uuid });
      if (ok) {
        router.push("/foodChat/myRoomList");
      }
    };

    const onDeleteRoom = async () => {
      if (window.confirm("정말로 삭제하시겠습니까??")) {
        const { ok, err } = await deleteRoom(uuid);
        if (ok) {
          alert("삭제 되었습니다.");
          router.push({
            path: "/foodChat",
          });
          // .then(() => router.go(0));
        } else {
          alert(err);
        }

        return;
      }
      console.log("방 노삭제");
    };

    const onEditRoom = async (updateUUID: string, isWebsocket = false) => {
      if (uuid !== updateUUID) return;
      const { ok, roomInfo } = await getRoomInfo({ uuid });
      if (ok) {
        roomInfoData.value = roomInfo;

        naverMaps.renderMainMarker({
          lat: roomInfoData.value!.lating.y,
          lng: roomInfoData.value!.lating.x,
        });
        if (!isWebsocket) {
          webSocket.updateRoom(uuid);
        }
      }
    };

    const updateRestaurant = (
      updateUUID: string,
      restaurant: RestaurantInfoDto
    ) => {
      if (updateUUID === uuid) {
        makers = makers.map((v) => {
          if (v.restaurantData.id === restaurant.id) {
            return {
              maker: v.maker,
              restaurantData: restaurant,
            };
          } else {
            return v;
          }
        });

        // 보고있는 view 값 갱신
        if (refCompoViewForm.value?.viewData.id === restaurant.id) {
          openViewRestaurantInfo(restaurant);
          refCompoViewForm.value?.setOpenViewData(restaurant);
        }
      }
    };

    const onUpdateRestaurant = async (id: number) => {
      const { ok, restaurant, err } = await getRestaurantById(id);

      if (ok) {
        updateRestaurant(uuid, restaurant);

        webSocket.updateRestaurant({
          uuid,
          restaurantId: id,
        });
      } else {
        console.log(err);
      }
    };

    const onDeleteRestaurnt = async (id: number) => {
      if (!window.confirm("삭제 하실겁니까??")) return;

      isLoding.value = true;
      makers.filter(async (v) => {
        if (v.restaurantData.id === id) {
          const { ok, err } = await deleteRestaurant(v.restaurantData.id);

          if (!ok) {
            console.log(err);
            return true;
          }

          // 클라우드에 있는 이미지 삭제
          if (
            v.restaurantData.restaurantImageUrl !== null &&
            v.restaurantData.restaurantImageUrl.length > 1
          ) {
            const deleteImageUrl = v.restaurantData.restaurantImageUrl;

            const isDeleted = await deleteFile(deleteImageUrl!);

            if (isDeleted) {
              console.log("이미지 삭제 성공");
            }
          }

          updateByRemoveMarker(v.maker);
          makers = makers.filter((v) => v.restaurantData.id !== id);
          // 웹소켓 전달
          webSocket.removeMaker({
            uuid,
            restaurantId: id,
          });
          console.log(makers);
          isViewActive.value = false;
          isLoding.value = false;

          return false;
        }
        return true;
      });
    };

    // 레스토랑 필터
    const isActiveFilterSearch = ref(false);
    const selectedText = ref("");

    const selectedFilter = [
      { type: EnumFilter.RestaurantName },
      { type: EnumFilter.HashTag },
      { type: EnumFilter.Specialization },
      { type: EnumFilter.Location },
    ];

    const filterResult = reactive({
      filterName: "",
      fillterArry: [] as (RestaurantInfoDto | undefined)[],
    });

    const goRestaurantPostionById = (id: number) => {
      const maker = makers.filter((v) => v.restaurantData.id === +id)[0].maker;

      const makerPosition = maker.getPosition();

      naverMaps.mapCenterZoom(makerPosition, { number: 15, effect: false });
      activeMakerinfoWindow(maker);

      isActiveFilterSearch.value = false;
    };

    const updateFilterInfo = () => {
      filterResult.fillterArry = makers.map((v) => v.restaurantData);
    };

    const updateFilterResult = () => {
      if (!selectedText.value) return;

      if (filterResult.filterName === "") {
        // 입력된 값이 없으면 모든값 얻기
        filterResult.fillterArry = makers.map((v) => v.restaurantData);
        return;
      }

      switch (selectedText.value) {
        case EnumFilter.RestaurantName:
          return FilterBySelectedText("restaurantName");
        case EnumFilter.HashTag:
          return FilterBySelectedText("hashTags");
        case EnumFilter.Specialization:
          return FilterBySelectedText("specialization");
        case EnumFilter.Location:
          return FilterBySelectedText("location");
        default:
          console.log("나무지값");
          break;
      }
    };

    const FilterBySelectedText = (
      type: "restaurantName" | "hashTags" | "specialization" | "location"
    ) => {
      filterResult.fillterArry = makers
        .filter((v) =>
          typeof v.restaurantData[type] === "object"
            ? (v.restaurantData[type] as Array<string>).find((v) =>
                v.includes(filterResult.filterName)
              )
            : v.restaurantData[type].includes(filterResult.filterName)
        )
        .map((v) => v.restaurantData);
    };

    watch([selectedText, () => filterResult.filterName], () => {
      updateFilterResult();
    });

    // 마운트
    onMounted(async () => {
      isLoding.value = true;

      await roomInit();
      webSocket.joinRoom(uuid);
      webSocket.catchUpdateRoom((uuid) => {
        onEditRoom(uuid, true);
      });

      webSocket.catchUpdateRestaurant(({ uuid: updateUUID, restaurant }) => {
        updateRestaurant(updateUUID, restaurant);
      });

      webSocket.catchReqApprovaWait(async () => {
        const { ApprovalWaitUsers } = await getRoomInfo({ uuid });

        ApprovalWaitUserLists.value = ApprovalWaitUsers;
      });
      // 이름 변경 할까 말까
      // 레스토랑 생성
      webSocket.catchCreateMaker(async (restaurant) => {
        const maker = naverMaps.renderMarker({
          x: restaurant.lating.x,
          y: restaurant.lating.y,
        });

        markerCommonEvent(maker);
        makers.push({ maker, restaurantData: restaurant });
      });
      // 이름 변경 할까 말까
      // 레스토랑 삭제
      webSocket.catchRemoveMaker((restaurantId) => {
        makers = makers.filter((v) => {
          const isRemove = v.restaurantData.id === restaurantId;
          if (isRemove) {
            updateByRemoveMarker(v.maker);
          }
          return isRemove;
        });
      });

      isLoding.value = false;
      // console.log("maksers", makers);
    });

    onUnmounted(() => {
      webSocket.leaveRoom(uuid);
    });

    // 방들어 올때 초기설정
    const roomInit = async () => {
      const { ok, roomInfo, users, RestaurantInfo, ApprovalWaitUsers } =
        await getRoomInfo({
          uuid,
        });

      // console.log(roomInfo);
      // console.log(users);
      // console.log(RestaurantInfo);
      // console.log(ApprovalWaitUsers);

      roomInfoData.value = roomInfo;
      ApprovalWaitUserLists.value = ApprovalWaitUsers;

      if (roomInfo.superUserInfo.username === store.state.userName) {
        isSpuerUser.value = true;
      }

      naverMaps = new CustomNaverMaps(
        mapRef,
        new naver.maps.LatLng(
          roomInfoData.value!.lating.x,
          roomInfoData.value!.lating.y
        )
      );

      // 방 초기 줌 위치 마커
      naverMaps.renderMainMarker({
        lat: roomInfoData.value!.lating.y,
        lng: roomInfoData.value!.lating.x,
      });

      RestaurantInfo.forEach((v) => {
        const maker = naverMaps.renderMarker({
          x: v.lating.x,
          y: v.lating.y,
        });
        markerCommonEvent(maker);
        makers.push({ maker, restaurantData: v });
      });

      // 마커 클릭(추가) 리스너 ( 폼에 보낼 데이터 설정 )
      // 지도에서 빈곳 클릭시 레스토랑 챗 addFrom Active
      naver.maps.Event.addListener(naverMaps.map, "click", (e) => {
        if (!isActiveAdd.value) return;
        isAddFormActive.value = true;

        refCompoAddForm.value?.setOpenData({
          uuid: route.params.uuid as string,
          map: naverMaps.map,
          position: e.coord,
        });
      });
      naver.maps.Event.addListener(naverMaps.map, "drag", () => {
        makerInfoWindow.close();
        closeViewRestaurantInfo();
      });

      updateFilterInfo();
    };

    return {
      mapRef,
      refCompoViewForm,
      refCompoAddForm,
      isLoding,
      isAddFormActive,
      isSpuerUser,

      isActiveApprovalWait,
      ApprovalWaitUserLists,
      updateApprovaWatiUsers,

      createMaker,
      router,
      route,
      onLeaveRoom,
      onDeleteRoom,
      isViewActive,

      isEditRoomAcitve,
      refCompoEditRoom,
      onEditRoom,
      openEditRoom,

      onDeleteRestaurnt,
      onUpdateRestaurant,
      ...toRefs(filterResult),
      selectedText,
      selectedFilter,

      roomInfoData,
      isOpenRestaurantInfo,
      RestaurantInfoData,
      onClickViewRestrauntInfo,

      isActiveAdd,

      isActiveFilterSearch,
      goRestaurantPostionById,

      isOptionsCheckd,

      consoleTest,
      webSocket,
    };
  },
});
</script>

<style lang="scss"></style>
