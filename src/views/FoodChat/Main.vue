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
      class="max-w-xl w-full flex flex-col gap-[5px] px-4 py-8 mt-4 bg-blue-600 rounded-xl border-2 shadow-xl gird text-white"
    >
      <p>회원 가입 페이지</p>
      <div>
        <label for="username">아이디</label>
        <input
          class="w-[80%]"
          type="text"
          id="username"
          v-model="username"
          placeholder="한글 또는 영문 숫자를 입력하세요."
        />
      </div>

      <div>
        <label for="password">패스워드</label>
        <input
          class="w-[76%]"
          type="password"
          id="password"
          v-model="password"
        />
      </div>

      <div class="flex justify-between">
        <loading-btn
          class="border-2 w-44 h-12"
          :size="35"
          :isLoading="isLoadingSigUp"
          @click.prevent="userCreate"
        >
          <p>계정 만들기</p>
        </loading-btn>

        <button class="border-2" @click.prevent="isPageSigUp = false">
          돌아가기
        </button>
      </div>
    </form>
    <!-- 로그인 -->
    <form
      v-else
      class="max-w-xl w-full flex flex-col gap-[5px] px-4 py-8 mt-4 bg-blue-600 rounded-xl border-2 shadow-xl gird text-white"
    >
      <p>로그인</p>
      <div>
        <label for="username">아이디</label>
        <input class="w-[80%]" type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">패스워드</label>
        <input
          class="w-[76%]"
          type="password"
          id="password"
          v-model="password"
        />
      </div>
      <div class="flex justify-between">
        <loading-btn
          class="border-2 w-32 h-12"
          :size="35"
          :isLoading="isLoadingLogin"
          @click.prevent="userLogin"
        >
          <p>Login</p>
        </loading-btn>
        <button class="border-2" @click.prevent="isPageSigUp = true">
          Sign Up(회원가입)
        </button>
      </div>
    </form>
  </div>

  <!-- 로그인 됐을시 -->
  <div
    class="relative dark:bg-transparent"
    :style="[route.params.uuid ? mapViewStyles : {}]"
    v-else
  >
    <!--route-view 페이지 갱신 문제로 key값 추가 -->
    <router-view :key="route.fullPath" />

    <!-- 모바일 하단-->
    <div
      class="shadow-top fixed bottom-0 left-0 py-2 w-full h-[4.5rem] bg-blue-400 sm:hidden dark:bg-blue-900"
      style="z-index: 101"
    >
      <div class="flex w-full justify-around h-full text-center">
        <div
          class="cursor-pointer"
          @click.prevent="router.push('/foodChat/myRoomList')"
        >
          <div class="h-full w-[4rem]">
            <fa-icon :icon="['fa', 'list']" :size="'lg'" />
            <p class="sm:inline sm:pl-4">내 방들</p>
          </div>
        </div>
        <div
          class="cursor-pointer"
          @click.prevent="router.push('/foodChat/search')"
        >
          <div class="h-full">
            <fa-icon :icon="['fa', 'magnifying-glass']" :size="'lg'" />
            <p class="sm:inline sm:pl-4">서치</p>
          </div>
        </div>
        <div
          class="cursor-pointer"
          @click.prevent="router.push('/foodChat/MyPage')"
        >
          <div class="h-full">
            <fa-icon :icon="['fa', 'users']" :size="'lg'" />

            <p class="sm:inline sm:pl-4">마이 페이지</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 사이드바 -->
    <!-- sm 이상 사이드바 -->
    <div
      class="hidden sm:flex w-20 h-full fixed left-0 px-2 flex-col text-center inset-y-0 transition-all whitespace-nowrap bg-blue-400 shadow-lg shadow-slate-500 dark:bg-blue-900"
      style="z-index: 102"
    >
      <!-- 아이콘 & 클릭 트리거 -->
      <div
        class="flex h-full flex-col justify-start gap-12 pt-40 overflow-hidden"
      >
        <div
          class="cursor-pointer"
          @click.prevent="router.push({ name: 'myRoomList' })"
        >
          HOME
        </div>
        <div v-for="item in sideBarInfo" :key="item.id">
          <div
            class="cursor-pointer h-16 mx-auto w-full"
            @click.prevent="
              () => {
                isSideBarActive = true;
                if (sideBarClickedText === item.eventTrigger) {
                  isSideBarActive = false;
                  sideBarClickedText = '';
                  return;
                }
                sideBarClickedText = item.eventTrigger;
              }
            "
          >
            <div class="flex flex-col">
              <fa-icon
                :icon="['fa', item.faIcon]"
                :size="item.faSize"
                :class="
                  sideBarClickedText === item.eventTrigger
                    ? 'text-yellow-500'
                    : ''
                "
              />
              <p class="inline text-base">{{ item.text }}</p>
            </div>
          </div>
        </div>
        <!-- 정보창 랜더 없는 아이콘 & 클릭 트리거 -->
        <!-- <div
          @click.prevent="isActiveApprovalWait = true"
          class="cursor-pointer"
        >
          <fa-icon :icon="['fa', 'users']" size="2x" />
          <p class="text-base">승인 요청</p>
        </div> -->
      </div>
    </div>
    <!-- 사이드바 정보창 -->
    <div
      class="w-[max(30rem,40vw)] hidden z-[101] sm:flex h-full fixed left-20 flex-col inset-y-0 bg-white shadow-lg shadow-slate-500 transition-all duration-300"
      :class="
        isSideBarActive ? 'translate-x-0 ' : 'translate-x-[min(-34rem,-45vw)]'
      "
    >
      <!-- 화살표 -->
      <div
        class="left-[max(30rem,40vw)] absolute w-10 h-10 bottom-2/4 text-center flex flex-col justify-center bg-yellow-400 rounded-r-2xl cursor-pointer transition-all duration-300"
        @click.prevent="
          () => {
            if (!isSideBarActive) return;
            isSideBarActive = !isSideBarActive;
            sideBarClickedText = '';
          }
        "
      >
        <fa-icon :icon="['fa', 'arrow-left']" />
      </div>
      <!-- 콘텐츠 랜더 -->
      <div class="overflow-auto h-full">
        <div v-for="item in sideBarInfo" :key="item.id">
          <div
            class="w-full p-2"
            v-show="sideBarClickedText === item.eventTrigger"
          >
            <component :is="item.renderCompo" />
            <!-- <MyRooms class="w-full" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import {
  Component,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { createUser, logIn, logOut, testUser } from "@/api/auth";
import { useRoute, useRouter } from "vue-router";
import { getJoinRoomList } from "@/api/Room";
import LoadingBtn from "@/components/common/Input/LoadingBtn.vue";
import MyPage from "@/views/FoodChat/MyPage.vue";
import MyRooms from "@/views/FoodChat/MyRoomList.vue";
import SearchRoom from "@/views/FoodChat/SearchRoomList.vue";
import * as webSocket from "@/api/Socket";

interface ISaideBar {
  eventTrigger: string;
  faIcon: string;
  faSize: string;
  text: string;
  renderCompo: Component;
}

export default defineComponent({
  components: { LoadingBtn, MyRooms, SearchRoom, MyPage },
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

    // 사이드바
    const isSideBarActive = ref(false);
    const sideBarClickedText = ref("");

    const sideBarInfo = [
      {
        eventTrigger: "room",
        faIcon: "list",
        faSize: "2x",
        text: "참여 방들",
        renderCompo: MyRooms,
      },
      {
        eventTrigger: "search",
        faIcon: "magnifying-glass",
        faSize: "2x",
        text: "방 찾기",
        renderCompo: SearchRoom,
      },
      {
        eventTrigger: "myPage",
        faIcon: "users",
        faSize: "2x",
        text: "내 정보창",
        renderCompo: MyPage,
      },
    ] as ISaideBar[];

    // render view 넓이 설정 css
    const mapViewStyles = ref({
      height: "calc(var(--mobile--full) - 14.75rem)",
    });

    const setViewStyles = () => {
      if (window.innerWidth < 640) {
        // 모바일 지도
        mapViewStyles.value = {
          height: "calc(var(--mobile--full) - 13.4rem)",
        };
      } else {
        mapViewStyles.value = {
          height: "calc(var(--mobile--full) - 9.15rem)",
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

    onMounted(async () => {
      setViewStyles();
      window.addEventListener("resize", setViewStyles);
      console.log("마운트 로그인");
      isLogin.value && webSocket.init();

      // 로그인됐을시 토큰이 맞는지 확인
      if (isLogin.value) {
        const isT = await testUser();
        if (!isT) {
          logOut();
        }
      }
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

      // 사이드바
      isSideBarActive,
      sideBarClickedText,
      sideBarInfo,
    };
  },
});
</script>

<style lang="scss">
.shadow-top {
  filter: var(--shadow-fill-food-bottom);
}
</style>
