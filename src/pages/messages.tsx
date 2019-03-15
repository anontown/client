import {
  Paper,
  RaisedButton,
} from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import {
  Md,
  Page,
} from "../components";
import { dateFormat, userSwitch, UserSwitchProps } from "../utils";
import * as G from "../../generated/graphql";

type MessagesPageProps = RouteComponentProps<{}> & UserSwitchProps;

export const MessagesPage = userSwitch(withRouter((_props: MessagesPageProps) => {
  const msgs = G.FindMsgs.use({
    variables: {
      query: {
        date: {
          date: new Date().toISOString(),
          type: "lte"
        }
      }
    }
  });

  return (
    <Page>
      <Helmet>
        <title>お知らせ</title>
      </Helmet>
      <div>
        <div>
          <RaisedButton label="最新" onClick={async () => {
            if (msgs.data === undefined) {
              return;
            }
            const first = msgs.data.msgs.first();
            if (first === undefined) {
              await msgs.refetch();
            } else {
              msgs.fetchMore({
                variables: {
                  query: {
                    date: {
                      date: first.date,
                      type: "gt"
                    }
                  },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...prev,
                    msgs: [...fetchMoreResult.msgs, ...prev.msgs]
                  }
                }
              });
            }
          }} />
        </div>
        <div>
          {msgs.data !== undefined
            ? msgs.data.msgs.map(m =>
              <Paper key={m.id}>
                <div>{dateFormat.format(m.date)}</div>
                <Md text={m.text} />
              </Paper>)
            : null}
        </div>
        <div>
          <RaisedButton label="前" onClick={async () => {
            if (msgs.data === undefined) {
              return;
            }
            const last = msgs.data.msgs.last();
            if (last === undefined) {
              await msgs.refetch();
            } else {
              msgs.fetchMore({
                variables: {
                  query: {
                    date: {
                      date: last.date,
                      type: "lt"
                    }
                  },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...prev,
                    msgs: [...prev.msgs, ...fetchMoreResult.msgs]
                  }
                }
              });
            }
          }} />
        </div>
      </div>
    </Page>
  );
}));