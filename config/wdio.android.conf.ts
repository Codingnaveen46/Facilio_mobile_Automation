import { config as sharedConfig } from "./wdio.shared.conf";
import fs from "fs";
import path from "path";
import allure from "@wdio/allure-reporter";
import dotenv from "dotenv";
import CleanAllureService from "../src/services/cleanAllure.service";
dotenv.config(); // 👈 Load .env variables securely

export const config = {
  ...sharedConfig,

  // 🔒 Sequential execution on single device
  maxInstances: 1,

  suites: {
    regression: [path.resolve(__dirname, "../tests/features/**/*.feature")],
    smoke: [path.resolve(__dirname, "../tests/features/login.feature")],
  },

  // ⚠️ No Appium service - user runs Appium manually
  // ✅ CleanAllureService clears allure-results before each run
  services: [[CleanAllureService, {}]],

  // 🐳 Docker/Env support
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT || "4723", 10),
  path: process.env.APPIUM_PATH || "/wd/hub",
  logLevel: "info",

  capabilities: [
    {
      platformName: "Android",
      "appium:deviceName": process.env.DEVICE_NAME || "Pixel_9",
      "appium:platformVersion": process.env.PLATFORM_VERSION || "15",
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
  // 🏷️ Add Cucumber tags to Allure report as labels
  //
  beforeScenario: async function (world: any) {
    const tags = world.pickle?.tags || [];
    for (const tag of tags) {
      const tagName = tag.name.replace("@", ""); // Remove @ prefix
      allure.addLabel("tag", tagName);
    }
  },

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

      // Find all XML files in the results directory (excluding combined file)
      const resultsDir = path.join(process.cwd(), "results");
      const xmlFiles = fs
        .readdirSync(resultsDir)
        .filter(
          (file: string) =>
            file.endsWith(".xml") && file !== "combined-results.xml"
        );

      if (xmlFiles.length === 0) {
        console.warn("⚠️ No XML result files found in results directory.");
        return;
      }

      console.log(`📄 Found ${xmlFiles.length} XML result file(s). Merging...`);

      // Merge all XML files into a single combined file
      let totalTests = 0;
      let totalFailures = 0;
      let totalErrors = 0;
      let totalSkipped = 0;
      let allTestSuites = "";

      for (const xmlFile of xmlFiles) {
        const xmlPath = path.join(resultsDir, xmlFile);
        const xmlContent = fs.readFileSync(xmlPath, "utf-8");

        // Extract testsuite content (between <testsuites> tags)
        const testsuiteMatch = xmlContent.match(
          /<testsuite[\s\S]*?<\/testsuite>/g
        );
        if (testsuiteMatch) {
          allTestSuites += testsuiteMatch.join("\n  ");
        }

        // Extract counts from testsuites tag
        const countsMatch = xmlContent.match(
          /<testsuites tests="(\d+)" failures="(\d+)" errors="(\d+)" skipped="(\d+)"/
        );
        if (countsMatch) {
          totalTests += parseInt(countsMatch[1], 10);
          totalFailures += parseInt(countsMatch[2], 10);
          totalErrors += parseInt(countsMatch[3], 10);
          totalSkipped += parseInt(countsMatch[4], 10);
        }
      }

      // Create combined XML
      const combinedXml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="${totalTests}" failures="${totalFailures}" errors="${totalErrors}" skipped="${totalSkipped}">
  ${allTestSuites}
</testsuites>`;

      const combinedPath = path.join(resultsDir, "combined-results.xml");
      fs.writeFileSync(combinedPath, combinedXml);
      console.log(`✅ Merged into: combined-results.xml`);

      // Upload the combined XML file to Bugasura
      console.log(`\n📤 Uploading combined-results.xml to Bugasura...`);
      const uploadCmd = `bugasura UPLOAD_RESULTS results/combined-results.xml \
        --api_key ${BUGASURA_API_KEY} \
        --team_id ${BUGASURA_TEAM_ID} \
        --project_id ${BUGASURA_PROJECT_ID} \
        --server ${BUGASURA_SERVER} \
        --testrun_id ${BUGASURA_TESTRUN_ID}`;

      execSync(uploadCmd, { stdio: "inherit" });
      console.log("\n🎉 Bugasura upload completed successfully.");
    } catch (err: any) {
      console.error("❌ Bugasura upload failed:", err?.message || err);
    }
  },
};
