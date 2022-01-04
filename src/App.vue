<template>
  <div id="nav">
    <router-link to="/">home</router-link> |
    <router-link to="/ds">음식 채팅방</router-link> |
  </div>

  <div>메인 홈페이지</div>
  <div class="render-view">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
}

a:-webkit-any-link {
  text-decoration: none;
}

#nav {
  padding: 1rem;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      // color: #42b983;
      color: $color-blue-0;
    }
  }
}

.render-view {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}
</style>
