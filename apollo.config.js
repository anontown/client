module.exports = {
  schemas: {
    app: {
      "schema": "./node_modules/@anontown/graphql/schema.json"
    }
  },
  queries: [
    {
      schema: "app",
      includes: ["./src/**/*.gql"],
    }
  ]
}