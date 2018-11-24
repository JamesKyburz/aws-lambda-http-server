const { test } = require('tap')
const handler = require('..')
const http = require('http')

process.env.PORT = 1

const server = http.createServer((req, res) => res.end())
server.listen(process.env.PORT)

const event = { requestContext: { path: '' }, headers: {} }

test('callbackWaitsForEmptyEventLoop yes', t => {
  process.env.WAIT_FOR_EMPTY_EVENT_LOOP = 'yes'
  const context = {}
  handler(event, context, () => {
    t.equals(true, context.callbackWaitsForEmptyEventLoop)
    t.end()
  })
})

test('callbackWaitsForEmptyEventLoop not yes', t => {
  process.env.WAIT_FOR_EMPTY_EVENT_LOOP = 'xyes'
  const context = {}
  handler(event, context, () => {
    t.equals(false, context.callbackWaitsForEmptyEventLoop)
    t.end()
  })
})

test('serverless-plugin-warmup', t => {
  const warmup = {...event, source: 'serverless-plugin-warmup'}
  handler(warmup, {}, (err, result) => {
    t.error(err)
    t.equals('Lambda is warm!', result)
    t.end()
  })
})

test('ok response', t => {
  server.on('request', (req, res) => res.end('ok'))
  handler(event, {}, (err, result) => {
    t.error(err)
    t.equals('ok', result.body)
    t.equals(200, result.statusCode)
    t.end()
  })
})

test('SERVER_PORT', t => {
  delete process.env.PORT
  process.env.SERVER_PORT = 1
  server.on('request', (req, res) => res.end('ok'))
  handler(event, {}, (err, result) => {
    t.error(err)
    t.equals('ok', result.body)
    t.equals(200, result.statusCode)
    t.end()
  })
})
