import { timeouts } from "../data/timeouts.js";

export class ProjectsPage {
  constructor(I) {
    this.I = I;
    this.signedInSuccessfullyMessage = locate(".common-flash-success").withText(
      "Signed in successfully",
    );
  }

  async checkThatSignedInSuccessfullyMessageIsVisible() {
    this.I.waitForElement(this.signedInSuccessfullyMessage, timeouts.SHORT);
    this.I.seeElement(this.signedInSuccessfullyMessage);
  }

  async generateProjectCardLocator(projectName) {
    return locate("a").withAttr({ title: projectName });
  }

  async openProjectByName(projectName) {
    const projectCard = await this.generateProjectCardLocator(projectName);

    await this.I.waitForElement(projectCard, timeouts.SHORT);
    await this.I.click(projectCard);
  }
}
