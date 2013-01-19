'use strict';
/*jshint asi: true*/

var createRli = require('../fakes/readline')
var readlineVim = require('../..')

module.exports = function createHarness () { 
  var hns = {
      rli        : undefined 
    , rlv        : undefined 
    , normal     : undefined
    , insert     : undefined
    , resetModes : resetModes
    , reset      : reset
    , key        : key
    , code       : code
  };

  function key(k) {
    var name, ctrl, alt, shift;
    var keys = k.split('-');
    if (keys.length === 1) name = keys[0];
    else name = keys[1], ctrl = keys[0] === 'ctrl', alt = keys[0] === 'alt', shift = keys[0] = 'shift'

    hns.rli._ttyWrite(null, { name: name, ctrl: ctrl, alt: alt, shift: shift })
  }

  function code(code_) {
    hns.rli._ttyWrite(code_, { })
  }

  function resetModes() {
    hns.normal = 0
    hns.insert = 0
  }

  function reset() {
    hns.rli = createRli()
    hns.rlv = readlineVim(hns.rli)

    hns.rlv.events.removeAllListeners()
    hns.rlv.events.on('normal', function () { hns.normal++ })
    hns.rlv.events.on('insert', function () { hns.insert++ })

    hns.rlv.forceNormal()
    hns.resetModes()
  }
  reset()

  return hns;
};
