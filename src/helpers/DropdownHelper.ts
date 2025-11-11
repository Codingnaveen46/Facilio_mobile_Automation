export class DropdownHelper {
  static get searchField() {
    return $(
      '//android.widget.EditText[@resource-id="input-field" and @text="Enter a value"]'
    );
  }

  static option(name: string) {
    return $(`//android.widget.TextView[contains(@text,"${name}")]`);
  }

  static get submitButton() {
    return $('//android.widget.TextView[@text="Submit"]');
  }

  static async selectFromDropdown(
    openDropdownElement: WebdriverIO.Element,
    value: string
  ) {
    // Open dropdown
    await openDropdownElement.waitForDisplayed({ timeout: 8000 });
    await openDropdownElement.click();
    await driver.pause(500);

    // If clear icon exists, click it
    const clearBtn = $(
      '//com.horcrux.svg.SvgView[@resource-id="clearable"]/com.horcrux.svg.GroupView/com.horcrux.svg.GroupView/com.horcrux.svg.PathView'
    );
    if (await clearBtn.isDisplayed().catch(() => false)) {
      await clearBtn.click();
      await driver.pause(300);
    }

    // Search field
    await this.searchField.waitForDisplayed({ timeout: 8000 });
    await this.searchField.setValue(value);
    await driver.pause(1000);

    // Select option
    const optionElement = this.option(value);
    await optionElement.waitForDisplayed({ timeout: 8000 });
    await optionElement.click();

    // Submit
    await this.submitButton.click();
  }
}

export default DropdownHelper;
