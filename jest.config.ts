/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {

  clearMocks: true,
  collectCoverage: false,
  coverageProvider: "v8",
  testMatch: [
    "**/*.spec.ts",
  ],

  transform: {
    "^.+\.(t|j)sx?$": ["@swc/jest"]
  },
};
