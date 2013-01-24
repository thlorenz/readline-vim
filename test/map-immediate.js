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

test('\ngiven I mapped insert mode [ctrl-s] to [ctrl-p] and am in insert mode', function (t) {
  function localSetup() {
    setup()
    var ctrlS = { name: 's', ctrl: true }
    matchInsert.withArgs('ctrl-s').returns('ctrl-p')
    hns.rlv.forceInsert()
  }

  localSetup()

  hns.key('ctrl-s')
 
  console.log('written', hns.written);
  // t.equal(hns.written.pop().key, { name: 'p', ctrl: true }, 'pressing ctrl-s emits ctrl-p')
  //t.equal(map.matchInsert({ name: 's', ctrl: true, shift: true }), undefined, 'matching [shift-ctrl-i] returns undefined')
  
  t.end()
})

/*
test('\nkey combinations in insert mode', function (t) {
   t.test('\n# given I mapped [ctrl-i] to escape', function (t) {
    var map = createMap()

    map.insert('ctrl-i', 'escape')

    t.equal(map.mappings.insert.immediates['ctrl-i'], 'escape', 'it is added to the mappings under insert.immediates.ctrl-i')
    t.equal(map.matchInsert({ name: 'i', ctrl: true }), 'escape', 'matching [ctrl-i] returns escape')
    t.equal(map.matchInsert({ name: 'i', ctrl: true, shift: true }), undefined, 'matching [shift-ctrl-i] returns undefined')

    t.end()
   })

   t.test('\n# given I mapped [shift-ctrl-i] to ctrl-p (although that does not currently work due to readline limiations)', function (t) {
    var map = createMap()

    map.insert('shift-ctrl-i', 'ctrl-p')

    t.equal(map.mappings.insert.immediates['shift-ctrl-i'], 'ctrl-p', 'it is added to the mappings under insert.immediates.shift-ctrl-i')
    t.equal(map.matchInsert({ name: 'i', ctrl: true, shift: true }), 'ctrl-p', 'matching [shift-ctrl-i] returns ctrl-p')
    t.equal(map.matchInsert({ name: 'j', ctrl: true, shift: true }), undefined, 'matching [shift-ctrl-j] returns undefined')
    t.equal(map.matchInsert({ name: 'i', ctrl: false, shift: true }), undefined, 'matching [ctrl-i] returns undefined')

    t.end()
   })
})

test('\nkey combinations in normal mode', function (t) {
   t.test('\n# given I mapped [ctrl-i] to escape', function (t) {
    var map = createMap()

    map.normal('ctrl-i', 'escape')

    t.equal(map.mappings.normal.immediates['ctrl-i'], 'escape', 'it is added to the mappings under normal.immediates.ctrl-i')
    t.equal(map.matchNormal({ name: 'i', ctrl: true }), 'escape', 'matching [ctrl-i] returns escape')
    t.equal(map.matchNormal({ name: 'i', ctrl: true, shift: true }), undefined, 'matching [shift-ctrl-i] returns undefined')

    t.end()
   })

   t.test('\n# given I mapped [shift-ctrl-i] to ctrl-p (although that does not currently work due to readline limiations)', function (t) {
    var map = createMap()

    map.normal('shift-ctrl-i', 'ctrl-p')

    t.equal(map.mappings.normal.immediates['shift-ctrl-i'], 'ctrl-p', 'it is added to the mappings under normal.immediates.shift-ctrl-i')
    t.equal(map.matchNormal({ name: 'i', ctrl: true, shift: true }), 'ctrl-p', 'matching [shift-ctrl-i] returns ctrl-p')
    t.equal(map.matchNormal({ name: 'j', ctrl: true, shift: true }), undefined, 'matching [shift-ctrl-j] returns undefined')
    t.equal(map.matchNormal({ name: 'i', ctrl: false, shift: true }), undefined, 'matching [ctrl-i] returns undefined')

    t.end()
   })
})
*/
