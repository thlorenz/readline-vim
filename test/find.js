'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('\ngiven the line contains hello world', function (t) {
  function setup() {
    hns.reset()
    //              01234567890                      
    hns.rli.line = 'hello wOrld'
  }

  t.test('\n# and the cursor is at position 0', function (t) {
    function setupCursorAt_0() {
      setup()
      hns.rli.cursor = 0
    }

    setupCursorAt_0()
    hns.seq('f e')
    t.equal(hns.rli.moveCursor.pop(), 1, hns.seqed + 'moves cursor to e')

    setupCursorAt_0()
    hns.seq('f z')
    t.equal(hns.rli.moveCursor.length, 0, hns.seqed + 'does not move cursor')

    setupCursorAt_0()
    hns.seq('f space')
    t.equal(hns.rli.moveCursor.pop(), 5, hns.seqed + 'moves cursor to space')

    setupCursorAt_0()
    hns.seq('t space')
    t.equal(hns.rli.moveCursor.pop(), 4, hns.seqed + 'moves cursor up to space')

    setupCursorAt_0()
    hns.seq('f l')
    t.equal(hns.rli.moveCursor.pop(), 2, hns.seqed + 'moves cursor to l')

    setupCursorAt_0()
    hns.seq('t l')
    t.equal(hns.rli.moveCursor.pop(), 1, hns.seqed + 'moves cursor up to l')

    setupCursorAt_0()
    hns.seq('f o')
    t.equal(hns.rli.moveCursor.pop(), 4, hns.seqed + 'moves cursor to o')

    setupCursorAt_0()
    hns.seq('f shift-o')
    t.equal(hns.rli.moveCursor.pop(), 7, hns.seqed + 'moves cursor to O')

    t.end()
  })

  t.test('\n# and the cursor is at position 5', function (t) {
    function setupCursorAt_5() {
      setup()
      hns.rli.cursor = 5
    }

    setupCursorAt_5()
    hns.seq('f e')
    t.equal(hns.rli.moveCursor.length, 0, hns.seqed + 'does not move cursor')

    setupCursorAt_5()
    hns.seq('f d')
    t.equal(hns.rli.moveCursor.pop(), 5, hns.seqed + 'moves cursor to d')

    setupCursorAt_5()
    hns.seq('shift-f d')
    t.equal(hns.rli.moveCursor.length, 0, hns.seqed + 'does not move cursor')

    setupCursorAt_5()
    hns.seq('t d')
    t.equal(hns.rli.moveCursor.pop(), 4, hns.seqed + 'moves cursor up to d')

    setupCursorAt_5()
    hns.seq('shift-t d')
    t.equal(hns.rli.moveCursor.length, 0, hns.seqed + 'does not move cursor')

    setupCursorAt_5()
    hns.seq('shift-f e')
    t.equal(hns.rli.moveCursor.pop(), -4, hns.seqed + 'moves cursor to e')

    setupCursorAt_5()
    hns.seq('shift-t e')
    t.equal(hns.rli.moveCursor.pop(), -3, hns.seqed + 'moves cursor up to e')

    t.end()
  })
})
