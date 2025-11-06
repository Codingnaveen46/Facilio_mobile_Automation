class LoginPage {


  get pageHeader(){
    return $('new UiSelector().text("Maximize Your Output")')
  }

  // Welcome/Login screen
  get loginButton() { 
    return $('~Login'); 
  }

  // Email input field
  get emailField() {
    return $('#username');
  }

  get submitButton() { 
    return $('//button[@name="action"]');
  }

  // Password input field
  get passwordField() { 
    return $('#password');
  }

  get signInButton() { 
    return $('//button[@name="action"]');
  }

  // Notification Allow button (Android system popup)
  get allowNotificationButton() {
    return $('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');
  }

  // Home screen element
  get homeScreen() { 
    return $('//android.widget.TextView[@resource-id="home-page-welcome-card-name-text"]');
  }

  async openApp() {
    console.log("Launching app...");
    await driver.pause(3000);
  }

  // ✅ Add this block
  async login(email: string, password: string) {
    console.log("Logging in...");

    await this.loginButton.click();

    await this.emailField.setValue(email);
    await this.submitButton.click();

    await this.passwordField.setValue(password);
    await this.signInButton.click();

    // Handle notification popup
    try {
      if (await this.allowNotificationButton.isDisplayed()) {
        await this.allowNotificationButton.click();
      }
    } catch (err) {
      console.log("Notification popup not shown (continuing)");
    }

    await driver.pause(2000);
  }


async handleNotificationPopupIfDisplayed() {
  try {
    const allowNotif = await this.allowNotificationButton;
    if (await allowNotif.isDisplayed()) {
      await allowNotif.click();
      console.log("Notification permission allowed");
    }
  } catch (e) {
    console.log("No notification popup found, skipping...");
  }
}



  
}



export default new LoginPage();
