'use strict';
/*jshint asi: true*/

var test = require('tap').test
  , proxyquire = require('proxyquire').noCallThru()
  , sinon = require('sinon')
  , createHarness = require('./utils/harness')

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
}

test('\ngiven I am in insert mode', function (t) {
  function insertModeSetup() {
    setup()
    hns.rlv.forceInsert()
  }
  
  t.test('\nand I mapped insert mode [ctrl-s] to [ctrl-p]', function (t) {
    insertModeSetup()

    matchInsert.withArgs('ctrl-s').returns('ctrl-p')

    hns.key('ctrl-s')
    t.equal(hns.writtenStr.pop(), 'ctrl-p', 'pressing ctrl-s emits ctrl-p')
    t.equal(hns.writtenStr.pop(), undefined, 'it does not emit anything else')

    hns.key('ctrl-k')
    t.equal(hns.writtenStr.pop(), 'ctrl-k', 'pressing ctrl-k emits ctrl-k')
    
    t.end()
  })

  t.test('\nand I mapped insert mode [shift-ctrl-s] to [ctrl-p]', function (t) {
    insertModeSetup()

    matchInsert.withArgs('shift-ctrl-s').returns('ctrl-p')

    hns.key('shift-ctrl-s')
    t.equal(hns.writtenStr.pop(), 'ctrl-p', 'pressing shift-ctrl-s emits ctrl-p')
    t.equal(hns.writtenStr.pop(), undefined, 'it does not emit anything else')

    hns.key('ctrl-s')
    t.equal(hns.writtenStr.pop(), 'ctrl-s', 'pressing ctrl-s emits ctrl-s')
    
    t.end()
  })

  t.test('\nand I mapped insert mode [ctrl-s] to [esc]', function (t) {
    insertModeSetup()

    matchInsert.withArgs('ctrl-s').returns('esc')

    hns.key('ctrl-s')
    t.equal(hns.normal, 1, 'pressing ctrl-s switches to normal mode')
    t.equal(hns.writtenStr.pop(), undefined, 'it does not emit anything')

    hns.key('ctrl-k')
    // XXX
    //t.equal(hns.writtenStr.pop(), 'ctrl-k', 'pressing ctrl-k emits ctrl-k')
    
    t.end()
  })
})

test('\ngiven I am in normal mode', function (t) {
  function normalModeSetup() {
    setup()
    hns.rlv.forceNormal()
  }
  
  t.test('\nand I mapped normal mode [s] to k', function (t) {
    normalModeSetup()

    matchNormal.withArgs('s').returns('k')

    hns.key('s')
    t.equal(hns.rli.historyPrev, 1, '[s] goes back in history')

    hns.rli.reset()
    hns.key('l')
    t.equal(hns.rli.historyPrev, 0, '[l] does not go back in history')
    
    t.end()
  })

  t.test('\nand I mapped normal mode [ctrl-s] to k', function (t) {

    normalModeSetup()

    matchNormal.withArgs('ctrl-s').returns('k')

    hns.key('ctrl-s')
    t.equal(hns.rli.historyPrev, 1, '[ctrl-s] goes back in history')

    hns.rli.reset()
    hns.key('ctrl-k')
    t.equal(hns.rli.historyPrev, 0, '[ctrl-k] does not go back in history')
    
    t.end()
  })

  t.test('\nand I mapped normal mode [shift-s] to k', function (t) {
    normalModeSetup()

    matchNormal.withArgs('shift-s').returns('k')

    hns.key('shift-s')
    t.equal(hns.rli.historyPrev, 1, '[shift-s] goes back in history')

    hns.rli.reset()
    hns.key('ctrl-s')
    t.equal(hns.rli.historyPrev, 0, '[ctrl-s] does not go back in history')
    
    t.end()
  })

  t.test('\nand I mapped normal mode [shift-ctrl-s] to j', function (t) {
    normalModeSetup()

    matchNormal.withArgs('shift-ctrl-s').returns('j')

    hns.key('shift-ctrl-s')
    t.equal(hns.rli.historyNext, 1, '[shift-ctrl-s] goes forward in history')

    hns.rli.reset()
    hns.key('ctrl-s')
    t.equal(hns.rli.historyNext, 0, '[ctrl-s] does not go forward in history')
    
    t.end()
  })
})
