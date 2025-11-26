import { config as sharedConfig } from "./wdio.shared.conf";
import fs from "fs";
import path from "path";
import allure from "@wdio/allure-reporter";
import dotenv from "dotenv";
dotenv.config(); // 👈 Load .env variables securely

export const config = {
  ...sharedConfig,

  suites: {
    regression: [path.resolve(__dirname, "../tests/features/**/*.feature")],
    smoke: [path.resolve(__dirname, "../tests/features/login.feature")],
  },

  // Comment out if you're running Appium manually
  // Uncomment for CI/CD or if you want WDIO to start Appium automatically
  services: [
    // [
    //   "appium",
    //   {
    //     command: "appium",
    //     args: {
    //       port: 4723,
    //       basePath: "/wd/hub",
    //     },
    //   },
    // ],
  ],

  port: 4723,
  path: "/wd/hub",
  logLevel: "info",

  capabilities: [
    {
      platformName: "Android",
      "appium:deviceName": "Pixel_9",
      "appium:platformVersion": "15",
      "appium:automationName": "UiAutomator2",

      // App under test
      "appium:app": `${process.cwd()}/apps/android/app-workq-release-8.apk`,
      "appium:appPackage": "com.facilio.mobile.workq.revive",
      "appium:appActivity": "com.facilio.mobile.MainActivity",

      "appium:autoGrantPermissions": true,
      "appium:noReset": false,
      "appium:fullReset": true,

      "appium:ensureWebviewsHavePages": true,
      "appium:adbExecTimeout": 60000,

      "appium:chromedriverExecutable":
        "/Users/apple/chromedrivers/124/chromedriver",
    },
  ],

  //
  // 📸 Capture screenshots after each step and attach to Allure
  //
  afterStep: async function (test: any, context: any, { error }: any) {
    const screenshotDir = path.join(process.cwd(), "screenshots-temp");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir);
    }

    const filePath = path.join(screenshotDir, `${Date.now()}-step.png`);
    await browser.saveScreenshot(filePath);

    if (error) {
      await allure.addAttachment(
        "Failure Screenshot",
        fs.readFileSync(filePath),
        "image/png"
      );
    }
  },

  //
  // 🧹 Cleanup logic after scenario
  //
  afterScenario: async function (world: unknown, result: { passed: boolean }) {
    const screenshotDir = path.join(process.cwd(), "screenshots-temp");
    if (result.passed) {
      fs.rmSync(screenshotDir, { recursive: true, force: true });
    } else {
      console.log("❗ Test failed — keeping screenshots for debugging.");
    }
  },

  //
  // 🐞 After all tests finish — auto-generate Allure & upload to Bugasura
  //
  onComplete: function () {
    const { execSync } = require("child_process");

    try {
      console.log("\n📊 Generating Allure Report...");
      execSync("npx allure generate allure-results --clean", {
        stdio: "inherit",
      });
      console.log("✅ Allure report generated successfully.");

      console.log("\n🐞 Uploading test results to Bugasura...");
      const {
        BUGASURA_API_KEY,
        BUGASURA_TEAM_ID,
        BUGASURA_PROJECT_ID,
        BUGASURA_SERVER,
        BUGASURA_TESTRUN_ID,
      } = process.env;

      if (!BUGASURA_API_KEY) {
        console.warn("⚠️ BUGASURA_API_KEY not found in .env. Skipping upload.");
        return;
      }

      const uploadCmd = `bugasura UPLOAD_RESULTS results/results-0-0.xml \
        --api_key ${BUGASURA_API_KEY} \
        --team_id ${BUGASURA_TEAM_ID} \
        --project_id ${BUGASURA_PROJECT_ID} \
        --server ${BUGASURA_SERVER} \
        --testrun_id ${BUGASURA_TESTRUN_ID}`;

      execSync(uploadCmd, { stdio: "inherit" });
      console.log("✅ Bugasura upload completed successfully.");
    } catch (err: any) {
      console.error("❌ Bugasura upload failed:", err?.message || err);
    }
  },
};
