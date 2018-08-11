module.exports = {
  schemas: {
    myPrimaryBackend: {
      "endpoint": "../server/resources/app.gql",
      "schema": "schema.json"
    }
  },
  queries: [
    {
      schema: "myPrimaryBackend",
      includes: ["./src/**/*.gql"],
    }
  ]
}