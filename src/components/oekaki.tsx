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
  onSubmit?: (svg: string) => void;
  size: Vec2d;
}

interface OekakiState {
  value: Value;
  color: RGBColor;
  fill: boolean;
  width: number;
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
    };
  }

  line: Line | null = null;

  penDown(x: number, y: number) {
    this.line = {
      color: this.state.color,
      fill: this.state.fill,
      width: this.state.width,
      m: { x, y },
      lines: Im.List(),
    };
  }

  penUp() {
    if (this.line !== null) {
      this.setState({ value: this.state.value.change(this.state.value.value.push(this.line)) });
      this.line = null;
    }
  }

  penMove(x: number, y: number) {
    if (this.line !== null) {
      this.line.lines = this.line.lines.push({ x, y });
    }
  }

  toColorString(color: RGBColor): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }

  get svg(): string {
    const val = this.state.value.value;

    return `
<?xml version="1.0" encoding="utf-8"?>
<svg width="${this.props.size.x}px"
  height="${this.props.size.y}px"
  xmlns="http://www.w3.org/2000/svg"
  baseProfile="full"
  version="1.1">
  ${val.map((p) => `<path strokeLinecap="round"
        strokeWidth="${p.width}"
        stroke="${this.toColorString(p.color)}"
        fill="${p.fill ? this.toColorString(p.color) : "none"}"
        d="${`M ${p.m.x} ${p.m.y} ` + p.lines.map((l) => `L ${l.x} ${l.y} `).join(" ")}"
      />`)}
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
          <ColorPicker color={this.state.color} onChange={(color) => this.setState({ color })} />
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
            if (this.props.onSubmit) {
              this.props.onSubmit(this.svg);
            }
          }} >
            <FileFileUpload />
          </IconButton >
        </div >
        <img src={"data:image/svg+xml," + encodeURIComponent(this.svg)}
          width={this.props.size.x}
          height={this.props.size.y}
          onMouseDown={(e) => this.penDown(e.clientX, e.clientY)}
          onMouseUp={() => this.penUp()}
          onMouseMove={(e) => this.penMove(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            e.preventDefault();
            this.penDown(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }}
          onTouchEnd={() => this.penUp()}
          onTouchMove={(e) => {
            e.preventDefault();
            this.penMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }}
        />
      </div>
    );
  }

}
