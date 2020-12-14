require('./helpers/local-require')
const { test } = require('tap')
const handler = require('..')

process.env.PORT = 1
process.env.LOG_LEVEL = 'error'

const base = require('server-base')

let onRequest = (req, res) => res.end()

for (const event of [
  {
    version: '1.0',
    httpMethod: 'GET',
    requestContext: { path: '/' },
    multiValueHeaders: {}
  },
  {
    version: '2.0',
    requestContext: {
      http: {
        method: 'GET',
        path: '/'
      }
    },
    rawPath: '/'
  }
]) {
  base({
    '/': {
      get (req, res) {
        onRequest(res, res)
      }
    }
  }).start(process.env.PORT)

  process.env.PORT = 1
  onRequest = (req, res) => res.end()

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
    const warmup = { ...event, source: 'serverless-plugin-warmup' }
    handler(warmup, {}, (err, result) => {
      t.error(err)
      t.equals('Lambda is warm!', result)
      t.end()
    })
  })

  test('ok response', t => {
    onRequest = (req, res) => res.end('ok')
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
    onRequest = (req, res) => res.end('still ok')
    handler(event, {}, (err, result) => {
      t.error(err)
      t.equals('still ok', result.body)
      t.equals(200, result.statusCode)
      t.end()
    })
  })
}
