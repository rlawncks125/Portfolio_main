<template>
  <loding :isLoding="isLoding" />
  <div class="flex gap-2">
    <span class="text-red-800" v-if="isSpuerUser">방 주인입니다.</span>
    <button v-if="isSpuerUser" @click="onDeleteRoom">방 삭제하기</button>
  </div>
  <div class="flex justify-between">
    <button @click="onLeaveRoom">방 나가기</button>
    <button @click.prevent="router.push('/foodChat')">방으로 돌아가기</button>
  </div>

  <div id="map" class="w-full h-full mx-auto"></div>
  <transition name="ani-fade">
    <foot-chat-add-form
      v-show="isAddFromActive"
      ref="refCompoAddForm"
      @closeAddForm="() => (isAddFromActive = false)"
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

  <!-- 밑에 상단에 서치 버튼 추가  -->
  <div class="absolute bottom-0 right-4">
    <transition name="acodi">
      <div
        class="overflow-hidden mb-2 flex flex-col gap-1"
        v-show="isOptionsCheckd"
      >
        <!-- 방 설정 버튼 -->
        <div
          class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-gray-500 bg-opacity-50 sm:hidden"
          @click="consoleTest('방설정')"
        >
          <fa-icon :icon="['fa', 'gear']" class="text-white" />
        </div>
        <!-- 서치 버튼 -->
        <div
          class="w-16 h-16 rounded-full flex flex-col justify-center text-center cursor-pointer bg-gray-500 bg-opacity-50"
          @click="onClickFilterBtn"
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
      <fa-icon v-else :icon="['fa', 'angle-up']" class="text-white" size="2x" />
    </label>
    <input
      class="hidden"
      type="checkbox"
      id="option"
      v-model="isOptionsCheckd"
    />
  </div>

  <!-- 서치 버튼 클릭시 보여주기 -->
  <!-- form?  -->
  <!-- 클릭시 마커로 이동  -->

  <!-- 필터 임시 구현 -->
  <!-- <div>음식점 리스트 필터 ( 태그 , 지역 , 등등등)</div>

  <select v-model="selectedText">
    <option class="hidden" disabled value="">필터할 종류</option>
    <template v-for="item in selectedFilter" :key="item.id">
      <option>
        {{ item.type }}
      </option>
    </template>
  </select>

  <label for=""> :</label>
  <input
    type="text"
    @input="
      (e) => {
        filterName = e.target.value;
      }
    "
    :value="filterName"
  />
  <br /> -->

  <!-- 필터 결과값 -->
  <!-- {{ fillterArry }} -->

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
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import FootChatAddForm from "@/components/FoodChatAddForm.vue";
import FootChatViewForm from "@/components/FoodChatViewForm.vue";
import MyPage from "@/views/FoodChat/MyPage.vue";
import MyRooms from "@/views/FoodChat/MyRoomList.vue";
import SearchRoom from "@/views/FoodChat/SearchRoomList.vue";
import { useRoute, useRouter } from "vue-router";
import {
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
    const makerInfoWindow = new naver.maps.InfoWindow({ content: "" });

    // 마커 & 레스토랑 데이터
    let makers: Array<{
      maker: naver.maps.Marker;
      restaurantData: RestaurantInfoDto;
    }> = [];

    // addform
    const isAddFromActive = ref<boolean>(false);
    const isActiveAdd = ref(false);
    const refCompoAddForm = ref<InstanceType<typeof FootChatAddForm>>();

    // view Form
    const isViewActive = ref<boolean>(false);
    const refCompoViewForm = ref<InstanceType<typeof FootChatViewForm>>();

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

    // 레스토랑 필터
    const selectedText = ref("");

    const selectedFilter = [
      { type: EnumFilter.RestaurantName },
      { type: EnumFilter.HashTag },
      { type: EnumFilter.Specialization },
      { type: EnumFilter.Location },
    ];

    const filterResult = reactive({
      filterName: "",
      fillterArry: [] as (string | undefined)[],
    });

    const onClickFilterBtn = () => {
      console.log("필터 진행");
    };

    // 마커 이벤트
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
      isAddFromActive.value = false;

      console.log("createMaker", restaurant);

      if (!restaurant) return;

      markerCommonEvent(maker);

      makers.push({ maker, restaurantData: restaurant });

      console.log(makers);
      isActiveAdd.value = false;
      updateFilterInfo();
    };

    // CRUD
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

    const onUpdateRestaurant = async (id: number) => {
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

        // 보고있는 view 값 갱신
        if (refCompoViewForm.value?.viewData.id === id) {
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

          v.maker.onRemove();
          makerInfoWindow.close();
          makers = makers.filter((v) => v.restaurantData.id !== id);
          console.log(makers);
          updateFilterInfo();
          closeViewRestaurantInfo();
          isViewActive.value = false;
          isLoding.value = false;

          return false;
        }
        return true;
      });
    };

    // 필터 처리
    watch([selectedText, () => filterResult.filterName], () => {
      updateFilterResult();
    });

    const updateFilterInfo = () => {
      filterResult.fillterArry = makers.map(
        (v) => v.restaurantData.restaurantName
      );
    };

    const updateFilterResult = () => {
      if (!selectedText.value) return;

      if (filterResult.filterName === "") {
        filterResult.fillterArry = makers.map(
          (v) => v.restaurantData.restaurantName
        );
        console.log("모든값");
        return;
      }

      switch (selectedText.value) {
        case EnumFilter.RestaurantName:
          console.log(EnumFilter.RestaurantName);
          filterResult.fillterArry = makers
            .filter((v) =>
              v.restaurantData.restaurantName.includes(filterResult.filterName)
            )
            .map((v) => v.restaurantData.restaurantName);

          break;
        case EnumFilter.HashTag:
          console.log(EnumFilter.HashTag);

          filterResult.fillterArry = makers
            .filter((v) =>
              v.restaurantData.hashTags.includes(`#${filterResult.filterName}`)
            )
            .map((v) => v.restaurantData.restaurantName);

          break;
        case EnumFilter.Specialization:
          console.log(EnumFilter.Specialization);
          filterResult.fillterArry = makers
            .filter((v) =>
              v.restaurantData.specialization.includes(filterResult.filterName)
            )
            .map((v) => v.restaurantData.restaurantName);
          break;
        case EnumFilter.Location:
          console.log(EnumFilter.Location);
          filterResult.fillterArry = makers
            .filter((v) =>
              v.restaurantData.location.includes(filterResult.filterName)
            )
            .map((v) => v.restaurantData.restaurantName);
          break;
        default:
          console.log("나무지값");
          break;
      }
    };

    onMounted(async () => {
      isLoding.value = true;
      const { ok, roomInfo, users, RestaurantInfo } = await getRoomInfo({
        uuid: route.params.uuid as string,
      });
      roomInfoData.value = roomInfo;

      console.log(roomInfo);
      // console.log(users);
      console.log(RestaurantInfo);

      if (roomInfo.superUserInfo.username === store.state.userName) {
        isSpuerUser.value = true;
      }

      // const { ok: superRoomOk, myRooms } = await getMySuperRooms();
      // if (superRoomOk) {
      //   const findUser = myRooms.find((v) => v.uuid === uuid);
      //   if (findUser) {
      //     isSpuerUser.value = true;
      //   }
      // }

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
      new naver.maps.Marker({
        position: {
          x: roomInfo.lating.x,
          y: roomInfo.lating.y,
        },
        map: map.value,
        icon: {
          url: "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1644527647/back-Portfolio/Company_building_free_icon_4_sd6q06.png",
          size: new naver.maps.Size(50, 50),
        },
        clickable: false,
      });

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
        isAddFromActive.value = true;

        refCompoAddForm.value?.setOpenData({
          uuid: route.params.uuid as string,
          map: map.value,
          position: e.coord,
        });
      });
      isLoding.value = false;
      console.log("maksers", makers);

      updateFilterInfo();
    });

    return {
      refCompoViewForm,
      refCompoAddForm,
      isLoding,
      isAddFromActive,
      isSpuerUser,

      createMaker,
      router,
      route,
      onLeaveRoom,
      onDeleteRoom,
      isViewActive,

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

      onClickFilterBtn,

      isOptionsCheckd,
      isSideBarActive,
      sideBarClickedText,
      sideBarInfo,

      consoleTest,
    };
  },
});
</script>

<style></style>
