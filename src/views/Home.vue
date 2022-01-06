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
    <div>연락처 , 이메일 등등</div>
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
