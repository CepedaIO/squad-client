import ms from "smtp-tester";
import { defineConfig } from "cypress";

const mailServer = ms.init(7777)
let lastEmail = {};

// @ts-ignore
mailServer.bind((addr, id, email) => {
  // @ts-ignore
  lastEmail[email.headers.to] = {
    body: email.body,
    html: email.html,
  }
});

export default defineConfig({
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      on("task", {
        getLastEmail(email) {
          // @ts-ignore
          return lastEmail[email] || null;
        }
      });
    }
  }
});
