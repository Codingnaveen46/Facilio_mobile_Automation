import { When, Then } from "@wdio/cucumber-framework";
import HomePage from "../pageobjects/home.page";

When("I open the site selection dropdown", async () => {
  await HomePage.openSiteDropdown();
});

When("I search for site {string}", async (siteName: string) => {
  await HomePage.searchSite(siteName);
});

When("I select the site {string}", async (siteName: string) => {
  await HomePage.selectSite(siteName);
});

Then("the site should be switched to {string}", async (siteName: string) => {
  await HomePage.verifySiteSwitched(siteName);
});
