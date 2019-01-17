module.exports = {
  // for datasource see https://github.com/apollographql/fullstack-tutorial/blob/master/final/server/src/datasources/user.js
  rooms: async (_, { pageSize = 5, after }, { dataSources }) => {
    //const results = await dataSources.db.getRooms({ pageSize, after })
    return [
      {
        id: 1,
        name: 'Room 1',
        isLocked: false,
        isGameRunning: false,
        currentPlayerAmount: 0,
        maximumPlayerAmount: 5,
      },
      {
        id: 2,
        name: 'Room 2',
        isLocked: true,
        isGameRunning: false,
        currentPlayerAmount: 2,
        maximumPlayerAmount: 5,
      },
      {
        id: 3,
        name: 'Room 3',
        isLocked: true,
        isGameRunning: true,
        currentPlayerAmount: 5,
        maximumPlayerAmount: 5,
      },
    ]
  },
  room: async (_, { id }, { dataSources }) => {
    //const result = await dataSources.db.getRoom({ id })
    return {
      id: 1,
      name: 'Room 1',
      isLocked: false,
      isGameRunning: false,
      currentPlayerAmount: 0,
      maximumPlayerAmount: 5,
    }
  },
}
