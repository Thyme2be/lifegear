const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // path ของ project
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

module.exports = createJestConfig(customJestConfig);
