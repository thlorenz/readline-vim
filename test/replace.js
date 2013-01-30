'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('\nreplace followed by a letter key', function (t) {

  hns.seq('r o')
  t.equal(hns.rli.deleteRight, 1, hns.seqed + 'deletes right once')
  t.equal(hns.rli.ttyWrite.length, 1, 'outputs one char')
  t.equal(hns.rli.ttyWrite[0].key.name, 'o', 'outputs o')
  t.notOk(hns.rli.ttyWrite[0].key.shift, 'as lowercase')
  t.equal(hns.rli.moveCursor.pop(), -1, 'moves cursor left once')

  t.end()
})

test('\nreplace followed by an uppercase letter key', function (t) {

  hns.seq('r shift-o')
  t.equal(hns.rli.deleteRight, 1, hns.seqed + 'deletes right once')
  t.equal(hns.rli.ttyWrite.length, 1, 'outputs one char')
  t.equal(hns.rli.ttyWrite[0].key.name, 'o', 'outputs o')
  t.ok(hns.rli.ttyWrite[0].key.shift, 'as uppercase')
  t.equal(hns.rli.moveCursor.pop(), -1, 'moves cursor left once')

  t.end()
})

test('\nreplace followed by backspace', function (t) {

  hns.seq('r backspace')
  t.equal(hns.rli.deleteRight, 0, hns.seqed + 'does not delete right')
  t.equal(hns.rli.ttyWrite.length, 1, 'outputs one char')
  t.equal(hns.rli.ttyWrite[0].key.name, 'backspace', 'outputs backspace')
  t.equal(hns.rli.moveCursor.length, 0, 'does not tell rli to move cursor')

  t.end()
})

/*test('\nreplace followed by space', function (t) {

  hns.seq('r space')
  t.equal(hns.rli.deleteRight, 1, hns.seqed + 'deletes right once')
  t.equal(hns.rli.ttyWrite.length, 1, 'outputs one char')
  t.equal(hns.rli.ttyWrite[0].key.name, 'space', 'outputs space')
  t.notOk(hns.rli.ttyWrite[0].key.shift, 'as lowercase')
  t.equal(hns.rli.moveCursor.pop(), -1, 'moves cursor left once')

  t.end()
})*/
