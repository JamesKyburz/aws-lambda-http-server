const http = require('http')

const handlers = {}

module.exports = port => handlers[port]

http.createServer = fn => {
  let port
  let handler = fn || (f => f)
  const saveHandler = fn => {
    if (fn) handler = fn
    if (typeof port !== 'undefined') handlers[port] = handler
  }
  return {
    address: () => ({ address: '::', family: 'IPv6', port }),
    listen (listenPort, cb) {
      if (typeof listenPort === 'object') listenPort = listenPort.port
      port = listenPort
      saveHandler()
      cb && cb()
      return this
    },
    removeListener (type) {
      if (type === 'request') saveHandler(f => f)
      return this
    },
    removeAllListeners () {
      saveHandler(f => f)
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
