import { config as sharedConfig } from './wdio.shared.conf';

export const config = {
  ...sharedConfig,

  services: [['appium', { command: 'appium' }]],

  capabilities: [{
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 15',
    'appium:platformVersion': '17.2',
    'appium:automationName': 'XCUITest',
    'appium:app': './apps/ios/MyApp.app'
  }]
}
