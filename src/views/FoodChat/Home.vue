<template>
  <div class="px-2 mb-[5rem] overflow-y-auto">
    <div>FoodChat Home</div>
    <button @click.prevent="router.push('/foodChat/myRoomList')">
      내 방리스트 보기
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
      </h4>
    </section>

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
