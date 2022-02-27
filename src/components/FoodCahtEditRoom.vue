<template>
  <div
    class="fixed bg-gray-600 inset-0 w-screen h-screen text-2xl sm:text-base"
    style="z-index: 1001"
  >
    <div
      class="relative overflow-auto max-w-5xl p-2 h-full bg-yellow-100 inset-0 sm:w-11/12 sm:h-5/6 sm:mx-auto sm:my-12 sm:rounded-xl sm:overflow-y-auto sm:p-4"
    >
      <button class="float-right mr-8 mt-4" @click.prevent="$emit('close')">
        X
      </button>

      <form class="text-center py-20">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend>방 설정 변경</legend>
          <div class="pt-4">
            <div class="flex justify-between items-center">
              <label>방 이름 :</label>
              <input class="flex-1 w-1/2" type="text" v-model="roomName" />
            </div>
            <div class="flex flex-col items-center">
              <p>마크</p>
              <div class="w-20 h-20 bg-purple-500"></div>
            </div>

            <div class="flex justify-between items-center flex-col">
              <label>시작 지역</label>
              <div ref="mapRef" class="w-full h-96 mx-auto"></div>
            </div>
            <LodingBtn
              :isLoading="isLoadingChange"
              Msg="변경"
              :size="30"
              class="mt-4 w-40 h-14"
              @click.prevent="onChangeRoom"
              role="change"
            />
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import LodingBtn from "@/components/common/Input/LoadingBtn.vue";
import { EditRoomInPutDto, Lating, RoominfoDto } from "@/assets/swagger";
import { useRoute } from "vue-router";
import { editRoom } from "@/api/Room";

export default defineComponent({
  emits: ["close", "edit"],
  components: { LodingBtn },
  setup(_, { emit }) {
    const uuid = useRoute().params.uuid as string;

    let map: naver.maps.Map;
    let marker: naver.maps.Marker;

    const mapRef = ref();

    const dataInfo = reactive({
      roomName: "",
    });

    const isLoadingChange = ref(false);

    const onChangeRoom = async () => {
      let lating = undefined;
      if (marker) {
        lating = marker.getPosition();
      }
      const updateData = {
        uuid,
        roomName: dataInfo.roomName,
        ...(lating && { lating }),
      } as EditRoomInPutDto;

      const { ok, err } = await editRoom(updateData);
      if (ok) {
        // edit
        emit("edit", uuid);
      } else {
        console.log(err);
      }
    };

    const setRoomInfo = (data: RoominfoDto) => {
      if (data) {
        dataInfo.roomName = data.roomName!;
      }
      if (data.lating) {
        if (marker) {
          marker.onRemove();
        }
        marker = new naver.maps.Marker({
          position: data.lating,
          map,
        });
        map.setCenter(data.lating);
      }
    };

    onMounted(() => {
      const mapOptions = {
        center: new naver.maps.LatLng(37.4592758, 126.6838396),
        zoom: 15,
        // 지도 줌 컨트롤러
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: true,
        minZoom: 6,
        //
      } as naver.maps.MapOptions;

      map = new naver.maps.Map(mapRef.value, mapOptions);

      naver.maps.Event.addListener(map, "click", (e) => {
        if (marker) {
          marker.onRemove();
        }

        marker = new naver.maps.Marker({
          position: e.coord,
          map,
        });
      });
    });

    return {
      mapRef,
      isLoadingChange,
      onChangeRoom,
      ...toRefs(dataInfo),
      setRoomInfo,
    };
  },
});
</script>

<style scoped></style>
