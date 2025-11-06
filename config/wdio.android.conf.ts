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
        chromedriverExecutableDir: `${process.cwd()}/node_modules/chromedriver/lib/chromedriver`
      }
    }]
  ],

  port: 4723,
  path: '/',
  logLevel: "info",

  capabilities: [
    {
      platformName: "Android",
      "appium:deviceName": "Pixel_9_Pro",
      "appium:platformVersion": "16",
      "appium:automationName": "UiAutomator2",
      "appium:app": `${process.cwd()}/apps/android/app-workq-svg-helper.apk`,
      "appium:appPackage": "com.facilio.mobile.workq.revive",
      "appium:appActivity": "com.facilio.mobile.MainActivity",
      "appium:autoGrantPermissions": true,
      "appium:noReset": false,
      "appium:fullReset": true,
      "appium:chromedriverAutodownload": true,
      "appium:ensureWebviewsHavePages": true,
      "appium:adbExecTimeout": 60000
    }
  ],

  afterStep: async function (
  test: any,
  context: any,
  { error }: { error?: Error }
) {
  const screenshotDir = path.join(process.cwd(), 'screenshots-temp');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  const fileName = `${Date.now()}-step.png`;
  const filePath = path.join(screenshotDir, fileName);

  await browser.saveScreenshot(filePath);

  // Attach only on failure
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
