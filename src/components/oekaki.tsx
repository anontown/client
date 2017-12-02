import * as Im from "immutable";
import {
  Checkbox,
  IconButton,
  Slider,
} from "material-ui";
import {
  ContentRedo,
  ContentUndo,
  FileFileUpload,
} from "material-ui/svg-icons";
import * as React from "react";
import { RGBColor } from "react-color";
import { Command } from "../utils";
import { ColorPicker } from "./color-picker";
import * as ReactDOM from "react-dom";

export interface Vec2d {
  x: number;
  y: number;
}

export interface Line {
  color: RGBColor;
  fill: boolean;
  width: number;
  m: Vec2d;
  lines: Im.List<Vec2d>;
}

export type Value = Command<Im.List<Line>>;

export interface OekakiProps {
  onSubmit: (data: FormData) => void;
  size: Vec2d;
}

interface OekakiState {
  value: Value;
  color: RGBColor;
  fill: boolean;
  width: number;
  line: Line | null;
}

export class Oekaki extends React.Component<OekakiProps, OekakiState> {
  defaltMinRows = 5;

  constructor(props: OekakiProps) {
    super(props);
    this.state = {
      value: Command.fromValue(Im.List()),
      color: { r: 0, g: 0, b: 0 },
      fill: false,
      width: 1,
      line: null
    };
  }

  getPoint(cx: number, cy: number): [number, number] {
    const rect = ReactDOM.findDOMNode(this.refs['img']).getBoundingClientRect();
    return [cx - rect.left, cy - rect.top];
  }

  penDown(cx: number, cy: number) {
    const [x, y] = this.getPoint(cx, cy);
    if (this.state.line === null) {
      this.setState({
        line: {
          color: this.state.color,
          fill: this.state.fill,
          width: this.state.width,
          m: { x, y },
          lines: Im.List(),
        }
      });
    }
  }

  penUp() {
    if (this.state.line !== null) {
      this.setState({
        value: this.state.value.change(this.state.value.value.push(this.state.line)),
        line: null
      });
    }
  }

  penMove(cx: number, cy: number) {
    const [x, y] = this.getPoint(cx, cy);
    if (this.state.line !== null) {
      this.setState({
        line: {
          ...this.state.line,
          lines: this.state.line.lines.push({ x, y })
        }
      });
    }
  }

  toColorString(color: RGBColor): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a || "1"})`;
  }

  get svg(): string {
    const val = this.state.line !== null
      ? this.state.value.value.push(this.state.line)
      : this.state.value.value;

    return `
<svg width="${this.props.size.x}px"
  height="${this.props.size.y}px"
  xmlns="http://www.w3.org/2000/svg">
  ${val.map(p => `
      <g stroke-linecap="round"
        stroke-width="${p.width}"
        stroke="${this.toColorString(p.color)}"
        fill="${p.fill ? this.toColorString(p.color) : "none"}">
        <path d="${`M ${p.m.x} ${p.m.y} ` + p.lines.map(l => `L ${l.x} ${l.y}`).join(" ")}"/>
      </g>`).join("\n")}
</svg>
    `;
  }

  render() {
    return (
      <div>
        <div>
          <div>
            太さ
          </div>
          <Slider value={this.state.width}
            step={1}
            min={1}
            max={10}
            onChange={(_e, v) => this.setState({ width: v })} />
          <ColorPicker color={this.state.color} onChange={color => this.setState({ color })} />
          <Checkbox label="塗りつぶす"
            checked={this.state.fill}
            onCheck={(_e, v) => this.setState({ fill: v })} />
          <IconButton onClick={() => this.setState({ value: this.state.value.undo() })}  >
            <ContentUndo />
          </IconButton>
          <IconButton onClick={() => this.setState({ value: this.state.value.redo() })} >
            <ContentRedo />
          </IconButton >
          <IconButton onClick={() => {
            //svg to blob
            const img = ReactDOM.findDOMNode(this.refs['img']) as HTMLImageElement;
            const canvas = document.createElement('canvas');
            canvas.setAttribute("width", this.props.size.x.toString());
            canvas.setAttribute("height", this.props.size.y.toString());
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
              ctx.drawImage(img, 0, 0, this.props.size.x, this.props.size.y);
              canvas.toBlob(blob => {
                if (blob !== null) {
                  const data = new FormData();
                  data.append("image", blob, "oekaki.png");
                  this.props.onSubmit(data);
                }
              });
            }
          }} >
            <FileFileUpload />
          </IconButton >
        </div >
        <img
          ref="img"
          style={{
            border: "solid 5px #888"
          }}
          src={"data:image/svg+xml," + encodeURIComponent(this.svg)}
          width={this.props.size.x}
          height={this.props.size.y}
          onMouseDown={e => {
            e.preventDefault();
            this.penDown(e.clientX, e.clientY);
          }}
          onMouseUp={e => {
            e.preventDefault();
            this.penUp();
          }}
          onMouseMove={e => {
            e.preventDefault();
            this.penMove(e.clientX, e.clientY);
          }}
          onTouchStart={e => {
            e.preventDefault();
            this.penDown(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }}
          onTouchEnd={e => {
            e.preventDefault();
            this.penUp();
          }}
          onTouchMove={e => {
            e.preventDefault();
            this.penMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }}
        />
      </div>
    );
  }

}
