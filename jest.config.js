module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['./'],
  setupFiles: ["<rootDir>/test/dotenv-config.js"],
};
