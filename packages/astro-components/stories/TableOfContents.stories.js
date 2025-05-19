import StoryTableOfContents from "./StoryTableOfContents.astro";
import {getHeadings} from "./Article.md";

const headings = getHeadings();

export default {
  component: StoryTableOfContents,
};

export const Basic = {
  /* @type {import("./StoryTableOfContents.astro").Props} */
  args: {
    headings,
  },
};

export const Styled = {
  /* @type {import("./StoryTableOfContents.astro").Props} */
  args: {
    isStyled: true,
    headings,
  },
};

export const FromDepthToDepth = {
  args: {
    headings,
    fromDepth: 3,
    toDepth: 4,
  },
};
