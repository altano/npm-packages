import { describe } from "vitest";
import { middleware } from "./utils/makeTest";

describe("html entities", async () => {
  const html = `
    <html>
      <body style="
        display: flex;
        flex-direction: column;
        background-color: white;
        width: 100vw;
        height: 100vh;
        ">
        <h1>&;'"<> ̀</h1>
      </body>
    </html>
  `.trim();

  middleware.should("handle html entities", {
    requestUrl: `http://example.com/entities.png`,
    format: "png",
    componentHtml: html,
  });
});
