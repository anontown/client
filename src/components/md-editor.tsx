import * as React from 'react';
import {
  TextField,
  IconButton,
  Toggle,
  Dialog
} from 'material-ui';
import { ImageAddAPhoto, ContentCreate } from 'material-ui/svg-icons';
import { Md } from './md';
import { Errors } from './errors';
import { Oekaki } from './oekaki';

export interface MdEditorProps {
  errors?: string[],
  onUploadImage?: (data: Blob | FormData) => void;
  value: string;
  preview?: boolean;
  maxRows?: number;
  minRows?: number;
  onChange?: (e: React.FormEvent<{}>, newValue: string) => void;
}

export interface MdEditorState {
  preview: boolean;
  oekaki: boolean;
}

export class MdEditor extends React.Component<MdEditorProps, MdEditorState> {
  defaltMinRows = 5;

  constructor(props: MdEditorProps) {
    super(props);
    this.state = {
      preview: props.preview || false,
      oekaki: false
    }
  }

  render() {
    return (
      <div>
        <Errors errors={this.props.errors} />
        <Dialog
          title="お絵かき"
          open={this.state.oekaki}
          autoScrollBodyContent={true}
          onRequestClose={() => this.setState({ oekaki: false })}>
          <Oekaki size={{ x: 320, y: 240 }} onSubmit={svg => {
            if (this.props.onUploadImage) {
              this.props.onUploadImage(new Blob([svg], { type: 'image/svg+xml' }))
            }
          }} />
        </Dialog>
        <div>
          <IconButton type="file" onChange={e => {
            if (this.props.onUploadImage) {
              let target = e.target as HTMLInputElement;
              let files = target.files;
              if (files !== null) {
                for (let file of Array.from(files)) {
                  let formData = new FormData();
                  formData.append('image', file);
                  this.props.onUploadImage(file);
                }
              }
            }
          }}>
            <ImageAddAPhoto />
          </IconButton>
          <IconButton onClick={() => this.setState({ oekaki: true })}>
            <ContentCreate />
          </IconButton>
        </div >
        <Toggle label='Preview' defaultToggled={this.state.preview} onToggle={(_e, v) => this.setState({ preview: v })} />
        <TextField multiLine={true}
          rows={this.props.minRows || this.defaltMinRows}
          rowsMax={this.props.maxRows}
          value={this.props.value}
          onChange={this.props.onChange} />
        <Md body={this.props.value} />
      </div>
    );
  }
}