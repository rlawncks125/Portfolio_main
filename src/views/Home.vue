<template>
  <div class="px-4">
    <div>자기소개하기</div>

    <fa-icon :icon="['fa', 'coffee']" class="block" style="height: 50px" />

    <loading-btn
      class="mt-4 h-20 w-64"
      :isLoading="isLoading"
      @click="consoleLog('클릭')"
    >
      <p>버튼을 누르세요</p></loading-btn
    >

    <section class="자기소개">
      <div>주저리 주저리 주저리</div>
    </section>
    <button @click="puts">콘솔</button>
    <section class="기술 소개">
      <div>기술소개</div>
    </section>
    <section class="포토폴리오 소개">
      <div>포토폴리오 소개</div>
    </section>
    <footer>
      <div>
        <p
          class="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2"
        >
          연락처 <br />
          이메일 등등
        </p>
      </div>
    </footer>
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
import { useStore } from "../store/index";

import LoadingBtn from "@/components/common/Input/LoadingBtn.vue";

export default defineComponent({
  components: { LoadingBtn },
  setup() {
    const store = useStore();

    const isLoading = ref(false);

    // const imageFileData = ref<FileDataType>();

    // const puts = () => {
    //   console.log(imageFileData.value);
    // };

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
      // imageFileData, puts
    };
  },
});
</script>

<style scoped>
section {
  margin: 10rem 0;
}
</style>
