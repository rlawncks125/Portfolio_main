<template>
  <div>자기소개하기</div>
  <div class="image"></div>
  <section class="자기소개">
    <div>주저리 주저리 주저리</div>
  </section>
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
import { defineComponent } from "vue";
import { useStore } from "../store/index";

export default defineComponent({
  setup() {
    const store = useStore();

    return {};
  },
});
</script>

<style scoped>
.image {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background: url("~@/assets/images/HOME.png");
}

section {
  margin: 10rem 0;
}
</style>
