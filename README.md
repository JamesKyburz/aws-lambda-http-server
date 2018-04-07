# aws-lambda-http-server

Call your http server stack code using an in memory http listener. No sockets needed.

# server.js

```javascript
require('http').createServer((req, res) => {
  if (req.url === '/hello') return res.end('world')
})
.listen(1234)
```

# aws-lambda.js

```javascript
exports.proxy = require('aws-lambda-http-server')
require('./server.js')
```

# serverless.yml

```yaml
service: test
provider:
  name: aws
  runtime: nodejs8.10
  endpointType: edge
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
