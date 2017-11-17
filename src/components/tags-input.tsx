import * as React from "react";
import { WithContext as TagInput } from "react-tag-input";
import { apiClient } from "../utils";
import { Snack } from "./snack";

export interface TagsInputProps {
  value: string[];
  onChange?: (value: string[]) => void;
}

interface TagsInputState {
  acTags: Array<{ name: string, count: number }>;
  snackMsg: null | string;
}

export class TagsInput extends React.Component<TagsInputProps, TagsInputState> {
  constructor(props: TagsInputProps) {
    super(props);
    this.state = {
      acTags: [],
      snackMsg: null,
    };

    apiClient.findTopicTags({ limit: 100 })
      .subscribe( tags => {
        this.setState({ acTags: tags });
      }, () => {
        this.setState({ snackMsg: "タグ候補取得に失敗しました" });
      });
  }

  render() {
    return [
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />,
      <TagInput placeholder="タグ"
        tags={this.props.value.map((v, i) => ({ text: v, id: i }))}
        suggestions={this.state.acTags.map( x => x.name)}
        handleAddition={ tag => {
          if (this.props.onChange) {
            this.props.onChange([...this.props.value, tag]);
          }
        }}
        handleDelete={ i => {
          if (this.props.onChange) {
            const tags = [...this.props.value];
            tags.splice(i, 1);
            this.props.onChange(tags);
          }
        }} />,
    ];
  }
}
