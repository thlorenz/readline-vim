'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , proxyquire = require('proxyquire').noCallThru()
  , sinon = require('sinon')
  , createHarness = require('./utils/harness')
  , threshold = 10

var stubs, hns, matchNormal, matchInsert

function setup() {
  matchNormal = sinon.stub() 
  matchInsert = sinon.stub()

  stubs = {
    './lib/map': function () {
      return { matchNormal: matchNormal, matchInsert: matchInsert }
    }
  };

  var readlineVim = proxyquire('..', stubs)
  hns = createHarness(readlineVim)
  hns.rlv.threshold = threshold / 2 
}

test('\ngiven I mapped insert mode [lk] to escape and am in insert mode', function (t) {

  function localSetup() {
    setup()
    matchInsert.withArgs('l', []).returns(true)
    matchInsert.withArgs('k', ['l']).returns('escape')

    hns.rlv.forceInsert()
  }

  t.test('\n# when I type [lk] quickly', function (t) {
    localSetup()

    hns.key('l')
    hns.key('k')

    t.equal(hns.rli.ttyWrite.length, 0, 'outputs nothing')
    t.equal(hns.normal, 1, 'switches to normal mode once')
    t.end()
  })

  t.test('\n# when I type [lk] slowly', function (t) {
    localSetup()

    hns.key('l')
    setTimeout(lastKeyAndCheck, threshold)

    function lastKeyAndCheck() {
      hns.key('k')

      var ttyw = hns.rli.ttyWrite;

      t.equal(ttyw.length, 2, 'outputs twice')
      t.equal(ttyw.shift().key.name, 'l', 'l')
      t.equal(ttyw.shift().key.name, 'k', 'k')
      t.equal(hns.normal, 0, 'does not switch to normal mode')
      t.end()
    }
  })
})


