<template>
  <div
    class="fixed bg-gray-600 inset-0 w-screen h-screen text-2xl"
    style="z-index: 1001"
  >
    <div
      class="relative bg-yellow-100 inset-0 w-11/12 h-5/6 mx-auto my-12 rounded-xl overflow-y-auto"
    >
      <p>접속유저 : {{ store.state.userName }}</p>

      <button v-if="isSuperUser" @click="onDeleteRestaurnt">삭제 버튼</button>
      <button class="absolute pt-2 top-0 right-4" @click="onClose">X</button>

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
          <div class="w-80">
            <img
              class="bg-cover bg-center w-full h-full"
              :src="restaurantImageUrl"
            />
          </div>
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
            class="pl-4 grid grid-cols-1 border-2"
            v-for="childMessages in comment.childMessages"
            :key="childMessages.id"
          >
            <p>
              {{ childMessages.userInfo.nickName }}
              {{ getDateData(childMessages.CreateTime) }}
            </p>

            <p class="pl-3">
              {{ childMessages.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RestaurantInfoDto } from "@/assets/swagger";
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { useStore } from "@/store/index";

export default defineComponent({
  props: {
    vieFormData: Object as PropType<RestaurantInfoDto>,
    isRoomSuperUser: Boolean,
  },
  emits: ["viewClose", "DeleteRestrunt"],

  setup(props, { emit }) {
    const store = useStore();
    const isSuperUser = ref(false);

    const restaurantImageUrl = ref(
      "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg"
    );

    const getDateData = (date: Date) => {
      let outPutTime = "작성 시간 : ㄴ";
      if (date) {
        // 데이터 가 어떻게 받아올지 모르겠지만
        // 2021-12-20T17:14:34.508Z 형식일경우
        const paseDate = new Date(date);
        const time = {
          year: paseDate.getFullYear(),
          month: paseDate.getMonth(),
          date: paseDate.getDate(),
          hour: paseDate.getHours(),
          second: paseDate.getSeconds(),
        };

        outPutTime = `작성 시간 : ${time.year}-${time.month}-${time.date}:${time.hour}:${time.second}`;
      }
      return outPutTime;
    };

    const onClose = () => {
      emit("viewClose");
    };

    const onDeleteRestaurnt = () => {
      emit("DeleteRestrunt", props.vieFormData?.id);
    };

    // onMounted(() => {});

    watch(
      () => props.vieFormData,
      () => {
        if (
          props.vieFormData?.restaurantImageUrl !== null &&
          typeof props.vieFormData?.restaurantImageUrl === "string" &&
          (props.vieFormData?.restaurantImageUrl as string).length > 10
        ) {
          restaurantImageUrl.value = props.vieFormData!.restaurantImageUrl;
        } else {
          restaurantImageUrl.value =
            "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg";
        }

        if (
          props.vieFormData?.resturantSuperUser.nickName ===
          store.state.userName
        ) {
          isSuperUser.value = true;
        } else if (props.isRoomSuperUser) {
          isSuperUser.value = true;
        } else {
          isSuperUser.value = false;
        }
      }
    );

    return {
      store,
      isSuperUser,
      getDateData,
      restaurantImageUrl,
      onClose,
      onDeleteRestaurnt,
    };
  },
});
// 나머지 api구현
// ui/ux
</script>

<style scoped></style>
