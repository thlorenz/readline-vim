'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('close on ctrl-d', function (t) {
  t.equal(hns.rli.closeCalled, 0, 'times close called on init')

  hns.key('ctrl-d')
  t.equal(hns.rli.closeCalled, 1, 'times close called after ctrl-d')

  t.end()
})
