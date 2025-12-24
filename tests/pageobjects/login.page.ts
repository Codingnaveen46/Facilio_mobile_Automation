import PermissionsHelper from "../../src/helpers/permissionsHelper";
import { ContextHelper } from "../../src/helpers/contextHelper";

class LoginPage {
  // Header on Welcome screen
  get pageHeader() {
    return $('//android.widget.TextView[@text="Maximize Your Output."]');
  }
  // Welcome/Login screen
  get loginButton() {
    return $("~Login");
  }

  // WebView login fields
  get emailField() {
    return $('//input[@name="username"]');
  }
  get submitButton() {
    return $('//button[@name="action"]');
  }
  get passwordField() {
    return $('//input[@name="password"]');
  }
  get signInButton() {
    return $('//button[@name="action"]');
  }

  // Home screen marker
  get homeScreen() {
    return $(
      '//android.widget.TextView[@resource-id="home-page-welcome-card-name-text"]'
    );
  }

  async openApp() {
    console.log("Launching app...");
    await driver.pause(1500);
  }

  // ✅ Header validation with real assertion
  async verifyWelcomeHeader() {
    await this.pageHeader.waitForDisplayed({ timeout: 15000 });
    const text = await this.pageHeader.getText();
    console.log("📌 Header text found:", text);

    // Actual assertion
    expect(text).toBe("Maximize Your Output.");
  }

  async login(email: string, password: string) {
    // 🔄 Smart login: skip if already on home screen (regression session reuse)
    try {
      const isHomeVisible = await this.homeScreen.isDisplayed();
      if (isHomeVisible) {
        console.log("✅ Already logged in - skipping login flow");
        return;
      }
    } catch {
      // Not on home screen, proceed with login
    }

    await this.verifyWelcomeHeader(); // 👈 Assertion happens first

    await this.loginButton.waitForDisplayed({ timeout: 10000 });
    await this.loginButton.click();

    // ✅ Switch to WebView to enter credentials
    await ContextHelper.switchToWebView();

    await this.emailField.setValue(email);
    await this.submitButton.click();
    await this.passwordField.setValue(password);
    await this.signInButton.click();

    // ✅ Switch to Native to handle notification popup
    await ContextHelper.switchToNative();
    await PermissionsHelper.allowNotificationsIfVisible();

    // ✅ Assert Home Screen loaded
    await this.homeScreen.waitForDisplayed({ timeout: 20000 });
    console.log("✅ Login complete & Home Screen visible");
  }
}

export default new LoginPage();
