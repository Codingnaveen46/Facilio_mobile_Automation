export class PermissionsHelper {
  static async allowNotificationsIfVisible() {
    await driver.switchContext("NATIVE_APP");

    // Use $$ to find elements without throwing "no such element" error if missing
    const allowBtns = $$(
      "id=com.android.permissioncontroller:id/permission_allow_button"
    );
    const allowForegroundBtns = $$(
      "id=com.android.permissioncontroller:id/permission_allow_foreground_only_button"
    );

    const buttons = await allowBtns;
    if ((await buttons.length) > 0 && (await buttons[0].isDisplayed())) {
      await buttons[0].click();
      console.log("✅ Notification permission allowed (standard)");
      return;
    }

    const fgButtons = await allowForegroundBtns;
    if ((await fgButtons.length) > 0 && (await fgButtons[0].isDisplayed())) {
      await fgButtons[0].click();
      console.log("✅ Notification permission allowed (foreground only)");
      return;
    }

    console.log("ℹ️ No notification popup displayed (Clean check).");
  }
}

export default PermissionsHelper;
