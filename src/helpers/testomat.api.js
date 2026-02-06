export class TestomatApi extends Helper {

  constructor(token, projectId) {    
    this.I = this.helpers.REST;
    this.projectId = projectId;
    this.token = token;
  }
  
  async loginViaAPI(generalApiToken, expectedStatus) {
    const response = await this.I.sendPostRequest("/login", {
      api_token: generalApiToken,
    });

    if (response.status !== expectedStatus) {
      throw new Error(`Login failed. Status: ${response.status}`);
    }

    return response;
  }

  async createSuite(suiteName, expectedStatus) {
    await this.I.haveRequestHeaders({
      Authorization: this.token,
    });

    const response = await this.I.sendPostRequest(`/${this.projectId}/suites`, {
      data: {
        type: "suites",
        attributes: {
          title: suiteName,
          "file-type": "file",
        },
      },
    });

    if (response.status !== expectedStatus) {
      throw new Error(
        `Suite "${suiteName}" was not created. Status: ${response.status}`,
      );
    }

    return response;
  }

  async createTestCase(suiteId, testName, expectedStatus) {
    await this.I.haveRequestHeaders({
      Authorization: this.token,
    });

    const res = await this.I.sendPostRequest(`/${this.projectId}/tests`, {
      data: {
        type: "tests",
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
      },
    });

    if (res.status !== expectedStatus) {
      throw new Error(
        `Test case "${testName}" was not created. Status: ${res.status}`,
      );
    }

    return {
      title: testName,
    };
  }

  async createSettedCountOfTests(
    suiteId,
    countOfTestsToCreate,
    expectedStatus,
  ) {
    const createdTests = [];

    for (let i = 0; i < countOfTestsToCreate; i++) {
      const testName = `Test_case_${i + 1}`;

      const test = await this.createTestCase(
        suiteId,
        testName,
        expectedStatus,
      );

      createdTests.push(test.title);
    }

    return createdTests;
  }

  async deleteSuiteById(suiteId, expectedStatus) {
    await this.I.haveRequestHeaders({
      Authorization: this.token,
    });

    const response = await this.I.sendDeleteRequest(
      `/${this.projectId}/suites/${suiteId}`,
    );

    if (response.status !== expectedStatus) {
      throw new Error(
        `Suite with ID "${suiteId}" was not deleted. Status: ${response.status}`,
      );
    }
    
    return response;
  }

  async deleteRunById(runId, expectedStatus) {
    await this.I.haveRequestHeaders({
      Authorization: this.token,
    });

    const response = await this.I.sendDeleteRequest(
      `/${this.projectId}/runs/${runId}`,
    );

    if (response.status !== expectedStatus) {
      throw new Error(
        `Test run with ID "${runId}" was not deleted. Status: ${response.status}`,
      );
    }
    
    return response;
  }
}