import { timeouts } from "../data/timeouts.js";

export class ManualRunResultsPage {
  constructor(I) {
    this.I = I;
    this.runStatusFailed = locate(".run-status.failed").withText("failed");
    this.pieChart = locate(".apexcharts-pie");
  }
  async verifyFailedStatusIsVisible() {
    this.I.waitForElement(this.runStatusFailed, timeouts.SHORT);
    this.I.seeElement(this.runStatusFailed);
  }

  async verifyPieChartIsVisible() {
    this.I.waitForElement(this.pieChart, timeouts.SHORT);
    this.I.seeElement(this.pieChart);
  }
}
