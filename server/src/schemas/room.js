const { gql } = require('apollo-server-express')

const Room = gql`
  type Room {
    id: ID!
    name: String
    isLocked: Boolean
    isGameRunning: Boolean
    currentPlayerAmount: Int
    maximumPlayerAmount: Int
  }
`

module.exports = Room
