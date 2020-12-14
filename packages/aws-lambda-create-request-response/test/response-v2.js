const { test } = require('tap')
const create = require('..')

test('statusCode writeHead 404', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.statusCode, 404)
      t.end()
    }
  )
  res.writeHead(404)
  t.equals(res.statusCode, 404)
  res.end()
})

test('statusCode statusCode=200', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.statusCode, 200)
      t.end()
    }
  )
  res.statusCode = 200
  t.equals(res.statusCode, 200)
  res.end()
})

test('writeHead headers', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(result.headers, {
        'x-custom-1': '1',
        'x-custom-2': '2'
      })
      t.end()
    }
  )
  res.writeHead(200, {
    'x-custom-1': '1',
    'x-custom-2': '2'
  })
  t.equals(res.headersSent, true)
  res.end()
})

test('setHeader', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(result.headers, {
        'x-custom-1': '1',
        'x-custom-2': '2'
      })
      t.end()
    }
  )
  res.setHeader('x-custom-1', '1')
  res.setHeader('x-custom-2', '2')
  res.end()
})

test('single cookie', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.headers['set-cookie'], undefined)
      t.deepEquals(result.cookies, ['a=1'])
      t.end()
    }
  )
  res.setHeader('set-cookie', 'a=1')
  res.end()
})

test('multiple cookies', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.headers['set-cookie'], undefined)
      t.deepEquals(result.cookies, ['a=1', 'b=2'])
      t.end()
    }
  )
  res.setHeader('set-cookie', ['a=1', 'b=2'])
  res.end()
})

test('hasHeader', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(result.headers, {
        'x-custom-1': '1',
        'x-custom-2': '2'
      })
      t.end()
    }
  )
  res.setHeader('x-custom-1', '1')
  res.setHeader('x-custom-2', '2')
  t.equals(true, res.hasHeader('x-custom-1'))
  t.equals(true, res.hasHeader('x-custom-2'))
  res.end()
})

test('multi header support for api gateway', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(result.headers, {
        'x-custom-1': '1,1'
      })
      t.end()
    }
  )
  res.setHeader('x-custom-1', ['1', '1'])
  res.end()
})

test('setHeader + removeHeader', t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.deepEquals(result.headers, {
        'x-custom-2': '2'
      })
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
    version: '2.0',
    rawPath: '/',
    requestContext: {
      http: {
        method: 'GET',
        path: '/'
      }
    },
    headers: {}
  })
  res.setHeader('x-custom-1', '1')
  res.setHeader('x-custom-2', '2')
  t.equals('1', res.getHeader('x-custom-1'))
  t.deepEquals(res.getHeaders(), {
    'x-custom-1': '1',
    'x-custom-2': '2'
  })
  t.end()
})

test(`res.write('ok')`, t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.isBase64Encoded, false)
      t.equals(result.body, 'ok')
      t.end()
    }
  )
  res.write('ok')
  t.equals(res.headersSent, true)
  res.end()
})

test(`res.end('ok')`, t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.isBase64Encoded, false)
      t.equals(result.body, 'ok')
      t.end()
    }
  )
  res.end('ok')
})

test(`res.end(Buffer.from('ok'))`, t => {
  const { res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'GET',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.isBase64Encoded, false)
      t.equals(result.body, 'ok')
      t.end()
    }
  )
  res.end(Buffer.from('ok'))
})

test('req.pipe(res)', t => {
  const { req, res } = create(
    {
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'POST',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.isBase64Encoded, false)
      t.equals(result.body, 'ok')
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
      version: '2.0',
      rawPath: '/',
      requestContext: {
        http: {
          method: 'POST',
          path: '/'
        }
      },
      headers: {}
    },
    (err, result) => {
      t.error(err)
      t.equals(result.body, Buffer.from('ok').toString('base64'))
      t.equals(result.isBase64Encoded, true)
      t.end()
    }
  )
  res.end('ok')
})
