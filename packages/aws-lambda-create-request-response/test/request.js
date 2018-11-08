const { test } = require('tap')
const create = require('..')

test('request url path', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    },
    headers: {}
  })
  t.equals('/', req.url)
  t.end()
})

test('request url path with stage removed', t => {
  const { req } = create({
    requestContext: {
      stage: 'dev',
      path: '/dev/'
    },
    headers: {}
  })
  t.equals('/', req.url)
  t.end()
})

test('querystring /?x=42', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    },
    queryStringParameters: {
      x: '42'
    },
    headers: {}
  })
  t.equals('/?x=42', req.url)
  t.end()
})

test('querystring /?x=åäö', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    },
    queryStringParameters: {
      x: 'åäö'
    },
    headers: {}
  })
  t.equals('/?x=åäö', req.url)
  t.end()
})

test('querystring /?x=õ', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    },
    queryStringParameters: {
      x: 'õ'
    },
    headers: {}
  })
  t.equals('/?x=õ', req.url)
  t.end()
})

test('request method', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    httpMethod: 'GET',
    headers: {}
  })
  t.equals('GET', req.method)
  t.end()
})

test('request headers', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    headers: {
      'x-cUstom-1': '42',
      'x-custom-2': '43'
    }
  })
  t.equals('42', req.headers['x-custom-1'])
  t.equals('42', req.rawHeaders['x-cUstom-1'])
  t.equals('42', req.getHeader('x-custom-1'))
  t.equals('43', req.headers['x-custom-2'])
  t.equals('43', req.getHeader('x-custom-2'))
  t.deepEqual(
    {
      'x-custom-1': '42',
      'x-custom-2': '43'
    },
    req.getHeaders()
  )

  t.end()
})

test('stream', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    headers: {}
  })
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    t.equals('ok', data)
    t.end()
  })
  req.push('ok')
  req.push(null)
})

test('text body', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    body: 'ok',
    headers: {}
  })
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    t.equals('ok', data)
    t.end()
  })
})

test('text base64 body', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    body: Buffer.from('ok').toString('base64'),
    isBase64Encoded: true,
    headers: {}
  })
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    t.equals('ok', data)
    t.end()
  })
})

test('connection', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    headers: {}
  })
  t.deepEqual({}, req.connection)
  t.end()
})
