import { timeouts } from "./../src/data/timeouts.js";
import { TestomatApi } from "../src/helpers/testomat.api.js";
import {
  MainPage,
  LoginPage,
  ProjectsPage,
  ProjectPage,
  SuitePage,
  ManualRunPage,
  ManualRunResultsPage,
} from "../src/pages/index.js";

Feature("AQA test task");

let testomatApi;
let mainPage;
let loginPage;
let projectsPage;
let projectPage;
let suitePage;
let manualRunPage;
let manualRunResultsPage;

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
  mainPage = new MainPage(I);
  loginPage = new LoginPage(I);
  projectsPage = new ProjectsPage(I);
  projectPage = new ProjectPage(I);
  suitePage = new SuitePage(I, projectId);
  manualRunPage = new ManualRunPage(I);
  manualRunResultsPage = new ManualRunResultsPage(I);

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
