'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , hns = require('./utils/harness')()

test('replace followed by a key', function (t) {
  var ttyw = hns.rli.ttyWrite

  hns.seq('r o')
  t.equal(hns.rli.deleteRight, 1, hns.seqed + 'deletes right once')
//  t.equal(ttyw.length, 1, 'outputs one char')

  t.end()
})

// TODO: handle special keys when replace mode was triggered (i.e. on ENTER)
