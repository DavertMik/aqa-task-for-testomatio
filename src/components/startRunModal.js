import { timeouts } from "../data/timeouts.js";
export class StartRunModal {
  constructor(I, projectId) {
    this.I = I;
    this.projectId = projectId;

    this.launchButton = locate("button").withText("Launch");
  }

  async waitForVisible() {
    await this.I.waitForElement(this.launchButton, timeouts.EXTRA_LONG);
  }

  async launchRunAndCaptureRunId() {
    let runId;

    await this.I.usePlaywrightTo(
      "launch run and capture run id",
      async ({ page }) => {
        console.log(`ProjectID: ${this.projectId}`);
        const responsePromise = page.waitForResponse(
          (res) =>
            res.url().includes(`/${this.projectId}/runs`) &&
            res.request().method() === "POST",
        );

        await page.getByRole("button", { name: "Launch" }).click();

        const response = await responsePromise;
        const body = await response.json();
        runId = body.data.id;
      },
    );

    return runId;
  }
}
