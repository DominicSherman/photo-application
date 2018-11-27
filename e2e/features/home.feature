@home @LogMeIn
Feature: Test home screen

  Scenario: When I click on the Select Images button I should see the Select Images Modal
    Given I have logged in
    When I click on the Select Images button
    Then I should see a Touchable Image