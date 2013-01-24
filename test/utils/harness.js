'use strict';
/*jshint asi: true*/

var createRli = require('../fakes/readline')
  , parseKey = require('parse-key')
  , stringifyKey = require('stringify-key')


module.exports = function createHarness (readlineVim_) { 
  var readlineVim = readlineVim_ || require('../..')
  var hns = {
      rli        : undefined 
    , rlv        : undefined 
    , normal     : undefined
    , insert     : undefined
    , resetModes : resetModes
    , reset      : reset
    , key        : key
    , code       : code
    , seq        : seq
    , keyed      : undefined
    , coded      : undefined
    , seqed      : undefined
    , written    : []
    , writtenStr : []
  };

  function key(k) {
    var keyObj;
    try { 
      keyObj = parseKey(k)
    } catch(e) {
      // XXX: probably should fix parse key to handle these cases (same for stringify key)
      keyObj = { name: k }
    }
    hns.rli._ttyWrite(null, keyObj)
    hns.keyed = ' [' + k + '] '
  }

  function code(code_) {
    hns.rli._ttyWrite(code_, { })
    hns.coded = ' [' + code_ + '] '
  }

  function seq(seq_) {
    var keys = seq_.split(' ')

    // since we are dealing with a sequence here, it makes sense to reset
    hns.reset()

    hns.key(keys.shift())
    hns.key(keys.shift())
    hns.seqed = ' [' + seq_ + '] '
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

    readlineVim.base_ttyWrite
    hns.rlv.events.on('write', function (code, key) { 
      hns.written.push({ code: code, key: key }) 
      try { 
        hns.writtenStr.push(stringifyKey(key)) 
      } catch (e) { console.error(e) }
    })

    hns.rlv.forceNormal()
    hns.resetModes()

    hns.keyed = hns.coded = hns.seqed = hns.pressed = undefined
    hns.written = [] 
    hns.writtenStr = []
    
    return hns;
  }
  reset()

  return hns;
};
