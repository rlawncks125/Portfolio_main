<template>
  <div class="px-2 mb-[5rem] overflow-y-auto">
    <div>FoodChat Home</div>
    <button @click.prevent="router.push('/foodChat/myRoomList')">
      포트폴리오 가기
    </button>

    <br />
    <br />
    <section>
      <h4>
        내 주변의 음식점 리뷰 기능을 구현 해봤습니다.
        <br />
        점심시간에 밖에가서 먹어야 할때 블로그 리뷰 , 카페 리뷰 등을 찾곤 하죠
        <br />
        하지만 리뷰들을 보면 , 광고 같은 리뷰들도 많을 겁니다.
        <br />
        이 앱을 만든 이유는
        <br />
        같은 그룹 사람들 끼리
        <br />
        활동 하고 있는 지역을 중심으로
        <br />
        주변 음식점 리뷰를 그룹 끼리만 공유를하고
        <br />
        특정 인물이 음식을 싫어하는 경우 메모지 같은 느낌 으로
        <br />
        댓글을 달아 기록을 남기면 좋겠다 싶어서 만들었습니다.
        <br />
        닉네임을 한글 닉네임으로도 만들수 있게 했습니다.
      </h4>
    </section>

    <section class="sm:hidden">
      <!-- 아이콘 설명 -->
      <div
        class="fixed bottom-[3.5rem] left-0 w-full flex justify-around text-center bg-orange-400 text-fuchsia-800"
      >
        <div>
          <p>내 방 목록</p>
          <p>↓</p>
        </div>
        <div>
          <p>방찾기</p>
          <p>↓</p>
        </div>
        <div>
          <p>내 정보</p>
          <p>↓</p>
        </div>
      </div>

      <!-- 모바일 하단-->
      <div
        class="fixed bottom-0 left-0 py-4 w-full h-14 bg-gray-400 sm:hidden"
        style="z-index: 101"
      >
        <div class="flex w-full justify-around h-full">
          <div
            class="cursor-pointer"
            @click.prevent="router.push('/foodChat/myRoomList')"
          >
            <div class="h-full">
              <fa-icon :icon="['fa', 'list']" />
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
    </section>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    return { router };
  },
};
</script>

<style lang="scss" scoped></style>
