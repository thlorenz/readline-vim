'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('\nswitching to normal mode', function (t) {
  hns.reset()
  hns.rlv.forceInsert()
  
  var k = 'escape'
  hns.key(k)
  t.equal(hns.normal, 1, 'when in insert mode, [' + k + '] switches to normal mode')
  hns.key(k)
  t.equal(hns.normal, 1, 'when in normal mode, [' + k + '] not switches to normal mode')

  hns.rli.reset()
  hns.rlv.forceInsert()

  k = 'Ctrl-['
  hns.key(k)
  t.equal(hns.normal, 1, 'when in insert mode, [' + k + '] switches to normal mode')
  hns.key(k)
  t.equal(hns.normal, 1, 'when in normal mode, [' + k + '] not switches to normal mode')

  t.end()
})

test('\nswitching to insert mode', function (t) {

  function normalToInsert(k) {
    hns.reset()
    hns.key(k)
    t.equal(hns.insert, 1, 'when in normal mode, [' + k + '] switches to insert mode')
  }

  hns.reset()
  hns.rlv.forceInsert(true)

  var k = 'i'
  hns.key(k)
  t.equal(hns.insert, 0, 'when in insert mode, [' + k + '] not switches to insert mode')

  normalToInsert('i')
  t.equal(hns.rli.moveCursor.length, 0, 'does not move cursor')

  normalToInsert('a')
  t.equal(hns.rli.moveCursor.pop(), 1, 'and moves cursor one to the right')

  normalToInsert('shift-i')
  t.equal(hns.rli.moveCursor.pop(), -Infinity, 'and moves cursor to the beginning of the line')

  normalToInsert('shift-a')
  t.equal(hns.rli.moveCursor.pop(), Infinity, 'and moves cursor to the end of the line')

  t.end()
})
