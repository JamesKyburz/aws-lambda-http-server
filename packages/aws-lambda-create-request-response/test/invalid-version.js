const { test } = require('tap')
const create = require('..')

test('incorrect or missing version', t => {
  t.plan(1)
  create({}, err => {
    t.equals(err.message, 'unsupported version undefined {}')
  })
})
