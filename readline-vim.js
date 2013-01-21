'use strict';
var EventEmitter =  require('events').EventEmitter
  , createMap    =  require('./lib/map')
  , utl          =  require('./lib/utl')
  , log          =  utl.log
  , logl         =  utl.logl
  ;

function isEsc(s) {
  return s.trim().slice(0, 3).toLowerCase()=== 'esc';
}

var override = module.exports = function override_ttyWrite(rli) {
  var original_ttyWrite = rli._ttyWrite
    , normal = false
    , buf = []
    , seq = { keys: [], last: undefined } 
    , emitter = new EventEmitter()
    , emit = emitter.emit.bind(emitter)
    , map = createMap();

  // exposes properties and functions of our vimified readline
  var vim = { threshold: 2000 };

  vim.__defineGetter__('events', function () { return emitter; });
  vim.__defineGetter__('map', function () { return map; });

  vim.forceNormal = function(silent) {
    normal = true;
    if (!silent) emit('normal');
  };

  vim.forceInsert = function(silent) {
    normal = false;
    if (!silent) emit('insert');
  };

  function normalMode() {
    if (normal) return;
    rli._moveCursor(-1);
    normal = true;
    clearSequence();
    emit('normal');
  }

  function insertMode() {
    normal = false;
    clearSequence();
    emit('insert');
  }

  function clearSequence() {
    logl('clearing seq: ' + seq.keys);
    while(seq.keys.pop());
  }

  function matchSequence(mapped) {
    var fastEnough = (new Date() - seq.last) <= vim.threshold;

    // delete sequence chars currently printed (exclude things like space)
    fastEnough && seq.keys.slice(-1)
      .filter(function (x) { return x.length === 1; })
      .forEach(rli._deleteLeft.bind(rli));

    clearSequence();

    if (!fastEnough) return false;

    if(isEsc(mapped)) { 
      normalMode(); 
      return true;
    }

    // TODO: otherwise simulate the keypress that the sequence maps to

    return true;
  }
  
  // __ttyWrite has been here since 0.2, so I think we are safe to assume it will be used in the future
  rli._ttyWrite = function(code, key) {
    var self = this;
    key = key || {};

    // normal mode via escape or ctrl-[
    if (key.name == 'escape') return normalMode();
    if (key.name == '[' && key.ctrl) return normalMode();

    if (!normal) { 
      seq.keys.push(key.name);
      // remember when last key was entered so we can decide if it counts as sequence or not
      var m = map.matchInsert(seq.keys);
      logl('matched ' + m);
      if (!m) {
        // in case we buffered some keys hoping for a complete sequence, loose hope and 
        clearSequence();
      } else if (m === true) {
        // we hope for a future match
      } else if (matchSequence(m)) { 
        // we matched our sequence and therefore will not print the keys
        return;
      }
      
      seq.last = new Date();

      return original_ttyWrite.apply(rli, arguments);
    }

    function deleteLine() {
      self._deleteLineLeft();
      self._deleteLineRight();
    }

    var prev = buf.pop();
    switch(key.name) {
      // insert mode via i
      case 'i':
        if (key.shift) return this._moveCursor(-Infinity), insertMode();
        return insertMode();
      // insert mode via a
      case 'a':
        if (key.shift) return this._moveCursor(Infinity), insertMode();
        return this._moveCursor(+1), insertMode();
        break;
        
      // change line via 'cc' or 'C'
      case 'c':
        if (key.shift) return deleteLine(), insertMode();
        if (!prev) return buf.push('c');
        if (prev == 'c') return deleteLine(), insertMode();
        break;
      // delete line via 'dd' or 'D'
      case 'd':
        if (key.shift) return deleteLine();
        if (!prev) return buf.push('d');
        if (prev == 'd') return deleteLine();
        break;

      // movements
      case 'h':
        if (prev == 'd') return this._deleteLeft();
        if (prev == 'c') return this._deleteLeft(), insertMode();
        return this._moveCursor(-1);
      case 'l':
        if (prev == 'd') return this._deleteRight();
        if (prev == 'c') return this._deleteRight(), insertMode();
        return this._moveCursor(+1);
      case 'b':
        if (prev == 'd') return this._deleteWordLeft();
        if (prev == 'c') return this._deleteWordLeft(), insertMode();
        return this._wordLeft();
      case 'w':
        if (prev == 'd') return this._deleteWordRight();
        if (prev == 'c') { 
          this._deleteWordRight();
          return insertMode();
        }
        return this._wordRight();

      // deletion
      case 'x':
        return key.shift 
          ? this._deleteLeft() 
          : this._deleteRight(); 

      // history
      case 'k':
        return this._historyPrev();
      case 'j':
        return this._historyNext();

      // enter
      case 'enter':
        return this._line(), insertMode();
    }

    switch (code) {
      case '0':
        return this._moveCursor(-Infinity);
      case '$': 
        return this._moveCursor(Infinity);
    }
  };

  return vim;
};

if (module.parent) return;

var rli = utl.readline();
var vim = override(rli);
var map = vim.map;
map.insert('jk', 'esc');
