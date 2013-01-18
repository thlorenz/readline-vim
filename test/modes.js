'use strict';
/*jshint asi: true*/

var test = require('trap').test
var createRli = require('./fakes/readline')
var readlineVim = require('..')

var rli, normal, insert


function key(k) {
  var name, ctrl, alt, shift;
  var keys = k.split('-');
  if (keys.length === 1) name = keys[0];
  else name = keys[1], ctrl = keys[0] === 'ctrl', alt = keys[0] === 'alt', shift = keys[0] = 'shift'

  rli._ttyWrite(null, { name: name, ctrl: ctrl, alt: alt, shift: shift })
}

function setup() {
  rli = createRli()
  var rlv = readlineVim(rli)
  rlv.on('normal', function () { normal++ })
  rlv.on('insert', function () { insert++ })

  normal = 0
  insert = 0
}

test('switching to normal mode', function (t) {
  setup()
  
  var k = 'escape'
  key(k)
  t.equal(normal, 1, 'when in insert mode switches to normal mode on ' + k)
  key(k)
  t.equal(normal, 1, 'when in normal mode not switches to normal mode on ' + k)

  rli.reset()

  k = 'Ctrl-['
  key(k)
  t.equal(normal, 1, 'when in insert mode switches to normal mode on ' + k)
  key(k)
  t.equal(normal, 1, 'when in normal mode not switches to normal mode on ' + k)
})
