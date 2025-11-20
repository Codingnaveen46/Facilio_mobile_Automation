# 📱 WDIO Appium BDD Framework (Facilio WorkQ)

This project is a robust mobile automation framework built using **WebdriverIO**, **Appium**, **Cucumber (BDD)**, and **TypeScript**. It supports Android and iOS (pending) automation with comprehensive reporting via Allure and integration with Bugasura.

## 🚀 Tech Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [WebdriverIO (v9)](https://webdriver.io/)
- **Mobile Automation**: [Appium](https://appium.io/)
- **BDD Framework**: [Cucumber](https://cucumber.io/)
- **Reporting**: [Allure Report](https://allurereport.org/)
- **Test Management**: Bugasura Integration

---

## 📂 Project Structure

```
wdio-appium-bdd/
├── apps/                 # Mobile app binaries (.apk / .ipa)
├── config/               # WDIO configuration files
│   ├── wdio.android.conf.ts
│   ├── wdio.ios.conf.ts
│   └── wdio.shared.conf.ts
├── src/                  # Source code and utilities
│   ├── helpers/          # Reusable helper functions (gestures, waits)
│   ├── services/         # Custom WDIO services
│   └── utils/            # Shared utilities (logger, etc.)
├── tests/                # Test files
│   ├── features/         # Gherkin feature files (.feature)
│   ├── pageobjects/      # Page Object Model (POM) classes
│   └── step-definitions/ # Step definitions mapping to features
├── results/              # JUnit XML results
├── allure-results/       # Raw Allure results
├── allure-report/        # Generated HTML report
└── package.json          # Dependencies and scripts
```

---

## 🛠️ Prerequisites

Before setting up the framework, ensure you have the following installed:

1.  **Node.js** (v18 or higher)
    ```bash
    node -v
    ```
2.  **Java Development Kit (JDK)** (v11 or higher)
    - Set `JAVA_HOME` environment variable.
3.  **Android Studio** (for Android testing)
    - Install Android SDK Platform-Tools.
    - Set `ANDROID_HOME` environment variable.
    - Create an Emulator (e.g., Pixel 9, API 35).
4.  **Appium**
    ```bash
    npm install -g appium
    appium driver install uiautomator2
    appium driver install xcuitest # For iOS
    ```
5.  **Appium Inspector** (Optional, for element inspection)

---

## ⚙️ Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd wdio-appium-bdd
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

---

## 🔧 Configuration

### 1. Environment Variables (`.env`)
Create a `.env` file in the root directory to store sensitive keys (e.g., Bugasura API keys). You can use `.env.example` as a reference if available.

```ini
BUGASURA_API_KEY=your_key
BUGASURA_TEAM_ID=your_team_id
BUGASURA_PROJECT_ID=your_project_id
BUGASURA_SERVER=your_server_url
BUGASURA_TESTRUN_ID=your_testrun_id
```

### 2. Android Configuration (`config/wdio.android.conf.ts`)
Update the following capabilities to match your local setup:

-   **Device Name**: Change `appium:deviceName` to your emulator/device name (e.g., "Pixel_9").
-   **Platform Version**: Update `appium:platformVersion` (e.g., "15").
-   **APK Path**: Ensure the APK exists at `apps/android/app-workq-release-8.apk` or update the path.
-   **Chromedriver**: Update `appium:chromedriverExecutable` to the path where your compatible Chromedriver is located.
    > **Note**: This is critical for hybrid apps or webviews.

---

## 🏃‍♂️ Running Tests

### Android
Run all Android tests:
```bash
npm run android
```
*This uses `config/wdio.android.conf.ts`.*

### iOS (Pending Setup)
Run all iOS tests:
```bash
npm run ios
```
*This uses `config/wdio.ios.conf.ts`.*

### Run Specific Features
To run a specific feature file (e.g., Login):
```bash
npx wdio config/wdio.android.conf.ts --spec tests/features/login.feature
```

### Run by Tags
You can filter tests by tags (configured in `wdio.shared.conf.ts`):
```bash
npx wdio config/wdio.android.conf.ts --cucumberOpts.tagExpression="@smoke"
```

---

## 📊 Reporting

### Allure Report
After the test execution, generate and open the Allure report:
```bash
npm run report
```
This will:
1.  Clean previous reports.
2.  Generate a new HTML report from `allure-results`.
3.  Open it in your default browser.

### Bugasura Integration
Test results are automatically uploaded to Bugasura if the environment variables are set correctly in `.env`.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Appium Server Fails** | Check if port 4723 is in use: `lsof -i :4723` and kill it: `kill -9 <PID>`. |
| **Device Not Found** | Run `adb devices` to ensure your emulator/device is connected. |
| **Chromedriver Error** | Ensure the `chromedriverExecutable` path in config matches the Chrome version on the device/emulator. |
| **SDK Issues** | Verify `ANDROID_HOME` is set correctly in your shell profile (`.zshrc` or `.bashrc`). |

---

## 🤝 Contributing

1.  Create a new branch for your feature/fix.
2.  Follow the BDD approach: Write the Feature -> Step Definition -> Page Object.
3.  Ensure all tests pass before merging.

---
