import type { Element as WdioElement } from 'webdriverio';

export async function waitForElement(el: WdioElement, timeout = 10000) {
  await el.waitForDisplayed({ timeout });
}
