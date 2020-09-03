const http = require('http')

const handlers = {}

module.exports = port => {
  if (typeof port !== 'undefined') return handlers[port]
  const keys = Object.keys(handlers)
  if (keys.length === 1) return handlers[keys[0]]
}

http.createServer = fn => {
  const noop = f => f
  let port
  let handler = fn || noop
  const saveHandler = fn => {
    if (fn) handler = fn
    if (typeof port !== 'undefined') handlers[port] = handler
  }
  return {
    setTimeout: f => f,
    address: () => ({ address: '::', family: 'IPv6', port }),
    listen (listenPort, cb) {
      if (typeof listenPort === 'object') listenPort = listenPort.port
      port = listenPort
      saveHandler()
      cb && cb()
      return this
    },
    removeListener (type) {
      if (type === 'request') saveHandler(noop)
      return this
    },
    removeAllListeners () {
      saveHandler(noop)
      return this
    },
    on (type, fn) {
      if (type === 'request') saveHandler(fn)
      return this
    },
    once (type, fn) {
      return this
    },
    addListener (type, fn) {
      return this.on(type, fn)
    },
    close () {
      return this
    }
  }
}
