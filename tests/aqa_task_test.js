import { timeouts } from "./../src/data/timeouts.js";
import { TestomatApi } from "../src/helpers/testomat.api.js";

Feature("AQA test task");

let testomatApi;

let suiteId;
let token;
let runId;

let generalApiToken = process.env.TESTOMAT_GENERAL_API_TOKEN;
let userEmail = process.env.USER_EMAIL;
let userPassword = process.env.USER_PASSWORD;
let userName = process.env.USER_NAME;
let projectName = process.env.TESTOMAT_PROJECT_NAME;
let projectId = process.env.TESTOMAT_PROJECT_ID;

let suiteName = `Test_suite_${Date.now()}`;
let countOfTestsToCreate = 2;
let statusMessage = "Test Message";
let expectedStatus = 200;
let createdTestCasesNames = [];

Before(async ({ I }) => {
  testomatApi = new TestomatApi(I, token, projectId);

  const login = await testomatApi.login(generalApiToken, expectedStatus);
  testomatApi.token = `Bearer ${login.data.jwt}`;

  const createSuite = await testomatApi.createSuite(suiteName, expectedStatus);
  suiteId = createSuite.data.data.id;

  createdTestCasesNames = await testomatApi.createSettedCountOfTests(
    suiteId,
    countOfTestsToCreate,
    expectedStatus,
  );
});

Scenario("Test task scenario", async ({ I }) => {
  I.amOnPage("/");

  I.waitForElement({ css: ".side-menu .login-item" }, timeouts.SHORT);
  I.seeElement({ css: ".side-menu .login-item" });
  I.click({ css: ".side-menu .login-item" });

  I.waitForElement({ css: "#user_email" }, timeouts.SHORT);
  I.seeElement({ css: "#user_email" });
  I.click({ css: "#user_email" });
  I.type(userEmail);
  // TODO: Need to ask: How to verify that input contains expected value?

  I.waitForElement({ css: "#user_password" }, timeouts.SHORT);
  I.seeElement({ css: "#user_password" });
  I.click({ css: "#user_password" });
  I.type(userPassword);

  I.waitForElement({ css: "[type='submit']" }, timeouts.SHORT);
  I.seeElement({ css: "[type='submit']" });
  I.click({ css: "[type='submit']" });

  I.waitForElement(
    locate(".common-flash-success").withText("Signed in successfully"),
    timeouts.SHORT,
  );
  I.seeElement(
    locate(".common-flash-success").withText("Signed in successfully"),
  );

  I.waitForElement(locate(`a[title="${projectName}"]`), timeouts.SHORT);
  I.seeElement(locate(`a[title="${projectName}"]`));
  I.click(locate(`a[title="${projectName}"]`));

  I.waitForElement(locate("span").withText(`${suiteName}`), timeouts.SHORT);
  I.seeElement(locate("span").withText(`${suiteName}`));
  I.click(locate("span").withText(`${suiteName}`));

  I.waitForElement(
    locate(".ember-basic-dropdown .md-icon-dots-horizontal"),
    timeouts.SHORT,
  );
  I.seeElement(locate(".ember-basic-dropdown .md-icon-dots-horizontal"));
  I.click(locate(".ember-basic-dropdown .md-icon-dots-horizontal"));

  I.waitForElement(locate("button").withText("Run Tests"), timeouts.SHORT);
  I.seeElement(locate("button").withText("Run Tests"));
  I.click(locate("button").withText("Run Tests"));

  I.waitForElement(locate("button").withText("Launch"), timeouts.SHORT);
  I.seeElement(locate("button").withText("Launch"), timeouts.SHORT);
  await I.usePlaywrightTo(
    "catch run id after Launch click",
    async ({ page }) => {
      const responsePromise = page.waitForResponse(
        (res) =>
          res.url().includes(`/${projectId}/runs`) &&
          res.request().method() === "POST",
      );

      await page.getByRole("button", { name: "Launch" }).click();

      const response = await responsePromise;
      const body = await response.json();

      runId = body.data.id;
    },
  );

  I.waitForElement(
    locate(".cp-Panel-toggle button").withText("Passed"),
    timeouts.SHORT,
  );
  I.seeElement(locate(".cp-Panel-toggle button").withText("Passed"));
  I.click(locate(".cp-Panel-toggle button").withText("Passed"));

  I.waitForElement(
    locate("li").withText("passed").withText("by").withText(userName),
    timeouts.SHORT,
  );
  I.seeElement(
    locate("li").withText("passed").withText("by").withText(userName),
  );

  I.waitForElement(
    locate(".leading-tight").withText(createdTestCasesNames[1]),
    timeouts.SHORT,
  );
  I.seeElement(locate(".leading-tight").withText(createdTestCasesNames[1]));
  I.click(locate(".leading-tight").withText(createdTestCasesNames[1]));

  I.waitForElement(
    locate(".cp-Panel-toggle button").withText("Failed"),
    timeouts.SHORT,
  );
  I.seeElement(locate(".cp-Panel-toggle button").withText("Failed"));
  I.click(locate(".cp-Panel-toggle button").withText("Failed"));

  I.waitForElement(
    locate("li").withText(`failed`).withText(`by`).withText(`${userName}`),
    timeouts.SHORT,
  );
  I.seeElement(
    locate("li").withText(`failed`).withText(`by`).withText(`${userName}`),
  );

  I.waitForElement(locate('[placeholder="Result message"]'), timeouts.SHORT);
  I.seeElement(locate('[placeholder="Result message"]'));
  I.fillField(locate('[placeholder="Result message"]'), statusMessage);
  I.pressKey("Tab");
  I.waitForElement(
    locate("li")
      .withText(`failed`)
      .withText(`by`)
      .withText(`${userName}`)
      .withText(`with`)
      .withText(`${statusMessage}`),
  );

  I.waitForElement(locate("button").withText("Finish Run"), timeouts.SHORT);
  I.seeElement(locate("button").withText("Finish Run"));
  I.click(locate("button").withText("Finish Run"));

  //TODO: Figure out how to catch this flash popup
  // I.seeElement(locate("h2").withText("This run has finished!"));

  I.waitForElement(
    locate(".run-status.failed").withText("failed"),
    timeouts.SHORT,
  );
  I.seeElement(locate(".run-status.failed").withText("failed"));

  I.waitForElement(locate(".apexcharts-pie"), timeouts.SHORT);
  I.seeElement(locate(".apexcharts-pie"));
});

After(async () => {
  if (!suiteId) return;

  await testomatApi.deleteSuiteById(suiteId, expectedStatus);

  if (runId) {
    await testomatApi.deleteRunById(runId, expectedStatus);
  }
});
