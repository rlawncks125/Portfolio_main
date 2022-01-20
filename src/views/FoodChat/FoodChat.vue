<template>
  <loding :isLoding="isLoding" />
  <div class="flex gap-2">
    <span class="text-red-800" v-if="isSpuerUser">방 주인입니다.</span>
    <button v-if="isSpuerUser" @click="onDeleteRoom">방 삭제하기</button>
  </div>
  <div class="flex flex-col justify-between">
    <p>{{ formPushData.uuid }} 방</p>
  </div>
  <div class="flex justify-between">
    <button @click="onLeaveRoom">방 나가기</button>
    <button @click.prevent="router.go(-1)">방으로 돌아가기</button>
  </div>

  <div id="map" class="w-11/12 h-96 mx-auto"></div>
  <foot-chat-add-form
    v-show="isFromActive"
    :formPushData="formPushData"
    @closeForm="closeForm"
    @createMaker="createMaker"
  />
  <foot-chat-view-form
    v-show="isViewActive"
    :vieFormData="viewPushData"
    :isRoomSuperUser="isSpuerUser"
    @viewClose="onCloseView"
    @DeleteRestrunt="onDeleteRestaurnt"
    @UpdateRestaurantById="onUpdateRestaurant"
  />

  <!-- 필터 -->
  <div>음식점 리스트 필터 ( 태그 , 지역 , 등등등)</div>

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
  <br />

  <!-- 필터 결과값 -->
  {{ fillterArry }}
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  Ref,
  ref,
  toRefs,
  watch,
} from "vue";
import FootChatAddForm from "@/components/FoodChatAddForm.vue";
import FootChatViewForm from "@/components/FoodChatViewForm.vue";
import { useRoute, useRouter } from "vue-router";
import {
  CreateRestaurantOutPutDto,
  Restaurant,
  RestaurantInfoDto,
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

interface IFormPushData {
  map?: naver.maps.Map;
  position?: naver.maps.Coord;
  uuid: string;
}

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
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const uuid = route.params.uuid as string;
    const isLoding = ref(false);
    const isSpuerUser = ref(false);

    // 네이버 api
    let map = ref<naver.maps.Map>();
    const makerInfoWindow = new naver.maps.InfoWindow({ content: "" });

    let makers: Array<{
      maker: naver.maps.Marker;
      restaurantData: RestaurantInfoDto;
    }> = [];

    // form
    const isFromActive = ref<boolean>(false);
    const formPushData = reactive<IFormPushData>({
      map: map.value,
      position: {} as naver.maps.Coord,
      uuid,
    });
    // view
    const isViewActive = ref<boolean>(false);
    const viewPushData = ref({
      specialization: [] as string[],
      hashTags: [] as string[],
    } as RestaurantInfoDto);
    // 필터
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

    const onLeaveRoom = async () => {
      if (!window.confirm("방을 나가실겁니까?")) return;

      const { ok } = await leaveRoom({ uuid });
      if (ok) {
        router.go(-1);
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

    const markerCommonEvent = (maker: naver.maps.Marker) => {
      maker.addListener("dblclick", () => {
        // 방법 1 ) 레스토랑 값 찾아서 view에 보낼 데이터 변경
        const restaurantId = makers.filter((v) => v.maker === maker)[0]
          .restaurantData.id;

        // const findRestaurantId = 11;

        // viewPushData.value = RestaurantInfo.filter(
        //   (v) => v.id === findRestaurantId
        // )[0];

        viewPushData.value = makers.filter(
          (v) => v.restaurantData.id === restaurantId
        )[0].restaurantData;

        isViewActive.value = true;
      });
      // document.getElementById('')?.addEventListener('mouseleave')
      // 마커 클릭시 레스토랑 정보 보여주기
      maker.addListener("click", () => {
        if (makerInfoWindow.getMap()) {
          makerInfoWindow.close();
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
        }
      });
    };

    const closeForm = () => {
      isFromActive.value = false;
    };
    const onCloseView = () => {
      isViewActive.value = false;
    };

    const createMaker = ({
      maker,
      restaurant,
    }: {
      maker: naver.maps.Marker;
      restaurant: Restaurant;
    }) => {
      isFromActive.value = false;

      console.log("createMaker", restaurant);

      if (!restaurant) return;

      markerCommonEvent(maker);

      makers.push({ maker, restaurantData: restaurant });

      console.log(makers);
      updateFilterInfo();
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
        viewPushData.value = makers.filter(
          (v) => v.restaurantData.id === id
        )[0].restaurantData;
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
          isViewActive.value = false;
          makerInfoWindow.close();
          makers = makers.filter((v) => v.restaurantData.id !== id);
          console.log(makers);
          updateFilterInfo();
          isLoding.value = false;
          return false;
        }
        return true;
      });
    };

    const updateFilterInfo = () => {
      filterResult.fillterArry = makers.map(
        (v) => v.restaurantData.restaurantName
      );
    };

    onMounted(async () => {
      isLoding.value = true;
      const { ok, roomInfo, users, RestaurantInfo } = await getRoomInfo({
        uuid: route.params.uuid as string,
      });
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
      // 지도에서 빈곳 클릭시 레스토랑 챗 생성 폼 Active
      naver.maps.Event.addListener(map.value, "click", (e) => {
        isFromActive.value = true;
        formPushData.map = map.value;
        formPushData.position = e.coord;
      });
      isLoding.value = false;
      console.log("maksers", makers);

      updateFilterInfo();
    });

    watch([selectedText, () => filterResult.filterName], () => {
      updateFilterResult();
    });

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

    return {
      isLoding,
      isFromActive,
      isSpuerUser,
      formPushData,
      closeForm,
      createMaker,
      router,
      onLeaveRoom,
      onDeleteRoom,
      isViewActive,
      viewPushData,
      onCloseView,
      onDeleteRestaurnt,
      onUpdateRestaurant,
      ...toRefs(filterResult),
      selectedText,
      selectedFilter,
    };
  },
});
</script>

<style></style>
