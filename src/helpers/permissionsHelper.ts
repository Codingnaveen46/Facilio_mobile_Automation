export class PermissionsHelper {
  static async allowNotifications() {
    try {
      const allowBtn = await $('//android.widget.Button[@text="Allow"]');
      if (await allowBtn.isDisplayed()) {
        await allowBtn.click();
        console.log("Notifications allowed");
        return;
      }
    } catch {}

    try {
      await driver.execute('mobile: acceptAlert');
      console.log("Alert accepted by mobile command");
    } catch {
      console.log("No notification popup shown");
    }
  }
}
