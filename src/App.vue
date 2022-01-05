<template>
  <input class="out-checkd" type="checkbox" v-model="isCehckd" />
  <div id="nav">
    <div class="nav-home" @click="changePage">
      <router-link to="/">
        <img src="@/assets/images/HOME.png" alt="" />
      </router-link>
    </div>
    <div class="nav-wrap" @click="changePage">
      <router-link to="/foodChat">음식 채팅방</router-link>
      <router-link to="/ds">다른 포폴</router-link>
      <router-link to="/ds">다른 포폴</router-link>
      <router-link to="/ds">다른 포폴</router-link>
    </div>
    <!-- <input class="in-checkd" type="checkbox" v-model="isCehckd" /> -->
  </div>

  <div class="render-view">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    // const isCehckd = ref();

    // const changePage = () => {
    //   isCehckd.value = false;
    //   console.log("cc");
    // };

    return {};
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300&family=Song+Myung&display=swap");

$max-width: 1280px;
$checkd-width: 50px;
$checkd-height: 5rem;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  @include xs() {
    font-size: 12px;
  }
  @include sm() {
    font-size: 12px;
  }
  @include md() {
    font-size: 16px;
  }
  @include lg() {
    font-size: 18px;
  }
  @include xl() {
    font-size: 18px;
  }
  @include xxl() {
    font-size: 18px;
  }
}

body {
  background-color: $color-blue-0;
}

#app {
  font-family: "IBM Plex Sans KR", sans-serif;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 30px;
  color: #2c3e50;

  display: grid;
  grid-template:
    "nav nav nav nav" 5rem
    "render-view render-view render-view render-view" minmax(50px, auto)
    / 1fr 2fr 2fr 1fr;
  justify-items: center;
  @include mobile() {
    grid-template:
      ". nav nav ." 5rem
      "render-view render-view render-view render-view" minmax(50px, auto)
      / 1fr 1fr 1fr 1fr;
  }
}

a:-webkit-any-link {
  text-decoration: none;
}

#nav {
  grid-area: nav;
  width: 100%;
  max-width: $max-width;
  text-align: center;
  background-color: $color-blue-2;

  a {
    height: 100%;
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }

  .nav-home {
    height: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .nav-wrap {
    a {
      border: 1px solid black;
    }
  }

  @include mobile() {
    .nav-home {
      width: 100%;
    }
    .nav-wrap {
      display: flex;
      position: fixed;
      top: $checkd-height;
      left: 0;
      width: 100%;
      flex-direction: column;
      flex-wrap: wrap;
      z-index: 1000;
      background-color: aliceblue;

      transform: translateX(-1000px);
      transition: transform 0.2s ease-in-out;
    }
  }

  @mixin mobile-high-setup() {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .nav-home {
      width: 250px;
      padding: 0 1rem;
    }
    .nav-wrap {
      display: flex;
      flex-wrap: wrap;
    }
  }
  @include tablet() {
    @include mobile-high-setup();
  }
  @include laptop() {
    @include mobile-high-setup();
  }
  @include desktop() {
    @include mobile-high-setup();
  }
}

.out-checkd {
  display: none;
  width: $checkd-width;
  height: $checkd-height;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;

  &:checked ~ #nav {
    .nav-wrap {
      transform: translateX(0px);
    }
  }

  &:checked {
    &::after {
      display: block;
      content: " ";
      position: fixed;
      margin-top: $checkd-height;
      width: 100vw;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0.5;
      background-color: black;
    }
  }
  @include mobile() {
    display: block;
  }
}

// .in-checkd {
//   display: none;
//   position: fixed;
//   top: 0;
//   left: 0;
//   z-index: 1001;
//   width: $checkd-width;
//   height: $checkd-height;

//   @include mobile() {
//     display: block;
//   }
// }

.render-view {
  grid-area: render-view;
  width: 100%;
  height: 100%;
  max-width: $max-width;
}
</style>
