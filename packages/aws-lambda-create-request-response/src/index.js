'use strict'

const Stream = require('stream')
const queryString = require('querystring')

module.exports = (event, callback) => {
  const base64Support = process.env.BINARY_SUPPORT === 'yes'
  const response = {
    body: Buffer.from(''),
    isBase64Encoded: base64Support,
    statusCode: 200,
    headers: {}
  }

  const req = new Stream.Readable()
  req._read = f => f
  req.url = event.requestContext.path.replace(
    new RegExp('^/' + event.requestContext.stage),
    ''
  )
  if (event.queryStringParameters) {
    req.url += '?' + queryString.stringify(event.queryStringParameters)
  }
  req.method = event.httpMethod
  req.rawHeaders = {}
  req.headers = {}

  for (const key of Object.keys(event.headers)) {
    req.rawHeaders[key] = event.headers[key]
    req.headers[key.toLowerCase()] = event.headers[key]
  }

  req.getHeader = name => {
    return req.headers[name.toLowerCase()]
  }
  req.getHeaders = () => {
    return req.headers
  }

  req.connection = {}

  const res = new Stream()
  Object.defineProperty(res, 'statusCode', {
    get () {
      return response.statusCode
    },
    set (statusCode) {
      response.statusCode = statusCode
    }
  })
  res.headers = {}
  res.writeHead = (status, headers) => {
    response.statusCode = status
    if (headers) res.headers = Object.assign(res.headers, headers)
  }
  res.write = chunk => {
    response.body = Buffer.concat([
      response.body,
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    ])
  }
  res.setHeader = (name, value) => {
    res.headers[name] = value
  }
  res.removeHeader = name => {
    delete res.headers[name]
  }
  res.getHeader = name => {
    return res.headers[name.toLowerCase()]
  }
  res.getHeaders = () => {
    return res.headers
  }
  res.end = text => {
    if (text) res.write(text)
    response.body = Buffer.from(response.body).toString(
      base64Support ? 'base64' : undefined
    )
    response.headers = res.headers || {}
    res.writeHead(response.statusCode)
    callback(null, response)
  }
  if (event.body) {
    req.push(event.body, event.isBase64Encoded ? 'base64' : 'binary')
    req.push(null)
  }

  return { req, res }
}
