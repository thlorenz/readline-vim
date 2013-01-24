'use strict';
var EventEmitter =  require('events').EventEmitter
  , createMap    =  require('./lib/map')
  , createInsert =  require('./lib/insert-mode')
  , utl          =  require('./lib/utl')
  , log          =  utl.log
  , logl         =  utl.logl
  ;

var override = module.exports = function override_ttyWrite(rli) {
  var original_ttyWrite =  rli._ttyWrite
    , normal            =  false
    , buf               =  []
    , emitter           =  new EventEmitter()
    , emit              =  emitter.emit.bind(emitter)
    , map               =  createMap()
    ;

  // exposes properties and functions of our vimified readline
  var vim = { threshold: 200 };
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
    insert.clearSequence();
    emit('normal');
  }

  function insertMode() {
    normal = false;
    insert.clearSequence();
    emit('insert');
  }

  function notifyingWrite(code, key) {
    emit('write',code, key);
    original_ttyWrite.apply(rli, arguments);
  }

  var insert = createInsert(rli, vim, normalMode, notifyingWrite);

  // __ttyWrite has been here since 0.2, so I think we are safe to assume it will be used in the future
  rli._ttyWrite = function(code, key) {
    var self = this;
    key = key || {};

    if (!normal) return insert.handleInput(code, key);

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
map.insert('ctrl-k', 'ctrl-p');
