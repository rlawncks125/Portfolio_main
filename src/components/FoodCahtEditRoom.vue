<template>
  <div class="foodChat-form">
    <div
      class="foodChat-form-main"
      style="height: calc(var(--mobile--full) - 2vh)"
    >
      <button class="float-right mr-8 mt-4" @click.prevent="$emit('close')">
        X
      </button>

      <form class="text-center pt-20">
        <fieldset
          class="border-2 p-2 pb-8 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend>방 설정 변경</legend>
          <div class="pt-4 flex flex-col gap-4 items-center">
            <div class="flex flex-col items-center">
              <button @click.prevent="isChangeMake = !isChangeMake">
                마크 이미지 번경 변경
              </button>
              <input-file
                v-show="isChangeMake"
                ref="inputFileComponet"
                class="w-80 h-60"
                @cahngeFile="(data) => (imageFile = data)"
              />
            </div>
            <div class="flex justify-between items-center">
              <label>방 이름 :</label>
              <input class="flex-1 w-1/2" type="text" v-model="roomName" />
            </div>

            <div class="w-full">
              <label>시작 지역 좌표 변경</label>
              <div ref="mapRef" class="w-full h-96 mx-auto"></div>
            </div>
            <LodingBtn
              :isLoading="isLoadingChange"
              :size="30"
              class="mt-4 w-40 h-14"
              @click.prevent="onChangeRoom"
              role="change"
            >
              <p>적용</p>
            </LodingBtn>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import LodingBtn from "@/components/common/Input/LoadingBtn.vue";
import InputFile, {
  FileDataType,
} from "@/components/common/Input/File-one.vue";
import { EditRoomInPutDto, Lating, RoominfoDto } from "@/assets/swagger";
import { useRoute } from "vue-router";
import { editRoom } from "@/api/Room";
import { deleteFile, getImageURLByFormData } from "@/api/file";
import { useStore } from "@/store";
import { CustomNaverMaps } from "@/plugin/naverMaps";

export default defineComponent({
  emits: ["close", "edit"],
  components: { LodingBtn, InputFile },
  setup(_, { emit }) {
    const uuid = useRoute().params.uuid as string;
    const store = useStore();

    // let map: naver.maps.Map;
    let map: CustomNaverMaps;
    let marker: naver.maps.Marker;

    const mapRef = ref();

    const dataForm = reactive({
      roomName: "",
      markeImageUrl: "",
    });
    const roomInfo = computed(() => store.getters["getRoomInfo"]());

    const isLoadingChange = ref(false);

    // input file
    const isChangeMake = ref(false);
    const inputFileComponet = ref<InstanceType<typeof InputFile>>();
    const imageFile = ref<FileDataType>();

    const onChangeRoom = async () => {
      if (!roomInfo.value) {
        alert("제대로된 방정보가 아니다");
        return;
      }

      isLoadingChange.value = true;
      let lating = undefined;
      let imageUrl = undefined;
      if (marker) {
        lating = marker.getPosition();
      }

      if (isChangeMake.value && imageFile.value) {
        // 기존 이미지 삭제후
        // 새 이미지 URL

        const postForm = new FormData();
        postForm.append("file", imageFile.value.file, imageFile.value.fileName);

        // 이미지 url 작업
        imageUrl = await getImageURLByFormData(postForm);

        if (imageUrl && dataForm.markeImageUrl) {
          const isDeleted = await deleteFile(dataForm.markeImageUrl);
          if (isDeleted) {
            console.log("기존 이미지 삭제");
          }
        }
      }

      const updateData = {
        uuid,
        roomName: dataForm.roomName,
        ...(imageUrl && { markeImageUrl: imageUrl }),
        ...(lating && { lating }),
      } as EditRoomInPutDto;

      const { ok, err } = await editRoom(updateData);

      isLoadingChange.value = false;
      if (ok) {
        // edit
        emit("edit", uuid);
      } else {
        console.log(err);
      }
    };

    const setRoomInfo = () => {
      inputFileComponet.value?.resetFile();

      if (!roomInfo.value) return;

      dataForm.roomName = roomInfo.value.roomName;
      dataForm.markeImageUrl = roomInfo.value.markeImageUrl;

      if (marker) {
        marker.onRemove();
      }
      marker = map.renderMarker(roomInfo.value.lating);
      map.mapCenterZoom(roomInfo.value.lating, { number: 16 });
    };

    watch(roomInfo, () => {
      setRoomInfo();
    });

    onMounted(() => {
      map = new CustomNaverMaps(
        mapRef,
        new naver.maps.LatLng(126.6838396, 37.4592758)
      );

      naver.maps.Event.addListener(map.map, "click", (e) => {
        if (marker) {
          marker.onRemove();
        }

        marker = map.renderMarker(e.coord);
      });
    });

    return {
      mapRef,
      inputFileComponet,
      isLoadingChange,
      imageFile,
      isChangeMake,
      onChangeRoom,
      ...toRefs(dataForm),
    };
  },
});
</script>

<style scoped></style>
