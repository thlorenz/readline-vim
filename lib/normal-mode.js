'use strict';
var utl          =  require('./utl')
  , log          =  utl.log
  , logl         =  utl.logl
  , stringifyKey =  require('stringify-key')
  , parseKey     =  require('parse-key')
  , letterRegex  =  /^[a-zA-Z0-9]$/
  ;

module.exports = function createNormalMode(
    rli
  , vim
  , insertMode
  , original_ttyWrite) {

  var self = {}
    , buf = [];

  function tryMatchImmediate(code, key) {
    var keyStr; 
    key.name = key.name || code;

    keyStr = stringifyKey(key);

    var mapStr = vim.map.matchNormal(keyStr)
      , mapKey;

    if (!mapStr) return null;
    
    mapKey = parseKey(mapStr);

    return mapKey;
  }

  function deleteLine() {
    rli._deleteLineLeft();
    rli._deleteLineRight();
  }

  /**
   * 
   * @name replaceChar
   * @function
   * @param code {String}
   * @param key {Object} 
   * @return {Boolean} true if key press was handled, false if not
   */
  function replaceChar(code, key) {
    if (!key || !key.name) return false;
    if (!letterRegex.test(key.name)) return false;

    rli._deleteRight();
    original_ttyWrite(code, key);
    rli._moveCursor(-1);

    return true;
  }

  function findChar(method, key) {
    var c, start, pos, tgtPos;

    c = (key.sequence && key.sequence.length === 1) ? key.sequence : key.name;

    if (!c) return;

    function indexOfBwd (line, c, cursor) {
      return line.slice(0, cursor).lastIndexOf(c);
    }

    switch(method) {
      case 'f':
      case 't':
        log('key '); logl(key);
        start = rli.cursor + 1;
        if (start < 0 || start >= rli.line.length) return;

        pos = rli.line.indexOf(c, start);
        if (pos === -1) return;

        tgtPos = method === 'f' ? pos : pos - 1;
        rli._moveCursor(tgtPos - rli.cursor);
        break;
      case 'F':
      case 'T':
        start = rli.cursor;
        if (start < 0 || start >= rli.line.length) return;

        pos = indexOfBwd(rli.line, c, start);
        if (pos === -1) return;

        tgtPos = method === 'F' ? pos : pos + 1;
        rli._moveCursor(tgtPos - rli.cursor);
        break;
    }
  }

  function matchCommand(code, key) {
    var prev = buf.pop();

    if (prev === 'r') {
      prev = null;
      var handled = replaceChar(code, key);
      if (handled) return;
    }
    
    if (prev && /^[fFtT]$/.test(prev)) return findChar(prev, key);

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
        
      // replace via r[letter]
      case 'r':
        if(key.shift) return; // not handling replace mode right now
        if (!prev) return buf.push('r');
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

      // find
      case 'f':
      case 't':
        if (!prev) buf.push(key.shift ? key.name.toUpperCase() : key.name);
        break;

      // history
      case 'k':
        if (!utl.hasModifier(key)) rli._historyPrev();
        return;
      case 'j':
        if (!utl.hasModifier(key)) rli._historyNext();
        return;

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
    var mapKey = tryMatchImmediate(code, key);

    if(buf.length === 0 && mapKey) 
      matchCommand(mapKey.name, mapKey);
    else
      matchCommand(code, key);

    return false;
  };

  return self;
};
