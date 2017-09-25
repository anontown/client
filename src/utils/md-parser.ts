declare function require(path: string): any

const markdown = require('remark-parse');
const unified = require('unified');
const breaks = require('remark-breaks');
const disable = require('remark-disable-tokenizers');

export function parse(text: string): Root {
  return unified()
    .use(markdown)
    .use(disable, {
      block: [
        'html',
        'footnote'
      ],
      inline: [
      ]
    })
    .use(breaks)
    .parse(text);
}

export type MdNode = Paragraph |
  Blockquote |
  Heading |
  Code |
  InlineCode |
  List |
  ListItem |
  Table |
  TableRow |
  TableCell |
  ThematicBreak |
  Break |
  Emphasis |
  Strong |
  Delete |
  Link |
  Image |
  Text;

interface IParent {
  children: MdNode[];
}

interface IText {
  value: string;
}

export interface Root extends IParent {
  type: 'root';
}

export interface Paragraph extends IParent {
  type: "paragraph";
}

export interface Blockquote extends IParent {
  type: "blockquote";
}

export interface Heading extends IParent {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface Code extends IText {
  type: "code";
  lang: string | null;
}

export interface InlineCode extends IText {
  type: "inlineCode";
}

export interface List extends IParent {
  type: "list";
  ordered: boolean;
  start: number | null;
  loose: boolean;
}

export interface ListItem extends IParent {
  type: "listItem";
  loose: boolean;
  checked: boolean | null;
}

export interface Table extends IParent {
  type: "table";
  align: ("left" | "right" | "center" | null)[];
}

export interface TableRow extends IParent {
  type: "tableRow";
}

export interface TableCell extends IParent {
  type: "tableCell";
}

export interface ThematicBreak {
  type: "thematicBreak";
}

export interface Break {
  type: "break";
}

export interface Emphasis extends IParent {
  type: "emphasis";
}

export interface Strong extends IParent {
  type: "strong";
}

export interface Delete extends IParent {
  type: "delete";
}

export interface Link extends IParent {
  type: "link";
  title: string | null;
  url: string;
}

export interface Image {
  type: "image";
  title: string | null;
  alt: string | null;
  url: string;
}

export interface Text extends IText {
  type: "text";
}
