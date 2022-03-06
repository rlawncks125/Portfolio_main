<template>
  <div
    class="fixed bg-gray-600 inset-0 w-screen h-screen text-2xl sm:text-base"
    style="z-index: 1001"
  >
    <div
      class="relative overflow-auto max-w-5xl p-2 pt-0 pb-12 h-full bg-yellow-100 inset-0 sm:w-11/12 sm:h-5/6 sm:mx-auto sm:my-12 sm:rounded-xl sm:overflow-y-auto sm:p-4"
    >
      <div
        class="-translate-x-2 w-screen sticky px-8 py-4 top-0 flex justify-between bg-yellow-100 items-center"
        style="z-index: 103"
      >
        <button class="text-3xl" @click="onClose">&lt;</button>
        <p>{{ viewData.restaurantName }}</p>
        <button v-if="isSuperUser" @click="onDeleteRestaurnt">삭제 버튼</button>
      </div>
      <!-- <button class="hidden sm:block absolute top-2 right-2" @click="onClose">
        X
      </button> -->

      <!-- <p>접속유저 : {{ store.state.userName }}</p> -->
      <div class="h-80 sm:h-96 -translate-x-2 w-screen">
        <img
          class="bg-cover bg-center w-full h-full"
          :src="restaurantImageUrl"
        />
      </div>

      <div class="flex items-center mb-3 gap-2">
        <span class="text-3xl">평균 별점 </span>
        <star-fill :starNum="5" :starSize="2" :fill="viewData.avgStar" />
      </div>
      <div class="flex flex-wrap items-center gap-2 pb-8 mb-8 border-b-2">
        <span> 전문 분야 </span>
        <template v-for="special in viewData.specialization" :key="special.id">
          <p class="text-gray-500 bg-yellow-400 rounded-full py-1 px-3">
            {{ special }}
          </p>
        </template>
      </div>

      <div v-if="viewData.hashTags.length > 0" class="flex gap-1">
        <template v-for="tag in viewData.hashTags" :key="tag.id">
          <p class="px-1 text-indigo-100 bg-cyan-500 rounded-full">
            {{ tag }}
          </p>
        </template>
      </div>

      <!-- 댓글 -->
      <form>
        <fieldset
          class="border-2 p-2 rounded-2xl grid max-w-full grid-cols-1 justify-items-center"
        >
          <legend class="text-left ml-4">후기 리뷰</legend>
          <p v-if="viewData.comments.length === 0">리뷰가 없습니다.</p>

          <div class="text-left w-full">
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
                <div
                  v-show="
                    store.state.userName === comment.message.userInfo.nickName
                  "
                >
                  <button @click="setEditCommentId(comment.id)">수정</button>
                  <button @click="onDeleteComment(comment.id)">삭제</button>
                </div>
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
              <!-- 대댓글 -->
              <div
                class="ml-6 pl-4 flex flex-col border-2 gap-1"
                v-for="childMessages in comment.childMessages"
                :key="childMessages.id"
              >
                <div class="whitespace-pre-wrap">
                  <div class="flex justify-between -translate-x-2">
                    <div>
                      <span class="translate-y-4">└ </span>
                      <span>
                        {{ childMessages.userInfo.nickName }}[{{
                          childMessages.userInfo.role
                        }}]
                      </span>
                      <span class="text-gray-500">
                        {{ getDateData(childMessages.CreateTime) }}
                      </span>
                    </div>
                    <button
                      class="text-red-300"
                      v-show="
                        store.state.userName === childMessages.userInfo.nickName
                      "
                      @click="
                        setChildCommentCreateTime(childMessages.CreateTime)
                      "
                    >
                      수정 하기
                    </button>
                  </div>
                  <p>
                    {{ childMessages.message }}
                  </p>
                </div>
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
        </fieldset>
      </form>

      <!-- 댓글 달기 -->
      <div class="mt-4 flex flex-col text-left pb-14">
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

      // console.log(activeMessage.value);
    };

    const setChildCommentCreateTime = (createTime: string) => {
      if (editActiveChildMessage.value === createTime) {
        editActiveChildMessage.value = null;
        return;
      }

      editActiveChildMessage.value = createTime;
      addFormData.childMessage = "";
      // console.log(editActiveChildMessage.value);
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
      let outPutTime: number | string = 0;
      if (date) {
        // 데이터 가 어떻게 받아올지 모르겠지만
        // 2021-12-20T17:14:34.508Z 형식일경우
        const paseDate = new Date(date);
        const nt = new Date();
        // const time = {
        //   year: paseDate.getFullYear()
        //   month: paseDate.getMonth(),
        //   date: paseDate.getDate() as string | number,
        //   hour: paseDate.getHours(),
        //   second: paseDate.getSeconds(),
        // };

        // outPutTime = paseDate.toLocaleString();

        if (paseDate.getFullYear() !== nt.getFullYear()) {
          const year = nt.getFullYear() - paseDate.getFullYear();
          const month = nt.getMonth() - paseDate.getMonth();

          outPutTime = `${year * 12 + month}달 전`;
        } else if (paseDate.getMonth() !== nt.getMonth()) {
          const month = nt.getMonth() - paseDate.getMonth();
          outPutTime = `${month}달 전`;
        } else if (paseDate.getDate() != nt.getDate()) {
          const day = nt.getDate() - paseDate.getDate();
          const hours = nt.getHours() - paseDate.getHours();

          if (day > 1) {
            outPutTime = `${day}일 전`;
          } else {
            outPutTime = `${day * 24 + hours}시간 전`;
          }
        } else if (paseDate.getHours() != nt.getHours()) {
          const hours = nt.getHours() - paseDate.getHours();
          const min = nt.getMinutes() - paseDate.getMinutes();

          if (hours > 1) {
            outPutTime = `${hours}시간 전`;
          } else {
            outPutTime = `${hours * 60 + min}분 전`;
          }
        } else if (paseDate.getMinutes() != nt.getMinutes()) {
          const min = nt.getMinutes() - paseDate.getMinutes();
          outPutTime = `${min}분 전`;
        } else {
          outPutTime = "방금 전";
        }
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
      emit("DeleteRestrunt", viewData.value!.id);
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
      emit("UpdateRestaurantById", viewData.value!.id);
      resetFormData();
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
