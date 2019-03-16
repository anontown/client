import {
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Snack, Errors } from "../../components";
import { UserSwitchProps, userSwitch } from "../../utils";
import * as G from "../../../generated/graphql";

type AccountSettingPageProps = RouteComponentProps<{}> & UserSwitchProps;

export const AccountSettingPage = userSwitch(withRouter((props: AccountSettingPageProps) => {
  const [snackMsg, setSnackMsg] = React.useState<string | null>(null);
  const [newPass, setNewPass] = React.useState("");
  const [oldPass, setOldPass] = React.useState("");
  const [sn, setSn] = React.useState("");
  const user = G.FindUser.use();
  React.useEffect(() => {
    if (user.data !== undefined) {
      setSn(user.data.user.sn);
    } else {
      setSn("");
    }
  }, [user.data, setSn]);
  const updateUserSubmit = G.UpdateUser.use();
  const createTokenMasterSubmit = G.CreateTokenMaster.use();

  return <Paper>
    <Helmet>
      <title>アカウント設定</title>
    </Helmet>
    <Snack
      msg={snackMsg}
      onHide={() => setSnackMsg(null)} />
    {user.error !== undefined
      ? <Errors errors={["ユーザー情報取得に失敗しました"]} />
      : null}
    {user.loading
      ? <div>loading</div>
      : null}
    {user.data !== undefined
      ? <form>
        <TextField floatingLabelText="ID" value={sn} onChange={(_e, v) => setSn(v)} />
        <TextField
          floatingLabelText="新しいパスワード"
          value={newPass}
          onChange={(_e, v) => setNewPass(v)} />
        <TextField
          floatingLabelText="現在のパスワード"
          value={oldPass}
          onChange={(_e, v) => setOldPass(v)} />
        <RaisedButton onClick={async () => {
          if (user.data !== undefined) {
            try {
              await updateUserSubmit({
                variables: {
                  sn,
                  pass: newPass,
                  auth: { id: user.data.user.id, pass: oldPass }
                }
              });
              const token = await createTokenMasterSubmit({
                variables: {
                  auth: { id: user.data.user.id, pass: newPass }
                }
              });
              if (token.data !== undefined) {
                props.updateUserData({
                  ...props.userData,
                  token: token.data.createTokenMaster as G.TokenMaster.Fragment
                });
              }
            } catch{
              setSnackMsg("エラーが発生しました");
            }
          }
        }} label="OK" />
      </form>
      : null}
  </Paper >;
}));