'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('given the line contains 0123456789', function (t) {
  function setup() {
    hns.reset()
    hns.rli.line = '0123456789'
  }

  t.test('and the cursor is at position 0', function (t) {
    function setupCursor() {
      setup()  
      rli.cursor = 0
    }
  })

  
})
