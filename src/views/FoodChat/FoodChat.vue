<template>
  <loding :isLoding="isLoding" />
  <div class="flex justify-between">
    <p>{{ formPushData.uuid }} 방</p>
    <button @click.prevent="router.go(-1)">방으로 돌아가기</button>
  </div>
  <div id="map" class="w-11/12 h-96 mx-auto"></div>
  <foot-chat-add-form
    v-show="isFromActive"
    :formPushData="formPushData"
    @closeForm="closeForm"
    @createMaker="createMaker"
  />
  <div>음식점 리스트 필터 ( 태그 , 지역 , 등등등)</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref, toRefs } from "vue";
import FootChatAddForm from "@/components/FoodChatAddForm.vue";
import { useRoute, useRouter } from "vue-router";
import { CreateRestaurantOutPutDto, Restaurant } from "@/assets/swagger";
import { getRoomInfo } from "@/api/Room";
import { deleteRestaurant } from "@/api/Restaurant";

interface IFormPushData {
  map?: naver.maps.Map;
  position?: naver.maps.Coord;
  uuid: string;
}
export default defineComponent({
  components: { FootChatAddForm },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isLoding = ref(false);

    let map = ref<naver.maps.Map>();

    let makers: Array<any> = [];
    const isFromActive = ref<boolean>(false);
    const formPushData = reactive<IFormPushData>({
      map: map.value,
      position: {} as naver.maps.Coord,
      uuid: route.params.uuid as string,
    });

    const isViewActive = ref<boolean>(false);
    const viewPushData = reactive({} as Restaurant);

    const makerCommonEvent = (maker: naver.maps.Marker) => {
      // 더블 클릭시 마커 삭제 이벤트 리스너
      // - 채팅창으로 오픈 작업하기
      // - filter로 더블클릭한 마커 정보 가져오기
      // - food-chat-view 컴포넌트 만들어서 정보 바인드
      maker.addListener("dblclick", () => {
        const isTrue = prompt("삭제할거에요? ( '네' 라고 입력하세요 )");
        if (isTrue !== "네") return;

        makers = makers.filter(async (v) => {
          if (v.maker.position === maker.getPosition()) {
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
      console.log(roomInfo);
      console.log(users);
      console.log(RestaurantInfo);

      const mapOptions = {
        center: new naver.maps.LatLng(roomInfo.lating.Y, roomInfo.lating.X),
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
            x: v.lating.X,
            y: v.lating.Y,
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
    });

    return {
      isLoding,
      isFromActive,
      formPushData,
      closeForm,
      createMaker,
      router,
    };
  },
});
</script>

<style></style>
