'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('deletion', function (t) {
  var k, seq, keys

  k = 'shift-d'

  hns.key(k)
  t.equal(hns.rli.deleteLineLeft, 1, '[' + k + '] deletes line left once')
  t.equal(hns.rli.deleteLineRight, 1, '[' + k + '] deletes line right once')

  hns.reset()
  hns.rlv.forceInsert()

  hns.key(k)
  t.equal(hns.rli.deleteLineLeft, 0, 'in insert mode [' + k + '] does not delete line left')
  t.equal(hns.rli.deleteLineRight, 0, 'in insert mode [' + k + '] does not delete line right')

  // staying in normal mode for remaining test
  hns.reset()

  k = 'd'
  hns.key(k)
  t.equal(hns.rli.deleteLineLeft, 0, '[' + k + '] does not delete line left')
  t.equal(hns.rli.deleteLineRight, 0, '[' + k + '] does not delete line right')

  hns.reset()
  hns.rlv.forceNormal()

  function send(seq_) {
    seq = seq_;
    keys = seq.split(' ')

    hns.key(keys.shift())
    hns.key(keys.shift())
  }

  send('d d')

  t.equal(hns.rli.deleteLineLeft, 1, '[' + seq + '] deletes line left once')
  t.equal(hns.rli.deleteLineRight, 1, '[' + seq + '] deletes line right once')

  t.end()
})
