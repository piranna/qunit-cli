#!/usr/bin/env node

var fs      = require('fs')
var extname = require('path').extname
var resolve = require('path').resolve

var assign   = require('object-assign')
var optimist = require('optimist')

var QUnit = require('./index')


// Request at least one test file as parameter
var argv = optimist
    .alias('code', 'c')
    .describe('code', 'Path to code loaded globally')
    .demand(1)
    .argv

var files = argv._

// Define QUnit globals
global.QUnit = QUnit

assign(global, QUnit)

function setGlobal(code)
{
  code = code.split(':')
  var namespace = code.shift()

  if(code.length)
    code = code.join(':')
  else
  {
    code = namespace
    namespace = ''
  }

  code = require(resolve(code))
  if(namespace)
    global[namespace] = code
  else
    assign(global, code)
}

// Expose exports of code globally
var code = argv.code
if(code)
{
  if(!(code instanceof Array)) code = [code]

  code.forEach(setGlobal)
}

// [Hack] Load QUnit test framework allowing config to be set by plugins
var config = QUnit.extend({}, QUnit.config)
QUnit.load()
QUnit.extend(QUnit.config, config)

// Run tests
files.forEach(function(file)
{
  file = resolve(file)

  fs.stat(file, function(error, stats)
  {
    if(error) return console.warn(error)

    if(!stats.isDirectory()) return require(file)

    fs.readdir(file, function(error, files)
    {
      if(error) return console.warn(error)

      files.forEach(function(name)
      {
        name = resolve(file, name)

        if(extname(name) === '.js') return require(name)

        console.warn('Unknown file type:',name)
      });
    })
  })
});
