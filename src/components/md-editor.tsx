import {
  Dialog,
  IconButton,
  TextField,
  Toggle,
} from "material-ui";
import { ContentCreate, ImageAddAPhoto } from "material-ui/svg-icons";
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

  render() {
    return (
      <div>
        <Dialog
          title="お絵かき"
          open={this.state.slowOekaki}
          autoScrollBodyContent={true}
          onRequestClose={() => this.setState({ slowOekaki: false })}>
          <Errors errors={this.state.oekakiErrors} />
          <Oekaki size={{ x: 320, y: 240 }} onSubmit={data => {
            imgur.upload(data)
              .subscribe(url => {
                this.setState({ slowOekaki: false, oekakiErrors: undefined });
                if (this.props.onChange) {
                  this.props.onChange(this.props.value + `![](${url})`);
                }
              }, () => {
                this.setState({ oekakiErrors: ["アップロードに失敗しました"] });
              });
          }} />
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
              Observable.of(...Array.from(files))
                .map(file => {
                  const formData = new FormData();
                  formData.append("image", file);
                  return formData;
                })
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
          }}>
            {//<ImageAddAPhoto />
            }
          </input>
        </Dialog>
        <div>
          <IconButton onClick={() => this.setState({ slowImage: true })}>
            <ImageAddAPhoto />
          </IconButton>
          <IconButton onClick={() => this.setState({ slowOekaki: true })}>
            <ContentCreate />
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
          rowsMax={this.props.maxRows}
          value={this.props.value}
          onChange={(_, v) => {
            if (this.props.onChange) {
              this.props.onChange(v);
            }
          }} />
        {this.state.preview
          ? <Md body={this.props.value} />
          : null}
      </div>
    );
  }
}
