const { test } = require('tap')
const create = require('..')

test('request url path', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      path: '/'
    }
  })
  t.equals(req.url, '/')
  t.end()
})

test('request url path fallback', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {},
    path: '/'
  })
  t.equals(req.url, '/')
  t.end()
})

test('request url path with stage removed', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      stage: 'dev',
      path: '/dev/'
    }
  })
  t.equals(req.url, '/')
  t.end()
})

test('querystring /?x=42', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      x: ['42']
    }
  })
  t.equals(req.url, '/?x=42')
  t.end()
})

test('querystring /?x=åäö', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      x: ['åäö']
    }
  })
  t.equals(req.url, '/?x=%C3%A5%C3%A4%C3%B6')
  t.end()
})

test('querystring /?x=õ', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      x: ['õ']
    }
  })
  t.equals(req.url, '/?x=%C3%B5')
  t.end()
})

test('querystring with multiple values for same name /?x=1&x=2', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      x: ['1', '2']
    }
  })
  t.equals(req.url, '/?x=1&x=2')
  t.end()
})

test('complicated querystring', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      path: '/'
    },
    multiValueQueryStringParameters: {
      url:
        'https://example.com/t/t?a=8&as=1&t=2&tk=1&url=https://example.com/õ',
      clickSource: 'yes',
      category: 'cat'
    }
  })
  t.equals(
    req.url,
    '/?url=https%3A%2F%2Fexample.com%2Ft%2Ft%3Fa%3D8%26as%3D1%26t%3D2%26tk%3D1%26url%3Dhttps%3A%2F%2Fexample.com%2F%C3%B5&clickSource=yes&category=cat'
  )
  t.end()
})

test('request method', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      path: ''
    },
    httpMethod: 'GET'
  })
  t.equals(req.method, 'GET')
  t.end()
})

test('request headers', t => {
  const { req } = create({
    version: '1.0',
    requestContext: {
      path: ''
    },
    multiValueHeaders: {
      'x-cUstom-1': ['42'],
      'x-custom-2': ['43']
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
    version: '1.0',
    requestContext: {
      path: ''
    },
    multiValueHeaders: {
      'x-multiple-1': ['41', '42']
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
    version: '1.0',
    requestContext: {
      path: ''
    },
    multiValueHeaders: {}
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
    version: '1.0',
    requestContext: {
      path: ''
    },
    body: 'ok',
    multiValueHeaders: {}
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
    version: '1.0',
    requestContext: {
      path: ''
    },
    body: Buffer.from('ok').toString('base64'),
    isBase64Encoded: true,
    multiValueHeaders: {}
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
    version: '1.0',
    requestContext: {
      path: ''
    },
    body: 'åäöß',
    multiValueHeaders: {}
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
    version: '1.0',
    requestContext: {
      path: ''
    },
    multiValueHeaders: {}
  })
  t.deepEqual(req.connection, {})
  t.end()
})
