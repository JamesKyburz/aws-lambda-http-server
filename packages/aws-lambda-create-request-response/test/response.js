const { test } = require('tap')
const create = require('..')

test('statusCode writeHead 404', t => {
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(404, result.statusCode)
      t.end()
    }
  )
  res.writeHead(404)
  res.end()
})

test('statusCode statusCode=200', t => {
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(200, result.statusCode)
      t.end()
    }
  )
  res.statusCode = 200
  res.end()
})

test('writeHead headers', t => {
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(
        {
          'x-custom-1': ['1'],
          'x-custom-2': ['2']
        },
        result.multiValueHeaders
      )
      t.end()
    }
  )
  res.writeHead(200, {
    'x-custom-1': '1',
    'x-custom-2': '2'
  })
  res.end()
})

test('setHeader', t => {
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(
        {
          'x-custom-1': ['1'],
          'x-custom-2': ['2']
        },
        result.multiValueHeaders
      )
      t.end()
    }
  )
  res.setHeader('x-custom-1', '1')
  res.setHeader('x-custom-2', '2')
  res.end()
})

test('multi header support for api gateway', t => {
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(
        {
          'x-custom-1': ['1', '1']
        },
        result.multiValueHeaders
      )
      t.end()
    }
  )
  res.setHeader('x-custom-1', ['1', '1'])
  res.end()
})

test('setHeader + removeHeader', t => {
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(
        {
          'x-custom-2': ['2']
        },
        result.multiValueHeaders
      )
      t.end()
    }
  )
  res.setHeader('x-custom-1', '1')
  res.setHeader('x-custom-2', '2')
  res.removeHeader('x-custom-1')
  res.end()
})

test('getHeader/s', t => {
  const { res } = create({
    requestContext: {
      path: '/'
    },
    headers: {}
  })
  res.setHeader('x-custom-1', '1')
  res.setHeader('x-custom-2', '2')
  t.equals('1', res.getHeader('x-custom-1'))
  t.deepEquals(
    {
      'x-custom-1': '1',
      'x-custom-2': '2'
    },
    res.getHeaders()
  )
  t.end()
})

test(`res.write('ok')`, t => {
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(false, result.isBase64Encoded)
      t.equals('ok', result.body)
      t.end()
    }
  )
  res.write('ok')
  res.end()
})

test(`res.end('ok')`, t => {
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(false, result.isBase64Encoded)
      t.equals('ok', result.body)
      t.end()
    }
  )
  res.end('ok')
})

test('req.pipe(res)', t => {
  const { req, res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(false, result.isBase64Encoded)
      t.equals('ok', result.body)
      t.end()
    }
  )
  req.pipe(res)
  req.push('ok')
  req.push(null)
})

test('base64 support', t => {
  process.env.BINARY_SUPPORT = 'yes'
  const { res } = create(
    {
      requestContext: {
        path: '/'
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(Buffer.from('ok').toString('base64'), result.body)
      t.equals(true, result.isBase64Encoded)
      t.end()
    }
  )
  res.end('ok')
})
