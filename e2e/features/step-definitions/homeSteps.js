const {Given, When, Then} = require('cucumber');
const testConfig = require('../../../testConfig');

Given(/^I have logged in$/, async () => {
    await expect(element(by.id('button-Select Images'))).toBeVisible();
});

When(/^I select an image$/, async () => {
    await element(by.id('button-Select Images')).tap();
    await element(by.id(`touchableImage-${testConfig.fileName}`)).tap();
    await element(by.id('doneButton')).tap();
});

When(/^I press the upload button$/, async () => {
    await element(by.id('uploadButton')).tap();
});

Then(/^I should see the selected image preview$/, async () => {
    await expect(element(by.id(`preview-${testConfig.fileName}`))).toBeVisible();
});

Then(/^I should see the loading view$/, async () => {
    await expect(element(by.id('spinner'))).toBeVisible();
});