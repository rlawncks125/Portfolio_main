<template>
  <div>음식 채팅 방</div>
  <div id="map" style="width: 90%; height: 400px; margin: auto"></div>
  <div v-if="isFromActive">
    추가 정보 폼
    <p>{{ formPushData.position }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

interface IFormPushData {
  map?: naver.maps.Map;
  position?: naver.maps.Coord;
}
export default defineComponent({
  setup() {
    let map = ref<naver.maps.Map>();
    let makers: Array<any> = [];
    const isFromActive = ref<boolean>(false);
    const formPushData = reactive<IFormPushData>({
      map: map.value,
      position: {} as naver.maps.Coord,
    });

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

      // 마커 추가
      naver.maps.Event.addListener(map.value, "click", (e) => {
        isFromActive.value = true;
        formPushData.map = map.value;
        formPushData.position = e.coord;

        const maker = new naver.maps.Marker({
          position: e.coord,
          map: map.value,
        });
        // 더블 클릭시 마커 삭제 이벤트 리스너
        maker.addListener("dblclick", () => {
          const isTrue = prompt("삭제할거에요? ( '네' 라고 입력하세요 )");
          if (isTrue !== "네") return;

          makers = makers.filter((v) => {
            if (v.position === maker.getPosition()) {
              return false;
            }
            return true;
          });

          maker.onRemove();
        });

        makers.push(maker);
        console.log(makers);
      });
    });

    return { isFromActive, formPushData };
  },
});
</script>

<style></style>
