<template>
  <div>자기소개하기</div>
  <div class="image"></div>
  <img class="h-12" src="~@/assets/images/search.png" alt="" />

  <input-file
    class="w-full h-80"
    @cahngeFile="(data) => (imageFileData = data)"
  />

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
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "../store/index";
import InputFile, {
  FileDataType,
} from "@/components/common/Input/File-multi.vue";

export default defineComponent({
  components: { InputFile },
  setup() {
    const store = useStore();

    // const imageFileData = ref<FileDataType>();

    // const puts = () => {
    //   console.log(imageFileData.value);
    // };

    return {
      // imageFileData, puts
    };
  },
});
</script>

<style scoped>
.image {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background: url("~@/assets/images/home-icon.png") center/cover;
}

section {
  margin: 10rem 0;
}
</style>
