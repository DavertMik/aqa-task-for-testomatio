import { timeouts } from "../data/timeouts.js";

export class MainPage {
  constructor(I) {
    this.I = I;
    this.loginButton = locate(".side-menu .login-item");
  }

  async goToLoginPage() {
    this.I.waitForElement(this.loginButton, timeouts.SHORT);
    this.I.seeElement(this.loginButton);
    this.I.click(this.loginButton);
    this.I.waitForNavigation();
  }
}