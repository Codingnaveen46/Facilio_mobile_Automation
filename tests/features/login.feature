Feature: Mobile App Login

  @Regression @P0 @P1 @P2
  Scenario: TES6505 User logs in
    Given the user launches the app
    When I tap on the Login button on the welcome screen
    And I enter my email
    And I tap on the Submit button
    And I enter my password
    And I tap on the Sign in button
    And Allow for Notifications popup appears
    When I tap on the Allow button on the Notifications popup
    Then I should see the Home screen

  @Regression @P1 @P2
  Scenario: TES6514 User switches site after login
    When I open the site selection dropdown
    And I search for site "Marina"
    And I select the site "Marina"
    Then the site should be switched to "Marina"
    Then I should see the Home screen