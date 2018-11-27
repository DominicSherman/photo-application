@e2e @home @LogMeInToDev @LogMeOutOfDev
Feature: Test home screen

  Scenario: When I upload an image it should show the loading screen
    Given I have logged in
    When I select an image
    Then I should see the selected image preview
