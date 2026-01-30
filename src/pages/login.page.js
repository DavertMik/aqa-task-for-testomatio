import { timeouts } from "../data/timeouts.js";

export class LoginPage {
  constructor(I) {
    this.I = I;
    this.emailInput = locate("#user_email");
    this.passwordInput = locate("#user_password");
    this.loginButton = locate("[type='submit']"); // TODO: Why marked as input?
  }

  async login(userEmail, userPassword) {
    await this.fillUserEmail(userEmail);
    await this.fillUserPassword(userPassword);
    await this.clickLoginButton();
  }

  async fillUserEmail(userEmail) {
    this.I.waitForElement(this.emailInput, timeouts.SHORT);
    this.I.seeElement(this.emailInput);
    this.I.click(this.emailInput);
    this.I.type(userEmail);
  }

  async fillUserPassword(userPassword) {
    this.I.waitForElement(this.passwordInput, timeouts.SHORT);
    this.I.seeElement(this.passwordInput);
    this.I.click(this.passwordInput);
    this.I.type(userPassword);
  }

  async clickLoginButton() {
    this.I.waitForElement(this.loginButton, timeouts.SHORT);
    this.I.seeElement(this.loginButton);
    this.I.click(this.loginButton);
  }
}
