import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../pageobjects/login.page';
import { ContextHelper } from '../../src/helpers/contextHelper';
import loginPage from '../pageobjects/login.page';

When('I open the app', async () => {
  await LoginPage.openApp();

  // Ensure we are in native
  await driver.switchContext('NATIVE_APP');

  // Wait for the header
  await LoginPage.pageHeader.waitForDisplayed({ timeout: 10000 });

  // Capture text
  const headerText = await LoginPage.pageHeader.getText();

  // Print in console
  console.log("✅ Header Text Found:", headerText);

  // Validate it
  expect(headerText).toContain("Maximize Your Output");
});




Given('the user launches the app', async () => {
  await LoginPage.openApp();

});

When('I tap on the Login button on the welcome screen', async () => {
  await LoginPage.loginButton.waitForDisplayed({ timeout: 15000 });
  await LoginPage.loginButton.click();

  // Wait for webview to appear and switch
  await browser.waitUntil(async () => {
    const ctx = await driver.getContexts();
    const hasWebView = ctx.some(c => {
      if (typeof c === 'string') return c.includes('WEBVIEW');
      // DetailedContext can have different property names depending on platform/sdk
      const name = (c as any).id ?? (c as any).name ?? (c as any).context ?? String(c);
      return typeof name === 'string' && name.includes('WEBVIEW');
    });
    return hasWebView;
  }, { timeout: 8000, timeoutMsg: "WebView not loaded" });

  await ContextHelper.switchToWebView();
});

When('I enter my email {string}', async (email: string) => {
  await LoginPage.emailField.waitForDisplayed({ timeout: 15000 });
  await LoginPage.emailField.setValue(email);
});

When('I tap on the Submit button', async () => {
  await LoginPage.submitButton.waitForDisplayed({ timeout: 15000 });
  await LoginPage.submitButton.click();
});

When('I enter my password {string}', async (password: string) => {
  await LoginPage.passwordField.waitForDisplayed({ timeout: 15000 });
  await LoginPage.passwordField.setValue(password);
});

When('I tap on the Sign in button', async () => {
  await LoginPage.signInButton.waitForDisplayed({ timeout: 15000 });
  await LoginPage.signInButton.click();
});

Then('Allow for Notifications popup appears', async () => {
  await ContextHelper.switchToNative();

  try {
    const isVisible = await LoginPage.allowNotificationButton.isDisplayed();
    if (isVisible) {
      console.log('Notification popup visible');
    }
  } catch {
    console.log('No notification popup. Continuing...');
  }
});

When('I tap on the Allow button on the Notifications popup', async () => {
  try {
    const isVisible = await LoginPage.allowNotificationButton.isDisplayed();
    if (isVisible) {
      await LoginPage.allowNotificationButton.click();
      console.log('Notifications permission allowed');
    }
  } catch {
    console.log('No popup to click. Skipping...');
  }
}); 

/* Then('I should see the Home screen', async () => {
  // Back to native after login
  await ContextHelper.switchToNative();
  await LoginPage.homeScreen.waitForDisplayed({ timeout: 20000 });
});
  
 */
Then('I should see the Home screen', async () => {
  await ContextHelper.switchToNative();

  // Try handling popup if auto-shows immediately
  try {
    if (await LoginPage.allowNotificationButton.isDisplayed()) {
      await LoginPage.allowNotificationButton.click();
      console.log('Notifications permission allowed automatically');
    }
  } catch {}

  await LoginPage.homeScreen.waitForDisplayed({ timeout: 20000 });
});  



