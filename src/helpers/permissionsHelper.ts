export class PermissionsHelper {
  static async allowNotificationsIfVisible() {
    await driver.switchContext("NATIVE_APP");

    const allowBtn = $(
      "id=com.android.permissioncontroller:id/permission_allow_button"
    );
    const allowForegroundBtn = $(
      "id=com.android.permissioncontroller:id/permission_allow_foreground_only_button"
    );

    try {
      if (await allowBtn.isDisplayed()) {
        await allowBtn.click();
        console.log("Notification permission allowed (standard)");
        return;
      }
    } catch {}

    try {
      if (await allowForegroundBtn.isDisplayed()) {
        await allowForegroundBtn.click();
        console.log("Notification permission allowed (foreground only)");
        return;
      }
    } catch {}

    console.log("No notification popup displayed.");
  }
}

export default PermissionsHelper;
