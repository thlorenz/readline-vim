'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('delete', function (t) {

  hns.key('shift-d')
  t.equal(hns.rli.deleteLineLeft, 1, hns.keyed + 'deletes line left once')
  t.equal(hns.rli.deleteLineRight, 1, hns.keyed + 'deletes line right once')

  hns.reset()
  hns.rlv.forceInsert()

  hns.key('shift-d')
  t.equal(hns.rli.deleteLineLeft, 0, 'in insert mode' + hns.keyed + 'does not delete line left')
  t.equal(hns.rli.deleteLineRight, 0, 'in insert mode' + hns.keyed + 'does not delete line right')

  // staying in normal mode for remaining test
  hns.reset()

  hns.key('d')
  t.equal(hns.rli.deleteLineLeft, 0, hns.keyed + 'does not delete line left')
  t.equal(hns.rli.deleteLineRight, 0, hns.keyed + 'does not delete line right')

  hns.reset()
  hns.rlv.forceNormal()

  hns.seq('d d')

  t.equal(hns.rli.deleteLineLeft, 1, hns.seqed + 'deletes line left once')
  t.equal(hns.rli.deleteLineRight, 1, hns.seqed + 'deletes line right once')

  t.end()
})

test('change', function (t) {

  hns.reset().key('shift-c')

  t.equal(hns.rli.deleteLineLeft, 1, hns.keyed + 'deletes line left once')
  t.equal(hns.rli.deleteLineRight, 1, hns.keyed + 'deletes line right once')
  t.equal(hns.insert, 1, 'switches to insert mode')

  hns.reset().seq('c c')

  t.equal(hns.rli.deleteLineLeft, 1, hns.seqed + 'deletes line left once')
  t.equal(hns.rli.deleteLineRight, 1, hns.seqed + 'deletes line right once')
  t.equal(hns.insert, 1, 'switches to insert mode')

  t.end()
})
