<template>
  <div
    v-if="item"
    class="inline-flex mr-[1rem] h-[2rem] border items-center rounded-lg"
  >
    <img class="h-full mx-auto" :src="item" alt="스택 이미지" />
  </div>
</template>

<script lang="ts">
// 주소 : https://shields.io/
// 아이콘 검색 주소 : https://simpleicons.org/
// src 형식 : https://img.shields.io/badge/텍스트-배경색상(#제외)?style=스타일&logo=기술스택&logoColor=로고색상
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
            "https://img.shields.io/badge/javascript-F7DF1E?style=flat&logo=javascript&logoColor=black";
          break;
        case "node":
          item.value =
            "https://img.shields.io/badge/node-339933?style=flat&logo=node.js&logoColor=white";
          break;
        case "html":
          item.value =
            "https://img.shields.io/badge/html5-E34F26?style=flat&logo=html5&logoColor=white";
          break;
        case "css":
          item.value =
            "https://img.shields.io/badge/css-1572B6?style=flat&logo=css3&logoColor=white";
          break;
        case "vue":
          item.value =
            "https://img.shields.io/badge/vue.js-4FC08D?style=flat&logo=vue.js&logoColor=white";
          break;
        case "nest":
          item.value =
            "https://img.shields.io/badge/nestjs-E0234E?style=flat&logo=nestjs&logoColor=white";
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
