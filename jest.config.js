module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
    // process `*.ts` files with `ts-jest`
    "^.+\\.tsx?$": "ts-jest",
  },
  // node_modules 경로 하위에 있는 모든 테스트 파일을 대상에서 제외합니다
  testPathIgnorePatterns: ["/node_modules/"],

  // 커버리지
  // collectCoverage: true,
  collectCoverageFrom: [
    "src/components/**/*.{js,vue}",
    "src/views/**/*.vue",
    "src/App.vue",
    "!**/node_modules/**",
  ],

  moduleFileExtensions: [
    "js",
    "ts",
    "json",
    // tell Jest to handle `*.vue` files
    "vue",
  ],

  // testPathIgnorePatterns 포함된 제외시킨 파일중
  // 특정 파일은 테스팅하는데 포함시킨다
  transformIgnorePatterns: [
    // "/node_modules/(?!(vue-radial-progress|navermaps)/)",
    "/node_modules/(?!(vue-radial-progress)/)",
  ],

  setupFiles: ["<rootDir>/tests/__mocks__/setup.ts"],
  verbose: true,
};
