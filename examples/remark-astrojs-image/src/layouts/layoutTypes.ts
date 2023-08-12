export interface MdxLayoutProps {
  /**
   * The absolute path to the MDX file (e.g. home/user/projects/.../file.md).
   */
  file: string;
  /**
   * The browser-ready URL for MDX files under src/pages/. For example,
   * src/pages/en/about.mdx will provide a url of /en/about/. For MDX files
   * outside of src/pages, url will be undefined.
   */
  url: string;
  content: MarkdownFrontmatter;
}
