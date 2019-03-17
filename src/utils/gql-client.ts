import { Config } from "../env";
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Operation, split } from 'apollo-link';
import * as zen from "zen-observable-ts";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { auth } from "./user";

export function createHeaders(id: string, key: string): {} {
  return {
    "X-Token": `${id},${key}`
  };
}

const httpLink = new HttpLink({
  uri: Config.api.origin,
  credentials: 'same-origin'
});

const wsLink = new WebSocketLink({
  uri: Config.socket.origin + "/graphql",
  options: {
    reconnect: true
  }
});

const request = async (opt: Operation) => {
  if (auth !== null) {
    opt.setContext({
      headers: createHeaders(auth.id, auth.key)
    });
  }
};

const requestLink = new ApolloLink((operation, forward) =>
  new zen.Observable(observer => {
    let handle: zen.ZenObservable.Subscription | undefined = undefined;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward!(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

export const gqlClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    requestLink,
    split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query) as any;
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink,
    )
  ]),
  cache: new InMemoryCache()
});