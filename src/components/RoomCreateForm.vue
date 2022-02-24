<template>
  <div
    class="fixed bg-gray-600 inset-0 w-screen h-screen text-2xl sm:text-base"
    style="z-index: 1001"
  >
    <loding :isLoding="isLoading" />
    <div
      class="relative overflow-auto max-w-5xl p-2 h-full bg-yellow-100 inset-0 sm:w-11/12 sm:h-5/6 sm:mx-auto sm:my-12 sm:rounded-xl sm:overflow-y-auto sm:p-4"
    >
      <button class="float-right mb-2" @click.prevent="onClose">X</button>
      <div ref="mapRef" class="w-full h-96 mx-auto"></div>

      <div class="pt-4">
        <div class="flex justify-between items-center">
          <label>방 이름 :</label>
          <input class="flex-1 w-1/2" type="text" v-model="roomName" />
          <button class="p-1" @click.prevent="onCreateRoom">방 만들기</button>
        </div>

        <div>방 생성시 기본값이 되는 좌표를 마커로 표시해주세요</div>

        <div class="flex justify-between items-center">
          <label>도로명 주소 :</label>
          <input class="flex-1 w-1/2" type="text" v-model="addr" />
          <button class="p-1" @click.prevent="serachAddr">찾기</button>
        </div>

        <div v-for="addr in findAddrs" :key="addr.id">
          <div class="cursor-pointer border mt-1">
            <p @click="onMoveMarkerAddress(addr.x, addr.y)">
              {{ addr.roadAddress }}
            </p>
          </div>
        </div>

        <input-file
          ref="inputFileComponet"
          :isStyleRounded="true"
          class="w-64 h-64 bg-transparent"
          @cahngeFile="(data) => (imageFile = data)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRaw,
  toRefs,
  watch,
} from "vue";
import InputFile, {
  FileDataType,
} from "@/components/common/Input/File-one.vue";
import axios from "axios";
import Loding from "@/components/Loding.vue";
import { createRoom } from "@/api/Room";

export default defineComponent({
  emits: ["onCreated", "onClose"],
  components: { InputFile, Loding },
  setup(props, { emit }) {
    let map: naver.maps.Map;
    let marker: naver.maps.Marker;

    const mapRef = ref();
    const roomName = ref("");
    const addr = ref();
    const findData = reactive({
      findAddrs: [] as naver.maps.Service.AddressItemV2[],
    });

    const isLoading = ref(false);

    // 이미지 처리 관련
    const inputFileComponet = ref<InstanceType<typeof InputFile>>();
    const imageFile = ref<FileDataType>();

    const onCreateRoom = async () => {
      let markeImageUrl = "";

      isLoading.value = true;
      // 이미지 url 작업
      if (imageFile.value?.type === "image") {
        const postForm = new FormData();
        postForm.append("file", imageFile.value.file, imageFile.value.fileName);

        markeImageUrl = await axios
          .post("/api/file", postForm, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => res.data.url);
      }

      const { ok, room } = await createRoom({
        roomName: roomName.value,
        lating: marker.getPosition(),
        markeImageUrl,
      });

      if (ok) {
        inputFileComponet.value?.resetFile();
        emit("onCreated", {
          ok,
          room,
        });
      }

      isLoading.value = false;
    };

    const onClose = () => {
      inputFileComponet.value?.resetFile();
      emit("onClose");
    };

    const serachAddr = async () => {
      if (!addr.value) return;
      naver.maps.Service.geocode(
        {
          query: addr.value,
        },
        (status, response) => {
          if (status === naver.maps.Service.Status.OK) {
            const addresses = response.v2.addresses;

            addresses.length > 0
              ? (findData.findAddrs = addresses)
              : alert("결과값이 없습니다.");
          }
        }
      );
    };

    const onMoveMarkerAddress = (x: number, y: number) => {
      if (marker) {
        marker.onRemove();
      }

      map.setCenter({
        x,
        y,
      });

      marker = new naver.maps.Marker({
        position: {
          x,
          y,
        },
        map,
      });
    };

    onMounted(() => {
      const mapOptions = {
        center: new naver.maps.LatLng(37.4592758, 126.6838396),
        zoom: 11,
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
      isLoading,
      inputFileComponet,
      imageFile,
      serachAddr,
      addr,
      onMoveMarkerAddress,
      ...toRefs(findData),
      onCreateRoom,
      onClose,
      roomName,
      mapRef,
    };
  },
});
</script>

<style></style>
