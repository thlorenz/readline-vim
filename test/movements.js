'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('movement keys move cursor in normal mode, but not in insert mode, tests start out in normal mode', function (t) {

  function checkOneMove(k, cursor) {
    hns.reset()
    hns.rlv.forceNormal()
    hns.key(k)
    t.equal(hns.rli.moveCursor.pop(), cursor, '[' + k + '] moves cursor ' + Math.abs(cursor) + ' to ' + (cursor < 0 ? 'left' : 'right') )
    t.notOk(hns.rli.moveCursor.pop(), 'causes no more movements')

    hns.reset()
    hns.rlv.forceInsert()
    hns.key(k)
    t.notOk(hns.rli.moveCursor.pop(), 'causes no movements in insert mode')
  }

  function checkOneMoveCode(code, cursor) {
    hns.reset()
    hns.rlv.forceNormal()
    hns.code(code)
    
    var tgt
    if (cursor === Infinity) tgt = 'end of line'
    else if (cursor === -Infinity) tgt = 'start of line'

    t.equal(hns.rli.moveCursor.pop(), cursor, 'code [' + code + '] moves cursor to ' + tgt)
    t.notOk(hns.rli.moveCursor.pop(), 'causes no more movements')

    hns.reset()
    hns.rlv.forceInsert()
    hns.code(code)
    t.notOk(hns.rli.moveCursor.pop(), 'causes no movements in insert mode')
  }

  function checkWordMove(k, direction) {
    var move = 'word' + direction[0].toUpperCase() + direction.slice(1)

    hns.reset()
    hns.rlv.forceNormal()
    hns.key(k)

    t.equal(hns.rli[move], 1, '[' + k + '] moves one word ' + direction)

    hns.reset()
    hns.rlv.forceInsert()
    hns.key(k)
    t.notOk(hns.rli.moveCursor.pop(), 'causes no movements in insert mode')
  }

  checkOneMove('h', -1)
  checkOneMove('l', 1)

  checkWordMove('b', 'left')
  checkWordMove('w', 'right')

  checkOneMoveCode('0', -Infinity)
  checkOneMoveCode('$', Infinity)

  t.end()
})
