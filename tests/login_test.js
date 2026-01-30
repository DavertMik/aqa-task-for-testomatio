const assert = require("assert");

Feature("AQA test task");

let suiteId;
let token;
let runId;
let userName = "Test Task";
let projectId = "codeceptjs-demo-project-f46c5";
let suiteName = `Test_suite_${Date.now()}`;
let countOfTestsToCreate = 2;
let statusMessage = "Test Message";
const createdTestCasesNames = [];

Before(async ({ I }) => {
  const login = await I.sendPostRequest("/login", {
    api_token: process.env.TESTOMAT_GENERAL_API_TOKEN,
  });

  assert.equal(login.status, 200);
  token = `Bearer ${login.data.jwt}`;

  I.haveRequestHeaders({
    Authorization: token,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  const createSuite = await I.sendPostRequest(`/${projectId}/suites`, {
    data: {
      type: "suites",
      attributes: {
        title: suiteName,
        "file-type": "file",
      },
    },
  });

  assert.equal(createSuite.status, 200);
  assert.equal(createSuite.data.data.attributes.title, suiteName);

  suiteId = createSuite.data.data.id;

  I.haveRequestHeaders({
    Authorization: token,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  for (let i = 0; i < countOfTestsToCreate; i++) {
    const testName = `Test_case_${i + 1}`;
    createdTestCasesNames.push(testName);

    const createTests = await I.sendPostRequest(`/${projectId}/tests`, {
      data: {
        attributes: {
          title: testName,
          sync: true,
        },
        relationships: {
          suite: {
            data: {
              type: "suites",
              id: suiteId,
            },
          },
        },
        type: "tests",
      },
    });

    assert.equal(createTests.status, 200);
  }
});

Scenario("Test task scenario", async ({ I }) => {
  I.amOnPage("/");
  I.waitForElement({ css: ".side-menu .login-item" }, 7);

  I.seeElement({ css: ".side-menu .login-item" });
  I.click({ css: ".side-menu .login-item" });
  I.waitForElement({ css: "#user_email" }, 7);

  I.seeElement({ css: "#user_email" });
  I.click({ css: "#user_email" });
  I.type(process.env.USER_EMAIL);

  I.seeElement({ css: "#user_password" });
  I.click({ css: "#user_password" });
  I.type(process.env.USER_PASSWORD);

  I.seeElement({ css: "[type='submit']" });
  I.click({ css: "[type='submit']" });
  I.waitForText("Signed in successfully", 5);
  I.see("CodeceptJS Demo Project");
  I.click("CodeceptJS Demo Project");

  I.waitForElement(locate("span").withText(`${suiteName}`), 7);
  I.click(locate("span").withText(`${suiteName}`));

  I.waitForElement({ css: ".ember-basic-dropdown" }, 7);
  I.click({ css: ".ember-basic-dropdown" });

  I.waitForElement(locate("button").withText("Run Tests"), 7);
  I.click(locate("button").withText("Run Tests"));

  I.waitForElement(locate("button").withText("Launch"), 7);

  await I.usePlaywrightTo(
    "catch run id after Launch click",
    async ({ page }) => {
      const responsePromise = page.waitForResponse(
        (res) =>
          res.url().includes(`/${projectId}/runs`) &&
          res.request().method() === "POST",
      );

      await page.click('button:has-text("Launch")');

      const response = await responsePromise;
      const body = await response.json();

      runId = body.data.id;
    },
  );

  I.waitForElement(locate(".cp-Panel-toggle button").withText("Passed"), 5);
  I.click(locate(".cp-Panel-toggle button").withText("Passed"));
  I.waitForText(`passed by ${userName}`, 7);

  I.seeElement(locate(".leading-tight").withText(createdTestCasesNames[1]));
  I.click(locate(".leading-tight").withText(createdTestCasesNames[1]));

  I.waitForElement(locate(".cp-Panel-toggle button").withText("Failed"), 5);
  I.click(locate(".cp-Panel-toggle button").withText("Failed"));
  I.seeElement(
    locate("li").withText(`failed`).withText(`by`).withText(`${userName}`),
  );

  I.fillField('[placeholder="Result message"]', statusMessage);
  I.pressKey("Tab");
  I.seeElement(
    locate("li")
      .withText(`failed`)
      .withText(`by`)
      .withText(`${userName}`)
      .withText(`with`)
      .withText(`${statusMessage}`),
  );

  I.seeElement(locate("button").withText("Finish Run"));
  I.click(locate("button").withText("Finish Run"));

  //TODO: Figure out how to catch this flash popup
  // I.seeElement(locate("h2").withText("This run has finished!"));

  I.seeElement(locate(".run-status.failed").withText("failed"));
  I.seeElement(locate(".apexcharts-pie"));
});

After(async ({ I }) => {
  I.haveRequestHeaders({
    Authorization: token,
  });

  const deleteSeiteResponse = await I.sendDeleteRequest(
    `/${projectId}/suites/${suiteId}`,
  );
  // TODO: BUG - on delete must be 204 instead of 200
  assert.equal(deleteSeiteResponse.status, 200);

  I.haveRequestHeaders({
    Authorization: token,
  });

  const deleteTestRunResponse = await I.sendDeleteRequest(
    `/${projectId}/runs/${runId}`,
  );

  assert.equal(deleteTestRunResponse.status, 200);
});
