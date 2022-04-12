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
      <div>포토폴리오 소개</div>
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

export default defineComponent({
  components: {},
  setup() {
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

<style scoped lang="scss">
section {
  margin: 10rem 0;
}

.wq {
  color: $color-blue-3;
}
</style>
