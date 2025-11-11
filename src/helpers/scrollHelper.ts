export class ScrollHelper {
  static async scrollToText(text: string) {
    await driver
      .execute("mobile: scroll", {
        strategy: "accessibility",
        selector: text,
      })
      .catch(async () => {
        // Fallback to UiScrollable if Android 14+ blocks the above
        await driver.execute("mobile: scrollGesture", {
          left: 100,
          top: 400,
          width: 800,
          height: 1200,
          direction: "down",
          percent: 0.9,
        });
      });
  }

  async scrollDown() {
    const startX = await driver.getWindowRect().then((rect) => rect.width / 2);
    const startY = await driver
      .getWindowRect()
      .then((rect) => rect.height * 0.8);
    const endY = await driver.getWindowRect().then((rect) => rect.height * 0.3);

    await driver.touchAction([
      { action: "press", x: startX, y: startY },
      { action: "wait", ms: 400 },
      { action: "moveTo", x: startX, y: endY },
      "release",
    ]);
  }
}
