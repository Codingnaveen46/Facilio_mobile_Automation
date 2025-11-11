# WDIO Appium BDD (Facilio WorkQ Mobile Automation)

This project automates the flow of the applicatication.
* WebdriverIO
* Appium
* Cucumber (BDD with Gherkin)
* TypeScript
* Allure reporting

The framework is structured for maintainability, with clear separation between feature files, page objects, and step definitions.

---

## Project Structure

```
src/
  helpers/        // Reusable utility helpers (scroll, wait, permissions, dropdowns)
  services/       // Custom WDIO services (example: clean allure reports)
  utils/          // Logger and shared utilities
  tests/
    features/     // Gherkin feature files (.feature)
    pageobjects/  // Screen-level classes for UI elements and actions
    step-definitions/ // Step implementations mapped to feature steps
config/           // WDIO configuration files for Android, iOS, shared setup
apps/             // Mobile app binaries (.apk / .ipa)
allure-results/   // Execution results for reporting
allure-report/    // Generated HTML report
```

---

## Requirements

Before running tests, make sure:

### Android

* Android Studio is installed
* Apppium
* Appium inspector
* An emulator or real device is connected
* Platform API 34 or 35 recommended Android 15 
### iOS (Optional, still pending setup )

* Xcode installed
* Valid signing setup for WebDriverAgent
* A real device or simulator

---

## Installation

Clone the repo and install dependencies:

```bash
npm install
```

---

## Running Tests

### Android

To run tests on Android:

```bash
npx wdio config/wdio.android.conf.ts
```

or (using the predefined script)

```bash
npm run android
```

### iOS

Tests are not fully configured yet, but once ready you will be able to run:

```bash
npm run ios
```

### Shared test execution (runs based on device settings in shared config)

```bash
npm test
```

---

## Reports (Allure)

After test execution:

```bash
npm run report
```

This generates and opens the Allure HTML report.

---

## Useful Commands

| Command                                       | Description                                             |
| --------------------------------------------- | ------------------------------------------------------- |
| `npx appium --base-path /wd/hub --allow-cors` | Starts Appium server with inspector support             |
| `lsof -i :4723`                               | Checks if Appium server is already running on port 4723 |
| `killall -9 node`                             | Force stops any running Appium server sessions          |
| `emulator -avd Pixel_9`                       | Launches Android emulator named `Pixel_9`               |
| `adb devices`                                 | Verifies connected emulator/device availability         |



| Command                                                                        | Description                                     |
| ------------------------------------------------------------------------------ | ----------------------------------------------- |
| `npx wdio config/wdio.android.conf.ts --spec tests/features/workorder.feature` | Runs **only** the Work Order feature on Android |
| `npx wdio config/wdio.android.conf.ts --spec tests/features/login.feature`     | Runs **only** the Login feature on Android      |



## Emulator Usage

You can run tests directly on:

* An Android **emulator** started from Android Studio
* A real Android device with USB debugging enabled

Make sure your device/emulator is detected:

```bash
adb devices
```

---

## Notes

* Credentials are currently hardcoded inside test or config. If needed, you can move them into a `.env` file later and load them using dotenv.
* iOS execution setup is pending configuration. Once WDA and device signing is ready, tests can be enabled using the existing config (`wdio.ios.conf.ts`).
