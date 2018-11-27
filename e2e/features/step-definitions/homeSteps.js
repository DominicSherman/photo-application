const {Given, When, Then} = require('cucumber');

Given(/^I have logged in$/, async () => {
    await expect(element(by.label('Upload'))).toBeVisible();
});

When(/^I click on the Select Images button$/, async () => {
    await element(by.label('Select Images')).tap();
});

Then(/^I should see a Touchable Image$/, async () => {
    await expect(element(by.label('Select Images to Upload'))).toBeVisible();
});

When(/^I click on a Touchable Image$/, async () => {
    await element(by.id('touchableImage-IMG_0001.JPG')).tap();
});