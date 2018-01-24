'use strict'

const httpHandler = require('in-memory-http-listener')
const createRequestResponse = require('aws-lambda-create-request-response')

const proxy = (event, context, callback) => {
  const { req, res } = createRequestResponse(event, callback)
  if (proxy.onRequest) proxy.onRequest(req, res)
  httpHandler(process.env.PORT)(req, res)
}

module.exports = proxy
