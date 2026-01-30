export class TestomatApi {
  constructor(I) {
    this.I = I;
  }

  async login(api_token, expectedStatus) {
    const response = await this.I.sendPostRequest("/login", {
      api_token: api_token,
    });

    if (response.status !== expectedStatus) {
      throw new Error(`Login failed. Status: ${response.status}`);
    }

    return response;
  }

  async createSuite(token, projectId, suiteName, expectedStatus) {
    await this.I.haveRequestHeaders({
      Authorization: token,
    });

    const response = await this.I.sendPostRequest(`/${projectId}/suites`, {
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

  async createTestCase(token, projectId, suiteId, testName, expectedStatus) {
    await this.I.haveRequestHeaders({
      Authorization: token,
    });

    const res = await this.I.sendPostRequest(`/${projectId}/tests`, {
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
    token,
    projectId,
    suiteId,
    countOfTestsToCreate,
    expectedStatus,
  ) {
    const createdTests = [];

    for (let i = 0; i < countOfTestsToCreate; i++) {
      const testName = `Test_case_${i + 1}`;

      const test = await this.createTestCase(
        token,
        projectId,
        suiteId,
        testName,
        expectedStatus,
      );

      createdTests.push(test.title);
    }

    return createdTests;
  }

  async deleteSuiteById(token, projectId, suiteId, expectedStatus) {
    await this.I.haveRequestHeaders({
      Authorization: token,
    });

    const response = await this.I.sendDeleteRequest(
      `/${projectId}/suites/${suiteId}`,
    );

    if (response.status !== expectedStatus) {
      throw new Error(
        `Suite with ID "${suiteId}" was not deleted. Status: ${response.status}`,
      );
    }
    
    return response;
  }

  async deleteRunById(token, projectId, runId, expectedStatus) {
    await this.I.haveRequestHeaders({
      Authorization: token,
    });

    const response = await this.I.sendDeleteRequest(
      `/${projectId}/runs/${runId}`,
    );

    if (response.status !== expectedStatus) {
      throw new Error(
        `Test run with ID "${runId}" was not deleted. Status: ${response.status}`,
      );
    }
    
    return response;
  }
}