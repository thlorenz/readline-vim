'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('in normal mode j and k can be used to browse the history', function (t) {

  hns.rlv.forceNormal()

  hns.key('k')
  t.equals(hns.rli.historyPrev, 1, '[k] navigates to previous item in history')

  hns.key('j')
  t.equals(hns.rli.historyNext, 1, '[j] navigates to next item in history')

  hns.reset()
  hns.rlv.forceInsert()

  hns.key('k')
  t.equals(hns.rli.historyPrev, 0, 'in insert mode [k] does not navigate to previous item in history')

  hns.key('j')
  t.equals(hns.rli.historyNext, 0, 'in insert mode [j] does not navigate to next item in history')

  t.end()
})
