Feature: Mobile App Login

  @Regression @P1
  Scenario: TES6505 User logs in
    Given the user launches the app
    When I tap on the Login button on the welcome screen
    And I enter my email "premkumar+mt@facilio.com"
    And I tap on the Submit button
    And I enter my password "PremQA@321"
    And I tap on the Sign in button
    And Allow for Notifications popup appears
    When I tap on the Allow button on the Notifications popup
    Then I should see the Home screen

  @Regression @P1
  Scenario: TES6514 User switches site after login
    When I open the site selection dropdown
    And I search for site "Marina"
    And I select the site "Marina"
    Then the site should be switched to "Marina"
    Then I should see the Home screen

  @Regression @P1
  Scenario: TES6515 User selects Standard template in Create Work Order screen
    When I navigate to create work order
    And I open the template dropdown
    And I select the template "Standard"
    And I enter subject "Test Work Order1 - Standard"
    And I enter description "Testing basic fields"
  #And I select site "Chennai"
    And I click save
    Then the work order should be created successfully
