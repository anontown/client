import {
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  Redirect,
  RouteComponentProps,
  withRouter,
  Link,
} from "react-router-dom";
import {
  Errors,
  Page,
} from "../components";
import { createTokenMaster } from "../gql/token.gql";
import { createTokenMaster as createTokenMasterResult, createTokenMasterVariables } from "../gql/_gql/createTokenMaster";
import { useUserContext, createUserData } from "src/utils";
import { useMutation } from "react-apollo-hooks";

type LoginPageProps = RouteComponentProps<{}>;

export const LoginPage = withRouter((_props: LoginPageProps) => {
  const [sn, setSn] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [errors, setErrors] = React.useState<string[] | undefined>(undefined);
  const userContext = useUserContext();
  const submit = useMutation<createTokenMasterResult, createTokenMasterVariables>(createTokenMaster);

  return <Page>
    <Helmet>
      <title>ログイン</title>
    </Helmet>
    {userContext.value !== null
      ? <Redirect to="/" />
      : <Paper>
        <Errors errors={errors} />
        <form>
          <div>
            <TextField
              floatingLabelText="ID"
              value={sn}
              onChange={(_e, v) => setSn(v)} />
          </div>
          <div>
            <TextField
              floatingLabelText="パスワード"
              value={pass}
              onChange={(_e, v) => setPass(v)}
              type="password" />
          </div>
          <div><RaisedButton label="ログイン" onClick={async () => {
            try {
              const token = await submit({
                variables: {
                  auth: {
                    sn: sn, pass: pass
                  }
                }
              });
              if (token.data !== undefined) {
                userContext.update(await createUserData(x))
              }
            } catch{
              setErrors(["ログインに失敗しました。"]);
            }
          }} /></div>
          <Link to="/signup">登録</Link>
        </form>
      </Paper>}
  </Page>;

});