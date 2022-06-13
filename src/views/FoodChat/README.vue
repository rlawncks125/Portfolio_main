<template>
  <div class="px-2 h-full mb-[5rem] sm:mb-0 overflow-y-auto max-w-7xl mx-auto">
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
