// @ts-nocheck
import type { Config } from "jest";

/**
 * Jest configuration for backend TypeScript tests.
 */
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/?(*.)+(test).ts"],
  clearMocks: true,
  collectCoverageFrom: ["src/services/**/*.ts", "src/modules/**/*.ts"],
  coverageDirectory: "../test-results/coverage/backend",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
  coverageThreshold: {
    global: {
      branches: 75,
      lines: 80,
      functions: 80,
      statements: 80,
    },
  },
};

export = config;
