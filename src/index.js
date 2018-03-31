'use strict'

const httpHandler = require('in-memory-http-listener')
const createRequestResponse = require('aws-lambda-create-request-response')

module.exports = (event, context, callback) => {
  if (event.source === 'serverless-plugin-warmup') {
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false
  const { req, res } = createRequestResponse(event, callback)
  httpHandler(process.env.PORT)(req, res)
}
