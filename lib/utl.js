var path    =  require('path')
  , fs      =  require('fs')
  , util    =  require('util')
  , readline = require('readline')
  , logFile =  path.join(__dirname, '../logs/debug.log');

var isDebug = exports.isDebug = function() {
  return process.env.DEBUG;
};

exports.log = function log(obj, depth) {
  if (!isDebug()) return;
  var s = util.inspect(obj, false, depth || 5, true);
  fs.appendFileSync(logFile, s);
};

exports.logl = function (obj, depth) {
  if (!isDebug()) return;
  exports.log(obj, depth);
  fs.appendFileSync(logFile, '\r\n');
};

exports.readline = function () {
  return readline.createInterface(process.stdin, process.stdout);  
};

exports.isEsc = function(s) {
  return s.trim().slice(0, 3).toLowerCase()=== 'esc';
};

exports.hasMeta = function(key) {
  return key.ctrl || key.alt || key.meta;
};

exports.hasModifier = function(key) {
  return key.ctrl || key.alt || key.meta || key.shift;
};
