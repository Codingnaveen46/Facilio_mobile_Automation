import { config as sharedConfig } from './wdio.shared.conf';

export const config = {
  ...sharedConfig,

  services: [
    ['appium', {
      command: 'appium',
      args: {
        port: 4723,
        basePath: '/wd/hub'
      }
    }]
  ],

  port: 4723,
  path: '/wd/hub',
  logLevel: 'info',

  capabilities: [{
    platformName: "iOS",
    "appium:deviceName": "Naveen's iPhone",     // ✅ no smart quotes
    "appium:udid": "00008020-00125D5E1E68402E",
    "appium:platformVersion": "18.3",           // ✅ clean version number
    "appium:automationName": "XCUITest",
    // Launch installed app
    "appium:bundleId": "com.facilio.mobile.workq.revive",

    "appium:noReset": true,
    "appium:autoAcceptAlerts": true
  }]
};
