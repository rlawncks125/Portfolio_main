<template>
  <div
    class="fixed bg-gray-600 inset-0 w-screen h-screen text-2xl sm:text-base"
    style="z-index: 1001"
  >
    <div
      class="relative overflow-auto max-w-5xl p-2 pt-0 h-full bg-yellow-100 inset-0 sm:w-11/12 sm:h-5/6 sm:mx-auto sm:my-12 sm:rounded-xl sm:overflow-y-auto sm:p-4"
    >
      <div
        class="sticky sm:hidden p-2 py-4 top-0 flex justify-between bg-yellow-100"
      >
        <button class="text-3xl" @click="onClose">&lt;</button>
        <p>가운데</p>
        <p>오른쪽</p>
      </div>
      <button class="hidden sm:block absolute top-2 right-2" @click="onClose">
        X
      </button>

      <p>접속유저 : {{ store.state.userName }}</p>

      <button v-if="isSuperUser" @click="onDeleteRestaurnt">삭제 버튼</button>

      <!-- 레스토랑 정보 -->
      <form class="text-center pt-10">
        <fieldset
          class="border-2 p-2 mx-4 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend class="text-center px-4">음식점 정보</legend>
          <h1 class="mr-4 text-4xl">
            {{ viewData.restaurantName }}
          </h1>
          <div
            v-if="viewData.specialization.length > 0"
            class="flex gap-1 items-center my-2"
          >
            <span> 전문 분야 : </span>
            <template
              v-for="special in viewData.specialization"
              :key="special.id"
            >
              <p class="text-gray-500 bg-yellow-400 rounded-full py-1 px-3">
                {{ special }}
              </p>
            </template>
          </div>
          <div class="h-64 sm:h-96">
            <img
              class="bg-cover bg-center w-full h-full"
              :src="restaurantImageUrl"
            />
          </div>

          <p class="mr-4">지역 이름 {{ viewData.location }}</p>
          <star-fill :starNum="5" :starSize="2" :fill="viewData.avgStar" />
          <p>평균 별점 {{ viewData.avgStar }}</p>
          <div v-if="viewData.hashTags.length > 0" class="flex gap-1">
            <template v-for="tag in viewData.hashTags" :key="tag.id">
              <p class="px-1 text-indigo-100 bg-cyan-500 rounded-full">
                {{ tag }}
              </p>
            </template>
          </div>
        </fieldset>
      </form>
      <!-- 댓글 -->
      <div>
        {{ activeMessage }}
        <div
          class="px-4"
          v-for="comment in viewData.comments"
          :key="comment.id"
        >
          <div class="flex justify-between">
            <p class="cursor-pointer" @click="setcommentId(comment.id)">
              {{ comment.message.userInfo.nickName }} :
              {{ comment.message.message }}
            </p>
            <button @click="setEditCommentId(comment.id)">수정</button>
            <button @click="onDeleteComment(comment.id)">삭제</button>
          </div>
          <div v-show="editActiveMessage === comment.id">
            <label for="">댓글 수정:</label>
            <input type="text" v-model="editMessage" />
            <button @click="onEditCommentId(comment.id)">댓글 수정</button>
          </div>
          <div v-show="activeMessage === comment.id">
            <label for="">추가 댓글:</label>
            <input type="text" v-model="childMessage" />
            <button @click="onAddCommentByCommentId(comment.id)">
              대댓글 추가
            </button>
          </div>
          <div
            class="ml-6 pl-4 flex flex-col border-2"
            v-for="childMessages in comment.childMessages"
            :key="childMessages.id"
          >
            <div class="whitespace-pre-wrap">
              <div class="flex">
                <p>
                  {{ childMessages.userInfo.nickName }}[{{
                    childMessages.userInfo.role
                  }}]
                </p>
                <button
                  class="text-red-300"
                  @click="setChildCommentCreateTime(childMessages.CreateTime)"
                >
                  수정 하기
                </button>
              </div>
              <p>
                {{ getDateData(childMessages.CreateTime) }}
              </p>
            </div>
            <p class="">
              {{ childMessages.message }}
            </p>
            <div
              class="flex justify-between border border-yellow-400"
              v-show="editActiveChildMessage === childMessages.CreateTime"
            >
              <div>
                <label for="">수정할 내용</label>
                <input type="text" v-model="editChildMessage" />
              </div>
              <button
                class="border border-red-400"
                @click="
                  onEditChildComment(comment.id, childMessages.CreateTime)
                "
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 댓글 달기 -->
      <div class="mt-4 flex flex-col text-left">
        <star-touch-event
          :starNum="5"
          :starSize="2"
          :fill="star"
          @clickStar="
            (starValue) => {
              star = starValue;
            }
          "
        />
        <label for="">추가 댓글 달기 :</label>
        <textarea class="" v-model="message" />
        <button @click="onAddCommentRestaurantById">댓글 추가</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  EnumAddMessageByCommentIdInPutDtoRole,
  EnumAddRestaurantCommentByIdIdInputDtoRole,
  RestaurantInfoDto,
} from "@/assets/swagger";
import StarFill from "@/components/common/StarFill.vue";
import StarTouchEvent from "@/components/common/StarTouchEvent.vue";
import {
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { useStore } from "@/store/index";
import {
  addMessageByCommentId,
  addRestaurantCommentById,
  deleteComment,
  editCommentChildMessage,
  editCommentMessage,
} from "@/api/Restaurant";

export default defineComponent({
  props: {
    isRoomSuperUser: Boolean,
  },
  emits: ["closeViewForm", "DeleteRestrunt", "UpdateRestaurantById"],
  components: { StarFill, StarTouchEvent },
  setup(props, { emit }) {
    const store = useStore();
    const isSuperUser = ref(false);

    const activeMessage = ref<number | null>();
    const editActiveMessage = ref<number | null>();
    const editActiveChildMessage = ref<string | null>();

    const restaurantImageUrl = ref(
      "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg"
    );

    const viewData = ref<RestaurantInfoDto>({
      id: 999999,
      resturantSuperUser: {
        id: 999999,
        nickName: "",
      },
      restaurantName: "",
      restaurantImageUrl: "",
      location: "",
      comments: [],
      avgStar: 0,
      lating: {
        x: 0,
        y: 0,
      },
      hashTags: [],
      specialization: [],
    });

    const addFormData = reactive({
      message: "",
      childMessage: "",
      editChildMessage: "",
      editMessage: "",
      star: 5,
    });

    const setcommentId = (id: number) => {
      if (activeMessage.value === id) {
        activeMessage.value = null;
        return;
      }

      activeMessage.value = id;
      addFormData.childMessage = "";

      console.log(activeMessage.value);
    };

    const setChildCommentCreateTime = (createTime: string) => {
      if (editActiveChildMessage.value === createTime) {
        editActiveChildMessage.value = null;
        return;
      }

      editActiveChildMessage.value = createTime;
      addFormData.childMessage = "";
      console.log(editActiveChildMessage.value);
    };

    const setEditCommentId = (id: number) => {
      if (editActiveMessage.value === id) {
        editActiveMessage.value = null;
        return;
      }

      editActiveMessage.value = id;
      addFormData.editMessage = " ";
    };

    const getDateData = (date: Date) => {
      let outPutTime = "작성 시간 : ㄴ";
      if (date) {
        // 데이터 가 어떻게 받아올지 모르겠지만
        // 2021-12-20T17:14:34.508Z 형식일경우
        const paseDate = new Date(date);
        // const time = {
        //   year: paseDate.getFullYear(),
        //   month: paseDate.getMonth(),
        //   date: paseDate.getDate() as string | number,
        //   hour: paseDate.getHours(),
        //   second: paseDate.getSeconds(),
        // };

        // outPutTime = `작성 시간 : ${time.year}-${time.month}-${time.date}:${time.hour}:${time.second}`;
        outPutTime = paseDate.toLocaleString();
      }
      return outPutTime;
    };

    const setOpenViewData = (data: RestaurantInfoDto) => {
      if (!data) return;
      viewData.value = data;

      if (
        viewData.value.restaurantImageUrl !== null &&
        typeof viewData.value.restaurantImageUrl === "string" &&
        (viewData.value.restaurantImageUrl as string).length > 10
      ) {
        restaurantImageUrl.value = viewData.value.restaurantImageUrl;
      } else {
        restaurantImageUrl.value =
          "https://res.cloudinary.com/dhdq4v4ar/image/upload/v1603952836/sample.jpg";
      }

      if (viewData.value.resturantSuperUser.nickName === store.state.userName) {
        isSuperUser.value = true;
      } else if (props.isRoomSuperUser) {
        isSuperUser.value = true;
      } else {
        isSuperUser.value = false;
      }
      console.log(viewData.value);
    };

    const onClose = () => {
      resetFormData();
      emit("closeViewForm");
    };

    const onDeleteRestaurnt = () => {
      emit("DeleteRestrunt", viewData.value?.id);
    };

    const onAddCommentRestaurantById = async () => {
      const { id } = viewData.value!;

      const { ok, err } = await addRestaurantCommentById({
        restaurantId: id,
        role: EnumAddRestaurantCommentByIdIdInputDtoRole.User,
        message: addFormData.message,
        star: addFormData.star,
      });
      if (ok) {
        addFormData.message = "";
        updateRestaurant();
      } else {
        console.log(err);
      }
    };

    const onAddCommentByCommentId = async (id: number) => {
      const { ok, err } = await addMessageByCommentId({
        commentId: id,
        role: EnumAddMessageByCommentIdInPutDtoRole.Anonymous,
        message: addFormData.childMessage,
      });

      if (ok) {
        activeMessage.value = null;
        updateRestaurant();
      } else {
        console.log(err);
      }
    };

    const onEditCommentId = async (id: number) => {
      const { ok, err } = await editCommentMessage({
        id,
        message: addFormData.editMessage,
      });

      if (ok) {
        editActiveMessage.value = null;
        updateRestaurant();
      } else {
        console.log(err);
      }
    };

    const onEditChildComment = async (
      commentId: number,
      childCreateTime: string
    ) => {
      // console.log(commentId, childCreateTime, addFormData.editChildMessage);
      // console.log(new Date(childCreateTime));
      const { ok, err } = await editCommentChildMessage({
        id: commentId,
        createTime: new Date(childCreateTime),
        message: addFormData.editChildMessage,
      });

      if (ok) {
        editActiveChildMessage.value = null;
        updateRestaurant();
      } else {
        console.log(err);
      }
    };

    const onDeleteComment = async (id: number) => {
      if (window.confirm("정말로 삭제하시겠습니까?")) {
        const { ok, err } = await deleteComment(id);
        if (ok) {
          updateRestaurant();
        } else {
          console.log(err);
        }
      }
    };

    const updateRestaurant = () => {
      resetFormData();
      emit("UpdateRestaurantById", viewData.value!.id);
    };

    const resetFormData = () => {
      addFormData.message = "";
      addFormData.childMessage = "";
      addFormData.editChildMessage = "";
      addFormData.editMessage = "";
      addFormData.star = 5;
    };

    return {
      viewData,
      setOpenViewData,
      store,
      isSuperUser,
      getDateData,
      restaurantImageUrl,
      onClose,
      onDeleteRestaurnt,
      onAddCommentRestaurantById,
      ...toRefs(addFormData),
      setcommentId,
      onAddCommentByCommentId,
      onEditChildComment,
      activeMessage,
      onDeleteComment,
      editActiveChildMessage,
      setChildCommentCreateTime,
      onEditCommentId,
      editActiveMessage,
      setEditCommentId,
    };
  },
});
</script>

<style lang="scss"></style>
