#!/usr/bin/env node

if (typeof QUnit === 'undefined')
  QUnit = require('qunit-cli')


QUnit.module('test')

test('failed', function(assert)
{
  assert.ok(false)
})

skip('skipped', function(){})

test('passed', function(assert)
{
  var x = 0
  assert.equal(++x, 1)
})
