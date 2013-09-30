'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('move on enter', function (t) {
  t.equal(hns.rli.lines, 0, hns.seqed + 'enters on init in normal mode')

  hns.seq('enter')
  t.equal(hns.rli.lines, 1, hns.seqed + 'enters in normal mode')

  t.end()
})
