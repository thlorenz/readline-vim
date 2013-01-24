'use strict';
var utl          =  require('./utl')
  , log          =  utl.log
  , logl         =  utl.logl
  , stringifyKey =  require('stringify-key')
  , parseKey     =  require('parse-key')
  ;

module.exports = function createNormalMode(rli, vim, insertMode, original_ttyWrite) {
  var self = {}
    , buf = [];

  // TODO: duplicate from insert-mode -> refactor this out into common module
  // expects to be the key to be one emitted by readline, i.e. of the format: { name: 'c', ctrl: true, meta: false, shift: false }
  function tryMatchImmediate(key, write) {
    var keyStr = stringifyKey(key)
      , mapStr = vim.map.matchInsert(keyStr)
      , mapKey;

    if (!mapStr) return true;
    
    try { // XXX fix parseKey?
      mapKey = parseKey(mapStr);
    } catch (e) {
      return true;
    }

    original_ttyWrite.call(rli, mapKey.name, mapKey);
    return false;
  }

  function deleteLine() {
    rli._deleteLineLeft();
    rli._deleteLineRight();
  }

  function matchCommand(code, key) {
    var prev = buf.pop();
    switch(key.name) {
      // insert mode via i
      case 'i':
        if (key.shift) return rli._moveCursor(-Infinity), insertMode();
        return insertMode();
      // insert mode via a
      case 'a':
        if (key.shift) return rli._moveCursor(Infinity), insertMode();
        return rli._moveCursor(+1), insertMode();
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
        if (prev == 'd') return rli._deleteLeft();
        if (prev == 'c') return rli._deleteLeft(), insertMode();
        return rli._moveCursor(-1);
      case 'l':
        if (prev == 'd') return rli._deleteRight();
        if (prev == 'c') return rli._deleteRight(), insertMode();
        return rli._moveCursor(+1);
      case 'b':
        if (prev == 'd') return rli._deleteWordLeft();
        if (prev == 'c') return rli._deleteWordLeft(), insertMode();
        return rli._wordLeft();
      case 'w':
        if (prev == 'd') return rli._deleteWordRight();
        if (prev == 'c') { 
          rli._deleteWordRight();
          return insertMode();
        }
        return rli._wordRight();

      // deletion
      case 'x':
        return key.shift 
          ? rli._deleteLeft() 
          : rli._deleteRight(); 

      // history
      case 'k':
        return rli._historyPrev();
      case 'j':
        return rli._historyNext();

      // enter
      case 'enter':
        return rli._line(), insertMode();
    }

    switch (code) {
      case '0':
        return rli._moveCursor(-Infinity);
      case '$': 
        return rli._moveCursor(Infinity);
    }
  }

  /**
   * Handles a given input in normal mode, including applying key mappings
   * 
   * @name handleInput
   * @function
   * @param code {String} key code
   * @param key {Object} key
   * @return {Boolean} false if the input was fully handled, true if it still needs to be handled
   */
  self.handleInput = function(code, key) {
    var passThru = utl.hasMeta(key) ? tryMatchImmediate(key) : true;
    if (!passThru) return;

    matchCommand(code, key);
  };

  return self;
};
