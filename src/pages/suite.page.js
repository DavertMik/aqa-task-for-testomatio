import { timeouts } from "../data/timeouts.js";
import { StartRunModal } from "../components/startRunModal.js";

export class SuitePage {
  constructor(I, projectId) {
    this.I = I;
    this.projectId = projectId;
    this.startRunModal = new StartRunModal(I, projectId);

    this.moreOptionsButton = locate(
      ".ember-basic-dropdown .md-icon-dots-horizontal",
    );
    this.moreOptionsMenu = locate("[data-ember-action]");
    this.runTestsButton = locate("button").withText("Run Tests");
  }

  async openMoreOptionsMenu() {
    this.I.waitForElement(this.moreOptionsButton, timeouts.SHORT);
    this.I.seeElement(this.moreOptionsButton);
    this.I.click(this.moreOptionsButton);
    this.I.waitForElement(this.moreOptionsMenu, timeouts.SHORT);
    this.I.seeElement(this.moreOptionsMenu);
  }

  async clickRunTestsButton() {
    this.I.waitForElement(this.runTestsButton, timeouts.SHORT);
    this.I.seeElement(this.runTestsButton);
    this.I.click(this.runTestsButton);
  }

  async runTestsAndGetRunId() {
    await this.startRunModal.waitForVisible();
    return await this.startRunModal.launchRunAndCaptureRunId();
  }
}
