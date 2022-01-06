<template>
  <div
    class="absolute bg-gray-600 inset-0 w-screen h-screen"
    style="z-index: 1001"
  >
    <div class="relative bg-yellow-100 inset-0 w-11/12 h-5/6 mx-auto my-14">
      <button class="absolute top-0 right-4" @click="closeForm">X</button>

      <form class="text-center">
        <fieldset class="border-2 p-4 mx-4">
          <legend class="text-center px-4">음식점 추가</legend>
          <label for="restaurntName" class="mr-4">음식점 이름</label>
          <input
            class="border-2 rounded-md focus:outline-green-400"
            type="text"
            name="restaurntName"
            v-model="restaurantName"
          />
          <button
            @click.prevent="addResturant"
            class="w-10/12 border-2 rounded-lg bg-gray-500 text-red-400 center"
          >
            Add
          </button>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
interface IFormPushData {
  map?: naver.maps.Map;
  position?: naver.maps.Coord;
  uuid: string;
}

import { defineComponent, PropType, reactive, ref, toRefs } from "vue";
import { CreateRestaurantInputDto } from "@/assets/swagger/index";

export default defineComponent({
  props: {
    formPushData: Object as PropType<IFormPushData>,
  },
  emits: ["closeForm", "createMaker"],
  setup(props, { emit }) {
    const formRef = ref<HTMLFormElement>();
    const formData = reactive({
      uuid: "",
      restaurantName: "",
      restaurantImageUrl: "",
      location: "",
      lating: {
        X: 0,
        Y: 0,
      },
    } as CreateRestaurantInputDto);

    const closeForm = () => {
      formDataReset();
      emit("closeForm");
    };
    const addResturant = () => {
      if (!props.formPushData) return;
      const { map, position, uuid } = props.formPushData;

      const maker = new naver.maps.Marker({
        position: {
          x: position?.x,
          y: position?.y,
        },
        map,
      });

      formData.uuid = uuid;
      formData.restaurantImageUrl = "http://";
      formData.location = "대구";
      formData.lating = {
        X: position!.x,
        Y: position!.y,
      };

      const resturantData = { ...formData };

      if (maker) {
        formDataReset();
        emit("createMaker", { maker, resturantData });
      }
    };
    const formDataReset = () => {
      formData.restaurantName = "";
    };

    return { closeForm, addResturant, formRef, ...toRefs(formData) };
  },
});
</script>

<style></style>
