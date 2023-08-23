declare module "trumpet" {
  import type { Transform } from "node:stream";
  export type Options = {
    outer: boolean;
  };
  export default function trumpet(opts?: Options): Trumpet {}
  export interface Trumpet extends Transform {
    select(selector: string): HTMLElement;
    selectAll(selector: string, cb: (elem: HTMLElement) => void): void;
  }
}
