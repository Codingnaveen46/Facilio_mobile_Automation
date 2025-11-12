import type { Options } from "@wdio/types";
import dotenv from "dotenv";
import CleanAllureService from "../src/services/cleanAllure.service";

dotenv.config();

export const config: Options.Testrunner = {
  runner: "local",

  services: ["appium", CleanAllureService],

  specs: [`${process.cwd()}/tests/features/**/*.feature`],

  framework: "cucumber",

  reporters: [
    "spec",
    [
      "junit",
      {
        outputDir: "./results",
        outputFileFormat: (opts) => `results-${opts.cid}.xml`,
      },
    ],
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
      },
    ],
  ],

  cucumberOpts: {
    require: ["./tests/step-definitions/**/*.ts"],
    tagExpression: "@smoke or @Regression or @Login or @P0 or @P1",
    timeout: 90000,
  },

  logLevel: "info",
  waitforTimeout: 15000,
  //@ts-ignore
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: "./tsconfig.json",
      transpileOnly: true,
    },
  },

  /**
   * After test run, auto-generate Allure report
   */
  onComplete: function () {
    const { execSync } = require("child_process");
    console.log("\n📊 Generating Allure Report...");
    execSync("npx allure generate allure-results --clean", {
      stdio: "inherit",
    });
    console.log("✅ Allure report ready");
  },
};
