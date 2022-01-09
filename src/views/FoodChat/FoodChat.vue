<template>
  <loding :isLoding="isLoding" />
  <div class="flex gap-2">
    <span v-if="isSpuerUser">방 주인입니다.</span>
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
  <foot-chat-view-form v-show="isViewActive" :vieFormData="viewPushData" />

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
    let makers: Array<any> = [];
    // form
    const isFromActive = ref<boolean>(false);
    const formPushData = reactive<IFormPushData>({
      map: map.value,
      position: {} as naver.maps.Coord,
      uuid,
    });
    // view
    const isViewActive = ref<boolean>(true);
    const viewPushData = reactive({
      id: 15,
      resturantSuperUser: {
        id: 12,
        nickName: "userTest1",
      },
      restaurantName: "adw",
      restaurantImageUrl:
        "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg",
      location: "인천",
      comments: [
        {
          id: 31,
          star: 4,
          message: {
            message: "메시지메시지",
            userInfo: {
              nickName: "유저1",
              role: "User",
            },
          },
          childMessages: [
            {
              userInfo: {
                nickName: "usertest1",
                role: "User",
              },
              message: "zzzz",
            },
            {
              message: "대변경해보아ㄴ요",
              userInfo: {
                nickName: "userTest2",
                role: "User",
              },
            },
          ],
        },
      ],
      avgStar: 4,
      lating: {
        x: 126.7,
        y: 37.4391,
      },
    } as RestaurantInfoDto);

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
      console.log("노삭제");
    };

    const makerCommonEvent = (maker: naver.maps.Marker) => {
      // 더블 클릭시 마커 삭제 이벤트 리스너
      // - 채팅창으로 오픈 작업하기
      // - filter로 더블클릭한 마커 정보 가져오기
      // - food-chat-view 컴포넌트 만들어서 정보 바인드
      maker.addListener("dblclick", () => {
        if (!window.confirm("삭제 하실겁니까??")) return;

        makers = makers.filter(async (v) => {
          if (
            v.restaurantData.lating.x === maker.getPosition().x &&
            v.restaurantData.lating.y === maker.getPosition().y
          ) {
            const { ok, err } = await deleteRestaurant(v.restaurantData.id);

            if (!ok) {
              console.log(err);
              return true;
            }

            maker.onRemove();
            return false;
          }
          return true;
        });
      });
    };

    const closeForm = () => {
      isFromActive.value = false;
    };

    const createMaker = ({
      maker,
      restaurantData,
    }: {
      maker: naver.maps.Marker;
      restaurantData: CreateRestaurantOutPutDto;
    }) => {
      isFromActive.value = false;

      makerCommonEvent(maker);

      makers.push({ maker, restaurantData });

      console.log(makers);
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
    };
  },
});
</script>

<style></style>
