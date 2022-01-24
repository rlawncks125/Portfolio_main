<template>
  <div
    class="fixed bg-gray-600 inset-0 w-screen h-screen text-2xl sm:text-base"
    style="z-index: 1001"
  >
    <loding :isLoding="isLoading" />
    <div
      class="relative overflow-auto max-w-5xl p-2 pt-0 h-full bg-yellow-100 inset-0 sm:w-11/12 sm:h-5/6 sm:mx-auto sm:my-12 sm:rounded-xl sm:overflow-y-auto sm:p-4"
    >
      <button class="absolute top-0 right-4" @click="closeForm">X</button>

      <form class="text-center py-10">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend class="text-center px-4">음식점 추가</legend>
          <!-- 이미지 드래그 앤 드롭 -->
          <label
            for="imageFile"
            @drop="onDropFile"
            @dragover="isFileStatus = 'dragover'"
            @dragleave="isFileStatus = ''"
            class="bg-red-200 py-24 px-4 w-9/12 my-2"
            :style="[isFileStatus === 'dragover' ? classOverFile : {}]"
          >
            <div class="pointer-events-none">
              <input
                class="hidden"
                @change.prevent="onChangeFile"
                type="file"
                accept="image/*"
                id="imageFile"
                name=""
              />
              <div class="h-12">
                <template v-if="!isFileStatus">
                  <div></div>
                  <p>이 구역을 클릭하시거나.</p>
                  <p>올리 이미지들을 여기에 끌어다 올리세요.</p>
                </template>
                <template v-else-if="isFileStatus === 'dragover'">
                  <p>이미지를 놓으세요</p>
                </template>
              </div>
            </div>
          </label>
          <!-- 이미지 출력 -->
          <div
            v-if="files.length > 0"
            class="flex justify-between max-w-full overflow-auto my-2 max-h-60"
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
          <!-- 전문 분야들 -->
          <div class="flex flex-wrap justify-between items-center">
            <label for="specialization" class="text-left mr-4 text-indigo-300"
              >전문 분야
            </label>
            <input
              class="addform-input-add"
              type="text"
              name="specialization"
              v-model="specialization"
              placeholder="전문 분야를 입력하세요"
            />
            <button @click.prevent="addSpecialization">추가</button>
          </div>

          <div class="flex my-2">
            <template
              v-for="specialization in specializations"
              :key="specialization.id"
            >
              <p class="mx-1 text-indigo-100 bg-cyan-500 rounded-full px-2">
                {{ specialization }}
              </p>
            </template>
          </div>
          <!-- 태그들  -->
          <div class="flex flex-wrap justify-between items-center">
            <label for="tag" class="text-left mr-4 text-indigo-300"
              >#해시태그</label
            >
            <input
              class="addform-input-add"
              type="text"
              name="tag"
              v-model="tag"
              placeholder="#해시태크 추가"
            />
            <button @click.prevent="addTag">추가</button>
          </div>

          <div class="flex my-2">
            <template v-for="tag in tags" :key="tag.id">
              <p class="mx-1 text-indigo-100 bg-cyan-500 rounded-full px-2">
                {{ tag }}
              </p>
            </template>
          </div>
          <!-- Create 버튼 -->
          <button
            @click.prevent="addResturant"
            class="w-10/12 border-2 rounded-lg"
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
import Loding from "./Loding.vue";

export default defineComponent({
  components: { Loding },
  props: {
    formPushData: Object as PropType<IFormPushData>,
  },
  emits: ["closeForm", "createMaker"],
  setup(props, { emit }) {
    const formRef = ref<HTMLFormElement>();
    const formData = reactive({
      restaurantName: "",
      location: "",
      specialization: "" as string,
      specializations: [] as string[],
      tag: "" as string,
      tags: [] as string[],
      files: [] as { type: string; data: any; fileName: any; file: File }[],
    });
    const isFileStatus = ref<string>();
    const isLoading = ref(false);

    const classData = reactive({
      classOverFile: {
        backgroundColor: "thistle",
      },
    });

    const onDropFile = (e: any) => {
      const files = e.dataTransfer?.files;
      isFileStatus.value = "";
      isLoading.value = true;
      // console.log(files);

      if (files.length > 1) {
        for (let i = 0; i < files.length; i++) {
          fileRender(files[i]);
        }
      } else {
        fileRender(files[0]);
      }
      isLoading.value = false;
    };
    const onChangeFile = (e: any) => {
      const files = e.target.files;

      isLoading.value = true;
      if (files.length > 1) {
        for (let i = 0; i < files.length; i++) {
          fileRender(files[i]);
        }
      } else {
        fileRender(files[0]);
      }
      isLoading.value = false;
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

      if (formData.tag.slice(0, 1) !== "#") {
        formData.tag = `#${formData.tag}`;
      }

      formData.tags.push(formData.tag);
      formData.tag = "";
    };

    const addSpecialization = (e: any) => {
      formData.specializations.push(formData.specialization);
      formData.specialization = "";
    };

    const addResturant = async () => {
      if (!props.formPushData) return;
      const { map, position, uuid } = props.formPushData;
      let imageUrl = "";

      isLoading.value = true;
      if (formData.files.length > 0) {
        const postForm = new FormData();
        postForm.append(
          "file",
          formData.files[0].file,
          formData.files[0].fileName
        );

        // 이미지 url 작업
        imageUrl = await axios
          .post("/api/file", postForm, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => res.data.url);
      }

      const { ok, err, restaurant } = await createRestaurant({
        uuid,
        lating: {
          x: position!.x,
          y: position!.y,
        },
        restaurantImageUrl: imageUrl,
        restaurantName: formData.restaurantName,
        location: formData.location,
        hashTags: formData.tags,
        specialization: formData.specializations,
      });
      if (!ok) {
        console.log(err);
        return;
      }

      isLoading.value = false;

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
      formData.location = "";
      formData.files = [];
      formData.specializations = [];
      formData.tags = [];
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
      onChangeFile,
      ...toRefs(classData),
      isFileStatus,
      closeForm,
      addResturant,
      formRef,
      ...toRefs(formData),
      addTag,
      addSpecialization,
      isLoading,
    };
  },
});
</script>

<style></style>
