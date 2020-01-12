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

test('methods return this', t => {
  const server = http.createServer()
  t.equals(server.listen(), server)
  t.equals(server.removeListener('x'), server)
  t.equals(server.removeAllListeners(), server)
  t.equals(server.on('x', f => f), server)
  t.equals(server.addListener('x', f => f), server)
  t.equals(server.close(), server)
  t.end()
})
