const { test } = require('tap')
const http = require('http')

const httpHandler = require('..')

test('on', t => {
  const server = http.createServer()
  const port = 0
  server.listen(port, f => f)

  t.equals(port, server.address().port)
  t.equals('function', typeof httpHandler(port))
  server.on('request', () => t.end())
  server.on('clientError', f => f)
  httpHandler(port)(null, null)
})

test('once', t => {
  const server = http.createServer()
  const port = 0
  server.listen(port, f => f)
  server.once('clientError', f => f)

  t.equals(port, server.address().port)
  t.equals('function', typeof httpHandler(port))
  server.on('request', () => t.end())
  httpHandler(port)(null, null)
})

test('listen with object', t => {
  const server = http.createServer()
  const port = 0
  server.listen({ port }, f => f)
  server.once('clientError', f => f)

  t.equals(port, server.address().port)
  t.equals('function', typeof httpHandler(port))
  server.on('request', () => t.end())
  httpHandler(port)(null, null)
})

test('addListener', t => {
  const server = http.createServer()
  const port = 0
  server.listen(port)

  t.equals(port, server.address().port)
  t.equals('function', typeof httpHandler(port))
  server.addListener('request', () => t.end())
  httpHandler(port)(null, null)
})

test('return handler when no port given, if only one handler exists', t => {
  const server = http.createServer()
  server.listen(0, f => f)
  t.equals('function', typeof httpHandler())
  server.on('request', () => t.end())
  httpHandler()(null, null)
})

test('no handler returned when no port given and multiple handlers exist', t => {
  t.plan(1)
  const server = http.createServer()
  server.listen(0, f => f)
  const server2 = http.createServer()
  server2.listen(5000, f => f)
  t.equals('undefined', typeof httpHandler())
})

test('simple response', t => {
  const server = http.createServer()
  const port = 0
  server.listen(port)

  t.equals(port, server.address().port)
  t.equals('function', typeof httpHandler(port))
  server.on('request', (req, res) => res.end('ok'))
  httpHandler(port)(null, {
    end (data) {
      t.equals('ok', data)
      t.end()
    }
  })
})

test('removeListener', t => {
  const server = http.createServer()
  const port = 0
  server.listen(port)

  t.equals(port, server.address().port)
  t.equals('function', typeof httpHandler(port))
  server.on('request', (req, res) => res.end('ok'))
  server.removeListener('request')
  server.removeListener('x')
  httpHandler(port)(null, {
    end (data) {
      t.fail()
    }
  })
  t.end()
})

test('removeAllListeners', t => {
  const server = http.createServer()
  const port = 0
  server.listen(port)

  t.equals(port, server.address().port)
  t.equals('function', typeof httpHandler(port))
  server.on('request', (req, res) => res.end('ok'))
  server.removeAllListeners()
  httpHandler(port)(null, {
    end (data) {
      t.fail()
    }
  })
  t.end()
})

test('multiple servers', t => {
  const server1 = http.createServer()
  const port1 = 0
  server1.listen(port1)
  server1.on('request', (req, res) => res.end('1'))
  httpHandler(port1)(null, {
    end (data) {
      t.equals('1', data)
    }
  })
  const server2 = http.createServer()
  const port2 = 1
  server2.listen(port2)
  server2.on('request', (req, res) => res.end('2'))
  httpHandler(port2)(null, {
    end (data) {
      t.equals('2', data)
    }
  })
  t.end()
})

test('listen', t => {
  const server = http.createServer()
  t.equals(server, server.listen(0))
  t.end()
})

test('setTimeout', t => {
  const server = http.createServer()
  t.equals(typeof server.setTimeout, 'function')
  t.doesNotThrow(server.setTimeout)
  t.end()
})

test('methods return this', t => {
  const server = http.createServer()
  t.equals(server.listen(), server)
  t.equals(server.removeListener('x'), server)
  t.equals(server.removeAllListeners(), server)
  t.equals(server.on('x', f => f), server)
  t.equals(server.once('x', f => f), server)
  t.equals(server.addListener('x', f => f), server)
  t.equals(server.close(), server)
  t.end()
})
