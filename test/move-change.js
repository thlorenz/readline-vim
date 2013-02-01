'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('change followed by move', function (t) {
  hns.seq('c h')
  t.equal(hns.rli.deleteLeft, 1, hns.seqed + 'deletes left once')
  t.equal(hns.insert, 1, 'switches to insert mode')

  hns.reset().seq('c l')
  t.equal(hns.rli.deleteRight, 1, hns.seqed + 'deletes right once')
  t.equal(hns.insert, 1, 'switches to insert mode')
  
  hns.reset().seq('c b')
  t.equal(hns.rli.deleteWordLeft, 1, hns.seqed + 'deletes word left once')
  t.equal(hns.insert, 1, 'switches to insert mode')

  hns.reset().seq('c w')
  t.equal(hns.rli.deleteWordRight, 1, hns.seqed + 'deletes word right once')
  t.equal(hns.insert, 1, 'switches to insert mode')

  t.end()
})
