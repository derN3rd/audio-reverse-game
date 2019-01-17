const { makeExecutableSchema } = require('apollo-server-express')

const resolvers = require('../resolvers')
const Query = require('./query')
const Room = require('./room')

module.exports = makeExecutableSchema({ typeDefs: [Query, Room], resolvers })
