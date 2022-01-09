<template>
  <div
    class="absolute bg-gray-600 inset-0 w-screen h-screen text-2xl"
    style="z-index: 1001"
  >
    <div
      class="relative bg-yellow-100 inset-0 w-11/12 h-5/6 mx-auto my-12 rounded-xl"
    >
      <button class="absolute top-0 right-4" @click="closeForm">X</button>

      <form class="text-center pt-10">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend class="text-center px-4">음식점 추가</legend>
          <label for="restaurntName" class="mr-4">음식점 이름</label>
          <input
            class="border-2 rounded-md focus:outline-green-400"
            type="text"
            name="restaurntName"
            v-model="restaurantName"
          />
          <label for="restaurntName" class="mr-4">지역 이름</label>
          <input
            class="border-2 rounded-md focus:outline-green-400"
            type="text"
            name="restaurntName"
            v-model="location"
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
import { createRestaurant } from "@/api/Restaurant";

export default defineComponent({
  props: {
    formPushData: Object as PropType<IFormPushData>,
  },
  emits: ["closeForm", "createMaker"],
  setup(props, { emit }) {
    const formRef = ref<HTMLFormElement>();
    const formData = reactive({
      restaurantName: "",
      location: "",
    } as CreateRestaurantInputDto);

    const closeForm = () => {
      formDataReset();
      emit("closeForm");
    };
    const addResturant = async () => {
      if (!props.formPushData) return;
      const { map, position, uuid } = props.formPushData;

      const { ok, err, restaurant } = await createRestaurant({
        uuid,
        lating: {
          x: position!.x,
          y: position!.y,
        },
        restaurantImageUrl: "null",
        restaurantName: formData.restaurantName,
        location: formData.location,
      });
      if (!ok) {
        console.log(err);
        return;
      }

      const maker = new naver.maps.Marker({
        position: {
          x: position?.x,
          y: position?.y,
        },
        map,
      });

      if (maker) {
        formDataReset();
        emit("createMaker", { maker, restaurantData: restaurant });
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
