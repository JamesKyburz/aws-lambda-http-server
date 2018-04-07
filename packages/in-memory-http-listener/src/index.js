const http = require('http')

const handlers = {}

module.exports = (port) => handlers[port]

http.createServer = fn => {
  let port = 0
  let handler = fn || (f => f)
  const saveHandler = fn => {
    if (fn) handler = fn
    if (port) handlers[port] = handler
  }
  return {
    address: () => ({ port }),
    listen (x, cb) {
      port = x
      saveHandler()
      cb && cb()
    },
    addEventListener (fn) {
      saveHandler()
    },
    removeAllListeners () {
      saveHandler(f => f)
    },
    on (type, fn) {
      if (type === 'request') saveHandler(fn)
    },
    close () {}
  }
}
