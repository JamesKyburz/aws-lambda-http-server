'use strict'

const Stream = require('stream')
const queryString = require('querystring')

module.exports = (event, callback) => {
  const { version } = event
  if (version !== '1.0' && version !== '2.0') {
    return callback(
      new Error(`unsupported version ${version} ${JSON.stringify(event)}`)
    )
  }
  const isBase64Encoded = process.env.BINARY_SUPPORT === 'yes'
  const response = {
    body: Buffer.from(''),
    isBase64Encoded,
    statusCode: 200,
    ...(version === '1.0' && { multiValueHeaders: {} }),
    ...(version === '2.0' && { headers: {} })
  }

  const req = new Stream.Readable()
  req.url = (
    event.requestContext.path ||
    event.path ||
    event.rawPath ||
    ''
  ).replace(new RegExp('^/' + event.requestContext.stage), '')

  req.finished = true

  if (version === '1.0') {
    if (event.multiValueQueryStringParameters) {
      req.url +=
        '?' + queryString.stringify(event.multiValueQueryStringParameters)
    }
  } else {
    if (event.rawQueryString) {
      req.url += '?' + event.rawQueryString
    }
  }

  req.method = event.httpMethod
  req.rawHeaders = []
  req.headers = {}

  const headers = event.multiValueHeaders || event.headers || {}

  for (const key of Object.keys(headers)) {
    const headerValues =
      version === '1.0' ? headers[key] : headers[key].split(',')
    for (const value of headerValues) {
      req.rawHeaders.push(key)
      req.rawHeaders.push(value)
    }
    req.headers[key.toLowerCase()] = headers[key].toString()
  }

  if (version === '2.0') {
    if (event.cookies && event.cookies.length) {
      for (const value of event.cookies) {
        req.rawHeaders.push('cookie')
        req.rawHeaders.push(value)
      }
      req.headers.cookie = event.cookies.join('; ')
    }
  }

  req.getHeader = name => {
    return req.headers[name.toLowerCase()]
  }
  req.getHeaders = () => {
    return req.headers
  }

  req.connection = {}

  const res = new Stream()
  let headersSent = false
  Object.defineProperty(res, 'statusCode', {
    get () {
      return response.statusCode
    },
    set (statusCode) {
      response.statusCode = statusCode
    }
  })
  Object.defineProperty(res, 'headersSent', {
    get () {
      return headersSent
    }
  })
  res.headers = {}
  res.writeHead = (status, headers = {}) => {
    headersSent = true
    response.statusCode = status
    const lowerCaseHeaders = {}
    for (const key of Object.keys(headers)) {
      lowerCaseHeaders[key.toLowerCase()] = headers[key]
    }
    res.headers = Object.assign(res.headers, lowerCaseHeaders)
  }
  res.write = chunk => {
    headersSent = true
    response.body = Buffer.concat([
      response.body,
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    ])
  }
  res.setHeader = (name, value) => {
    res.headers[name.toLowerCase()] = value
  }
  res.removeHeader = name => {
    delete res.headers[name.toLowerCase()]
  }
  res.getHeader = name => {
    return res.headers[name.toLowerCase()]
  }
  res.getHeaders = () => {
    return res.headers
  }
  res.hasHeader = name => {
    return undefined !== res.getHeader(name)
  }
  res.end = text => {
    if (text) res.write(text)
    response.body = Buffer.from(response.body).toString(
      isBase64Encoded ? 'base64' : undefined
    )
    if (version === '1.0') {
      response.multiValueHeaders = res.headers
    } else {
      response.headers = res.headers
    }
    res.writeHead(response.statusCode)
    fixApiGatewayHeaders()
    callback(null, response)
  }
  if (event.body) {
    req.push(event.body, event.isBase64Encoded ? 'base64' : undefined)
    req.push(null)
  }

  function fixApiGatewayHeaders () {
    if (version === '1.0') {
      for (const key of Object.keys(response.multiValueHeaders)) {
        if (!Array.isArray(response.multiValueHeaders[key])) {
          response.multiValueHeaders[key] = [response.multiValueHeaders[key]]
        }
      }
    } else {
      const cookies = response.headers['set-cookie']
      if (cookies) {
        response.cookies = Array.isArray(cookies) ? cookies : [cookies]
        delete response.headers['set-cookie']
      }
      for (const key of Object.keys(response.headers)) {
        if (Array.isArray(response.headers[key])) {
          response.headers[key] = response.headers[key].join(',')
        }
      }
    }
  }
  return { req, res }
}
