<template>
  <div
    v-if="item"
    class="inline-flex mr-[1rem] h-[3rem] border items-center rounded-lg"
  >
    <img class="h-full mx-auto" :src="item" alt="스택 이미지" />
  </div>
</template>

<script lang="ts">
// 아이콘 주소 : https://simpleicons.org/
// src 형식 : https://img.shields.io/badge/텍스트-배경색상(#제외)?style=for-the-badge&logo=기술스택&logoColor=white
import { defineComponent, onMounted, ref, toRaw } from "vue";

export default defineComponent({
  props: {
    stack: String,
  },
  setup(props) {
    const item = ref();

    const { stack } = toRaw(props);
    onMounted(() => {
      switch (stack) {
        case "js":
          item.value =
            "https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black";
          break;
        case "node":
          item.value =
            "https://img.shields.io/badge/node-339933?style=for-the-badge&logo=node.js&logoColor=white";
          break;
        case "html":
          item.value =
            "https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white";
          break;
        case "css":
          item.value =
            "https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white";
          break;
        case "vue":
          item.value =
            "https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white";
          break;
        case "nest":
          item.value =
            "https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white";
          break;
        default:
          break;
      }
    });

    return { item };
  },
});
</script>

<style scoped></style>
