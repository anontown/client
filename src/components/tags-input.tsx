import * as Im from "immutable";
import {
  AutoComplete,
  MenuItem,
} from "material-ui";
import * as React from "react";
import { apiClient } from "../utils";
import { Snack } from "./snack";
import * as style from "./tags-input.scss";

export interface TagsInputProps {
  value: Im.Set<string>;
  onChange?: (value: Im.Set<string>) => void;
}

interface TagsInputState {
  acTags: Array<{ name: string, count: number }>;
  snackMsg: null | string;
  inputValue: string;
}

export class TagsInput extends React.Component<TagsInputProps, TagsInputState> {
  constructor(props: TagsInputProps) {
    super(props);
    this.state = {
      acTags: [],
      snackMsg: null,
      inputValue: "",
    };

    apiClient.findTopicTags({ limit: 100 })
      .subscribe(tags => {
        this.setState({ acTags: tags });
      }, e => {
        console.error(e);
        this.setState({ snackMsg: "タグ候補取得に失敗しました" });
      });
  }

  addTag() {
    if (this.state.inputValue.length !== 0) {
      if (this.props.onChange !== undefined) {
        this.props.onChange(this.props.value.add(this.state.inputValue));
      }
      this.setState({ inputValue: "" });
    }
  }

  render() {
    return [
      <Snack
        key="snack"
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />,
      <div key="tags">
        {this.props.value.map(t => <span key={t} className={style.tag}>
          <span className={style.tagButton} onClick={() => {
            if (this.props.onChange !== undefined) {
              this.props.onChange(this.props.value.remove(t));
            }
          }}>×</span>
          {t}
        </span>).toArray()}
      </div>,
      <AutoComplete
        key="input"
        floatingLabelText="タグ"
        dataSource={this.state.acTags.map(t => ({
          text: t.name,
          value: <MenuItem
            primaryText={t.name}
            secondaryText={t.count.toString()}
          />,
        }))}
        filter={(text, key) => key.toLowerCase().indexOf(text.toLowerCase()) !== -1}
        searchText={this.state.inputValue}
        onUpdateInput={v => this.setState({ inputValue: v })}
        openOnFocus={true}
        onKeyDown={e => {
          // エンター/半角スペ
          if (e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            this.addTag();
          }
        }}
        onNewRequest={() => this.addTag()}
        listStyle={{
          maxHeight: "30vh",
        }}
      />,
    ];
  }
}
