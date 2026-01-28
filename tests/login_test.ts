Feature('login');

Scenario('Test task scenario',  ({ I }) => {
    I.amOnPage(process.env.BASE_URL);
    I.waitForNavigation("domcontentloaded");
    I.seeElement('Log In');
    I.click('Log In');
    I.amOnPage('/users/sign_in');
    I.waitForNavigation("domcontentloaded");
    I.seeElement('Email');
    I.fillField('Email', process.env.USER_EMAIL);
    I.seeElement('Password');
    I.fillField('Password', process.env.USER_PASSWORD);
    I.seeElement('Log In');
    I.click('Log In');
    I.see('Projects');
});
