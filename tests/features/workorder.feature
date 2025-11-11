Feature: Create Work Order with Template Selection

Background:
  Given the user launches the app
  And the user is logged in

  @P1
Scenario: User selects Standard template in Create Work Order screen
  When I navigate to create work order
  And I open the template dropdown
  And I select the template "Standard"
  And I enter subject "Test Work Order1 - Standard"
  And I enter description "Testing basic fields"
  And I select site "Chennai"
  And I click save
  Then the work order should be created successfully