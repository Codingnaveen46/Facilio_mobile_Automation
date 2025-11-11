import { ScrollHelper } from "../../src/helpers/scrollHelper";

class HomePage {
  get siteDropdown() {
    return $('//android.widget.TextView[@text="All Sites"]'); // Use accessibility id for reliability
  }

  get searchBox() {
    return $('//android.widget.EditText[@resource-id="input-field"]');
  }

  siteOption(siteName: string) {
    return $(`//android.widget.TextView[@text="${siteName}"]`);
  }

  async openSiteDropdown() {
    await this.siteDropdown.waitForDisplayed({ timeout: 15000 });
    await this.siteDropdown.click();
  }

  async searchSite(searchText: string) {
    await this.searchBox.waitForDisplayed({ timeout: 15000 });
    await this.searchBox.setValue(searchText);
    await driver.pause(1000);
  }

  async selectSite(siteName: string) {
    try {
      await this.siteOption(siteName).click();
    } catch {
      await ScrollHelper.scrollToText(siteName);
      await this.siteOption(siteName).click();
    }
  }

  async verifySiteSwitched(siteName: string) {
    for (let i = 0; i < 3; i++) {
      try {
        const el = $(`//android.widget.TextView[@text="${siteName}"]`);
        if (await el.isDisplayed()) {
          expect(await el.getText()).toBe(siteName);
          return;
        }
      } catch {}
      await driver.pause(1000);
    }
    throw new Error(`Site did not switch to ${siteName}`);
  }
}

export default new HomePage();
