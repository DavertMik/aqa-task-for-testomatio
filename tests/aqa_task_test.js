
Feature("AQA test task");

Before(async ({ I,
  MainPage,
  LoginPage,
  ProjectsPage,
  ProjectPage,
  TestomatApi,
  SuitePage,
  ManualRunPage,
  ManualRunResultsPage,
  Data,
 }) => {
  const login = await testomatApi.login(generalApiToken, expectedStatus);
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
  await mainPage.goToLoginPage();

  // TODO: Need to ask: How to verify that input contains expected value?
  // TODO: Why loginButton marked as input in DOM?
  await loginPage.login(userEmail, userPassword);

  // TODO: Rename ProjectsPage to DashboardPage
  await projectsPage.checkThatSignedInSuccessfullyMessageIsVisible();
  await projectsPage.openProjectByName(projectName);
  await projectPage.openSuiteByName(suiteName);

  await suitePage.openMoreOptionsMenu();
  await suitePage.clickRunTestsButton();

  runId = await suitePage.runTestsAndGetRunId();

  await manualRunPage.selectStatus("passed");
  await manualRunPage.verifyStatus(userName, "passed");

  await manualRunPage.openTestCase(createdTestCasesNames[1]);
  await manualRunPage.selectStatus("failed");
  await manualRunPage.fillStatusMessage(statusMessage);
  await manualRunPage.verifyStatus(userName, "failed", statusMessage);

  await manualRunPage.finishRun();

  //TODO: Figure out how to catch this flash popup
  // I.seeElement(locate("h2").withText("This run has finished!"));

  await manualRunResultsPage.verifyFailedStatusIsVisible();
  await manualRunResultsPage.verifyPieChartIsVisible();
});

After(async () => {
  if (!suiteId) return;

  await testomatApi.deleteSuiteById(suiteId, expectedStatus);

  if (runId) {
    await testomatApi.deleteRunById(runId, expectedStatus);
  }
});
