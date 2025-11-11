import { Given, When, Then } from "@wdio/cucumber-framework";
import WorkOrderPage from "../pageobjects/workorder.page";

let subjectCounter = 1;
let generatedSubject = "";

When("I navigate to create work order", async () => {
  await WorkOrderPage.openWorkOrderForm();
});

When("I open the template dropdown", async () => {
  await WorkOrderPage.openTemplateDropdown();
});

When("I select the template {string}", async (templateName: string) => {
  await WorkOrderPage.selectTemplate(templateName);
});

Then(
  "the template should be selected as {string}",
  async (templateName: string) => {
    await WorkOrderPage.verifyTemplateSelected(templateName);
  }
);

When(/^I enter subject "([^"]*)"$/, async (baseSubject: string) => {
  generatedSubject = `${baseSubject} ${subjectCounter}`;
  subjectCounter++;

  await WorkOrderPage.enterSubject(generatedSubject);
});

When("I enter description {string}", async (value: string) => {
  await WorkOrderPage.enterDescription(value);
});

When("I select site {string}", async (value: string) => {
  await WorkOrderPage.selectSite(value);
});

When("I click save", async () => {
  await WorkOrderPage.saveWorkOrder();
});

Then(/^the work order should be created successfully$/, async () => {
  await WorkOrderPage.verifyWorkOrderCreated(generatedSubject);
});
