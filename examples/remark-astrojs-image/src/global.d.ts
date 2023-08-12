interface MarkdownFrontmatter {
  title: string;
  layout: unknown;
  description: string;
  dateCreated: string;
  dateUpdated?: string;
  tags?: string[];
  draft: boolean;
}
