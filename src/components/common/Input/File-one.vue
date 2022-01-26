<template>
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
      <!-- 이미지 출력 -->
      <template v-if="files">
        <img
          class="h-full bg-cover mx-auto"
          :class="{ 'rounded-full': isStyleRounded }"
          v-if="files.type === 'image'"
          :src="files.data"
        />
      </template>
      <div class="flex flex-col justify-center h-full" v-else>
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
