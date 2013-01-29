'use strict';
/*jshint asi: true*/

var readlineHarness = require('readline-testharness')
  , stringifyKey = require('stringify-key');

module.exports = function createHarness (readlineVim_) { 
  var readlineVim = readlineVim_ || require('../..')
    , hns = readlineHarness(readlineVim)

  hns.written    = [] 
  hns.writtenStr = []

  hns.resetModes = function () {
    hns.normal = 0;
    hns.insert = 0;
  }

  hns.onreset = function onreset() {
    hns.rlw.events.removeAllListeners();
    hns.rlw.events.on('normal', function () { hns.normal++; });
    hns.rlw.events.on('insert', function () { hns.insert++; });

    hns.rlw.events.on('write', function (code, key) { 
      hns.written.push({ code: code, key: key }) ;
      try { 
        hns.writtenStr.push(stringifyKey(key)); 
      } catch (e) { console.error(e); }
    });
    hns.rlw.forceNormal();

    hns.written    =  [];
    hns.writtenStr =  [];

    hns.resetModes();
  }

  hns.onreset();
  return hns;
};
