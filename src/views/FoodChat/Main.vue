<template>
  <!-- <div>
    <button @click="getMyRoomlist">토큰 테스트</button>
    유저 닉네임 : {{ userName }}
  </div> -->
  <div
    v-if="!isLogin"
    class="h-5/6 flex py-4 items-start justify-center w-full text-3xl"
  >
    <!-- 회원가입 -->
    <form
      v-if="isPageSigUp"
      class="max-w-xl w-full px-4 bg-gray-400 py-4 mt-4 rounded-xl border-4 shadow-xl gird sm:grid-cols-1"
    >
      <p>회원 가입 페이지</p>
      <label for="username">아이디</label
      ><input type="text" id="username" v-model="username" />
      <br />
      <label for="password">패스워드</label
      ><input type="password" id="password" v-model="password" /><br />

      <div class="flex justify-between">
        <loading-btn
          class="border-2 w-40 h-12"
          Msg="계정 만들기"
          :size="35"
          :isLoading="isLoadingSigUp"
          @click.prevent="userCreate"
        />

        <button class="border-2" @click.prevent="isPageSigUp = false">
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
        <loading-btn
          class="border-2 w-32 h-12"
          Msg="Login"
          :size="35"
          :isLoading="isLoadingLogin"
          @click.prevent="userLogin"
        />
        <button class="border-2" @click.prevent="isPageSigUp = true">
          Sign Up(회원가입)
        </button>
      </div>
    </form>
  </div>

  <!-- 로그인 됐을시 -->
  <div
    class="relative"
    :style="[route.params.uuid ? mapViewStyles : {}]"
    v-else
  >
    <!--route-view 페이지 갱신 문제로 key값 추가 -->
    <router-view :key="route.fullPath" />

    <!-- 모바일 하단-->
    <div
      class="fixed bottom-0 left-0 py-4 w-full h-14 bg-gray-400 sm:hidden"
      style="z-index: 101"
    >
      <div class="flex w-full justify-around h-full">
        <div class="cursor-pointer" @click.prevent="router.push('/foodChat')">
          <div class="h-full">
            <fa-icon :icon="['fa', 'house']" />
            <p class="hidden sm:inline pl-4">방</p>
          </div>
        </div>
        <div
          class="cursor-pointer"
          @click.prevent="router.push('/foodChat/search')"
        >
          <div class="h-full">
            <fa-icon :icon="['fa', 'magnifying-glass']" />
            <p class="hidden sm:inline pl-4">서치</p>
          </div>
        </div>
        <div
          class="cursor-pointer"
          @click.prevent="router.push('/foodChat/MyPage')"
        >
          <div class="h-full">
            <fa-icon :icon="['fa', 'users']" />

            <p class="hidden sm:inline pl-4">마이 페이지</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { createUser, logIn } from "@/api/auth";
import { useRoute, useRouter } from "vue-router";
import { getJoinRoomList } from "@/api/Room";
import LoadingBtn from "@/components/common/Input/LoadingBtn.vue";
import * as webSocket from "@/api/Socket";

export default defineComponent({
  components: { LoadingBtn },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const userData = reactive({
      token: computed(() => store.state.token),
      userName: computed(() => store.state.userName),
    });

    const isLogin = ref(userData.token.length > 2);
    const isPageSigUp = ref(false);
    const isLoadingLogin = ref(false);
    const isLoadingSigUp = ref(false);

    // form
    const formData = reactive({
      username: "",
      password: "",
    });

    const resetFormData = () => {
      formData.username = "";
      formData.password = "";
    };

    // render view 넓이 설정 css
    const mapViewStyles = ref({
      height: "calc(var(--mobile--full) - 14.75rem)",
    });

    const setViewStyles = () => {
      if (window.innerWidth < 640) {
        // 모바일 지도
        mapViewStyles.value = {
          height: "calc(var(--mobile--full) - 13.35rem)",
        };
      } else {
        mapViewStyles.value = {
          height: "calc(var(--mobile--full) - 9rem)",
        };
      }
    };

    // CRUD
    const userCreate = async () => {
      isLoadingSigUp.value = true;

      const { ok, err } = await createUser({
        username: formData.username,
        password: formData.password,
      });

      isLoadingSigUp.value = false;
      if (ok) {
        alert("아이디가 만들어졌습니다.");
        isPageSigUp.value = false;
      } else {
        alert(`아이디 만들기에 실패하였습니다 : ${err}`);
      }
    };

    const userLogin = async () => {
      isLoadingLogin.value = true;
      const { ok, token, err } = await logIn({
        username: formData.username,
        password: formData.password,
      });
      if (ok) {
        alert("로그인 되었습니다.");
      } else {
        alert(`실패 하셔습니다 : ${err}`);
      }
      isLoadingLogin.value = false;
      resetFormData();
      // console.log(data.token);
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
        if (userData.token.length > 2) {
          console.log("로그인");
          webSocket.init();
          isLogin.value = true;
        } else {
          webSocket.close();
          console.log("로그아웃");
          isLogin.value = false;
        }
      }
    );

    watch(
      () => isPageSigUp.value,
      () => {
        resetFormData();
      }
    );

    onMounted(() => {
      setViewStyles();
      window.addEventListener("resize", setViewStyles);
      console.log("마운트 로그인");
      isLogin.value && webSocket.init();
    });
    onUnmounted(() => {
      window.removeEventListener("resize", setViewStyles);
      isLogin.value && webSocket.close();
      console.log("마운트 로그아웃");
    });

    return {
      ...toRefs(userData),
      ...toRefs(formData),
      userLogin,

      isLogin,
      userCreate,
      isPageSigUp,
      isLoadingLogin,
      isLoadingSigUp,
      router,
      route,
      getMyRoomlist,
      mapViewStyles,
    };
  },
});
</script>

<style lang="scss"></style>
