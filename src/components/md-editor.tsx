import * as React from 'react';
import { TextField, IconButton, Toggle } from 'material-ui';
import { ImageAddAPhoto, ContentCreate } from 'material-ui/svg-icons';
import Md from './md';


export interface Props {
  onUploadImageClick?: () => void;
  onOekakiClick?: () => void;
  value: string;
  preview?: boolean;
  maxRows?: number;
  minRows?: number;
  onYouTubeClick?: (videoID: string) => void;
  onChange?: (e: React.FormEvent<{}>, newValue: string) => void;
}

export interface State {
  preview: boolean;
}

export default class MdEditor extends React.Component<Props, State> {
  defaltMinRows = 5;

  constructor(props: Props) {
    super(props);
    this.state = {
      preview: props.preview || false
    }
  }

  render() {
    return (
      <div>
        <div>
          <IconButton onClick={this.props.onUploadImageClick}>
            <ImageAddAPhoto />
          </IconButton>
          <IconButton onClick={this.props.onOekakiClick}>
            <ContentCreate />
          </IconButton>
        </div >
        <Toggle label='Preview' defaultToggled={this.state.preview} onToggle={(_e, v) => this.setState({ preview: v })} />
        <TextField multiLine={true}
          rows={this.props.minRows || this.defaltMinRows}
          rowsMax={this.props.maxRows}
          value={this.props.value}
          onChange={this.props.onChange} />
        <Md body={this.props.value}
          onYouTubeClick={this.props.onYouTubeClick} />
      </div>
    );
  }
}