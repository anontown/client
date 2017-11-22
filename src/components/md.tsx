import { Dialog } from "material-ui";
import * as React from "react";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import { Config } from "../env";
import { camo, mdParser } from "../utils";

type URLType = { type: "normal", url: string } |
  { type: "router", path: string } |
  { type: "youtube", videoID: string } |
  { type: "image", url: string };

export interface MdProps {
  body: string;
}

export function Md(props: MdProps) {
  const node = mdParser.parse(props.body);
  return <div>{node.children.map(c => <MdNode node={c} />)}</div>;
}

interface MdYouTubeProps {
  title?: string,
  videoID: string
}

class MdYouTube extends React.Component<MdYouTubeProps, { slow: boolean }>{
  constructor(props: MdYouTubeProps) {
    super(props);
    this.state = {
      slow: false
    };
  }

  render() {
    return [
      <img src={`https://i.ytimg.com/vi/${this.props.videoID}/maxresdefault.jpg`}
        title={this.props.title || undefined}
        onClick={() => this.setState({ slow: true })} />,
      <Dialog
        title="YouTube"
        open={this.state.slow}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ slow: false })}>
        {this.state.slow
          ? <YouTube videoId={this.props.videoID} />
          : null}
      </Dialog>
    ]
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
      return <a href={props.node.url}
        target="_blank"
        title={props.node.title || undefined}>{props.node.children.map(c => <MdNode node={c} />)}</a>;
    case "image":
      return <img
        src={camo.getCamoUrl(props.node.url)}
        title={props.node.title || undefined} />;
    case "youtube":
      return <MdYouTube videoID={link.videoID} title={props.node.title || undefined} />;
    case "router":
      return <Link to={link.path}>{props.node.children.map(c => <MdNode node={c} />)}</Link>;
  }
}

function MdHeading(props: { node: mdParser.Heading }) {
  switch (props.node.depth) {
    case 1:
      return <h1>
        {props.node.children.map(c => <MdNode node={c} />)}
      </h1>;
    case 2:
      return <h2>
        {props.node.children.map(c => <MdNode node={c} />)}
      </h2>;
    case 3:
      return <h3>
        {props.node.children.map(c => <MdNode node={c} />)}
      </h3>;
    case 4:
      return <h4>
        {props.node.children.map(c => <MdNode node={c} />)}
      </h4>;
    case 5:
      return <h5>
        {props.node.children.map(c => <MdNode node={c} />)}
      </h5>;
    case 6:
      return <h6>
        {props.node.children.map(c => <MdNode node={c} />)}
      </h6>;
  }
}

function MdTable(props: { node: mdParser.Table }) {
  const head = props.node.children[0];

  return <table>
    <thead>
      <tr>
        {head.type === "tableRow"
          ? head.children.map((cell, index) =>
            <th style={{ textAlign: props.node.align[index] }}>{cell.type === "tableCell"
              ? cell.children.map(c => <MdNode node={c} />)
              : null}</th>)
          : null}
      </tr>
    </thead>
    <tbody>
      {props.node.children
        .filter((_, i) => i !== 0)
        .map(row => row.type === "tableRow"
          ? <tr>
            {row.children.map((cell, index) => cell.type === "tableCell"
              ? <td style={{ textAlign: props.node.align[index] }}>{cell.children.map(c => <MdNode node={c} />)}</td>
              : null)}
          </tr>
          : null)}
    </tbody >
  </table>;
}

class MdNode extends React.Component<{ node: mdParser.MdNode }, {}>{
  render(): React.ReactNode {
    switch (this.props.node.type) {
      case "paragraph":
        return <p>{this.props.node.children.map(c => <MdNode node={c} />)}</p>;
      case "blockquote":
        return <blockquote>{this.props.node.children.map(c => <MdNode node={c} />)}</blockquote>;
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
          return <ol>{this.props.node.children.map(c => <MdNode node={c} />)}</ol>;
        } else {
          return <ul>{this.props.node.children.map(c => <MdNode node={c} />)}</ul>;
        }
      case "listItem":
        return <li>{this.props.node.children.map(c => <MdNode node={c} />)}</li>;
      case "table":
        return <MdTable node={this.props.node} />;
      case "thematicBreak":
        return <hr />;
      case "break":
        return <br />;
      case "emphasis":
        return <em>{this.props.node.children.map(c => <MdNode node={c} />)}</em>;
      case "strong":
        return <strong>{this.props.node.children.map(c => <MdNode node={c} />)}</strong>;
      case "delete":
        return <del>{this.props.node.children.map(c => <MdNode node={c} />)}</del>;
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