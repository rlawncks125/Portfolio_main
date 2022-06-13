<template>
  <div class="px-4">
    <div>자기소개하기</div>

    <section class="자기소개">
      <div>주저리 주저리 주저리</div>
    </section>

    <section class="기술 소개">
      <div>기술소개</div>
    </section>
    <section class="포토폴리오 소개">
      <div class="mb-4">포토폴리오 소개</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          class="border"
          v-for="(pofol, index) in pofolItems"
          :key="pofol.id"
        >
          <div class="pl-2 flex justify-between items-center">
            <span>{{ pofol.name }}</span>
            <button @click="openViewIndex = index">보기</button>
          </div>
          <img
            :src="pofol.image"
            alt=""
            class="w-full bg-yellow-50 object-contain"
          />

          <!-- 설명 랜더 -->
          <div
            v-show="openViewIndex === index"
            class="fixed bg-gray-600 bg-opacity-60 inset-0 w-screen h-screen text-2xl sm:text-base z-[1001]"
          >
            <div
              class="relative overflow-auto w-[98vw] max-w-3xl m-auto top-[1vh] p-2 rounded-2xl bg-white inset-0"
              style="height: calc(var(--mobile--full) - 2vh)"
            >
              <div class="flex justify-between px-[1.5rem]">
                <span>{{ pofol.name }}</span>
                <button class="text-3xl" @click="openViewIndex = ''">X</button>
              </div>
              <component :is="pofol.compoenet" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer
      class="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2"
    >
      <div>
        <p>
          연락처 <br />
          이메일 등등
        </p>
      </div>
    </footer>
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-violet-700 to-indigo-600 text-3xl"
      >gradient Font Test
    </span>
    <br />
    <span
      class="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-500 text-3xl"
    >
      ( bg-clip-text , text-transparent ) + bg-gradient
    </span>
    <div class="wq">vue.conifg</div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import FoodChat from "@/views/FoodChat/README.vue";

export default defineComponent({
  components: {},
  setup() {
    const isLoading = ref(false);
    const openViewIndex = ref("");

    // const imageFileData = ref<FileDataType>();

    // const puts = () => {
    //   console.log(imageFileData.value);
    // };

    const pofolItems = [
      {
        name: "FoodChat",
        image:
          "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1654624758/%ED%8F%AC%ED%94%841_isxw3h.jpg",
        compoenet: FoodChat,
      },
      {
        name: "FoodChat2",
        image:
          "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1654624758/%ED%8F%AC%ED%94%841_isxw3h.jpg",
        compoenet: FoodChat,
      },
      {
        name: "FoodChat3",
        image:
          "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1654624758/%ED%8F%AC%ED%94%841_isxw3h.jpg",
        compoenet: FoodChat,
      },
    ];

    const consoleLog = (e: any) => {
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
      console.log(e);
    };

    return {
      isLoading,
      consoleLog,
      pofolItems,
      openViewIndex,
      // imageFileData, puts
    };
  },
});
</script>

<style scoped lang="scss">
section {
  margin: 10rem 0;
}

.wq {
  color: $color-blue-3;
}
</style>
