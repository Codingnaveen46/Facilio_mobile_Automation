export class ContextHelper {
  static async switchToWebView() {
    const contexts = await driver.getContexts();
    console.log("Available contexts:", contexts);

    const webviewContext = contexts.find(c => String(c).includes("WEBVIEW"));
    if (!webviewContext) {
      throw new Error("No WebView context found");
    }

    await driver.switchContext(String(webviewContext));
    console.log("✅ Switched to WebView");
  }

  static async switchToNative() {
    await driver.switchContext("NATIVE_APP");
    console.log("✅ Switched to Native context");
  }
}
