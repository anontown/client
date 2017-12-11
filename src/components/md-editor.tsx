import {
  Dialog,
  FontIcon,
  IconButton,
  TextField,
  Toggle,
} from "material-ui";
import * as React from "react";
import { Observable } from "rxjs";
import { imgur } from "../utils";
import { Errors } from "./errors";
import { Md } from "./md";
import { Oekaki } from "./oekaki";

export interface MdEditorProps {
  value: string;
  maxRows?: number;
  minRows?: number;
  onChange?: (newValue: string) => void;
  fullWidth?: boolean;
  onKeyPress?: React.KeyboardEventHandler<{}>;
}

interface MdEditorState {
  oekakiErrors?: string[];
  imageErrors?: string[];
  preview: boolean;
  slowOekaki: boolean;
  slowImage: boolean;
}

export class MdEditor extends React.Component<MdEditorProps, MdEditorState> {
  defaltMinRows = 5;

  constructor(props: MdEditorProps) {
    super(props);
    this.state = {
      preview: false,
      slowOekaki: false,
      slowImage: false,
    };
  }

  upload(datas: FormData[]) {
    Observable.of(...datas)
      .mergeMap(form => imgur.upload(form))
      .map(url => `![](${url})`)
      .reduce((tags, tag) => tags + tag + "\n", "")
      .subscribe(tags => {
        this.setState({ slowImage: false, oekakiErrors: undefined });
        if (this.props.onChange) {
          this.props.onChange(this.props.value + tags);
        }
      }, () => {
        this.setState({ imageErrors: ["アップロードに失敗しました"] });
      });
  }

  render() {
    return (
      <div onPaste={e => {
        const items = e.clipboardData.items;
        const datas = Array.from(items)
          .filter(x => x.type.indexOf("image") !== -1)
          .map(x => x.getAsFile())
          .filter<File>((x): x is File => x !== null)
          .map(x => {
            const data = new FormData();
            data.append("image", x, "image.png");
            return data;
          });
        this.upload(datas);
      }}>
        <Dialog
          title="お絵かき"
          open={this.state.slowOekaki}
          autoScrollBodyContent={true}
          onRequestClose={() => this.setState({ slowOekaki: false })}>
          <Errors errors={this.state.oekakiErrors} />
          <Oekaki size={{ x: 320, y: 240 }} onSubmit={data => this.upload([data])} />
        </Dialog>
        <Dialog
          title="画像アップロード"
          open={this.state.slowImage}
          autoScrollBodyContent={true}
          onRequestClose={() => this.setState({ slowImage: false })}>
          <Errors errors={this.state.imageErrors} />
          <input type="file" onChange={e => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (files !== null) {
              const datas = Array.from(files)
                .map(file => {
                  const formData = new FormData();
                  formData.append("image", file);
                  return formData;
                });
              this.upload(datas);
            }
          }} />
        </Dialog>
        <div>
          <IconButton onClick={() => this.setState({ slowImage: true })}>
            <FontIcon className="material-icons">add_a_photo</FontIcon>
          </IconButton>
          <IconButton onClick={() => this.setState({ slowOekaki: true })}>
            <FontIcon className="material-icons">create</FontIcon>
          </IconButton>
        </div>
        <Toggle
          label="Preview"
          toggled={this.state.preview}
          onToggle={(_e, v) => this.setState({ preview: v })} />
        <TextField
          name="text"
          multiLine={true}
          rows={this.props.minRows || this.defaltMinRows}
          rowsMax={this.props.maxRows || this.defaltMinRows}
          value={this.props.value}
          style={{ backgroundColor: "#fff" }}
          onChange={(_, v) => {
            if (this.props.onChange) {
              this.props.onChange(v);
            }
          }}
          onKeyPress={this.props.onKeyPress}
          fullWidth={this.props.fullWidth} />
        {this.state.preview
          ? <div style={{ backgroundColor: "#fff" }}>
            <Md body={this.props.value} />
          </div>
          : null}
      </div>
    );
  }
}
