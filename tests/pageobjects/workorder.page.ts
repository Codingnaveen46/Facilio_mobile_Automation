import { ScrollHelper } from "../../src/helpers/scrollHelper";

class WorkOrderPage {
  // Work Order button on home screen
  get workOrderButton() {
    return $('//android.widget.TextView[@text="Work Order"]');
  }

  // Current selected template dropdown
  get templateDropdown() {
    return $(
      '//com.horcrux.svg.SvgView[@resource-id="chevron-down"]'
    );
  }

  // Template selection list container
  get templateListContainer() {
    return $("//android.widget.ScrollView");
  }

  // Template item
  templateOption(name: string) {
    return $(`//android.widget.TextView[@text="${name}"]`);
  }

  // Selected Template label on Create Work Order screen
  get selectedTemplateLabel() {
    return $('android=new UiSelector().textContains("Standard")');
  }

  get subjectField() {
    return $(
      '//android.widget.EditText[@resource-id="input-field" and @text="Input your text here"]'
    );
  }

  // Description input
  get descriptionField() {
    return $('//android.widget.EditText[@resource-id="text-area"]');
  }

  // Site dropdown (clickable field)
  get siteField() {
    return $(
      '(//android.widget.EditText[@resource-id="input-field" and @text="Select an option"])[1]'
    );
  }

  // Search input in Choose Site bottom sheet
  get siteSearchBox() {
    return $(
      '//android.widget.EditText[@resource-id="input-field" and @text="Search Here"]'
    );
  }

  // Save Changes button in Choose Site bottom sheet
  get siteSaveChangesButton() {
    return $('//android.widget.TextView[@text="Save Changes"]');
  }

  // Popup container
  get siteChangePopup() {
    return $('//android.view.ViewGroup[@resource-id="modal-view"]');
  }

  // Yes, Proceed button
  get siteConfirmButton() {
    return $('//android.view.ViewGroup[@content-desc="Yes, Proceed"]');
  }

  // Cancel button (if ever needed)
  get siteCancelButton() {
    return $('//android.view.ViewGroup[@content-desc="Cancel"]');
  }

  // Save button
  get saveButton() {
    return $('//android.view.ViewGroup[@content-desc="Save"]');
  }

  async openWorkOrderForm() {
    await this.workOrderButton.waitForDisplayed({ timeout: 200000 });
    await this.workOrderButton.click();

    await $(
      '//android.widget.TextView[contains(@text,"Create Work Order")]'
    ).waitForDisplayed({ timeout: 15000 });
  }

  async openTemplateDropdown() {
    await this.templateDropdown.waitForDisplayed({ timeout: 15000 });
    await this.templateDropdown.click();
  }

  // ✅ Swipe inside the dropdown ScrollView (correct container)
  async swipeTemplateListUp() {
    const container = await this.templateListContainer;
    await container.waitForDisplayed({ timeout: 10000 });

    const { x, y } = await container.getLocation();
    const { width, height } = await container.getSize();

    const startX = x + width / 2;
    const startY = y + height * 0.85;
    const endY = y + height * 0.25;

    await driver.performActions([
      {
        type: "pointer",
        id: "finger",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startX, y: startY },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration: 600, x: startX, y: endY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.pause(300);
  }

  // ✅ Scroll until template is found
  async selectTemplate(templateName: string) {
    for (let i = 0; i < 6; i++) {
      const option = await this.templateOption(templateName);

      if (await option.isDisplayed().catch(() => false)) {
        await option.click();
        return;
      }

      await this.swipeTemplateListUp();
    }

    throw new Error(` Template "${templateName}" not found after scrolling.`);
  }

  // ✅ Verify template shown after selection
  async verifyTemplateSelected(expectedTemplate: string) {
    // Wait for template value to show up on Create Work Order screen
    const selectedTemplate = await $(
      `android=new UiSelector().textContains("${expectedTemplate}")`
    );

    await selectedTemplate.waitForDisplayed({ timeout: 15000 });
    const value = await selectedTemplate.getText();

    expect(value).toContain(expectedTemplate);
  }

  // ----- Actions -----
  async enterSubject(text: string) {
    await this.subjectField.waitForDisplayed({ timeout: 8000 });
    await this.subjectField.setValue(text);
  }

  async enterDescription(text: string) {
    const field = await this.descriptionField;

    await field.waitForDisplayed({ timeout: 10000 });
    await field.click();
    await driver.pause(400);

    const active = await $('//android.widget.EditText[@focused="true"]');
    await active.setValue(text);

    try {
      await driver.hideKeyboard();
    } catch {}
    await driver.pause(300);
  }

  async selectSite(value: string) {
    // Open dropdown
    await this.siteField.waitForDisplayed({ timeout: 10000 });
    await this.siteField.click();

    // Site search input field in bottom sheet
    const searchField = await $(
      `//android.widget.EditText[@resource-id="input-field" and @text="Search Here"]`
    );
    await searchField.waitForDisplayed({ timeout: 10000 });
    await searchField.clearValue();
    await searchField.setValue(value);

    await driver.hideKeyboard();
    await driver.pause(600); // allow list to refresh

    // Select exact match
    const exact = await $(`//android.widget.TextView[@text="${value}"]`);
    await exact.waitForDisplayed({ timeout: 10000 });
    await exact.click();

    // Save Changes button
    const saveChanges = await $(
      `//android.widget.TextView[contains(@text,"Save Changes")]`
    );
    await saveChanges.waitForDisplayed({ timeout: 10000 });
    await saveChanges.click();

    // Handle confirmation popup (if present)
    const confirm = await $(
      `//android.widget.TextView[contains(@text,"Yes, Proceed")]`
    );
    if (await confirm.isDisplayed().catch(() => false)) {
      await confirm.click();
    }

    await driver.pause(1200);
  }

  async saveWorkOrder() {
    await this.saveButton.waitForDisplayed({ timeout: 8000 });
    await this.saveButton.click();
  }

  async verifyWorkOrderCreated(subject: string) {
    // Wait a bit for navigation to finish
    await driver.pause(4000);

    // Look for the Subject in summary header
    const subjectHeader = await $(
      `//android.widget.TextView[contains(@text,"${subject}")]`
    );

    await subjectHeader.waitForDisplayed({ timeout: 20000 });

    // For extra stability, assert text match (optional)
    const headerText = await subjectHeader.getText();
    expect(headerText).toContain(subject);
  }
}

export default new WorkOrderPage();
