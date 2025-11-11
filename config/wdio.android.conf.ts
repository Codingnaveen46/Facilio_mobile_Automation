import { config as sharedConfig } from './wdio.shared.conf';
import fs from 'fs';
import path from 'path';
import allure from '@wdio/allure-reporter';

export const config = {
  ...sharedConfig,

  services: [
    ['appium', {
      command: 'appium',
      args: {
        port: 4723,
        basePath: '/wd/hub'   // ✅ Must match path below
      }
    }]
  ],

  port: 4723,
  path: '/wd/hub',            // ✅ Must match service basePath
  logLevel: "info",

  capabilities: [
    {
      platformName: "Android",
      "appium:deviceName": "Pixel_9",
      "appium:platformVersion": "15",
      "appium:automationName": "UiAutomator2",

      // Your app
      "appium:app": `${process.cwd()}/apps/android/app-workq-release 8.apk`,
      "appium:appPackage": "com.facilio.mobile.workq.revive",
      "appium:appActivity": "com.facilio.mobile.MainActivity",

      "appium:autoGrantPermissions": true,
      "appium:noReset": false,
      "appium:fullReset": true,

      "appium:ensureWebviewsHavePages": true,
      "appium:adbExecTimeout": 60000,

      // ✅ Use your correct ChromeDriver v124
      "appium:chromedriverExecutable": "/Users/apple/chromedrivers/124/chromedriver"
    }
  ],

 afterStep: async function (test: any, context: any, { error }: any) {
  const screenshotDir = path.join(process.cwd(), 'screenshots-temp');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  const filePath = path.join(screenshotDir, `${Date.now()}-step.png`);
  await browser.saveScreenshot(filePath);

  if (error) {
    await allure.addAttachment(
      'Failure Screenshot',
      fs.readFileSync(filePath),
      'image/png'
    );
  }
},

afterScenario: async function (
  world: unknown,
  result: { passed: boolean }
) {
  const screenshotDir = path.join(process.cwd(), 'screenshots-temp');

  if (result.passed) {
    fs.rmSync(screenshotDir, { recursive: true, force: true });
  } else {
    console.log('❗ Test failed — keeping screenshots for debugging.');
  }
},

};
 