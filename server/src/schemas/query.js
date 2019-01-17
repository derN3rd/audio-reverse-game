const { gql } = require('apollo-server-express')

const Query = gql`
  type Query {
    rooms(
      """
      The number of results to show. Must be >= 1. Default = 5
      """
      pageSize: Int
      after: Int
    ): [Room]!
    room(id: ID!): Room
    # me: User
  }
`

module.exports = Query
