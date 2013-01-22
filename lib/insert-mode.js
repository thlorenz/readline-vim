'use strict';
var utl          =  require('./utl')
  , log          =  utl.log
  , logl         =  utl.logl;

module.exports = function createInsertMode(rli, vim, normalMode, original_ttyWrite) {
  var seq = { keys: [], last: undefined }
    , self = {};

  function matchSequence(mapped) {
    var fastEnough = (new Date() - seq.last) <= vim.threshold;

    // delete sequence chars currently printed (exclude things like space)
    fastEnough && seq.keys.slice(-1)
      .filter(function (x) { return x.length === 1; })
      .forEach(rli._deleteLeft.bind(rli));

    self.clearSequence();

    if (!fastEnough) return false;

    if(utl.isEsc(mapped)) { 
      normalMode(); 
      return true;
    }

    // todo: otherwise simulate the keypress that the sequence maps to

    return true;
  }

  function tryMatchImmediate(mapped) {
    return true;
  }

  // returns true if we are to write to terminal
  function tryMatchSequence(key) {
    seq.keys.push(key.name);
    
    // remember when last key was entered so we can decide if it counts as sequence or not
    var m = vim.map.matchInsert(seq.keys) 
      // assume we'll match no complete sequence and therefore will want to print keyed char
      , passThru = true;

    logl('matched ' + m);
    if (!m) {
      // in case we buffered some keys hoping for a complete sequence, loose hope now
      self.clearSequence();
    } else if (m === true) {
      // we hope for a future match
    } else if (matchSequence(m)) { 
      // we matched our sequence and therefore will not print the char
      passThru = false;
    }
    
    if (passThru) seq.last = new Date();
    return passThru; 
  }

  self.clearSequence = function() {
    while(seq.keys.pop());
  };

  self.handleInput = function(code, key) {
    var passThru;

    logl('code: ' + code);
    log('key: '); logl(key);
    // normal mode via escape or ctrl-[
    if (key.name == 'escape') return normalMode();
    if (key.name == '[' && key.ctrl) return normalMode();

    passThru = utl.hasMeta(key) ? tryMatchImmediate(key) : tryMatchSequence(key);

    if (passThru) original_ttyWrite.apply(rli, arguments);
  };

  return self;
};
