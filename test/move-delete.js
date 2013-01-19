'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('delete followed by move', function (t) {
  hns.seq('d h')
  t.equal(hns.rli.deleteLeft, 1, hns.seqed + 'deletes left once')

  hns.seq('d l')
  t.equal(hns.rli.deleteRight, 1, hns.seqed + 'deletes right once')
  
  hns.seq('d b')
  t.equal(hns.rli.deleteWordLeft, 1, hns.seqed + 'deletes word left once')

  hns.seq('d w')
  t.equal(hns.rli.deleteWordRight, 1, hns.seqed + 'deletes word right once')

  t.end()
})
