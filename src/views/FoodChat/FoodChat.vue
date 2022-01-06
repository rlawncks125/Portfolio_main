<template>
  <div class="flex justify-between">
    <p>{{ formPushData.uuid }} 방</p>
    <button @click.prevent="router.go(-1)">방으로 돌아가기</button>
  </div>
  <div id="map" style="width: 90%; height: 400px; margin: auto"></div>
  <foot-chat-add-form
    v-show="isFromActive"
    :formPushData="formPushData"
    @closeForm="closeForm"
    @createMaker="createMaker"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref, toRefs } from "vue";
import FootChatAddForm from "@/components/FoodChatAddForm.vue";
import { useRoute, useRouter } from "vue-router";

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

    let map = ref<naver.maps.Map>();

    let makers: Array<any> = [];
    const isFromActive = ref<boolean>(false);
    const formPushData = reactive<IFormPushData>({
      map: map.value,
      position: {} as naver.maps.Coord,
      uuid: route.params.uuid as string,
    });

    const closeForm = () => {
      isFromActive.value = false;
    };

    const createMaker = ({
      maker,
      resturantData,
    }: {
      maker: naver.maps.Marker;
      resturantData: any;
    }) => {
      isFromActive.value = false;
      // 더블 클릭시 마커 삭제 이벤트 리스너
      // - 채팅창으로 오픈 작업하기
      maker.addListener("dblclick", () => {
        const isTrue = prompt("삭제할거에요? ( '네' 라고 입력하세요 )");
        if (isTrue !== "네") return;

        makers = makers.filter((v) => {
          if (v.maker.position === maker.getPosition()) {
            return false;
          }
          return true;
        });

        maker.onRemove();
      });

      makers.push({ maker, resturantData });
      console.log(makers);
    };

    onMounted(() => {
      const mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10,
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

      // 마커 클릭(추가) 리스너 ( 폼에 보낼 데이터 설정 )
      naver.maps.Event.addListener(map.value, "click", (e) => {
        isFromActive.value = true;
        formPushData.map = map.value;
        formPushData.position = e.coord;
      });
    });

    return { isFromActive, formPushData, closeForm, createMaker, router };
  },
});
</script>

<style></style>
