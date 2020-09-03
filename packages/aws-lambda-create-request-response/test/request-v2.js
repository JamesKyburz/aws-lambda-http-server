const { test } = require('tap')
const create = require('..')

test('request url path', t => {
  const { req } = create({
    version: '2.0',
    requestContext: {},
    rawPath: '/'
  })
  t.equals(req.url, '/')
  t.end()
})

test('request url path with stage removed', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '/dev/',
    requestContext: {
      stage: 'dev'
    }
  })
  t.equals(req.url, '/')
  t.end()
})

test('request with single cookie', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '/',
    requestContext: {},
    cookies: ['a=1']
  })
  t.equals(req.url, '/')
  t.equals(req.headers.cookie, 'a=1')
  t.end()
})

test('request with multiple cookies', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '/',
    requestContext: {},
    cookies: ['a=1', 'b=2']
  })
  t.equals(req.url, '/')
  t.equals(req.headers.cookie, 'a=1; b=2')
  t.end()
})

test('querystring /?x=42', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '/',
    requestContext: {},
    rawQueryString: 'x=42'
  })
  t.equals(req.url, '/?x=42')
  t.end()
})

test('querystring /?x=åäö', t => {
  const { req } = create({
    version: '2.0',
    requestContext: {
      path: '/'
    },
    rawQueryString: 'x=%C3%A5%C3%A4%C3%B6'
  })
  t.equals(req.url, '/?x=%C3%A5%C3%A4%C3%B6')
  t.end()
})

test('querystring /?x=õ', t => {
  const { req } = create({
    version: '2.0',
    requestContext: {
      path: '/'
    },
    rawQueryString: 'x=%C3%B5'
  })
  t.equals(req.url, '/?x=%C3%B5')
  t.end()
})

test('request method', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '',
    requestContext: {},
    httpMethod: 'GET'
  })
  t.equals(req.method, 'GET')
  t.end()
})

test('request headers', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '',
    requestContext: {},
    headers: {
      'x-cUstom-1': '42',
      'x-custom-2': '43'
    }
  })
  t.equals(req.headers['x-custom-1'], '42')
  t.equals(req.getHeader('x-custom-1'), '42')
  t.equals(req.headers['x-custom-2'], '43')
  t.equals(req.getHeader('x-custom-2'), '43')
  t.deepEqual(req.getHeaders(), {
    'x-custom-1': '42',
    'x-custom-2': '43'
  })
  t.deepEqual(req.rawHeaders, ['x-cUstom-1', '42', 'x-custom-2', '43'])
  t.end()
})

test('request headers with same name', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '',
    requestContext: {},
    headers: {
      'x-multiple-1': '41,42'
    }
  })
  t.equals(req.headers['x-multiple-1'], '41,42')
  t.deepEqual(req.getHeaders(), {
    'x-multiple-1': '41,42'
  })
  t.deepEqual(req.rawHeaders, ['x-multiple-1', '41', 'x-multiple-1', '42'])
  t.end()
})

test('stream', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '',
    requestContext: {},
    headers: {}
  })
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    t.equals(data, 'ok')
    t.end()
  })
  req.push('ok')
  req.push(null)
})

test('text body', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '',
    requestContext: {},
    body: 'ok',
    headers: {}
  })
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    t.equals(data, 'ok')
    t.end()
  })
})

test('text base64 body', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '',
    requestContext: {},
    body: Buffer.from('ok').toString('base64'),
    isBase64Encoded: true,
    headers: {}
  })
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    t.equals(data, 'ok')
    t.end()
  })
})

test('text body with encoding', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '',
    requestContext: {},
    body: 'åäöß',
    headers: {}
  })
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    t.equals(data, 'åäöß')
    t.end()
  })
})

test('connection', t => {
  const { req } = create({
    version: '2.0',
    rawPath: '',
    requestContext: {},
    headers: {}
  })
  t.deepEqual(req.connection, {})
  t.end()
})
