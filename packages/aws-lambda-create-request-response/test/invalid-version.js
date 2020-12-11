const { test } = require('tap')
const create = require('..')

test('incorrect or missing version', t => {
  const { req } = create({
    requestContext: {},
    path: '/'
  })
  t.equals(req.url, '/')
  t.end()
})
