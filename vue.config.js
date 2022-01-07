const backUrl = "https://myapi.kimjuchan97.site";

module.exports = {
  devServer: {
    port: process.env.PORTS || 8000,
    disableHostCheck: true,
    proxy: {
      // 프록시 요청을 보낼 api의 시작 부분
      "^/api": {
        target: backUrl,
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/api": "/" },
        // logLevel: "debug",
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
        `,
      },
    },
  },
};
