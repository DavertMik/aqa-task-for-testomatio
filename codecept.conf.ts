import { setHeadlessWhen, setCommonPlugins } from "@codeceptjs/configure";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: "./tests/*_test.js",
  output: "./output",
  helpers: {
    Playwright: {
      browser: "chromium",
      url: process.env.BASE_URL || "https://testomat.io",
      show: true,
      trace: false,
      waitForNavigation: "domcontentloaded",
      waitForAction: 500,
    },
    REST: {
      endpoint: process.env.API_BASE_URL,
    },
  },
  include: {
    I: "./steps_file",
  },
  plugins: {
    htmlReporter: {
      enabled: true,
    },
  },
  name: "aqa-task-for-testomatio",
};
