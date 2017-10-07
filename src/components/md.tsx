import * as React from 'react';
import { camo, mdParser } from '../utils';
import { Config } from '../env';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { Dialog } from 'material-ui';


type URLType = { type: 'normal', url: string } | { type: "router", path: string } | { type: 'youtube', videoID: string } | { type: 'image', url: string };

export interface MdProps {
  body: string;
}

export interface MdState {
  youtube: string | null;
}

export class Md extends React.Component<MdProps, MdState> {
  constructor(props: MdProps) {
    super(props);
  }

  render() {
    let node = mdParser.parse(this.props.body);
    return (
      <div>
        <Dialog
          title="YouTube"
          open={this.state.youtube !== null}
          autoScrollBodyContent={true}
          onRequestClose={() => this.setState({ youtube: null })}>
          {this.state.youtube !== null
            ? <YouTube videoId={this.state.youtube} />
            : null}
        </Dialog>
        {node.children.map(x => this.renderNode(x))}
      </div>
    );
  }

  renderTable(node: mdParser.Table): JSX.Element {
    let head = node.children[0];

    return (<table>
      <thead>
        <tr>
          {head.type === 'tableRow'
            ? head.children.map((cell, index) =>
              <th style={{ textAlign: node.align[index] }}>{cell.type === 'tableCell'
                ? cell.children.map(x => this.renderNode(x))
                : null}</th>)
            : null}
        </tr>
      </thead>
      <tbody>
        {node.children
          .filter((_, i) => i !== 0)
          .map(row => row.type === 'tableRow'
            ? <tr>
              {row.children.map((cell, index) => cell.type === 'tableCell'
                ? <td style={{ textAlign: node.align[index] }}>{cell.children.map(x => this.renderNode(x))}</td>
                : null)}
            </tr>
            : null)}
      </tbody >
    </table >);
  }

  renderHeading(node: mdParser.Heading): JSX.Element {
    switch (node.depth) {
      case 1:
        return (<h1>
          {node.children.map(c => this.renderNode(c))}
        </h1>);
      case 2:
        return (<h2>
          {node.children.map(c => this.renderNode(c))}
        </h2>);
      case 3:
        return (<h3>
          {node.children.map(c => this.renderNode(c))}
        </h3>);
      case 4:
        return (<h4>
          {node.children.map(c => this.renderNode(c))}
        </h4>);
      case 5:
        return (<h5>
          {node.children.map(c => this.renderNode(c))}
        </h5>);
      case 6:
        return (<h6>
          {node.children.map(c => this.renderNode(c))}
        </h6>);
    }
  }

  renderLink(node: mdParser.Link): JSX.Element {
    const link = this.urlEnum(node.url);
    switch (link.type) {
      case 'normal':
        return <a href={node.url}
          target="_blank"
          title={node.title || undefined}>{node.children.map(c => this.renderNode(c))}</a>
      case 'image':
        return <img
          src={camo.getCamoUrl(node.url)}
          title={node.title || undefined} />;
      case 'youtube':
        return <img src={`http://i.ytimg.com/vi/${link.videoID}/maxresdefault.jpg`}
          title={node.title || undefined}
          onClick={() => this.setState({ youtube: link.videoID })} />;
      case "router":
        return <Link to={link.path}>{node.children.map(c => this.renderNode(c))}</Link>
    }
  }

  urlEnum(url: string): URLType {
    let reg: RegExpMatchArray | null
    if (reg = url.match(/(youtube\.com\/watch\?v=|youtu\.be\/)([a-z0-9_]+)/i)) {
      return { type: 'youtube', videoID: reg[2] };
    }

    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
      return {
        type: "router",
        path: url
      };
    }

    if (url.indexOf(Config.client.origin) === 0) {
      return {
        type: "router",
        path: url.substring(Config.client.origin.length)
      };
    }

    if (url.match(/\.(jpg|jpeg|png|gif|bmp|tif|tiff|svg)$/i)) {
      return { type: 'image', url };
    }

    return { type: 'normal', url };
  }

  renderNode(node: mdParser.MdNode): JSX.Element | string | null {
    switch (node.type) {
      case 'paragraph':
        return (<p>{node.children.map(c => this.renderNode(c))}</p>);
      case 'blockquote':
        return (<blockquote>{node.children.map(c => this.renderNode(c))}</blockquote>);
      case 'heading':
        return this.renderHeading(node);
      case 'code':
        return (<pre>
          <code>{node.value}</code>
        </pre>);
      case 'inlineCode':
        return (<code>{node.value}</code>);
      case 'list':
        if (node.ordered) {
          return (<ol>{node.children.map(c => this.renderNode(c))}</ol>);
        } else {
          return (<ul>{node.children.map(c => this.renderNode(c))}</ul>);
        }
      case 'listItem':
        return (<li>{node.children.map(c => this.renderNode(c))}</li>);
      case 'table':
        return this.renderTable(node);
      case 'thematicBreak':
        return <hr />;
      case 'break':
        return <br />;
      case 'emphasis':
        return (<em>{node.children.map(c => this.renderNode(c))}</em>);
      case 'strong':
        return (<strong>{node.children.map(c => this.renderNode(c))}</strong>);
      case 'delete':
        return (<del>{node.children.map(c => this.renderNode(c))}</del>);
      case 'link':
        return this.renderLink(node);
      case 'image':
        return (<img src={camo.getCamoUrl(node.url)} title={node.title || undefined} alt={node.alt || undefined} />)
      case 'text':
        return node.value;
      default:
        return null;
    }
  }
}