# in-memory-http-listener

Overrides http server listen function to be in memory.

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![downloads](https://img.shields.io/npm/dm/in-memory-http-server.svg)](https://npmjs.org/package/in-memory-http-server)
[![Greenkeeper badge](https://badges.greenkeeper.io/JamesKyburz/in-memory-http-server.svg)](https://greenkeeper.io/)

# usage

```javascript
const handler = require('in-memory-http-listener')

// run server code

handler(port)(req, res)

```
# license

[Apache License, Version 2.0](LICENSE)
