<template>
  <div class="flex">
    <!-- 이미지 드래그 앤 드롭 -->
    <label
      for="imageFile"
      @drop="onDropFile"
      @dragover="isFileStatus = 'dragover'"
      @dragleave="isFileStatus = ''"
      class="block bg-red-200 p-2 w-full h-full my-2 text-center mx-auto"
      :style="[isFileStatus === 'dragover' ? classOverFile : {}]"
    >
      <div class="pointer-events-none h-full mx-auto border-2 border-gray-800">
        <div class="flex flex-col justify-center h-full">
          <template v-if="!isFileStatus">
            <p>이 구역을 클릭하시거나.</p>
            <p>올리 이미지들을 여기에 끌어다 올리세요.</p>
          </template>
          <template v-else-if="isFileStatus === 'dragover'">
            <p>이미지를 놓으세요</p>
          </template>
        </div>
        <input
          class="hidden"
          @change.prevent="onChangeFile"
          type="file"
          accept="image/*"
          id="imageFile"
          name=""
        />
      </div>
    </label>

    <!-- 이미지 출력 -->
    <div
      v-if="files && files.length > 0"
      class="flex flex-col justify-start gap-1 h-full w-1/4 my-2 ml-1 overflow-auto scroll"
    >
      <template v-for="file in files" :key="file.id">
        <img class="w-full" v-if="file.type === 'image'" :src="file.data" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

export interface FileDataType {
  file: File;
  type: string;
  data: any;
  fileName: any;
}

export default defineComponent({
  props: {
    isStyleRounded: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["cahngeFile"],
  setup(props, { emit }) {
    const files = ref<FileDataType[]>([]);
    const isFileStatus = ref<string>();
    const isLoading = ref(false);

    const classOverFile = {
      backgroundColor: "thistle",
    };

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
        if (reader.result) {
          const fileData = {
            file,
            type,
            data: reader.result,
            fileName: file.name,
          } as FileDataType;

          files.value!.push(fileData);
          emit("cahngeFile", files.value);
        }
      };
      reader.readAsDataURL(file);
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
      files,
      classOverFile,
      isFileStatus,
      isLoading,
      onDropFile,
      onChangeFile,
    };
  },
});
</script>

<style scoped></style>
