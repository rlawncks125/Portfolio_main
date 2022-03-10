<template>
  <!-- 이미지 드래그 앤 드롭 -->
  <label
    for="imageFile"
    @drop="onDropFile"
    @dragover="isFileStatus = 'dragover'"
    @dragleave="isFileStatus = ''"
    class="block bg-transparent w-full h-full my-2 text-center mx-auto"
    :style="[isFileStatus === 'dragover' ? classOverFile : {}]"
  >
    <div class="pointer-events-none h-full mx-auto">
      <!-- 이미지 출력 -->
      <template v-if="files">
        <img
          class="w-full h-full mx-auto bg-center bg-cover bg-no-repeat"
          :class="{
            'rounded-full border-2 border-solid border-gray-400 ':
              isStyleRounded,
          }"
          v-if="files.type === 'image'"
          :style="`background-image : url(${files.data})`"
        />
      </template>
      <div
        class="flex flex-col justify-center h-full outline-offset-[-10px] outline-dashed"
        v-else
      >
        <template v-if="!isFileStatus">
          <p>이 구역을 클릭하세요.</p>
          <p class="hidden sm:block">OR</p>
          <p class="hidden sm:block">올리 이미지들을 여기에 끌어다 올리세요.</p>
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
    const files = ref<FileDataType | null>(null);
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
      fileRender(files[0]);

      isLoading.value = false;
    };
    const onChangeFile = (e: any) => {
      const files = e.target.files;

      isLoading.value = true;

      fileRender(files[0]);

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

          files.value! = fileData;
          emit("cahngeFile", fileData);
        }
      };
      reader.readAsDataURL(file);
    };

    const resetFile = () => {
      files.value = null;
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
      resetFile,
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
