const backUrl = process.env.VUE_APP_API_URL;

module.exports = {
  devServer: {
    port: process.env.PORTS || 8080,
    disableHostCheck: true,
    // nginx 사용시
    // nginx에서 프록시 설정
    proxy: {
      // 프록시 요청을 보낼 api의 시작 부분
      "^/api": {
        target: backUrl,
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/api": "/" },
        logLevel: "debug",
      },
    },
  },
  css: {
    loaderOptions: {
      // scss 글로벌 정의
      sass: {
        additionalData: `
        @use "~@/assets/scss/common/_variables.scss" as *;
        @use "~@/assets/scss/common/_class.scss" as *;
        @use "~@/assets/scss/import/media.scss" as *;
        @use "~@/assets/scss/import/transition.scss" as *;
        @use "~@/assets/scss/import/foodchat.scss" as *;
        `,
      },
    },
  },
};
