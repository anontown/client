import * as Im from "immutable";
import {
  Dialog,
  MenuItem,
  Paper,
  RaisedButton,
  SelectField,
  TextField,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Errors,
  MdEditor,
  Page,
  TagsInput,
  UserSwitch,
} from "../components";
import { myInject, UserStore } from "../stores";
import { createTopicNormal, createTopicOne } from "../gql/topic.gql";
import { createTopicNormal as createTopicNormalResult, createTopicNormalVariables } from "../gql/_gql/createTopicNormal";
import { createTopicOne as createTopicOneResult, createTopicOneVariables } from "../gql/_gql/createTopicOne";
import { Mutation } from "react-apollo";

interface TopicCreatePageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export interface TopicCreatePageState {
  title: string;
  tags: Im.Set<string>;
  text: string;
  type: "TopicNormal" | "TopicOne";
  openDialog: boolean;
}

export const TopicCreatePage =
  withRouter(myInject(["user"], observer(class extends React.Component<TopicCreatePageProps, TopicCreatePageState> {
    constructor(props: TopicCreatePageProps) {
      super(props);
      this.state = {
        title: "",
        tags: Im.Set(),
        text: "",
        type: "TopicOne",
        openDialog: false,
      };
    }

    render() {
      return <Page>
        <Helmet>
          <title>トピック作成</title>
        </Helmet>
        <UserSwitch userData={this.props.user.data} render={() => <Paper>
          <Mutation<createTopicNormalResult | createTopicOneResult, createTopicNormalVariables | createTopicOneVariables>
            mutation={this.state.type === "TopicNormal" ? createTopicNormal : createTopicOne}
            variables={{
              title: this.state.title,
              tags: this.state.tags.toArray(),
              text: this.state.text,
            }}
            onCompleted={x => {
              this.props.history.push(`/topic/${("createTopicNormal" in x ? x.createTopicNormal : x.createTopicOne).id}`);
            }}
          >
            {(submit, { error }) => {
              return (<form>
                <Dialog
                  title="確認"
                  open={this.state.openDialog}
                  autoScrollBodyContent={true}
                  onRequestClose={() => this.setState({ openDialog: false })}
                  actions={[
                    <RaisedButton label={"はい"} onClick={() => {
                      this.setState({ openDialog: false });
                      submit();
                    }} />,
                    <RaisedButton label={"いいえ"} onClick={() => this.setState({ openDialog: false })} />,
                  ]}>
                  ニュース・ネタ・実況などは単発トピックで建てて下さい。<br />
                  本当に建てますか？
            </Dialog>
                {error && <Errors errors={["エラーが発生しました"]} />}
                <div>
                  <SelectField
                    floatingLabelText="種類"
                    value={this.state.type}
                    onChange={(_e, _i, v) => this.setState({ type: v })}>
                    <MenuItem value="TopicOne" primaryText="単発" />
                    <MenuItem value="TopicNormal" primaryText="通常" />
                  </SelectField>
                </div>
                <div>
                  <TextField
                    floatingLabelText="タイトル"
                    value={this.state.title}
                    onChange={(_e, v) => this.setState({ title: v })} />
                </div>
                <div>
                  <TagsInput value={this.state.tags} onChange={v => this.setState({ tags: v })} />
                </div>
                <MdEditor value={this.state.text} onChange={v => this.setState({ text: v })} />
                <div>
                  <RaisedButton onClick={() => {
                    if (this.state.type === "TopicNormal") {
                      this.setState({ openDialog: true });
                    } else {
                      submit();
                    }
                  }} label="トピック作成" />
                </div>
              </form>);
            }}
          </Mutation>
        </Paper>} />
      </Page>;
    }
  })));
