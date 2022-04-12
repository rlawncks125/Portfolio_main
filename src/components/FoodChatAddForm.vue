<template>
  <div class="foodChat-form">
    <loding :isLoding="isLoading" />
    <div
      class="foodChat-form-main"
      style="height: calc(var(--mobile--full) - 2vh)"
    >
      <button class="absolute top-2 right-4" @click.prevent="closeForm">
        X
      </button>

      <form class="text-center py-20">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend class="text-center px-8">음식점 추가</legend>
          <div class="w-full flex justify-around items-center">
            <label for="" class="w-40">레스토랑 이름 </label>
            <input class="w-0 flex-1" type="text" v-model="restaurantName" />
          </div>
          <div class="w-full flex justify-around items-center">
            <label for="" class="w-40">지역 </label>
            <input class="w-0 flex-1" type="text" v-model="location" />
          </div>
          <!-- 음식점 이미지  -->
          <p class="mt-4">레스토랑 이미지</p>
          <input-file
            ref="inputFileComponet"
            class="w-80 h-60"
            @cahngeFile="(data) => (imageFile = data)"
          />
          <!-- 전문 분야들 -->
          <div class="w-full flex flex-wrap justify-between items-center">
            <label for="specialization" class="w-28 text-left text-indigo-300"
              >전문 분야
            </label>
            <input
              class="w-20 flex-1"
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
          <div class="w-full flex flex-wrap justify-between items-center">
            <label for="tag" class="w-28 text-left text-indigo-300"
              >#해시태그</label
            >
            <input
              class="w-20 flex-1"
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
interface ICreatedRoomData {
  map?: naver.maps.Map;
  position?: naver.maps.Coord;
  uuid: string;
}

import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from "vue";

import { createRestaurant } from "@/api/Restaurant";
import Loding from "./Loding.vue";
import InputFile, {
  FileDataType,
} from "@/components/common/Input/File-one.vue";
import { ImageGetURLByFormData } from "@/api/file";

export default defineComponent({
  components: { Loding, InputFile },
  emits: ["closeAddForm", "createMaker"],
  setup(props, { emit }) {
    const formRef = ref<HTMLFormElement>();
    const createdRoomData = ref<ICreatedRoomData>();

    const formData = reactive({
      restaurantName: "",
      location: "",
      specialization: "" as string,
      specializations: [] as string[],
      tag: "" as string,
      tags: [] as string[],
    });
    const isFileStatus = ref<string>();
    const isLoading = ref(false);

    // input File
    const inputFileComponet = ref<InstanceType<typeof InputFile>>();
    const imageFile = ref<FileDataType>();

    const setOpenData = (data: ICreatedRoomData) => {
      createdRoomData.value = data;
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
      if (!createdRoomData.value) return;

      if (formData.restaurantName === "" || formData.location === "") {
        alert("만들수 없음 정보를 채우세요");
        return;
      }

      const { map, position, uuid } = createdRoomData.value;

      let imageUrl = "";

      isLoading.value = true;
      if (imageFile.value?.type === "image") {
        const postForm = new FormData();
        postForm.append("file", imageFile.value.file, imageFile.value.fileName);

        // 이미지 url 작업
        // imageUrl = await axios
        //   .post(`/api/file`, postForm, {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   })
        //   .then((res) => res.data.url);
        imageUrl = await ImageGetURLByFormData(postForm);
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
        emit("createMaker", { maker, restaurant });
      }
    };
    const closeForm = () => {
      formDataReset();
      emit("closeAddForm");
    };

    const formDataReset = () => {
      formData.restaurantName = "";
      formData.location = "";
      formData.specialization = "";
      formData.specializations = [];
      formData.tag = "";
      formData.tags = [];
      inputFileComponet.value?.resetFile();
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
      setOpenData,
      imageFile,
      inputFileComponet,
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
