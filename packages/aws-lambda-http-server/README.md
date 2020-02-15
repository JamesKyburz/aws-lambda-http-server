# aws-lambda-http-server

Call your http server stack code using an in memory http listener. No sockets needed.

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![build status](https://api.travis-ci.org/JamesKyburz/aws-lambda-http-server.svg)](https://travis-ci.org/JamesKyburz/aws-lambda-http-server)
[![downloads](https://img.shields.io/npm/dm/aws-lambda-http-server.svg)](https://npmjs.org/package/aws-lambda-http-server)
[![Greenkeeper badge](https://badges.greenkeeper.io/JamesKyburz/aws-lambda-http-server.svg)](https://greenkeeper.io/)

<a href="https://asciinema.org/a/174886?autoplay=1&speed=4&size=small&preload=1"><img src="https://asciinema.org/a/174886.png" width="380"/></a>

Should work with any http framework.

Tests include the following http frameworks.

- [x] [Express](https://www.npmjs.com/package/express)
- [x] [Fastify](https://www.npmjs.com/package/fastify)
- [x] [Koa](https://www.npmjs.com/package/koa)
- [x] [server-base](https://www.npmjs.com/package/server-base)

## server.js

```javascript
require('http').createServer((req, res) => {
  if (req.url === '/hello') return res.end('world')
})
.listen(5000)
```

## aws-lambda.js

```javascript
exports.proxy = require('aws-lambda-http-server')
require('./server.js')
```

## serverless.yml example

```yaml
service: test
provider:
  name: aws
  runtime: nodejs12.x
  region: eu-west-1
functions:
  proxy:
    handler: aws-lambda.proxy
    events:
      - http:
          path: /{proxy+}
          method: any
      - http:
          path: ''
          method: any
```

# license

[Apache License, Version 2.0](LICENSE)
