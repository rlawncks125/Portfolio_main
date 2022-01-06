module.exports = {
  devServer: {
    port: process.env.PORTS || 8000,
    disableHostCheck: true,
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
