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

  vim.normalMode = function() {
    if (normal) return;
    rli._moveCursor(-1);
    normal = true;
    insert.clearSequence();
    emit('normal');
  };

  vim.insertMode = function() {
    normal = false;
    insert.clearSequence();
    emit('insert');
  };

  var insert = createInsert(rli, vim, original_ttyWrite);
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
        if (key.shift) return this._moveCursor(-Infinity), vim.insertMode();
        return vim.insertMode();
      // insert mode via a
      case 'a':
        if (key.shift) return this._moveCursor(Infinity), vim.insertMode();
        return this._moveCursor(+1), vim.insertMode();
        break;
        
      // change line via 'cc' or 'C'
      case 'c':
        if (key.shift) return deleteLine(), vim.insertMode();
        if (!prev) return buf.push('c');
        if (prev == 'c') return deleteLine(), vim.insertMode();
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
        if (prev == 'c') return this._deleteLeft(), vim.insertMode();
        return this._moveCursor(-1);
      case 'l':
        if (prev == 'd') return this._deleteRight();
        if (prev == 'c') return this._deleteRight(), vim.insertMode();
        return this._moveCursor(+1);
      case 'b':
        if (prev == 'd') return this._deleteWordLeft();
        if (prev == 'c') return this._deleteWordLeft(), vim.insertMode();
        return this._wordLeft();
      case 'w':
        if (prev == 'd') return this._deleteWordRight();
        if (prev == 'c') { 
          this._deleteWordRight();
          return vim.insertMode();
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
        return this._line(), vim.insertMode();
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
