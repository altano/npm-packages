import { describe, it, expect } from "vitest";
import getSatoriFriendlyVNode from "../src/getSatoriFriendlyVNode";

describe("getSatoriFriendlyVNode", () => {
  it("should get a vnode with a fixed line-height", () => {
    const html = `
      <div style="
        margin: 0;
        padding: 0;
        font-size: 100px;
        line-height: 1;
      ">
        Hi, I'm some text
      </div>
    `.trim();
    const vnode = getSatoriFriendlyVNode(html);
    expect(vnode).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": "Hi, I'm some text",
                "style": {
                  "fontSize": "100px",
                  "lineHeight": 1,
                  "margin": "0",
                  "padding": "0",
                },
              },
              "type": "div",
            },
          ],
          "style": {
            "display": "flex",
            "flexDirection": "column",
            "height": "100%",
            "width": "100%",
          },
        },
        "type": "div",
      }
    `);
  });

  it("should not modify a px line-height", () => {
    const html = `
    <div style="
      margin: 0;
      padding: 0;
      font-size: 100px;
      line-height: 10px;
    ">
      Hi, I'm some text
    </div>
  `.trim();
    const vnode = getSatoriFriendlyVNode(html);
    expect(vnode).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": "Hi, I'm some text",
                "style": {
                  "fontSize": "100px",
                  "lineHeight": "10px",
                  "margin": "0",
                  "padding": "0",
                },
              },
              "type": "div",
            },
          ],
          "style": {
            "display": "flex",
            "flexDirection": "column",
            "height": "100%",
            "width": "100%",
          },
        },
        "type": "div",
      }
    `);
  });

  it("should not modify a string line-height", () => {
    const html = `
    <div style="
      margin: 0;
      padding: 0;
      font-size: 100px;
      line-height: "1";
    ">
      Hi, I'm some text
    </div>
  `.trim();
    const vnode = getSatoriFriendlyVNode(html);
    expect(vnode).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": "Hi, I'm some text",
                "style": {
                  "fontSize": "100px",
                  "lineHeight": "\\"1\\"",
                  "margin": "0",
                  "padding": "0",
                },
              },
              "type": "div",
            },
          ],
          "style": {
            "display": "flex",
            "flexDirection": "column",
            "height": "100%",
            "width": "100%",
          },
        },
        "type": "div",
      }
    `);
  });

  it("should create a vnode with a single child", () => {
    const html = `<div><br /></div>`;
    const vnode = getSatoriFriendlyVNode(html);
    expect(vnode).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [
                  {
                    "props": {
                      "children": [],
                    },
                    "type": "br",
                  },
                ],
              },
              "type": "div",
            },
          ],
          "style": {
            "display": "flex",
            "flexDirection": "column",
            "height": "100%",
            "width": "100%",
          },
        },
        "type": "div",
      }
    `);
  });
});
