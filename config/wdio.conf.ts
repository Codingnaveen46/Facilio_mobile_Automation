import dotenv from 'dotenv';
dotenv.config();

export const config: WebdriverIO.Config = {
  runner: 'local',

  hostname: '127.0.0.1',
  port: 4723,
  path: '/wd/hub',   // <-- REQUIRED since your Appium server runs with /wd/hub

 specs: ['./tests/features/**/*.feature'],
  exclude: [],

  maxInstances: 1,
  framework: 'cucumber',

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false
      }
    ]
  ],

 cucumberOpts: {
  require: ['./features/step-definitions/**/*.ts'],  // <-- works if config is in project root
  timeout: 90000,
   ignoreUndefinedDefinitions: true,
   format: ['pretty'],
  requireModule: ['ts-node/register']          // 👈 add this line
},


  //@ts-ignore
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true
    }
  },

  logLevel: 'info',
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 1,

services: [
  [
    'appium',
    {
      command: 'appium',
      args: {
        basePath: '/wd/hub',
        port: 4723,
        address: '127.0.0.1',
        sessionOverride: true,
        log: './logs/appium.log'
      }
    }
  ]
],


capabilities: [{
  platformName: 'Android',
  'appium:deviceName': 'Pixel_9_Pro',
  'appium:platformVersion': '16',
  'appium:automationName': 'UiAutomator2',
  'appium:app': 'apps/android/app-workq-svg-helper.apk',
  'appium:autoGrantPermissions': true,
  'appium:noReset': false,
  'appium:fullReset': true
}]

};
