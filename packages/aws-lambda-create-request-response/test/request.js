const { test } = require('tap')
const create = require('..')

test('request url path', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    }
  })
  t.equals('/', req.url)
  t.end()
})

test('request url path with stage removed', t => {
  const { req } = create({
    requestContext: {
      stage: 'dev',
      path: '/dev/'
    }
  })
  t.equals('/', req.url)
  t.end()
})

test('querystring /?x=42', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      x: ['42']
    }
  })
  t.equals('/?x=42', req.url)
  t.end()
})

test('querystring /?x=åäö', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      x: ['åäö']
    }
  })
  t.equals('/?x=åäö', req.url)
  t.end()
})

test('querystring /?x=õ', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      x: ['õ']
    }
  })
  t.equals('/?x=õ', req.url)
  t.end()
})

test('querystring with multiple values for same name /?x=1&x=2', t => {
  const { req } = create({
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      x: ['1', '2']
    }
  })
  t.equals('/?x=1&x=2', req.url)
  t.end()
})

test('request method', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    httpMethod: 'GET'
  })
  t.equals('GET', req.method)
  t.end()
})

test('request headers', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    multiValueHeaders: {
      'x-cUstom-1': ['42'],
      'x-custom-2': ['43']
    }
  })
  t.equals('42', req.headers['x-custom-1'])
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
  t.deepEqual(['x-cUstom-1', '42', 'x-custom-2', '43'], req.rawHeaders)
  t.end()
})

test('request headers with same name', t => {
  const { req } = create({
    requestContext: {
      path: ''
    },
    multiValueHeaders: {
      'x-multiple-1': ['41', '42']
    }
  })
  t.equals('41,42', req.headers['x-multiple-1'])
  t.deepEqual(
    {
      'x-multiple-1': '41,42'
    },
    req.getHeaders()
  )
  t.deepEqual(['x-multiple-1', '41', 'x-multiple-1', '42'], req.rawHeaders)
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
