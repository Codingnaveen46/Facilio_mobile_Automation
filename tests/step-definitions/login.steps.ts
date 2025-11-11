import { Given, When, Then } from "@wdio/cucumber-framework";
import LoginPage from "../pageobjects/login.page";
import PermissionsHelper from "../../src/helpers/permissionsHelper";
import { ContextHelper } from "../../src/helpers/contextHelper";

Given("the user launches the app", async () => {
  // Wait for the header
  await LoginPage.pageHeader.waitForDisplayed({ timeout: 10000 });
  // Capture text
  const headerText = await LoginPage.pageHeader.getText();
  // Print in console
  console.log("✅ Header Text Found:", headerText);
  // Validate it
  expect(headerText).toContain("Maximize Your Output");
});

When("I tap on the Login button on the welcome screen", async () => {
  await LoginPage.loginButton.waitForDisplayed({ timeout: 15000 });
  await LoginPage.loginButton.click();
});

When("I enter my email {string}", async (email: string) => {
  await ContextHelper.switchToWebView();
  await LoginPage.emailField.setValue(email);
});

When("I tap on the Submit button", async () => {
  await LoginPage.submitButton.click();
});

When("I enter my password {string}", async (password: string) => {
  await LoginPage.passwordField.setValue(password);
});

When("I tap on the Sign in button", async () => {
  await LoginPage.signInButton.click();
});

Then("Allow for Notifications popup appears", async () => {
  await ContextHelper.switchToNative();
  await PermissionsHelper.allowNotificationsIfVisible();
});

When("I tap on the Allow button on the Notifications popup", async () => {
  await PermissionsHelper.allowNotificationsIfVisible();
});

Then("I should see the Home screen", async () => {
  await ContextHelper.switchToNative();
  await LoginPage.homeScreen.waitForDisplayed({ timeout: 20000 });
});

Given("the user is logged in", async () => {
  await LoginPage.login("premkumar+mt@facilio.com", "PremQA@321");
});
