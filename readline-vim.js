'use strict';
var EventEmitter =  require('events').EventEmitter
  , createMap    =  require('./lib/map')
  , createInsert =  require('./lib/insert-mode')
  , createNormal =  require('./lib/normal-mode')
  , shimKey      =  require('./lib/shim-key')
  , utl          =  require('./lib/utl')
  , log          =  utl.log
  , logl         =  utl.logl
  ;

var override = module.exports = function override_ttyWrite(rli) {
  var original_ttyWrite =  rli._ttyWrite
    , isnormal          =  false
    , emitter           =  new EventEmitter()
    , emit              =  emitter.emit.bind(emitter)
    , map               =  createMap()
    ;

  // exposes properties and functions of our vimified readline
  var vim = { threshold: 200 };
  vim.__defineGetter__('events', function () { return emitter; });
  vim.__defineGetter__('map', function () { return map; });

  vim.forceNormal = function(silent) {
    isnormal = true;
    if (!silent) emit('normal');
  };

  vim.forceInsert = function(silent) {
    isnormal = false;
    if (!silent) emit('insert');
  };

  function normalMode() {
    if (isnormal) return;
    rli._moveCursor(-1);
    isnormal = true;
    insert.clearSequence();
    emit('normal');
  }

  function insertMode() {
    isnormal = false;
    insert.clearSequence();
    emit('insert');
  }

  function notifyingWrite(code, key) {
    emit('write',code, key);
    original_ttyWrite.apply(rli, arguments);
  }

  var insert = createInsert(rli, vim, normalMode, notifyingWrite);
  var normal = createNormal(rli, vim, insertMode, notifyingWrite);

  // __ttyWrite has been here since 0.2, so I think we are safe to assume it will be used in the future
  rli._ttyWrite = function(code, key) {
    key = key || {};

    var shimmed = shimKey(code, key);
    code = shimmed.code;
    key = shimmed.key;

    if (!isnormal) return insert.handleInput(code, key);
    
    // check for maps first
    if (!normal.handleInput(code, key)) return;
  };

  return vim;
};
