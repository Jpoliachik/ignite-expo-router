const { defaults: tsjPreset } = require("ts-jest/presets")

/** @type {import('@jest/types').Config.ProjectConfig} */
module.exports = {
  ...tsjPreset,
  preset: "jest-expo",
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-clone-referenced-element|react-native-code-push)",
    "jest-runner",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.maestro/", "@react-native"],
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/test/setup.ts"],
  transform:{
    '^.+\\.test.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/test/test-tsconfig.json'
    }]
  }
}
