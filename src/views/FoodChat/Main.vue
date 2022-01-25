<template>
  <loding :isLoding="isLoading" />
  <div class="underline">음식 채팅방 메인방</div>
  <div>
    <button @click="getMyRoomlist">토큰 테스트</button>
    유저 닉네임 : {{ userName }}
  </div>
  <div
    v-if="!isLogin"
    class="h-5/6 flex items-center justify-center w-full text-3xl"
  >
    <p>{{ token }}</p>
    <!-- 회원가입 -->
    <form
      v-if="isSignUp"
      class="max-w-xl w-full px-4 bg-gray-400 py-4 mt-4 rounded-xl border-4 shadow-xl gird sm:grid-cols-1"
    >
      <p>회원 가입 페이지</p>
      <label for="username">아이디</label
      ><input type="text" id="username" v-model="username" />
      <br />
      <label for="password">패스워드</label
      ><input type="password" id="password" v-model="password" /><br />

      <div class="flex justify-between">
        <button @click.prevent="userCreate" class="border-2">
          계정 만들기
        </button>
        <button class="border-2" @click.prevent="isSignUp = false">
          돌아가기
        </button>
      </div>
    </form>
    <!-- 로그인 -->
    <form
      v-else
      class="max-w-xl w-full px-4 bg-gray-400 py-4 mt-4 rounded-xl border-4 shadow-xl gird"
    >
      <p>로그인 페이지</p>
      <label for="username">아이디</label
      ><input type="text" id="username" v-model="username" />
      <br />
      <label for="password">패스워드</label
      ><input type="password" id="password" v-model="password" />
      <div class="flex justify-between">
        <button class="border-2" @click.prevent="userLogin">Login</button>
        <button class="border-2" @click.prevent="isSignUp = true">
          Sign Up(회원가입)
        </button>
      </div>
    </form>
  </div>

  <div v-else>
    <button class="border-2" @click.prevent="userLogOut">LogOut</button>
    <br />
    <!-- 페이지 갱신 문제로 key값 추가 -->
    <router-view :key="route.fullPath" />
    <!-- 모바일 하단 -->
    <div class="absolute bottom-0 left-0 w-full h-20 py-4 bg-gray-400">
      <div class="flex w-full justify-around h-full">
        <div class="cursor-pointer" @click="router.push('/foodChat')">
          <img class="h-full" src="@/assets/images/home-icon.png" alt="" />
        </div>
        <div class="cursor-pointer" @click="router.push('/foodChat/search')">
          <img class="h-full" src="@/assets/images/search.png" alt="" />
        </div>
        <div class="cursor-pointer" @click="router.push('/foodChat/MyPage')">
          <img class="h-full" src="@/assets/images/user-shape.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
import { createUser, logIn, logOut } from "@/api/auth";
import { useRoute, useRouter } from "vue-router";
import { getJoinRoomList } from "@/api/Room";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(false);
    const userData = reactive({
      token: computed(() => store.state.token),
      userName: computed(() => store.state.userName),
    });
    const isLogin = ref(userData.token.length > 2);
    const isSignUp = ref(false);

    const formData = reactive({
      username: "",
      password: "",
    });
    const resetFormData = () => {
      formData.username = "";
      formData.password = "";
    };
    const userCreate = async () => {
      isLoading.value = true;

      const { ok, err } = await createUser({
        username: formData.username,
        password: formData.password,
      });
      isLoading.value = false;
      if (ok) {
        alert("아이디가 만들어졌습니다.");
        isSignUp.value = false;
      } else {
        alert(`아이디 만들기에 실패하였습니다 : ${err}`);
      }
    };

    const userLogin = async () => {
      const { ok, token } = await logIn({
        username: formData.username,
        password: formData.password,
      });
      if (ok) {
        alert("로그인 되었습니다.");
      }
      resetFormData();
      // console.log(data.token);
    };
    const userLogOut = () => {
      router.push("/foodChat");
      logOut();
    };

    const getMyRoomlist = async () => {
      const { ok, myRooms, err } = await getJoinRoomList();
      if (ok) {
        console.log(myRooms);
      } else {
        console.log(err);
      }
    };

    watch(
      () => userData.token,
      () => {
        isLogin.value = userData.token.length > 2;
      }
    );

    watch(
      () => isSignUp.value,
      () => {
        resetFormData();
      }
    );

    return {
      ...toRefs(userData),
      ...toRefs(formData),
      userLogin,
      userLogOut,
      isLogin,
      userCreate,
      isSignUp,
      isLoading,
      router,
      route,
      getMyRoomlist,
    };
  },
});
</script>

<style scoped></style>
