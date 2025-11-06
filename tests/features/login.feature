Feature: Mobile App Login
@Regression @sanity
  Scenario: User logs in to the mobile app
    Given the user launches the app
    When I tap on the Login button on the welcome screen
    And I enter my email "premkumar+mt@facilio.com"
    And I tap on the Submit button
    And I enter my password "PremQA@321"
    And I tap on the Sign in button
    And  Allow for Notifications popup appears
    When I tap on the Allow button on the Notifications popup
   Then I should see the Home screen
