<template>
  <div
    class="absolute bg-gray-600 inset-0 w-screen h-screen text-2xl"
    style="z-index: 1001"
  >
    <div
      class="relative bg-yellow-100 inset-0 w-11/12 h-5/6 mx-auto my-12 rounded-xl"
    >
      <p>접속유저 : {{ store.state.userName }}</p>
      <button class="absolute pt-2 top-0 right-4">X</button>

      <form class="text-center pt-10">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend class="text-center px-4">음식점 정보</legend>
          <p for="restaurntName" class="mr-4">
            음식점 이름 {{ vieFormData.restaurantName }}
          </p>
          <p for="restaurntName" class="mr-4">
            지역 이름 {{ vieFormData.location }}
          </p>
          <p>평균 별점 {{ vieFormData.avgStar }}</p>
          <img
            v-if="vieFormData.restaurantImageUrl.length > 10 ? true : false"
            :src="vieFormData.restaurantImageUrl"
          />
        </fieldset>
      </form>
      <div>
        댓글
        <div
          class="pl-4"
          v-for="comment in vieFormData.comments"
          :key="comment.id"
        >
          <p>
            {{ comment.message.userInfo.nickName }} :
            {{ comment.message.message }}
          </p>
          <div
            class="pl-4"
            v-for="childMessages in comment.childMessages"
            :key="childMessages.id"
          >
            <p>
              {{ childMessages.userInfo.nickName }} :
              {{ childMessages.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 마커 레스토랑 정보 마우스 오버시 데이터 추가
// 레스토랑 폼 만들기
import { RestaurantInfoDto } from "@/assets/swagger";
import { defineComponent, PropType } from "vue";
import { useStore } from "@/store/index";

export default defineComponent({
  props: {
    vieFormData: Object as PropType<RestaurantInfoDto>,
  },
  setup(props) {
    console.log(props.vieFormData);
    const store = useStore();

    // console.log(props.vieFormData?.comments);
    return { store };
  },
});
</script>

<style scoped></style>
