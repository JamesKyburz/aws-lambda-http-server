require('../../in-memory-http-listener')
require('../../aws-lambda-create-request-response')
require.cache[require.resolve('in-memory-http-listener')] =
  require.cache[require.resolve('../../in-memory-http-listener')]
require.cache[require.resolve('aws-lambda-create-request-response')] =
  require.cache[require.resolve('../../aws-lambda-create-request-response')]
