'use strict';
var EventEmitter = require('events').EventEmitter
  , createMap = require('./lib/map');

// TODO:
var original_ttyWrite_global;

function isEsc(s) {
  return s.trim().slice(0, 3).toLowerCase()=== 'esc';
}

var self = module.exports = function override_ttyWrite(rli) {
  var original_ttyWrite = original_ttyWrite_global || rli._ttyWrite
    , normal = false
    , buf = []
    , emitter = new EventEmitter()
    , emit = emitter.emit.bind(emitter)
    , map = createMap();

  // use set timeout instead of interval, to allow threshold to be changed
  function popBufferDuringInsert() {
    var s = buf.pop();
    if (!s) return;
    original_ttyWrite.call(rli, null, { name: s });
    setTimeout(popBufferDuringInsert, self.threshold);
  }
  setTimeout(popBufferDuringInsert, self.threshold);

  // TODO:
  original_ttyWrite_global = original_ttyWrite;

  // __ttyWrite has been here since 0.2, so I think we are safe to assume it will be used in the future
  rli._ttyWrite = function(code, key) {
    var self = this;
    key = key || {};

    function normalMode() {
      if (normal) return;
      self._moveCursor(-1);
      normal = true;
      emit('normal');
    }

    function insertMode() {
      normal = false;
      emit('insert');
    }

    // normal mode via escape or ctrl-[
    if (key.name == 'escape') return normalMode();
    if (key.name == '[' && key.ctrl) return normalMode();

    if (!normal) { 

      var m = map.matchInsert(key.name, buf);
      if (!m) return original_ttyWrite.apply(rli, arguments);

      if (m === true) return buf.push(key.name);

      if (isEsc(m)) return normalMode();
      // TODO: otherwise simulate the keypress that the sequence maps to
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

  function forceNormal(silent) {
    normal = true;
    if (!silent) emit('normal');
  }

  function forceInsert(silent) {
    normal = false;
    if (!silent) emit('insert');
  }

  return { 
      events      :  emitter
    , forceNormal :  forceNormal
    , forceInsert :  forceInsert
    , map         :  map
    , threshold   :  200
  };
};

/*if (typeof $repl !== 'undefined') { 
  $repl.vim = module.exports($repl.rli);
}*/
