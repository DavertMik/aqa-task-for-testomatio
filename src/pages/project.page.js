import { timeouts } from "../data/timeouts.js";

export class ProjectPage {
  constructor(I) {
    this.I = I;
  }

  async generateSuiteLocator(suiteName) {
    return locate("span").withText(`${suiteName}`);
  }

  async openSuiteByName(suiteName) {
    let suiteLocator = await this.generateSuiteLocator(suiteName);

    this.I.waitForElement(suiteLocator, timeouts.SHORT);
    this.I.seeElement(suiteLocator);
    this.I.click(suiteLocator);
  }
}
