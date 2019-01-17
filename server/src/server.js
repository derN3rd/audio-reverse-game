const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const schema = require('./schemas')

const server = new ApolloServer({ schema })

const app = express()
server.applyMiddleware({ app })

app.listen({ port: process.env.PORT || 3000 }, () => {
  console.log(
    `Server started on http://localhost:${process.env.PORT ||
      3000}${server.graphqlpath || '/'}`
  )
})
