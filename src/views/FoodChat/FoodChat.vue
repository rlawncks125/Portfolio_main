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
  />

  <div>음식점 리스트 필터 ( 태그 , 지역 , 등등등)</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref, toRefs } from "vue";
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
import { deleteRestaurant } from "@/api/Restaurant";
import { useStore } from "@/store/index";

interface IFormPushData {
  map?: naver.maps.Map;
  position?: naver.maps.Coord;
  uuid: string;
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
    const isLoding = ref(false);
    const isSpuerUser = ref(false);
    const uuid = route.params.uuid as string;

    let map = ref<naver.maps.Map>();
    let makers: Array<{
      maker: naver.maps.Marker;
      restaurantData: RestaurantInfoDto;
    }> = [];

    const makerInfoWindow = new naver.maps.InfoWindow({ content: "" });

    // form
    const isFromActive = ref<boolean>(false);
    const formPushData = reactive<IFormPushData>({
      map: map.value,
      position: {} as naver.maps.Coord,
      uuid,
    });
    // view
    const isViewActive = ref<boolean>(false);
    const viewPushData = ref({} as RestaurantInfoDto);

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

    const makerCommonEvent = (maker: naver.maps.Marker) => {
      maker.addListener("dblclick", () => {
        // 방법 1 ) 레스토랑 값 찾아서 view에 보낼 데이터 변경
        const restaurantId = makers.filter((v) => v.maker === maker)[0]
          .restaurantData.id;

        console.log(restaurantId);
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
          <p class="font-mono">레스토랑 id :${restaurant.id}</p>
          <p>레스토랑 이름 :${restaurant.restaurantName}</p>
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

      makerCommonEvent(maker);

      makers.push({ maker, restaurantData: restaurant });

      console.log(makers);
    };

    const onDeleteRestaurnt = (id: number) => {
      if (!window.confirm("삭제 하실겁니까??")) return;

      makers = makers.filter(async (v) => {
        if (v.restaurantData.id === id) {
          const { ok, err } = await deleteRestaurant(v.restaurantData.id);

          if (!ok) {
            console.log(err);
            return true;
          }

          v.maker.onRemove();
          isViewActive.value = false;
          makerInfoWindow.close();
          return false;
        }
        return true;
      });
    };

    onMounted(async () => {
      isLoding.value = true;
      const { ok, roomInfo, users, RestaurantInfo } = await getRoomInfo({
        uuid: route.params.uuid as string,
      });
      // console.log(roomInfo);
      // console.log(users);
      // console.log(RestaurantInfo);

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
        makerCommonEvent(maker);
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
    });

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
    };
  },
});
</script>

<style></style>
