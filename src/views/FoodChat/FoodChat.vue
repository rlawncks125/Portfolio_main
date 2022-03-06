<template>
  <loding :isLoding="isLoding" />
  <div class="flex gap-2">
    <span class="text-red-800" v-if="isSpuerUser">방 주인입니다.</span>
    <button @click="isActiveApprovalWait = true" v-if="isSpuerUser">
      신청 대기 유저
    </button>
    <button v-if="isSpuerUser" @click="onDeleteRoom">방 삭제하기</button>
  </div>
  <div class="flex justify-between">
    <button @click="onLeaveRoom">방 나가기</button>
    <button @click.prevent="router.push('/foodChat')">방으로 돌아가기</button>
  </div>

  <!-- 맵 -->
  <div id="map" class="w-full h-full mx-auto relative">
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
            @click="openEditRoom"
          >
            <fa-icon :icon="['fa', 'gear']" class="text-white" />
          </div>
          <!-- 서치 버튼 -->
          <div
            class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-opacity-50"
            :class="isActiveFilterSearch ? 'bg-red-400' : 'bg-gray-500'"
            @click="isActiveFilterSearch = !isActiveFilterSearch"
          >
            <fa-icon :icon="['fa', 'magnifying-glass']" class="text-white" />
          </div>
          <!-- 레스토랑 추가 & 취소 버튼 -->
          <div
            class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-gray-500 bg-opacity-50"
            @click="isActiveAdd = !isActiveAdd"
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
  <!-- 현재 접속 중인방  -->
  <div
    class="absolute top-20 w-full flex justify-center text-center pointer-events-none"
  >
    <div>
      <p v-if="roomInfoData">{{ roomInfoData.roomName }} 방</p>
      <p class="text-red-400" v-show="isActiveAdd">생성 할곳을 클릭하세요</p>
    </div>
  </div>

  <!-- 레스토랑 정보 창 -->
  <div
    v-show="isOpenRestaurantInfo"
    class="absolute bottom-0 w-full flex justify-center"
  >
    <div
      class="bg-slate-100 w-4/6 max-w-3xl h-32 text-center rounded-xl flex flex-col justify-center cursor-pointer shadow-lg shadow-black/40 hover:scale-110"
      @click="onClickViewRestrauntInfo"
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
  <div
    v-show="isActiveFilterSearch"
    class="fixed inset-0 bg-gray-500"
    style="z-index: 102"
  >
    <div
      class="overflow-hidden m-4 bg-white border-2 border-gray-500 border-opacity-50 px-2 rounded-2xl"
      style="height: 90%"
    >
      <div
        class="flex justify-between items-center px-2 border-b-2 border-b-gray-500 border-opacity-50"
      >
        <div
          class="cursor-pointer px-2"
          @click="isActiveFilterSearch = !isActiveFilterSearch"
        >
          이전
        </div>
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
        <LoadingBtn Msg="검색" :isLoading="false" :size="20" class="h-10" />
      </div>

      <select v-model="selectedText">
        <option class="hidden" disabled value="">필터할 종류</option>
        <template v-for="item in selectedFilter" :key="item.id">
          <option>
            {{ item.type }}
          </option>
        </template>
      </select>

      <!-- 필터 결과 랜더 -->
      <div class="overflow-auto h-full pb-32">
        <div
          v-for="restaurant in fillterArry"
          class="my-4 cursor-pointer flex flex-col gap-2"
          :key="restaurant.id"
          @click.prevent="goRestaurantPostionById(restaurant.id)"
        >
          <picture>
            <img
              v-if="restaurant.restaurantImageUrl"
              :src="restaurant.restaurantImageUrl"
              alt=""
              class="rounded-2xl h-60 w-full bg-contain bg-center"
            />
            <img
              v-else
              src="https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg"
              alt=""
              class="rounded-2xl h-60 w-full bg-contain bg-center"
            />
          </picture>
          <div class="flex gap-2 flex-warp">
            <template
              v-for="specialization in restaurant.specialization"
              :key="specialization.id"
            >
              <p class="bg-amber-300 text-white px-2">{{ specialization }}</p>
            </template>
            <template v-for="hash in restaurant.hashTags" :key="hash.id">
              <p class="bg-sky-300 text-white px-2">{{ hash }}</p>
            </template>
          </div>
          <StarFiil
            class="float-right"
            :fill="restaurant.avgStar"
            :starNum="5"
            :starSize="1"
          />
          <h2 class="font-bold text-3xl">{{ restaurant.restaurantName }}</h2>
        </div>
      </div>
    </div>
  </div>

  <!-- 사이드바 -->
  <!-- sm 이상 사이드바 -->
  <div
    class="hidden sm:flex w-20 h-full fixed left-0 px-2 flex-col text-center inset-y-0 transition-all whitespace-nowrap bg-gray-400 shadow-lg shadow-slate-500"
    style="z-index: 101"
  >
    <!-- 아이콘 & 클릭 트리거 -->
    <div
      class="flex h-full flex-col justify-start gap-12 pt-40 overflow-hidden"
    >
      <div v-for="item in sideBarInfo" :key="item.id">
        <div
          class="cursor-pointer h-16 mx-auto w-full"
          @click="
            () => {
              isSideBarActive = true;
              sideBarClickedText = item.eventTrigger;
            }
          "
        >
          <div class="flex flex-col">
            <fa-icon
              :icon="['fa', item.faIcon]"
              :size="item.faSize"
              :class="
                sideBarClickedText === item.eventTrigger
                  ? 'text-yellow-500'
                  : ''
              "
            />
            <p class="inline text-base">{{ item.text }}</p>
          </div>
        </div>
      </div>
      <!-- 정보창 랜더 없는 아이콘 & 클릭 트리거 -->
      <div @click="isActiveApprovalWait = true" class="cursor-pointer">
        <fa-icon :icon="['fa', 'users']" size="2x" />
        <p class="text-base">승인 요청</p>
      </div>
    </div>
  </div>
  <!-- 사이드바 정보창 -->
  <div
    class="hidden sm:flex h-full fixed left-20 flex-col inset-y-0 transition-all bg-white shadow-lg shadow-slate-500"
    :class="isSideBarActive ? 'w-96' : 'w-0'"
    style="z-index: 101"
  >
    <!-- 화살표 -->
    <div
      class="absolute w-10 h-10 bottom-2/4 bg-teal-600 cursor-pointer transition-all"
      :class="isSideBarActive ? 'left-96' : 'left-0'"
      @click="
        () => {
          isSideBarActive = !isSideBarActive;
          sideBarClickedText = '';
        }
      "
    >
      <p v-if="!isSideBarActive">화</p>
      <p v-else>수</p>
    </div>
    <!-- 콘텐츠 랜더 -->
    <div class="overflow-auto h-full">
      <div v-for="item in sideBarInfo" :key="item.id">
        <div
          class="w-full px-2"
          v-show="sideBarClickedText === item.eventTrigger"
        >
          <component :is="item.renderCompo" />
          <!-- <MyRooms class="w-full" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
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
import MyPage from "@/views/FoodChat/MyPage.vue";
import MyRooms from "@/views/FoodChat/MyRoomList.vue";
import SearchRoom from "@/views/FoodChat/SearchRoomList.vue";
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
import { deleteRestaurant, getRestaurantById } from "@/api/Restaurant";
import { useStore } from "@/store/index";
import axios from "axios";
import * as webSocket from "@/api/Socket";

enum EnumFilter {
  RestaurantName = "레스토랑 이름",
  HashTag = "해시태그",
  Specialization = "전문 분야",
  Location = "지역",
}

interface ISaideBar {
  eventTrigger: string;
  faIcon: string;
  faSize: string;
  text: string;
  renderCompo: Component;
}

export default defineComponent({
  components: {
    FootChatAddForm,
    FootChatViewForm,
    ApprovaWaitView,
    EditRoom,
    StarFiil,
    LoadingBtn,
    MyPage,
    MyRooms,
    SearchRoom,
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
    let map = ref<naver.maps.Map>();

    // 마커 & 레스토랑 데이터
    const makerInfoWindow = new naver.maps.InfoWindow({ content: "" });
    let mainMarker: naver.maps.Marker;
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

    // 사이드바
    const isSideBarActive = ref(false);
    const sideBarClickedText = ref("");

    const sideBarInfo = [
      {
        eventTrigger: "room",
        faIcon: "house",
        faSize: "2x",
        text: "내 방들",
        renderCompo: MyRooms,
      },
      {
        eventTrigger: "search",
        faIcon: "magnifying-glass",
        faSize: "2x",
        text: "방 찾기",
        renderCompo: SearchRoom,
      },
      {
        eventTrigger: "myPage",
        faIcon: "users",
        faSize: "2x",
        text: "내 정보창",
        renderCompo: MyPage,
      },
    ] as ISaideBar[];

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

    const rednerMainMarker = () => {
      mainMarker = new naver.maps.Marker({
        position: {
          x: roomInfoData.value!.lating.x,
          y: roomInfoData.value!.lating.y,
        },
        map: map.value,
        icon: {
          url: "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1644527647/back-Portfolio/Company_building_free_icon_4_sd6q06.png",
          size: new naver.maps.Size(50, 50),
        },
        clickable: false,
      });
    };

    const markerCommonEvent = (maker: naver.maps.Marker) => {
      maker.addListener("click", () => {
        if (makerInfoWindow.getMap()) {
          makerInfoWindow.close();
          closeViewRestaurantInfo();
        } else {
          let restaurant = makers.filter((v) => v.maker === maker)[0]
            .restaurantData;

          const infoContent = `
          <p class="font-mono text-xs">레스토랑 id :${restaurant.id}</p>
          <p class="font-mono text-sm">${restaurant.restaurantName}</p>
          <p class="text-xs">${restaurant.resturantSuperUser.nickName} 님이 만들었습니다.</p>
          `;

          makerInfoWindow.setContent(infoContent);

          makerInfoWindow.open(map.value!, maker);
          openViewRestaurantInfo(restaurant);
        }
      });
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
        router.push("/foodChat");
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
        mainMarker.onRemove();
        rednerMainMarker();
        if (!isWebsocket) {
          webSocket.updateRoom(uuid);
        }
      }
    };

    const onUpdateRestaurant = async (id: number, isCallSocket = false) => {
      const { ok, restaurant, err } = await getRestaurantById(id);

      if (ok) {
        makers = makers.map((v) => {
          if (v.restaurantData.id === id) {
            return {
              maker: v.maker,
              restaurantData: restaurant,
            };
          } else {
            return v;
          }
        });

        if (!isCallSocket) {
          webSocket.updateRestaurant({
            uuid,
            restaurantId: id,
          });
        }
        // 보고있는 view 값 갱신
        if (refCompoViewForm.value?.viewData.id === id) {
          openViewRestaurantInfo(restaurant);
          refCompoViewForm.value?.setOpenViewData(restaurant);
        }
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
            const deleteImageUrl = v.restaurantData.restaurantImageUrl
              .split("/")
              .pop()
              ?.split(".")[0];

            const deleteResult = await axios
              .delete(`/api/file/${deleteImageUrl}`)
              .then((res: any) => res.data.deleted);

            if (Object.values(deleteResult).length > 0) {
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

      maker.trigger("click");
      map.value!.setZoom(14, true);
      map.value!.setCenter(makerPosition);

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

      webSocket.catchUpdateRestaurant(({ uuid: getUUID, restaurantId }) => {
        if (getUUID === uuid) {
          onUpdateRestaurant(restaurantId, true);
        }
      });
      webSocket.catchReqApprovaWait(async () => {
        const { ApprovalWaitUsers } = await getRoomInfo({ uuid });

        ApprovalWaitUserLists.value = ApprovalWaitUsers;
      });
      webSocket.catchCreateMaker(async (restaurntId) => {
        const { ok, restaurant } = await getRestaurantById(restaurntId);

        if (ok) {
          const maker = new naver.maps.Marker({
            position: {
              x: restaurant.lating.x,
              y: restaurant.lating.y,
            },
            map: map.value,
          });
          markerCommonEvent(maker);
          makers.push({ maker, restaurantData: restaurant });
        }
      });

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

      const mapOptions = {
        center: new naver.maps.LatLng(roomInfo.lating.y, roomInfo.lating.x),
        zoom: 14,
        // 지도 줌 컨트롤러
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: true,
        minZoom: 6,
        //
      } as naver.maps.MapOptions;

      const mapEl = document.getElementById("map");
      map.value = new naver.maps.Map(mapEl!, mapOptions);

      // 방 초기 줌 위치 마커
      rednerMainMarker();

      RestaurantInfo.forEach((v) => {
        const maker = new naver.maps.Marker({
          position: {
            x: v.lating.x,
            y: v.lating.y,
          },
          map: map.value,
        });
        markerCommonEvent(maker);
        makers.push({ maker, restaurantData: v });
      });

      // 마커 클릭(추가) 리스너 ( 폼에 보낼 데이터 설정 )
      // 지도에서 빈곳 클릭시 레스토랑 챗 addFrom Active
      naver.maps.Event.addListener(map.value, "click", (e) => {
        if (!isActiveAdd.value) return;
        isAddFormActive.value = true;

        refCompoAddForm.value?.setOpenData({
          uuid: route.params.uuid as string,
          map: map.value,
          position: e.coord,
        });
      });
      naver.maps.Event.addListener(map.value, "drag", () => {
        makerInfoWindow.close();
        closeViewRestaurantInfo();
      });

      updateFilterInfo();
    };

    return {
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
      isSideBarActive,
      sideBarClickedText,
      sideBarInfo,

      consoleTest,
      webSocket,
    };
  },
});
</script>

<style></style>
