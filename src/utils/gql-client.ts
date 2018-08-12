import { Config } from "../env";
import ApolloClient from 'apollo-boost';
import { stores } from "../stores";

export const gqlClient = new ApolloClient({
  uri: Config.api.origin,
  request: async opt => {
    if (stores.user.data !== null) {
      opt.setContext({
        headers: {
          "X-Token": `${stores.user.data.token.id},${stores.user.data.token.key}`
        }
      });
    }
  }
});
