export class ContextHelper {
  static async waitForWebview(timeout = 12000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const contexts = await driver.getContexts();
      console.log("🔍 Checking contexts:", contexts);

      const webviewContext = contexts.find((ctx) =>
        String(ctx).includes("WEBVIEW")
      );
      if (webviewContext) {
        return webviewContext;
      }

      await driver.pause(500);
    }

    throw new Error("WebView not found within timeout");
  }

  static async switchToWebView() {
    const webviewContext = await this.waitForWebview();
    await driver.switchContext(String(webviewContext));
    console.log("Switched to WebView:", webviewContext);
  }

  static async switchToNative() {
    await driver.switchContext("NATIVE_APP");
    console.log("📱 Switched to Native context");
  }
}

export const contextHelper = new ContextHelper();
