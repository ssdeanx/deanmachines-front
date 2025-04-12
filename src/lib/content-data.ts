/**
 * Content data structures for documentation and blog content
 *
 * This file provides type definitions and utilities for structured content
 * without requiring MDX or Contentlayer.
 */

/**
 * Base content interface with common properties
 */
export interface ContentBase {
  /** Unique identifier */
  id: string;
  /** Content title */
  title: string;
  /** Optional description */
  description?: string;
  /** URL-friendly slug */
  slug: string;
  /** The slug as URL parameters */
  slugAsParams: string;
  /** Publication date */
  date?: string;
  /** Content authors */
  authors?: string[];
  /** Content tags/categories */
  tags?: string[];
  /** Content type identifier */
  contentType: "doc" | "blog";
}

/**
 * Available section types
 */
export enum SectionType {
  Paragraph = "paragraph",
  Heading = "heading",
  List = "list",
  Code = "code",
  Callout = "callout",
  Image = "image",
  Table = "table",
  Quote = "quote",
  Divider = "divider",
  Card = "card",
}

/**
 * Base section interface
 */
export interface BaseSection {
  /** Section type */
  type: SectionType;
  /** Optional CSS class names */
  className?: string;
  /** Optional section ID for anchors */
  id?: string;
}

/**
 * Text formatting options
 */
export interface TextFormatting {
  /** Bold text */
  bold?: boolean;
  /** Italic text */
  italic?: boolean;
  /** Code formatting */
  code?: boolean;
  /** Link information */
  link?: { href: string; title?: string };
}

/**
 * A segment of formatted text
 */
export interface TextSpan {
  /** The text content */
  text: string;
  /** Optional formatting */
  format?: TextFormatting;
}

/**
 * A standard paragraph with optional formatted text
 */
export interface ParagraphSection extends BaseSection {
  type: SectionType.Paragraph;
  /** The paragraph content */
  content: TextSpan[];
}

/**
 * A heading with a specific level and optional formatted text
 */
export interface HeadingSection extends BaseSection {
  type: SectionType.Heading;
  /** Heading level (1-6) */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** The heading content */
  content: TextSpan[];
}

/**
 * Types of lists
 */
export enum ListType {
  Unordered = "unordered",
  Ordered = "ordered",
}

/**
 * A list item with optional nested items
 */
export interface ListItem {
  /** The item content */
  content: TextSpan[];
  /** Optional nested items */
  items?: ListItem[];
}

/**
 * A list section (ordered or unordered)
 */
export interface ListSection extends BaseSection {
  type: SectionType.List;
  /** List type (ordered or unordered) */
  listType: ListType;
  /** List items */
  items: ListItem[];
}

/**
 * A code block with syntax highlighting
 */
export interface CodeSection extends BaseSection {
  type: SectionType.Code;
  /** The code content */
  code: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Optional file name or title */
  filename?: string;
  /** Lines to highlight */
  highlightLines?: number[];
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
}

/**
 * Types of callouts
 */
export enum CalloutType {
  Default = "default",
  Warning = "warning",
  Success = "success",
  Danger = "danger",
}

/**
 * A callout box for important information
 */
export interface CalloutSection extends BaseSection {
  type: SectionType.Callout;
  /** Callout type */
  calloutType: CalloutType;
  /** Optional callout title */
  title?: string;
  /** Callout content */
  content: TextSpan[];
}

/**
 * An image with optional caption
 */
export interface ImageSection extends BaseSection {
  type: SectionType.Image;
  /** Image source URL */
  src: string;
  /** Alternative text */
  alt: string;
  /** Optional caption */
  caption?: string;
  /** Optional width */
  width?: number;
  /** Optional height */
  height?: number;
}

/**
 * A table cell
 */
export interface TableCell {
  /** Cell content */
  content: TextSpan[];
  /** Optional column span */
  colSpan?: number;
  /** Optional row span */
  rowSpan?: number;
  /** Text alignment */
  align?: "left" | "center" | "right";
}

/**
 * A table row
 */
export interface TableRow {
  /** Row cells */
  cells: TableCell[];
}

/**
 * A table section
 */
export interface TableSection extends BaseSection {
  type: SectionType.Table;
  /** Table header rows */
  header: TableRow[];
  /** Table body rows */
  rows: TableRow[];
  /** Optional table caption */
  caption?: string;
}

/**
 * A blockquote
 */
export interface QuoteSection extends BaseSection {
  type: SectionType.Quote;
  /** Quote content */
  content: TextSpan[];
  /** Optional attribution */
  attribution?: string;
}

/**
 * A divider/horizontal rule
 */
export interface DividerSection extends BaseSection {
  type: SectionType.Divider;
}

/**
 * A card with title, content and optional link
 */
export interface CardSection extends BaseSection {
  type: SectionType.Card;
  /** Card title */
  title: string;
  /** Card content */
  content: TextSpan[];
  /** Optional link */
  href?: string;
  /** Optional image */
  image?: string;
}

/**
 * Union type of all section types
 */
export type ContentSection =
  | ParagraphSection
  | HeadingSection
  | ListSection
  | CodeSection
  | CalloutSection
  | ImageSection
  | TableSection
  | QuoteSection
  | DividerSection
  | CardSection;

/**
 * Documentation content type
 */
export interface DocContent extends ContentBase {
  contentType: "doc";
  /** Content sections */
  sections: ContentSection[];
  /** Related documentation */
  related?: { title: string; href: string }[];
  /** Previous page */
  prev?: { title: string; slug: string };
  /** Next page */
  next?: { title: string; slug: string };
}

/**
 * Blog content type
 */
export interface BlogContent extends ContentBase {
  contentType: "blog";
  /** Content sections */
  sections: ContentSection[];
  /** Featured image */
  image?: string;
  /** Reading time in minutes */
  readingTime?: number;
}
