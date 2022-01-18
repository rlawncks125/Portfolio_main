<template>
  <div
    class="fixed bg-gray-600 inset-0 w-screen h-screen text-2xl"
    style="z-index: 1001"
  >
    <div
      class="relative bg-yellow-100 inset-0 w-11/12 h-5/6 mx-auto my-12 rounded-xl overflow-y-auto"
    >
      <button class="absolute top-0 right-4" @click="closeForm">X</button>

      <form class="text-center py-10">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend class="text-center px-4">음식점 추가</legend>
          <!-- 이미지 드래그 앤 드롭 -->
          <div
            @drop="onDropFile"
            @dragover="isFileStatus = 'dragover'"
            @dragleave="isFileStatus = ''"
            class="bg-red-200 py-24 px-4 w-9/12 my-2"
            :style="[isFileStatus === 'dragover' ? classOverFile : {}]"
          >
            <div class="pointer-events-none">
              <template v-if="!isFileStatus">
                <p>올리 이미지들을 여기에 끌어다 올리세요.</p>
              </template>
              <template v-else-if="isFileStatus === 'dragover'">
                <p>이미지를 놓으세요</p>
              </template>
            </div>
          </div>
          <!-- 이미지 출력 -->
          <div
            v-if="files.length > 0"
            class="flex justify-between max-w-full overflow-auto my-2"
          >
            <template v-for="file in files" :key="file.id">
              <img
                class="h-full"
                v-if="file.type === 'image'"
                :src="file.data"
              />
            </template>
          </div>

          <label for="restaurntName" class="mr-4">음식점 이름</label>
          <input
            class="border-2 rounded-md focus:outline-green-400"
            type="text"
            name="restaurntName"
            v-model="restaurantName"
          />
          <label for="location" class="mr-4">지역 이름</label>
          <input
            class="border-2 rounded-md focus:outline-green-400"
            type="text"
            name="location"
            v-model="location"
          />
          <div class="flex justify-between items-center">
            <label for="tag" class="mr-4">tag 추가</label>
            <input
              class="border-2 rounded-md focus:outline-green-400"
              type="text"
              name="tag"
              v-model="tag"
            />
            <button @click="addTag">추가</button>
          </div>
          <!-- 추가한 태그들  -->
          <div class="flex my-2">
            <template v-for="tag in tags" :key="tag.id">
              <p class="mx-1 bg-red-500 rounded-full px-2 py-1">
                {{ tag }}
              </p>
            </template>
          </div>
          <button
            @click.prevent="addResturant"
            class="w-10/12 border-2 rounded-lg bg-gray-500 text-red-400 center"
          >
            Add
          </button>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
interface IFormPushData {
  map?: naver.maps.Map;
  position?: naver.maps.Coord;
  uuid: string;
}

import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
  toRaw,
  toRefs,
} from "vue";
import { CreateRestaurantInputDto } from "@/assets/swagger/index";
import { createRestaurant } from "@/api/Restaurant";
import axios from "axios";

export default defineComponent({
  props: {
    formPushData: Object as PropType<IFormPushData>,
  },
  emits: ["closeForm", "createMaker"],
  setup(props, { emit }) {
    const formRef = ref<HTMLFormElement>();
    const formData = reactive({
      restaurantName: "",
      location: "",
      tag: "" as string,
      tags: [] as string[],
      files: [] as { type: string; data: any; fileName: any; file: File }[],
    });
    const isFileStatus = ref<string>();

    const classData = reactive({
      classOverFile: {
        backgroundColor: "thistle",
      },
    });

    const onDropFile = (e: any) => {
      const files = e.dataTransfer?.files;
      isFileStatus.value = "";
      // console.log(files);

      if (files.length > 1) {
        for (let i = 0; i < files.length; i++) {
          fileRender(files[i]);
        }
      } else {
        fileRender(files[0]);
      }
    };

    const fileRender = (file: any) => {
      // console.log(file);
      if (file.type.split("/")[0] !== "image") return;
      const reader = new FileReader();
      reader.onload = () => {
        const type = file.type.split("/")[0];
        reader.result &&
          formData.files.push({
            type,
            data: reader.result,
            fileName: file.name,
            file,
          });
      };
      reader.readAsDataURL(file);
    };

    const addTag = (e: any) => {
      e.preventDefault();
      formData.tags.push(formData.tag);
      formData.tag = "";
    };

    const addResturant = async () => {
      if (!props.formPushData) return;
      const { map, position, uuid } = props.formPushData;

      const postForm = new FormData();
      postForm.append(
        "file",
        formData.files[0].file,
        formData.files[0].fileName
      );

      // 이미지 url 작업
      const imageUrl = await axios
        .post("/api/file", postForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data.url);

      const { ok, err, restaurant } = await createRestaurant({
        uuid,
        lating: {
          x: position!.x,
          y: position!.y,
        },
        restaurantImageUrl: imageUrl,
        restaurantName: formData.restaurantName,
        location: formData.location,
      });
      if (!ok) {
        console.log(err);
        return;
      }

      const maker = new naver.maps.Marker({
        position: {
          x: position?.x,
          y: position?.y,
        },
        map,
      });

      if (maker) {
        formDataReset();
        emit("createMaker", { maker, restaurant: restaurant });
      }
    };
    const closeForm = () => {
      formDataReset();
      emit("closeForm");
    };

    const formDataReset = () => {
      formData.restaurantName = "";
      (formData.location = ""), (formData.files = []);
    };

    const preventDefaultDrag = (e: any) => {
      e.preventDefault();
    };
    onMounted(() => {
      window.addEventListener("dragover", preventDefaultDrag);
      window.addEventListener("drop", preventDefaultDrag);
    });
    onUnmounted(() => {
      window.removeEventListener("dragover", preventDefaultDrag);
      window.removeEventListener("drop", preventDefaultDrag);
    });

    return {
      onDropFile,
      ...toRefs(classData),
      isFileStatus,
      closeForm,
      addResturant,
      formRef,
      ...toRefs(formData),
      addTag,
    };
  },
});
</script>

<style></style>
