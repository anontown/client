import {
  Paper,
  RaisedButton,
} from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
} from "react-router-dom";
import {
  Page,
  Res,
} from "../components";
import { userSwitch, UserSwitchProps } from "../utils";
import * as G from "../../generated/graphql";

type NotificationsPageProps = RouteComponentProps<{}> & UserSwitchProps;

export const NotificationsPage = userSwitch((_props: NotificationsPageProps) => {
  const reses = G.FindReses.use({
    variables: {
      query: {
        date: {
          date: new Date().toISOString(),
          type: "lte"
        },
        notice: true
      }
    }
  });

  return (
    <Page>
      <Helmet>
        <title>通知</title>
      </Helmet>
      <div>
        <div>
          <RaisedButton label="最新" onClick={async () => {
            if (reses.data === undefined) {
              return;
            }
            const first = reses.data.reses.first();
            if (first === undefined) {
              await reses.refetch();
            } else {
              reses.fetchMore({
                variables: {
                  query: {
                    date: {
                      date: first.date,
                      type: "gt"
                    },
                    notice: true
                  },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...prev,
                    msgs: [...fetchMoreResult.reses, ...prev.reses]
                  }
                }
              });
            }
          }} />
        </div>
        <div>
          {reses.data !== undefined
            ? reses.data.reses.map(r => <Paper key={r.id}>
              <Res
                res={r} />
            </Paper>)
            : null}
        </div>
        <div>
          <RaisedButton label="前" onClick={async () => {
            if (reses.data === undefined) {
              return;
            }
            const last = reses.data.reses.last();
            if (last === undefined) {
              await reses.refetch();
            } else {
              reses.fetchMore({
                variables: {
                  query: {
                    date: {
                      date: last.date,
                      type: "lt"
                    },
                    notice: true
                  },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...prev,
                    msgs: [...prev.reses, ...fetchMoreResult.reses]
                  }
                }
              });
            }
          }} />
        </div>
      </div>
    </Page>
  );
});