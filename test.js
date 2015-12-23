#!/usr/bin/env node

if (typeof QUnit === 'undefined')
{
  QUnit = require('./index')
  QUnit.load()
}


QUnit.module('test')

QUnit.test('failed', function(assert)
{
  assert.ok(false)
})

QUnit.skip('skipped', function(){})

QUnit.test('passed', function(assert)
{
  var x = 0
  assert.equal(++x, 1)
})
