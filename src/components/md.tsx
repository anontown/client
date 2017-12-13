import { Dialog } from "material-ui";
import * as React from "react";
import { Link } from "react-router-dom";
import { Config } from "../env";
import {
  camo,
  mdParser,
  safeURL
} from "../utils";
import * as style from "./md.scss";

type URLType = { type: "normal", url: string } |
  { type: "router", path: string } |
  { type: "youtube", videoID: string } |
  { type: "image", url: string };

export interface MdProps {
  body: string;
}

export function Md(props: MdProps) {
  const node = mdParser.parse(props.body);
  return React.createElement("div", {
    style: {
      padding: "2px",
    },
    className: style.md,
  },
    ...node.children.map(c => <MdNode node={c} />));
}

interface MdYouTubeProps {
  title?: string;
  videoID: string;
}

class MdYouTube extends React.Component<MdYouTubeProps, { slow: boolean }> {
  constructor(props: MdYouTubeProps) {
    super(props);
    this.state = {
      slow: false,
    };
  }

  render() {
    return [
      <img
        key="img"
        src={`https://i.ytimg.com/vi/${this.props.videoID}/maxresdefault.jpg`}
        title={this.props.title || undefined}
        onClick={() => this.setState({ slow: true })} />,
      <Dialog
        key="dialog"
        title="YouTube"
        open={this.state.slow}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ slow: false })}>
        <div className={style.youtube}>
          <iframe
            src={`https://www.youtube.com/embed/${this.props.videoID}`}
            frameBorder="0">
          </iframe>
        </div>
      </Dialog>,
    ];
  }
}

function urlEnum(url: string): URLType {
  const reg = url.match(/(youtube\.com\/watch\?v=|youtu\.be\/)([a-z0-9_]+)/i);
  if (reg) {
    return { type: "youtube", videoID: reg[2] };
  }

  if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
    return {
      type: "router",
      path: url,
    };
  }

  if (url.indexOf(Config.client.origin) === 0) {
    return {
      type: "router",
      path: url.substring(Config.client.origin.length),
    };
  }

  if (url.match(/\.(jpg|jpeg|png|gif|bmp|tif|tiff|svg)$/i)) {
    return { type: "image", url };
  }

  return { type: "normal", url };
}

function MdLink(props: { node: mdParser.Link }) {
  const link = urlEnum(props.node.url);
  switch (link.type) {
    case "normal":
      return React.createElement("a", {
        href: safeURL(props.node.url),
        target: "_blank",
        title: props.node.title || undefined,
      }, ...props.node.children.map(c => <MdNode node={c} />));
    case "image":
      return <img
        src={safeURL(camo.getCamoUrl(props.node.url))}
        title={props.node.title || undefined} />;
    case "youtube":
      return <MdYouTube videoID={link.videoID} title={props.node.title || undefined} />;
    case "router":
      return React.createElement(Link, {
        to: link.path,
      }, ...props.node.children.map(c => <MdNode node={c} />));
  }
}

function MdHeading(props: { node: mdParser.Heading }) {
  return React.createElement(`h${props.node.depth}`, {},
    ...props.node.children.map(c => <MdNode node={c} />));
}

function MdTable(props: { node: mdParser.Table }) {
  const head = props.node.children[0];

  return <table>
    <thead>
      {React.createElement("tr", {}, ...head.type === "tableRow"
        ? head.children.map((cell, index) =>
          React.createElement("th", {
            style: {
              textAlign: props.node.align[index],
            },
          }, ...cell.type === "tableCell"
            ? cell.children.map(c => <MdNode node={c} />)
            : []))
        : [])}
    </thead>
    {React.createElement("tbody", {}, ...props.node.children
      .filter((_, i) => i !== 0)
      .map(row => row.type === "tableRow"
        ? React.createElement("tr", {}, ...row.children.map((cell, index) => cell.type === "tableCell"
          ? React.createElement("td", {
            style: {
              textAlign: props.node.align[index],
            },
          }, ...cell.children.map(c => <MdNode node={c} />))
          : []))
        : []))}
  </table>;
}

class MdNode extends React.Component<{ node: mdParser.MdNode }, {}> {
  render(): React.ReactNode {
    switch (this.props.node.type) {
      case "paragraph":
        return React.createElement("p", {}
          , ...this.props.node.children.map(c => <MdNode node={c} />));
      case "blockquote":
        return React.createElement("blockquote", {}
          , ...this.props.node.children.map(c => <MdNode node={c} />));
      case "heading":
        return <MdHeading node={this.props.node} />;
      case "code":
        return <pre>
          <code>{this.props.node.value}</code>
        </pre>;
      case "inlineCode":
        return <code>{this.props.node.value}</code>;
      case "list":
        if (this.props.node.ordered) {
          return React.createElement("ol", {}
            , ...this.props.node.children.map(c => <MdNode node={c} />));
        } else {
          return React.createElement("ul", {}
            , ...this.props.node.children.map(c => <MdNode node={c} />));
        }
      case "listItem":
        return React.createElement("li", {}
          , ...this.props.node.children.map(c => <MdNode node={c} />));
      case "table":
        return <MdTable node={this.props.node} />;
      case "thematicBreak":
        return <hr />;
      case "break":
        return <br />;
      case "emphasis":
        return React.createElement("em", {}
          , ...this.props.node.children.map(c => <MdNode node={c} />));
      case "strong":
        return React.createElement("strong", {}
          , ...this.props.node.children.map(c => <MdNode node={c} />));
      case "delete":
        return React.createElement("del", {}
          , ...this.props.node.children.map(c => <MdNode node={c} />));
      case "link":
        return <MdLink node={this.props.node} />;
      case "image":
        return <img
          src={camo.getCamoUrl(this.props.node.url)}
          title={this.props.node.title || undefined}
          alt={this.props.node.alt || undefined} />;
      case "text":
        return this.props.node.value;
      default:
        return null;
    }
  }
}
