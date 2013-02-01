'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

  // TODO: testharness should no longer reset on seq, fix tests to still work and publish new test harness

test('given the line contains hello world', function (t) {
  function setup() {
    hns.reset()
    //              01234567890                      
    hns.rli.line = 'hello world'
  }

  t.test('and the cursor is at position 0', function (t) {
    hns.rli.cursor = 0

    hns.seq('f e')
    t.equal(hns.moveCursor.pop(), 1, hns.seqed + 'moves cursor to e')

    t.end()
  })

  
})
